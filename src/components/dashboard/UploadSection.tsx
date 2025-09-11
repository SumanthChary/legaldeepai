import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, CheckCircle2, AlertCircle, X, Sparkles, Scan } from "lucide-react";
import { useFileUpload } from "@/components/document-analysis/upload/useFileUpload";
import { ScanButton } from "@/components/document-analysis/upload/ScanButton";
import { GoogleDrivePicker } from "@/components/google/GoogleDrivePicker";

type UploadSectionProps = {
  onSuccess?: () => void;
};

export const UploadSection = ({ onSuccess }: UploadSectionProps) => {
  const {
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
  } = useFileUpload(onSuccess);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Upload Documents</h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Transform your legal documents with AI-powered analysis. Upload PDFs, Word docs, and more to get instant insights.
        </p>
      </div>

      {/* Upload Area */}
      <Card className="p-8 border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors">
        <div 
          className={`text-center space-y-4 ${
            file ? 'bg-primary/5 rounded-lg p-6' : ''
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {file ? (
            // File Preview
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-primary">
                <FileText className="h-8 w-8" />
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{file.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <Badge variant="secondary" className="px-3 py-1">
                  {file.type.split('/')[1].toUpperCase()}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearFile}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Remove File
              </Button>
            </div>
          ) : (
            // Upload Interface
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <Upload className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Drag and drop your files here</h3>
                <p className="text-muted-foreground">
                  or click below to browse your computer
                </p>
              </div>
              
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  size="lg"
                  className="gap-2 px-8"
                >
                  <FileText className="h-5 w-5" />
                  Choose Files
                </Button>
                
                <ScanButton 
                  onScan={(scannedFile) => setFile(scannedFile)} 
                  disabled={isUploading}
                />
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept={ALLOWED_FILE_TYPES.join(',')}
                className="hidden"
              />
            </div>
          )}
        </div>
      </Card>

      {/* Supported Formats */}
      <Card className="p-6 bg-muted/50">
        <h4 className="font-semibold mb-3 text-center">Supported File Types</h4>
        <div className="flex flex-wrap justify-center gap-2">
          {ALLOWED_FILE_TYPES.map((type) => (
            <Badge key={type} variant="outline" className="px-3 py-1">
              {type.replace('.', '').toUpperCase()}
            </Badge>
          ))}
        </div>
        <p className="text-sm text-muted-foreground text-center mt-3">
          Maximum file size: {MAX_FILE_SIZE / 1024 / 1024}MB
        </p>
      </Card>

      {/* Error Display */}
      {uploadError && (
        <Card className="p-4 border-destructive/50 bg-destructive/5">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Upload Error</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{uploadError}</p>
        </Card>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Uploading and Processing...</span>
              <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
            <div className="text-sm text-muted-foreground text-center">
              AI is analyzing your document. This may take a few moments.
            </div>
          </div>
        </Card>
      )}

      {/* Upload Button */}
      {file && !isUploading && (
        <div className="text-center">
          <Button
            onClick={handleUpload}
            size="lg"
            className="gap-2 px-12"
          >
            <Sparkles className="h-5 w-5" />
            Analyze Document
          </Button>
        </div>
      )}

      {/* Google Drive Integration */}
      <GoogleDrivePicker
        onFileSelect={async (file) => {
          // Handle Google Drive file selection
          // Note: You would need to implement file download and processing here
          console.log('Selected Google Drive file:', file);
        }}
      />

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <Card className="p-6 text-center">
          <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">AI-Powered Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Advanced machine learning extracts key insights from your documents
          </p>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold mb-2">Instant Results</h3>
          <p className="text-sm text-muted-foreground">
            Get comprehensive analysis and summaries in seconds
          </p>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold mb-2">Smart Extraction</h3>
          <p className="text-sm text-muted-foreground">
            Automatically identifies key clauses, dates, and obligations
          </p>
        </Card>
      </div>
    </div>
  );
};