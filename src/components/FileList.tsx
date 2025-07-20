'use client';

import { useState } from 'react';
import { StudentRecord } from '@/types/fileUpload';
import { fileUploadService } from '@/lib/fileUploadService';
import { Download, Trash2, File, Calendar, AlertCircle } from 'lucide-react';

interface FileListProps {
  files: StudentRecord[];
  onFileDeleted: () => void;
}

export default function FileList({ files, onFileDeleted }: FileListProps) {
  const [deletingFile, setDeletingFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async (file: StudentRecord) => {
    try {
      await fileUploadService.downloadFile(file.file_url, file.filename);
    } catch (error) {
      setError('Failed to download file');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDelete = async (file: StudentRecord) => {
    if (!confirm(`Are you sure you want to delete "${file.filename}"?`)) {
      return;
    }

    setDeletingFile(file.id);
    setError(null);

    try {
      const success = await fileUploadService.deleteFile(file.id, file.file_url);
      if (success) {
        onFileDeleted();
      } else {
        setError('Failed to delete file');
      }
    } catch (error) {
      setError('An error occurred while deleting the file');
    } finally {
      setDeletingFile(null);
    }
  };

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'result':
        return '📊';
      case 'certificate':
        return '🏆';
      default:
        return '📄';
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'result':
        return 'bg-green-100 text-green-800';
      case 'certificate':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (files.length === 0) {
    return (
      <div className="bg-white border rounded-xl p-8 shadow-sm text-center">
        <File className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No files uploaded yet</h3>
        <p className="text-gray-500">Upload your first file to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file) => (
          <div
            key={file.id}
            className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* File Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getFileTypeIcon(file.type)}</span>
                <div>
                  <h4 className="font-semibold text-sm truncate max-w-32" title={file.filename}>
                    {file.filename}
                  </h4>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getFileTypeColor(file.type)}`}>
                    {file.type}
                  </span>
                </div>
              </div>
            </div>

            {/* File Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Calendar size={12} />
                <span>{new Date(file.uploaded_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleDownload(file)}
                className="flex-1 flex items-center justify-center space-x-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm"
              >
                <Download size={14} />
                <span>Download</span>
              </button>
              <button
                onClick={() => handleDelete(file)}
                disabled={deletingFile === file.id}
                className="flex items-center justify-center bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                title="Delete file"
              >
                {deletingFile === file.id ? (
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Trash2 size={14} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 