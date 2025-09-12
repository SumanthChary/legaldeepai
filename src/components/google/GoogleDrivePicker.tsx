import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, Download, Upload, RefreshCw, Cloud } from 'lucide-react';
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
  const [isConnected, setIsConnected] = useState(false);
  const [showFilePicker, setShowFilePicker] = useState(false);

  const { isLoading, isAuthenticated, authenticate, listDriveFiles, uploadToDrive } = useGoogleIntegration();

  useEffect(() => {
    if (isAuthenticated && !isConnected) {
      setIsConnected(true);
      handleLoadFiles();
    }
  }, [isAuthenticated]);

  const handleConnect = async () => {
    await authenticate();
  };

  const handleLoadFiles = async () => {
    if (isAuthenticated) {
      const driveFiles = await listDriveFiles(searchQuery);
      setFiles(driveFiles);
      setShowFilePicker(true);
    }
  };

  const handleSearch = async () => {
    if (isAuthenticated) {
      await handleLoadFiles();
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await uploadToDrive(file);
        onUpload?.(file);
        await handleLoadFiles(); // Refresh file list
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
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Cloud className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Google Drive Integration</h3>
          <p className="text-sm text-gray-600">Browse and upload files from your Google Drive</p>
        </div>
      </div>

      {!isConnected ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Connect to your Google Drive to browse and upload files directly to your account.
          </p>
          <Button 
            onClick={handleConnect} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Connecting...' : 'Connect to Google Drive'}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
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

          {!showFilePicker && (
            <div className="text-center py-4">
              <Button onClick={handleLoadFiles} disabled={isLoading}>
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

          {showFilePicker && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {files.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No files found. Try adjusting your search or upload a document.
                </p>
              ) : (
                files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => onFileSelect?.(file)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{getMimeTypeIcon(file.mimeType)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
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
        </div>
      )}
    </Card>
  );
};