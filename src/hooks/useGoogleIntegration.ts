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
      await googleApi.initialize();
      const success = await googleApi.authenticateWithGoogle();
      
      if (success) {
        setIsAuthenticated(true);
        toast({
          title: "Connected to Google",
          description: "Successfully connected to Google services",
        });
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      console.error('Google auth error:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Google services. Please try again.",
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
      const result = await googleApi.createDocument(title, content);
      toast({
        title: "Export Successful",
        description: "Document exported to Google Docs",
      });
      return result;
    } catch (error) {
      console.error('Docs export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export to Google Docs",
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
      const result = await googleApi.sendEmail(to, subject, body, attachments);
      toast({
        title: "Email Sent",
        description: `Email sent successfully to ${to}`,
      });
      return result;
    } catch (error) {
      console.error('Gmail send error:', error);
      toast({
        title: "Send Failed",
        description: "Failed to send email via Gmail",
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