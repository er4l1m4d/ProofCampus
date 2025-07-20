'use client';

import { useRef, useState } from 'react';
import { CertificatePreviewProps, UploadResult } from '@/types/certificate';
import CertificateUploadButton from './CertificateUploadButton';
import Image from 'next/image';

export default function CertificateGeneratorPreview({ data }: CertificatePreviewProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

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

  const downloadPDF = async () => {
    if (!certificateRef.current || !hasData || isGeneratingPDF) return;

    setIsGeneratingPDF(true);

    try {
      // Dynamic import to avoid SSR issues
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      // Create a temporary container with A4 dimensions for PDF generation
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      tempContainer.style.width = '595px'; // A4 width in points
      tempContainer.style.height = '842px'; // A4 height in points
      tempContainer.style.background = '#ffffff';
      tempContainer.style.border = '20px double #6b7280';
      tempContainer.style.borderRadius = '8px';
      tempContainer.style.padding = '48px';
      tempContainer.style.display = 'flex';
      tempContainer.style.flexDirection = 'column';
      tempContainer.style.justifyContent = 'space-between';
      tempContainer.style.position = 'relative';
      tempContainer.style.overflow = 'hidden';
      tempContainer.style.fontFamily = 'Playfair Display, serif';
      
      // Copy the certificate content
      tempContainer.innerHTML = certificateRef.current.innerHTML;
      document.body.appendChild(tempContainer);

      // Capture the certificate as canvas with A4 dimensions
      const canvas = await html2canvas(tempContainer, {
        scale: 3, // Higher quality for better PDF
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 595, // A4 width
        height: 842, // A4 height
        scrollX: 0,
        scrollY: 0
      });

      // Remove temporary container
      document.body.removeChild(tempContainer);

      // Create PDF in portrait A4 orientation
      const pdf = new jsPDF('portrait', 'pt', 'a4');
      
      // Use A4 dimensions
      const imgWidth = 595; // A4 width in points
      const imgHeight = 842; // A4 height in points
      
      // Add the image to PDF, centered
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Generate filename
      const filename = `${data.studentName.toLowerCase().replace(/\s+/g, '_')}_certificate.pdf`;
      
      // Download the PDF
      pdf.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleUploadComplete = (result: UploadResult) => {
    if (result.success) {
      console.log('Certificate uploaded to Irys:', result.url);
    } else {
      console.error('Upload failed:', result.error);
    }
  };

  // Calculate scale factor to fit in allocated space while maintaining PDF proportions
  const pdfWidth = 595; // A4 width in points (72 dpi)
  const pdfHeight = 842; // A4 height in points (72 dpi)
  const maxPreviewWidth = 465; // Reduced to fit within placeholder
  const scale = maxPreviewWidth / pdfWidth;
  const previewHeight = pdfHeight * scale;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {/* Certificate Preview */}
      <div 
        ref={certificateRef} 
        style={{
          width: `${maxPreviewWidth}px`,
          height: `${previewHeight}px`,
          background: '#ffffff',
          border: '8px double #6b7280',
          borderRadius: '8px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          overflow: 'hidden',
          padding: `${48 * scale}px`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          fontFamily: 'var(--font-playfair), serif'
        }}
      >
        {/* Optional Logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Image 
            src="/logo.png" 
            alt="Institution Logo" 
            width={80}
            height={80}
            style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 24px',
              display: 'block'
            }}
            onError={(e) => {
              // Hide logo if it doesn't exist
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {/* Certificate Content */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between', 
          textAlign: 'center' 
        }}>
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h1 
              style={{
                fontSize: `${48 * scale}px`, // Increased from 36
                fontWeight: '900', // Increased from bold
                color: '#000000', // Changed to pure black
                textTransform: 'uppercase',
                letterSpacing: '0.1em', // Increased spacing
                marginBottom: '16px',
                margin: 0,
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)' // Added shadow
              }}
            >
              Certificate of Completion
            </h1>
            <div 
              style={{
                width: `${96 * scale}px`,
                height: `${4 * scale}px`,
                backgroundColor: '#374151',
                margin: '0 auto',
                borderRadius: '2px'
              }}
            ></div>
          </div>

          {/* Main Content */}
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            gap: '24px' 
          }}>
            <p 
              style={{
                fontSize: `${18 * scale}px`,
                color: '#374151',
                fontStyle: 'italic',
                margin: 0
              }}
            >
              This is to certify that
            </p>
            
            <div style={{ margin: '16px 0' }}>
              <h2 
                style={{
                  fontSize: `${42 * scale}px`, // Increased from 32
                  fontWeight: '900', // Increased from 600
                  color: '#000000', // Changed to pure black
                  margin: 0,
                  paddingBottom: '12px',
                  paddingLeft: '32px',
                  paddingRight: '32px',
                  textShadow: '1px 1px 3px rgba(0,0,0,0.1)' // Added shadow
                }}
              >
                {data.studentName || 'Student Name'}
              </h2>
              <div 
                style={{
                  width: '60%',
                  height: `${2 * scale}px`,
                  backgroundColor: '#9ca3af',
                  margin: '0 auto',
                  marginTop: '6px'
                }}
              ></div>
            </div>
            
            <p 
              style={{
                fontSize: `${18 * scale}px`,
                color: '#374151',
                margin: 0
              }}
            >
              has successfully completed the course
            </p>
            
            <div style={{ margin: '16px 0' }}>
              <h3 
                style={{
                  fontSize: `${32 * scale}px`, // Increased from 24
                  fontWeight: '700', // Increased from 500
                  color: '#000000', // Changed to pure black
                  fontStyle: 'italic',
                  margin: 0,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.1)' // Added shadow
                }}
              >
                {data.courseTitle || 'Course Title'}
              </h3>
            </div>
            
            <p 
              style={{
                fontSize: `${18 * scale}px`,
                color: '#374151',
                margin: 0
              }}
            >
              on {formatDate(data.completionDate) || 'Completion Date'}
            </p>
          </div>

          {/* Signature Section */}
          <div style={{ 
            marginTop: '32px', 
            paddingTop: '24px', 
            borderTop: '1px solid #d1d5db' 
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-end' 
            }}>
              <div style={{ textAlign: 'center' }}>
                <div 
                  style={{
                    width: `${128 * scale}px`,
                    height: `${2 * scale}px`,
                    backgroundColor: '#374151',
                    marginBottom: '8px'
                  }}
                ></div>
                <p 
                  style={{
                    fontSize: `${14 * scale}px`,
                    color: '#6b7280',
                    fontWeight: '500',
                    margin: 0
                  }}
                >
                  Lecturer Signature
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div 
                  style={{
                    width: `${128 * scale}px`,
                    height: `${2 * scale}px`,
                    backgroundColor: '#374151',
                    marginBottom: '8px'
                  }}
                ></div>
                <p 
                  style={{
                    fontSize: `${14 * scale}px`,
                    color: '#6b7280',
                    fontWeight: '500',
                    margin: 0
                  }}
                >
                  Date
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status message */}
      {!hasData && (
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <div style={{ 
            backgroundColor: '#f3f4f6', 
            borderRadius: '8px', 
            padding: '20px' 
          }}>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Fill in the form to see your certificate preview
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons Section */}
      {hasData && (
        <div style={{ 
          marginTop: '32px', 
          width: '100%', 
          maxWidth: '500px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          {/* Upload to Irys Section */}
          <div style={{ 
            width: '100%',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#374151',
              margin: '0 0 16px 0',
              textAlign: 'center'
            }}>
              Upload to Irys Datachain
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: '0 0 16px 0',
              textAlign: 'center'
            }}>
              Store your certificate permanently on the decentralized network
            </p>
            <CertificateUploadButton
              certificateRef={certificateRef}
              certificateData={data}
              onUploadComplete={handleUploadComplete}
            />
          </div>

          {/* Divider */}
          <div style={{
            width: '100%',
            height: '1px',
            backgroundColor: '#e5e7eb',
            margin: '8px 0'
          }}></div>

          {/* Local Download Section */}
          <div style={{ 
            width: '100%',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#374151',
              margin: '0 0 16px 0',
              textAlign: 'center'
            }}>
              Download Locally
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: '0 0 16px 0',
              textAlign: 'center'
            }}>
              Save the certificate to your device
            </p>
            <button 
              onClick={downloadPDF}
              disabled={isGeneratingPDF}
              style={{
                width: '100%',
                maxWidth: '300px',
                padding: '12px 16px',
                borderRadius: '8px',
                fontWeight: '500',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                border: 'none',
                cursor: isGeneratingPDF ? 'not-allowed' : 'pointer',
                backgroundColor: isGeneratingPDF ? '#9ca3af' : '#072A6C',
                color: '#ffffff',
                margin: '0 auto'
              }}
            >
              {isGeneratingPDF ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid #ffffff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
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