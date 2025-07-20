'use client';

import { useState } from 'react';
import { certificateService } from '@/lib/certificateService';
import { CreateCertificateData } from '@/types/certificate';

interface CertificateFormProps {
  onCertificateCreated: (certificateId: string) => void;
}

export default function CertificateForm({ onCertificateCreated }: CertificateFormProps) {
  const [formData, setFormData] = useState<CreateCertificateData>({
    student_name: '',
    course: '',
    issuer: '',
    date: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof CreateCertificateData, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const certificate = await certificateService.createCertificate(formData);
      if (certificate) {
        onCertificateCreated(certificate.id);
        setFormData({
          student_name: '',
          course: '',
          issuer: '',
          date: ''
        });
      } else {
        setError('Failed to create certificate. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while creating the certificate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Student Name */}
      <div>
        <label htmlFor="student_name" className="block text-sm font-medium text-gray-700 mb-2">
          Student Name *
        </label>
        <input
          type="text"
          id="student_name"
          value={formData.student_name}
          onChange={(e) => handleInputChange('student_name', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          placeholder="Enter student's full name"
          required
        />
      </div>

      {/* Course */}
      <div>
        <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
          Course *
        </label>
        <input
          type="text"
          id="course"
          value={formData.course}
          onChange={(e) => handleInputChange('course', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          placeholder="Enter course name"
          required
        />
      </div>

      {/* Issuer */}
      <div>
        <label htmlFor="issuer" className="block text-sm font-medium text-gray-700 mb-2">
          Issuer *
        </label>
        <input
          type="text"
          id="issuer"
          value={formData.issuer}
          onChange={(e) => handleInputChange('issuer', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          placeholder="Enter issuer name"
          required
        />
      </div>

      {/* Date */}
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
          Date *
        </label>
        <input
          type="date"
          id="date"
          value={formData.date}
          onChange={(e) => handleInputChange('date', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          required
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating Certificate...' : 'Create Certificate'}
      </button>
    </form>
  );
} 