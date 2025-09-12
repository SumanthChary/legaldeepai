// Google API Service for Drive, Docs, and Gmail integration
import { supabase } from '@/integrations/supabase/client';

export class GoogleApiService {
  private static instance: GoogleApiService;
  private accessToken: string | null = null;
  private isInitialized = false;
  private clientId: string | null = null;

  private constructor() {}

  static getInstance(): GoogleApiService {
    if (!GoogleApiService.instance) {
      GoogleApiService.instance = new GoogleApiService();
    }
    return GoogleApiService.instance;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    // Get client ID from backend
    try {
      const { data, error } = await supabase.functions.invoke('google-config');
      if (error) throw error;
      this.clientId = data.clientId;
    } catch (error) {
      console.error('Failed to get Google Client ID:', error);
      throw new Error('Failed to load Google configuration. Please try again.');
    }
    
    // Load Google API script
    await this.loadScript('https://apis.google.com/js/api.js');
    await new Promise((resolve) => {
      gapi.load('client:auth2', resolve);
    });

    await gapi.client.init({
      clientId: this.clientId,
      scope: 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/gmail.send',
      discoveryDocs: [
        'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
        'https://docs.googleapis.com/$discovery/rest?version=v1',
        'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'
      ],
    });

    this.isInitialized = true;
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async authenticateWithGoogle(): Promise<boolean> {
    try {
      const authInstance = gapi.auth2.getAuthInstance();
      if (!authInstance.isSignedIn.get()) {
        await authInstance.signIn({
          scope: 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/gmail.send'
        });
      }
      
      const user = authInstance.currentUser.get();
      this.accessToken = user.getAuthResponse().access_token;
      return true;
    } catch (error) {
      console.error('Google Auth failed:', error);
      return false;
    }
  }

  // Google Drive Methods
  async listDriveFiles(query: string = '', pageSize: number = 10) {
    await this.ensureAuthenticated();
    
    const response = await gapi.client.drive.files.list({
      q: query,
      pageSize,
      fields: 'files(id,name,mimeType,modifiedTime,size,webViewLink)'
    });
    
    return response.result.files || [];
  }

  async uploadToDrive(file: File, folderId?: string) {
    await this.ensureAuthenticated();
    
    const metadata = {
      name: file.name,
      parents: folderId ? [folderId] : undefined
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      },
      body: form
    });

    return response.json();
  }

  async downloadFromDrive(fileId: string): Promise<Blob> {
    await this.ensureAuthenticated();
    
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      }
    });

    return response.blob();
  }

  // Google Docs Methods
  async createDocument(title: string, content: string) {
    await this.ensureAuthenticated();
    
    // Create the document
    const createResponse = await gapi.client.docs.documents.create({
      title
    });
    
    const documentId = createResponse.result.documentId;
    
    // Add content to the document
    if (content) {
      await gapi.client.docs.documents.batchUpdate({
        documentId,
        requests: [{
          insertText: {
            location: {
              index: 1
            },
            text: content
          }
        }]
      });
    }
    
    return {
      documentId,
      url: `https://docs.google.com/document/d/${documentId}/edit`
    };
  }

  // Gmail Methods
  async sendEmail(to: string, subject: string, body: string, attachments?: Array<{ filename: string; data: string; mimeType: string }>) {
    await this.ensureAuthenticated();
    
    let message = [
      `To: ${to}`,
      `Subject: ${subject}`,
      `Content-Type: text/html; charset=UTF-8`,
      '',
      body
    ].join('\n');

    if (attachments && attachments.length > 0) {
      const boundary = 'boundary_' + Math.random().toString(36).substr(2, 9);
      message = [
        `To: ${to}`,
        `Subject: ${subject}`,
        `Content-Type: multipart/mixed; boundary="${boundary}"`,
        '',
        `--${boundary}`,
        `Content-Type: text/html; charset=UTF-8`,
        '',
        body,
        ...attachments.map(att => [
          `--${boundary}`,
          `Content-Type: ${att.mimeType}`,
          `Content-Disposition: attachment; filename="${att.filename}"`,
          `Content-Transfer-Encoding: base64`,
          '',
          att.data
        ].join('\n')),
        `--${boundary}--`
      ].join('\n');
    }

    const encodedMessage = btoa(unescape(encodeURIComponent(message)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const response = await gapi.client.gmail.users.messages.send({
      userId: 'me',
      resource: {
        raw: encodedMessage
      }
    });

    return response.result;
  }

  private async ensureAuthenticated() {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    if (!this.accessToken) {
      const success = await this.authenticateWithGoogle();
      if (!success) {
        throw new Error('Google authentication failed');
      }
    }
  }
}

// Global gapi type declaration
declare global {
  interface Window {
    gapi: any;
  }
  const gapi: any;
}