
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useFileValidation } from "./hooks/useFileValidation";
import { useFileUploadProgress } from "./hooks/useFileUploadProgress";
import { uploadService } from "./services/uploadService";
import { supabase } from "@/integrations/supabase/client";

export const useFileUpload = (onSuccess?: () => void) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const { uploadError, validateFile, clearError, MAX_FILE_SIZE, ALLOWED_FILE_TYPES } = useFileValidation();
  const { isUploading, uploadProgress, startUpload, updateProgress, completeUpload, failUpload } = useFileUploadProgress();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearError();
    
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      console.log("📁 Selected file:", selectedFile.name, selectedFile.type, selectedFile.size);
      
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      } else {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  const clearFile = () => {
    setFile(null);
    clearError();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = async () => {
    if (!file) return;

    // Check user limits before uploading
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload documents",
        variant: "destructive",
      });
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('email, document_count, document_limit')
      .eq('id', user.id)
      .single();

    // Skip limit check for admin user
    if (profile?.email !== 'enjoywithpandu@gmail.com') {
      if (profile && profile.document_count >= profile.document_limit) {
        toast({
          title: "Document limit reached",
          description: `You've reached your limit of ${profile.document_limit} documents. Upgrade your plan to continue.`,
          variant: "destructive",
        });
        return;
      }
    }

    startUpload();
    
    try {
      console.log("🚀 Starting LIGHTNING upload for file:", file.name);
      
      const progressInterval = updateProgress();
      const startTime = Date.now();

      const result = await uploadService.uploadDocument(file);
      
      clearInterval(progressInterval);
      const processingTime = Date.now() - startTime;
      
      completeUpload();
      
      toast({
        title: "⚡ LIGHTNING Analysis Complete!",
        description: `${file.name} analyzed in ${Math.round(processingTime/1000)}s using advanced AI!`,
      });
      
      console.log(`✅ Analysis completed successfully: ${result.analysis_id}`);
      
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
          clearFile();
        }, 1000);
      } else {
        setTimeout(() => {
          clearFile();
        }, 1500);
      }
      
    } catch (error: any) {
      console.error("❌ Upload error:", error);
      failUpload();
      toast({
        title: "Upload failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    clearError();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      console.log("📁 Dropped file:", droppedFile.name, droppedFile.type, droppedFile.size);
      
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        
        if (fileInputRef.current) {
          try {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(droppedFile);
            fileInputRef.current.files = dataTransfer.files;
          } catch (error) {
            console.error("Error setting file input value:", error);
          }
        }
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  return {
    file,
    setFile,
    isUploading,
    uploadProgress,
    uploadError,
    fileInputRef,
    handleFileChange,
    clearFile,
    handleUpload,
    handleDrop,
    handleDragOver,
    MAX_FILE_SIZE,
    ALLOWED_FILE_TYPES
  };
};
