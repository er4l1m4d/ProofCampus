'use client';

import { useState, useEffect } from 'react';
import { Certificate } from '@/types/certificate';
import { UserProfile } from '@/types/user';
import { certificateService } from '@/lib/certificateService';
import { userService } from '@/lib/userService';
import CertificateForm from '@/components/CertificateForm';
import CertificateDisplay from '@/components/CertificateDisplay';

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const profile = await userService.getCurrentUserProfile();
        setUserProfile(profile);

        if (profile?.role === 'admin') {
          const allCerts = await certificateService.getAllCertificates();
          setCertificates(allCerts);
        } else {
          const userCerts = await certificateService.getUserCertificates();
          setCertificates(userCerts);
        }
      } catch (error) {
        console.error('Error loading certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCertificateCreated = async (certificateId: string) => {
    const newCertificate = await certificateService.getCertificateById(certificateId);
    if (newCertificate) {
      setCertificates(prev => [newCertificate, ...prev]);
      setSelectedCertificate(newCertificate);
      setShowForm(false);
    }
  };

  const handleDownload = async () => {
    if (selectedCertificate) {
      // Update the certificate HTML in the database
      await certificateService.updateCertificateHtml(selectedCertificate.id, 'downloaded');
    }
  };

  const canCreateCertificates = userProfile?.role === 'lecturer' || userProfile?.role === 'admin';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading certificates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">Certificate Management</h1>
          <p className="text-gray-600 text-sm md:text-base">
            {canCreateCertificates 
              ? 'Create and manage certificates for students' 
              : 'View your created certificates'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
          {/* Left Column - Form and List */}
          <div className="space-y-6">
            {/* Create Certificate Button */}
            {canCreateCertificates && (
              <div className="bg-white rounded-lg shadow p-4 md:p-6">
                {!showForm ? (
                  <button
                    onClick={() => setShowForm(true)}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
                  >
                    Create New Certificate
                  </button>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg md:text-xl font-semibold text-gray-800">Create Certificate</h2>
                      <button
                        onClick={() => setShowForm(false)}
                        className="text-gray-500 hover:text-gray-700 p-1"
                      >
                        ✕
                      </button>
                    </div>
                    <CertificateForm onCertificateCreated={handleCertificateCreated} />
                  </div>
                )}
              </div>
            )}

            {/* Certificates List */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 md:p-6 border-b border-gray-200">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                  {userProfile?.role === 'admin' ? 'All Certificates' : 'Your Certificates'}
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {certificates.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No certificates found.
                  </div>
                ) : (
                  certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedCertificate?.id === cert.id
                          ? 'bg-blue-50 border-l-4 border-blue-500'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedCertificate(cert)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-800 truncate">{cert.student_name}</h3>
                          <p className="text-sm text-gray-600 truncate">{cert.course}</p>
                          <p className="text-xs text-gray-500">
                            Issued: {new Date(cert.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-xs text-gray-400 ml-2 flex-shrink-0">
                          ID: {cert.id.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Certificate Preview */}
          <div className="xl:sticky xl:top-8">
            {selectedCertificate ? (
              <CertificateDisplay 
                certificate={selectedCertificate} 
                onDownload={handleDownload}
              />
            ) : (
              <div className="bg-white rounded-lg shadow p-6 md:p-8 text-center">
                <div className="text-gray-400 text-4xl md:text-6xl mb-4">📜</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Certificate Preview
                </h3>
                <p className="text-gray-600 text-sm md:text-base">
                  Select a certificate from the list to preview and download it.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 