'use client';

import { CertificateData, CertificatePreviewProps } from '@/types/certificate';

export default function CertificatePreview({ data }: CertificatePreviewProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const hasData = data.studentName && data.courseTitle && data.completionDate;

  return (
    <div className="flex flex-col items-center">
      {/* Certificate Preview */}
      <div className="w-full max-w-md bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-xl p-8 shadow-lg relative overflow-hidden">
        {/* Decorative border */}
        <div className="absolute inset-2 border-2 border-blue-300 rounded-lg"></div>
        
        {/* Certificate content */}
        <div className="relative z-10 text-center">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-blue-900 mb-2">
              Certificate of Completion
            </h1>
            <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          {/* Main content */}
          <div className="space-y-6">
            <p className="text-gray-700 text-sm leading-relaxed">
              This is to certify that
            </p>
            
            <div className="py-4">
              <h2 className="text-xl font-semibold text-blue-900 border-b-2 border-blue-300 pb-2">
                {data.studentName || 'Student Name'}
              </h2>
            </div>
            
            <p className="text-gray-700 text-sm leading-relaxed">
              has successfully completed the course
            </p>
            
            <div className="py-2">
              <h3 className="text-lg font-medium text-blue-800">
                {data.courseTitle || 'Course Title'}
              </h3>
            </div>
            
            <p className="text-gray-700 text-sm">
              on {formatDate(data.completionDate) || 'Completion Date'}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-blue-300">
            <div className="flex justify-between items-center text-xs text-gray-600">
              <div className="text-center">
                <div className="w-12 h-12 border-2 border-blue-400 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-blue-600 font-bold">S</span>
                </div>
                <p>Signature</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 border-2 border-blue-400 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-blue-600 font-bold">S</span>
                </div>
                <p>Seal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative corner elements */}
        <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-blue-400 rounded-tl-lg"></div>
        <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-blue-400 rounded-tr-lg"></div>
        <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-blue-400 rounded-bl-lg"></div>
        <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-blue-400 rounded-br-lg"></div>
      </div>

      {/* Status message */}
      {!hasData && (
        <div className="mt-6 text-center">
          <div className="bg-gray-100 rounded-lg p-4">
            <p className="text-gray-600 text-sm">
              Fill in the form to see your certificate preview
            </p>
          </div>
        </div>
      )}

      {/* Download buttons (placeholder for future implementation) */}
      {hasData && (
        <div className="mt-6 space-y-3 w-full max-w-md">
          <button 
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            disabled
          >
            Download as PDF (Coming Soon)
          </button>
          <button 
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
            disabled
          >
            Download as PNG (Coming Soon)
          </button>
        </div>
      )}
    </div>
  );
} 