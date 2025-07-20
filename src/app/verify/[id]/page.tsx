'use client';

import { useEffect, useState } from 'react';
import { Certificate } from '@/types/certificate';
import { certificateService } from '@/lib/certificateService';
import { QRCodeSVG } from 'qrcode.react';

interface VerifyPageProps {
  params: {
    id: string;
  };
}

export default function VerifyPage({ params }: VerifyPageProps) {
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const cert = await certificateService.getCertificateById(params.id);
        if (cert) {
          setCertificate(cert);
        } else {
          setError('Certificate not found');
        }
      } catch {
        setError('Failed to load certificate');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [params.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm md:text-base">Verifying certificate...</p>
        </div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-600 text-4xl md:text-6xl mb-4">❌</div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Certificate Not Found</h1>
          <p className="text-gray-600 text-sm md:text-base">The certificate you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <p className="text-xs md:text-sm text-gray-500 mt-2">Certificate ID: {params.id}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="text-green-600 text-4xl md:text-6xl mb-4">✅</div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Certificate Verified</h1>
          <p className="text-gray-600 text-sm md:text-base">This certificate is authentic and has been issued by our institution.</p>
        </div>

        {/* Certificate Display */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Certificate Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 md:p-6">
            <div className="text-center">
              <h2 className="text-2xl md:text-4xl font-serif mb-2">CERTIFICATE OF COMPLETION</h2>
              <p className="text-blue-100 text-sm md:text-base">Certificate ID: {certificate.id}</p>
            </div>
          </div>

          {/* Certificate Content */}
          <div className="p-4 md:p-8">
            <div className="text-center mb-6 md:mb-8">
              <p className="text-sm md:text-lg text-gray-600 mb-3 md:mb-4">This is to certify that</p>
              <h3 className="text-xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6 border-b-2 border-blue-600 pb-2 break-words">
                {certificate.student_name}
              </h3>
              <p className="text-sm md:text-lg text-gray-600 mb-3 md:mb-4">has successfully completed</p>
              <h4 className="text-lg md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6 border-b-2 border-blue-600 pb-2 break-words">
                {certificate.course}
              </h4>
            </div>

            {/* Certificate Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8">
              <div className="text-center">
                <h5 className="text-xs md:text-sm font-medium text-gray-500 mb-1 md:mb-2">ISSUED BY</h5>
                <p className="text-sm md:text-lg font-semibold text-gray-800 break-words">{certificate.issuer}</p>
              </div>
              <div className="text-center">
                <h5 className="text-xs md:text-sm font-medium text-gray-500 mb-1 md:mb-2">DATE ISSUED</h5>
                <p className="text-sm md:text-lg font-semibold text-gray-800">
                  {formatDate(certificate.date)}
                </p>
              </div>
            </div>

            {/* Verification QR Code */}
            <div className="text-center border-t pt-4 md:pt-6">
              <p className="text-xs md:text-sm text-gray-600 mb-2">Scan to verify this certificate</p>
              <div className="inline-block p-2 md:p-4 bg-gray-50 rounded-lg">
                <QRCodeSVG 
                  value={`${window.location.origin}/verify/${certificate.id}`}
                  size={80}
                  level="M"
                  includeMargin={true}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-6 md:mt-8 bg-white rounded-lg shadow p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Certificate Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Created:</span>
              <span className="ml-2 text-gray-800">
                {new Date(certificate.created_at).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Last Updated:</span>
              <span className="ml-2 text-gray-800">
                {new Date(certificate.updated_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-4 md:mt-6 text-center">
          <p className="text-xs md:text-sm text-gray-500">
            This certificate has been digitally verified. For additional verification, 
            please contact the issuing institution.
          </p>
        </div>
      </div>
    </div>
  );
} 