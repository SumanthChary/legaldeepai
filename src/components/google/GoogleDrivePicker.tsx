import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, Download, Upload, RefreshCw } from 'lucide-react';
import { useGoogleIntegration } from '@/hooks/useGoogleIntegration';

interface GoogleFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  size?: string;
  webViewLink: string;
}

interface GoogleDrivePickerProps {
  onFileSelect?: (file: GoogleFile) => void;
  onUpload?: (file: File) => void;
}

export const GoogleDrivePicker: React.FC<GoogleDrivePickerProps> = ({
  onFileSelect,
  onUpload
}) => {
  const [files, setFiles] = useState<GoogleFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFiles, setShowFiles] = useState(false);
  
  const {
    isLoading,
    isAuthenticated,
    authenticate,
    listDriveFiles,
    uploadToDrive
  } = useGoogleIntegration();

  const handleConnect = async () => {
    await authenticate();
    if (isAuthenticated) {
      await loadFiles();
    }
  };

  const loadFiles = async () => {
    const driveFiles = await listDriveFiles(searchQuery);
    setFiles(driveFiles);
    setShowFiles(true);
  };

  const handleSearch = async () => {
    if (isAuthenticated) {
      await loadFiles();
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await uploadToDrive(file);
        onUpload?.(file);
        await loadFiles(); // Refresh file list
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  const formatFileSize = (bytes?: string) => {
    if (!bytes) return 'Unknown size';
    const size = parseInt(bytes);
    if (size === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getMimeTypeIcon = (mimeType: string) => {
    if (mimeType.includes('document')) return '📄';
    if (mimeType.includes('spreadsheet')) return '📊';
    if (mimeType.includes('presentation')) return '📽️';
    if (mimeType.includes('pdf')) return '📕';
    if (mimeType.includes('image')) return '🖼️';
    return '📁';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Google Drive Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isAuthenticated ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Connect to Google Drive to import documents or upload analysis results
            </p>
            <Button onClick={handleConnect} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect to Google Drive'
              )}
            </Button>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button variant="outline" size="icon" onClick={handleSearch} disabled={isLoading}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>
              <div>
                <input
                  type="file"
                  id="drive-upload"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.txt"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('drive-upload')?.click()}
                  disabled={isLoading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>

            {!showFiles && (
              <div className="text-center py-4">
                <Button onClick={loadFiles} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Browse Files'
                  )}
                </Button>
              </div>
            )}

            {showFiles && (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {files.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No files found. Try adjusting your search or upload a document.
                  </p>
                ) : (
                  files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => onFileSelect?.(file)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-2xl">{getMimeTypeIcon(file.mimeType)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{file.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{formatFileSize(file.size)}</span>
                            <span>•</span>
                            <span>{new Date(file.modifiedTime).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{file.mimeType.split('/')[1]}</Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(file.webViewLink, '_blank');
                          }}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};