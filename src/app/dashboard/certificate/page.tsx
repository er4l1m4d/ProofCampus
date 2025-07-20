'use client';

import { useState } from 'react';
import CertificateGeneratorForm from '@/components/CertificateGeneratorForm';
import CertificateGeneratorPreview from '@/components/CertificateGeneratorPreview';
import { CertificateData } from '@/types/certificate';

export default function CertificateGeneratorPage() {
  const [certificateData, setCertificateData] = useState<CertificateData>({
    studentName: '',
    courseTitle: '',
    completionDate: ''
  });

  const handleFormChange = (data: CertificateData) => {
    setCertificateData(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Certificate Generator
          </h1>
          <p className="text-gray-600">
            Create and preview certificates for course completion
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Certificate Details
            </h2>
            <CertificateGeneratorForm 
              data={certificateData} 
              onChange={handleFormChange} 
            />
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Certificate Preview
            </h2>
            <CertificateGeneratorPreview data={certificateData} />
          </div>
        </div>
      </div>
    </div>
  );
} 