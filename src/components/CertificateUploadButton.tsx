'use client';

import { useState } from 'react';
import { CertificateData, UploadResult } from '@/types/certificate';
import { generateAndUploadPNG, generateAndUploadPDF } from '@/lib/certificateUploadService';
import VerifyIrysButton from './VerifyIrysButton';

interface CertificateUploadButtonProps {
  certificateRef: React.RefObject<HTMLDivElement | null>;
  certificateData: CertificateData;
  onUploadComplete?: (result: UploadResult) => void;
}

export default function CertificateUploadButton({
  certificateRef,
  certificateData,
  onUploadComplete
}: CertificateUploadButtonProps) {
  const [isUploadingPNG, setIsUploadingPNG] = useState(false);
  const [isUploadingPDF, setIsUploadingPDF] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  const hasData = certificateData.studentName && certificateData.courseTitle && certificateData.completionDate;

  const handleUpload = async (type: 'png' | 'pdf') => {
    if (!hasData || !certificateRef.current) return;

    const setIsUploading = type === 'png' ? setIsUploadingPNG : setIsUploadingPDF;
    setIsUploading(true);
    setUploadResult(null);

    try {
      const result = type === 'png' 
        ? await generateAndUploadPNG(certificateRef, certificateData)
        : await generateAndUploadPDF(certificateRef, certificateData);

      setUploadResult(result);
      onUploadComplete?.(result);

      if (result.success) {
        // Show success message
        console.log('Upload successful:', result.url);
      } else {
        // Show error message
        console.error('Upload failed:', result.error);
      }
    } catch (error) {
      const errorResult: UploadResult = {
        success: false,
        error: 'Upload failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
      setUploadResult(errorResult);
      onUploadComplete?.(errorResult);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '400px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Upload Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '16px',
        width: '100%',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => handleUpload('png')}
          disabled={!hasData || isUploadingPNG || isUploadingPDF}
          style={{
            flex: 1,
            maxWidth: '180px',
            padding: '12px 16px',
            borderRadius: '8px',
            fontWeight: '500',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            border: 'none',
            cursor: (!hasData || isUploadingPNG || isUploadingPDF) ? 'not-allowed' : 'pointer',
            backgroundColor: (!hasData || isUploadingPNG || isUploadingPDF) ? '#9ca3af' : '#072A6C',
            color: '#ffffff',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}
          onMouseEnter={(e) => {
            if (!(!hasData || isUploadingPNG || isUploadingPDF)) {
              e.currentTarget.style.backgroundColor = '#0d3a8a';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
            }
          }}
          onMouseLeave={(e) => {
            if (!(!hasData || isUploadingPNG || isUploadingPDF)) {
              e.currentTarget.style.backgroundColor = '#072A6C';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
            }
          }}
        >
          {isUploadingPNG ? (
            <>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid #ffffff',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span>Upload PNG</span>
            </>
          )}
        </button>

        <button
          onClick={() => handleUpload('pdf')}
          disabled={true} // Always disabled for now
          style={{
            flex: 1,
            maxWidth: '180px',
            padding: '12px 16px',
            borderRadius: '8px',
            fontWeight: '500',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            border: 'none',
            cursor: 'not-allowed', // Always not-allowed
            backgroundColor: '#9ca3af', // Always grayed out
            color: '#ffffff',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}
        >
          <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span>Coming Soon</span>
        </button>
      </div>

      {/* Upload Result */}
      {uploadResult && (
        <div style={{
          width: '100%',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '16px',
          backgroundColor: uploadResult.success ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${uploadResult.success ? '#bbf7d0' : '#fecaca'}`,
          textAlign: 'center'
        }}>
          {uploadResult.success ? (
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '12px',
                color: '#072A6C',
                fontWeight: '500'
              }}>
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Certificate uploaded successfully!</span>
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#374151' }}>
                  <strong>Transaction ID:</strong> {uploadResult.transactionId}
                </p>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#374151' }}>
                  <strong>File Type:</strong> {uploadResult.fileType || 'Unknown'}
                </p>
                <p style={{ margin: '0', fontSize: '14px', color: '#374151' }}>
                  <strong>Irys URL:</strong>
                </p>
              </div>

              <VerifyIrysButton
                url={uploadResult.url!}
                fileType={uploadResult.fileType}
                onDownloadClick={() => {
                  // For PDFs, download instead of opening in new tab
                  if (uploadResult.fileType === 'application/pdf') {
                    const link = document.createElement('a');
                    link.href = uploadResult.url!;
                    link.download = `certificate_${uploadResult.transactionId}.pdf`;
                    link.click();
                  }
                }}
              />

              {/* Additional info for PDFs */}
              {uploadResult.fileType === 'application/pdf' && (
                <div style={{ 
                  marginTop: '8px', 
                  padding: '8px', 
                  backgroundColor: '#fef3c7', 
                  borderRadius: '4px',
                  fontSize: '12px',
                  color: '#92400e'
                }}>
                  <p style={{ margin: '0' }}>
                    <strong>Note:</strong> PDFs may not display directly in browsers. 
                    Use the download button above to save the PDF file.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '12px',
                color: '#dc2626',
                fontWeight: '500'
              }}>
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Upload failed</span>
              </div>
              <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
                {uploadResult.error}: {uploadResult.message}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Info Message */}
      {!hasData && (
        <div style={{
          width: '100%',
          padding: '12px',
          borderRadius: '8px',
          backgroundColor: '#f3f4f6',
          border: '1px solid #d1d5db',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
            Fill in the certificate form to enable upload
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 