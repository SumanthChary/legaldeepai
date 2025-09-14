import { useState, useCallback } from 'react';
import { GoogleApiService } from '@/services/googleApi';
import { useToast } from '@/hooks/use-toast';

export const useGoogleIntegration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const googleApi = GoogleApiService.getInstance();

  const authenticate = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('🚀 Starting Google integration...');
      await googleApi.initialize();
      const success = await googleApi.authenticateWithGoogle();
      
      if (success) {
        setIsAuthenticated(true);
        toast({
          title: "✅ Connected to Google",
          description: "Successfully connected to Drive, Docs, and Gmail",
        });
        console.log('✅ Google integration complete');
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error: any) {
      console.error('❌ Google auth error:', error);
      
      let title = "Connection Failed";
      let description = error.message || "Failed to connect to Google services. Please try again.";
      
      // Provide specific guidance based on error type
      if (error.message?.includes('Google Client ID not configured')) {
        title = "Configuration Error";
        description = "Google Client ID not set up. Please check your Supabase Edge Functions configuration.";
      } else if (error.message?.includes('Domain not authorized')) {
        title = "Domain Authorization Error";
        description = "Your domain needs to be added to Google Cloud Console authorized origins.";
      } else if (error.message?.includes('Access denied')) {
        title = "Permission Denied";
        description = "Please accept the required permissions for Drive, Docs, and Gmail.";
      } else if (error.message?.includes('cancelled')) {
        title = "Authentication Cancelled";
        description = "Authentication was cancelled. Click Connect to try again.";
      } else if (error.message?.includes('APIs')) {
        title = "API Configuration Error";
        description = "Please enable Google Drive, Docs, and Gmail APIs in Google Cloud Console.";
      }
      
      toast({
        title,
        description,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const uploadToDrive = useCallback(async (file: File) => {
    if (!isAuthenticated) {
      await authenticate();
    }
    
    setIsLoading(true);
    try {
      const result = await googleApi.uploadToDrive(file);
      toast({
        title: "Upload Successful",
        description: `File "${file.name}" uploaded to Google Drive`,
      });
      return result;
    } catch (error) {
      console.error('Drive upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload file to Google Drive",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, authenticate, toast]);

  const exportToGoogleDocs = useCallback(async (title: string, content: string) => {
    if (!isAuthenticated) {
      await authenticate();
    }
    
    setIsLoading(true);
    try {
      console.log('📄 Exporting to Google Docs...');
      const result = await googleApi.createDocument(title, content);
      toast({
        title: "✅ Export Successful",
        description: `"${title}" created in Google Docs - opening in new tab`,
      });
      console.log('✅ Document created:', result.url);
      return result;
    } catch (error: any) {
      console.error('❌ Docs export error:', error);
      toast({
        title: "Export Failed",
        description: error.message || "Failed to export to Google Docs",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, authenticate, toast]);

  const sendViaGmail = useCallback(async (to: string, subject: string, body: string, attachments?: any[]) => {
    if (!isAuthenticated) {
      await authenticate();
    }
    
    setIsLoading(true);
    try {
      console.log('📧 Sending email via Gmail...');
      const result = await googleApi.sendEmail(to, subject, body, attachments);
      toast({
        title: "✅ Email Sent",
        description: `Email sent successfully to ${to}`,
      });
      console.log('✅ Email sent:', result);
      return result;
    } catch (error: any) {
      console.error('❌ Gmail send error:', error);
      toast({
        title: "Send Failed",
        description: error.message || "Failed to send email via Gmail",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, authenticate, toast]);

  const listDriveFiles = useCallback(async (query?: string) => {
    if (!isAuthenticated) {
      await authenticate();
    }
    
    setIsLoading(true);
    try {
      const files = await googleApi.listDriveFiles(query);
      return files;
    } catch (error) {
      console.error('Drive list error:', error);
      toast({
        title: "Failed to Load Files",
        description: "Could not retrieve files from Google Drive",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, authenticate, toast]);

  return {
    isLoading,
    isAuthenticated,
    authenticate,
    uploadToDrive,
    exportToGoogleDocs,
    sendViaGmail,
    listDriveFiles,
  };
};