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
      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Configuration error: ${error.message || 'Unable to load Google Client ID'}`);
      }
      if (!data?.clientId) {
        throw new Error('Google Client ID not configured in Supabase Edge Functions');
      }
      this.clientId = data.clientId;
      console.log('✅ Google Client ID loaded successfully');
    } catch (error) {
      console.error('Failed to get Google Client ID:', error);
      throw error instanceof Error ? error : new Error('Failed to load Google configuration. Please try again.');
    }
    
  // Load Google API scripts
  try {
    await this.loadScript('https://apis.google.com/js/api.js');
    await this.loadScript('https://accounts.google.com/gsi/client');
    await new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => reject(new Error('Google API loading timeout')), 10000);
      gapi.load('client', () => {
        clearTimeout(timeoutId);
        resolve(undefined);
      });
    });
  } catch (error) {
    console.error('Failed to load Google API:', error);
    throw new Error('Failed to load Google API. Please check your internet connection.');
  }

  // Initialize Google API client (without auth2)
  try {
    await gapi.client.init({
      discoveryDocs: [
        'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
        'https://docs.googleapis.com/$discovery/rest?version=v1',
        'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'
      ],
    });
    console.log('✅ Google API client initialized');
  } catch (error: any) {
      console.error('Failed to initialize Google client:', error);
      const origin = window.location.origin;
      const details = error?.details || error?.error || error?.message || '';

      // Provide actionable diagnostics for common init issues
      if (typeof details === 'string') {
        if (details.includes('origin_mismatch') || details.includes('Not a valid origin')) {
          throw new Error(`Domain not authorized: ${origin}. Add this origin to Authorized JavaScript origins in Google Cloud Console.`);
        }
        if (details.includes('idpiframe_initialization_failed')) {
          if (details.includes('Cookies are not enabled')) {
            throw new Error('Third-party cookies are blocked. Enable cookies for accounts.google.com or try a different browser.');
          }
          throw new Error('Google Sign-In could not initialize (idpiframe_initialization_failed). Check authorized origins and content blockers.');
        }
      }

      throw new Error(`Failed to initialize Google services. ${details ? `Details: ${details}` : 'Please verify your Google Cloud Console setup.'}`);
    }

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
      console.log('🔐 Starting Google authentication...');
      
      // Use the new Google Identity Services OAuth2 flow
      const client = google.accounts.oauth2.initTokenClient({
        client_id: this.clientId!,
        scope: [
          'openid',
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/drive.file',
          'https://www.googleapis.com/auth/documents',
          'https://www.googleapis.com/auth/gmail.send'
        ].join(' '),
        callback: (tokenResponse: any) => {
          if (tokenResponse.access_token) {
            this.accessToken = tokenResponse.access_token;
            gapi.client.setToken({ access_token: tokenResponse.access_token });
            console.log('✅ Access token acquired');
          }
        },
      });
      
      return new Promise((resolve, reject) => {
        client.callback = (response: any) => {
          if (response.error) {
            console.error('❌ Google Auth failed:', response.error);
            if (response.error === 'popup_closed_by_user') {
              reject(new Error('Authentication cancelled by user'));
            } else if (response.error === 'access_denied') {
              reject(new Error('Access denied. Please accept the required permissions.'));
            } else {
              reject(new Error(response.error));
            }
          } else {
            this.accessToken = response.access_token;
            gapi.client.setToken({ access_token: response.access_token });
            console.log('✅ User authenticated successfully');
            resolve(true);
          }
        };
        
        client.requestAccessToken();
      });
    } catch (error: any) {
      console.error('❌ Google Auth failed:', error);
      throw new Error(error.message || 'Authentication failed');
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

// Global gapi and google type declarations
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
  const gapi: any;
  const google: any;
}