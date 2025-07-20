'use client';

import { useRef, useEffect, useState } from 'react';
import { Certificate } from '@/types/certificate';
import { QRCodeSVG } from 'qrcode.react';

interface CertificateDisplayProps {
  certificate: Certificate;
  onDownload?: () => void;
}

export default function CertificateDisplay({ certificate, onDownload }: CertificateDisplayProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [showShareSuccess, setShowShareSuccess] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const downloadPDF = async () => {
    if (!certificateRef.current) return;

    try {
      // Dynamic import to avoid SSR issues
      const html2pdf = (await import('html2pdf.js')).default;
      
      const opt = {
        margin: 0.5,
        filename: `certificate-${certificate.student_name.replace(/\s+/g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
      };

      html2pdf().set(opt).from(certificateRef.current).save();
      
      if (onDownload) {
        onDownload();
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const shareCertificate = async () => {
    const verificationUrl = `${window.location.origin}/verify/${certificate.id}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Certificate for ${certificate.student_name}`,
          text: `Certificate of completion for ${certificate.course}`,
          url: verificationUrl
        });
      } else {
        await navigator.clipboard.writeText(verificationUrl);
        setShowShareSuccess(true);
        setTimeout(() => setShowShareSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error sharing certificate:', error);
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(verificationUrl);
        setShowShareSuccess(true);
        setTimeout(() => setShowShareSuccess(false), 3000);
      } catch (clipboardError) {
        alert('Failed to copy link. Please copy manually: ' + verificationUrl);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
      <div className="mb-4 md:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Certificate Preview</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={shareCertificate}
            className="bg-blue-600 text-white px-3 md:px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm md:text-base font-medium"
          >
            Share Certificate
          </button>
          <button
            onClick={downloadPDF}
            className="bg-green-600 text-white px-3 md:px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors text-sm md:text-base font-medium"
          >
            Download PDF
          </button>
        </div>
      </div>

      {showShareSuccess && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
          ✅ Verification link copied to clipboard!
        </div>
      )}

      {/* Certificate Container */}
      <div 
        ref={certificateRef}
        className="bg-gradient-to-br from-yellow-50 to-amber-100 border-4 md:border-8 border-amber-800 rounded-lg p-4 md:p-8 shadow-2xl relative"
        style={{ 
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      >
        {/* Certificate Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="text-3xl md:text-6xl font-serif text-amber-800 mb-2">CERTIFICATE</div>
          <div className="text-sm md:text-lg text-amber-700">OF COMPLETION</div>
        </div>

        {/* Certificate Content */}
        <div className="text-center mb-6 md:mb-8">
          <div className="text-sm md:text-lg text-gray-600 mb-3 md:mb-4">This is to certify that</div>
          <div className="text-xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6 border-b-2 border-amber-600 pb-2 break-words">
            {certificate.student_name}
          </div>
          <div className="text-sm md:text-lg text-gray-600 mb-3 md:mb-4">has successfully completed</div>
          <div className="text-lg md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6 border-b-2 border-amber-600 pb-2 break-words">
            {certificate.course}
          </div>
        </div>

        {/* Certificate Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4 mt-8 md:mt-12">
          <div className="text-center">
            <div className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2">Issued by</div>
            <div className="text-sm md:text-lg font-semibold text-gray-800 break-words">{certificate.issuer}</div>
          </div>
          
          <div className="text-center">
            <div className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2">Date</div>
            <div className="text-sm md:text-lg font-semibold text-gray-800">
              {formatDate(certificate.date)}
            </div>
          </div>
        </div>

        {/* Certificate ID and QR Code */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 md:mt-8 pt-4 border-t border-amber-600">
          <div className="text-xs md:text-sm text-gray-600 text-center sm:text-left">
            Certificate ID: {certificate.id}
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-1">Scan to verify</div>
            <QRCodeSVG 
              value={`${window.location.origin}/verify/${certificate.id}`}
              size={50}
              level="M"
              includeMargin={true}
            />
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-2 left-2 md:top-4 md:left-4 w-8 h-8 md:w-16 md:h-16 border-2 md:border-4 border-amber-600 rounded-full opacity-20"></div>
        <div className="absolute top-2 right-2 md:top-4 md:right-4 w-8 h-8 md:w-16 md:h-16 border-2 md:border-4 border-amber-600 rounded-full opacity-20"></div>
        <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 w-8 h-8 md:w-16 md:h-16 border-2 md:border-4 border-amber-600 rounded-full opacity-20"></div>
        <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 w-8 h-8 md:w-16 md:h-16 border-2 md:border-4 border-amber-600 rounded-full opacity-20"></div>
      </div>

      {/* Certificate Information */}
      <div className="mt-4 md:mt-6 bg-white rounded-lg shadow p-3 md:p-4">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3">Certificate Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Verification URL:</span>
            <div className="mt-1 p-2 bg-gray-50 rounded text-xs break-all">
              {`${window.location.origin}/verify/${certificate.id}`}
            </div>
          </div>
          <div>
            <span className="font-medium text-gray-600">Created:</span>
            <span className="ml-2 text-gray-800">
              {new Date(certificate.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 