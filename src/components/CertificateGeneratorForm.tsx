'use client';

import { useState } from 'react';
import { CertificateData, CertificateFormProps } from '@/types/certificate';
import { useSessionUsers, SessionUser } from '@/lib/useSessionUsers';

export default function CertificateGeneratorForm({ data, onChange }: CertificateFormProps) {
  const { users, loading, error } = useSessionUsers();
  const [selectedUser, setSelectedUser] = useState<string>('');

  const handleUserSelect = (userId: string) => {
    setSelectedUser(userId);
    
    if (userId) {
      const user = users.find(u => u.id === userId);
      if (user) {
        onChange({
          studentName: user.full_name,
          courseTitle: user.course_title,
          completionDate: user.completion_date
        });
      }
    } else {
      // Reset form when no user is selected
      onChange({
        studentName: '',
        courseTitle: '',
        completionDate: ''
      });
    }
  };

  const handleInputChange = (field: keyof CertificateData, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading students and courses...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Error loading students: {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Student and Course Selection */}
      <div>
        <label htmlFor="studentSelect" className="block text-sm font-medium text-gray-700 mb-2">
          Select Student and Course *
        </label>
        <select
          id="studentSelect"
          value={selectedUser}
          onChange={(e) => handleUserSelect(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
          required
        >
          <option value="">Choose a student and course...</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.full_name} - {user.course_title}
            </option>
          ))}
        </select>
      </div>

      {/* Display Selected Information */}
      {selectedUser && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Certificate Information</h3>
            </div>
          </div>
          
          <div className="space-y-2 text-sm text-green-700">
            <div className="flex justify-between">
              <span className="font-medium">Student Name:</span>
              <span>{data.studentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Course Title:</span>
              <span>{data.courseTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Completion Date:</span>
              <span>{new Date(data.completionDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Manual Override Fields (Optional) */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Manual Override (Optional)</h3>
        <p className="text-sm text-gray-600 mb-4">
          You can manually adjust the certificate details below if needed.
        </p>
        
        {/* Student Name Override */}
        <div className="mb-4">
          <label htmlFor="studentNameOverride" className="block text-sm font-medium text-gray-700 mb-2">
            Student Name
          </label>
          <input
            type="text"
            id="studentNameOverride"
            value={data.studentName}
            onChange={(e) => handleInputChange('studentName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter student's full name"
          />
        </div>

        {/* Course Title Override */}
        <div className="mb-4">
          <label htmlFor="courseTitleOverride" className="block text-sm font-medium text-gray-700 mb-2">
            Course Title
          </label>
          <input
            type="text"
            id="courseTitleOverride"
            value={data.courseTitle}
            onChange={(e) => handleInputChange('courseTitle', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter course title"
          />
        </div>

        {/* Completion Date Override */}
        <div>
          <label htmlFor="completionDateOverride" className="block text-sm font-medium text-gray-700 mb-2">
            Completion Date
          </label>
          <input
            type="date"
            id="completionDateOverride"
            value={data.completionDate}
            onChange={(e) => handleInputChange('completionDate', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>
      </div>

      {/* Form Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              {selectedUser 
                ? 'Certificate information has been auto-filled. You can adjust the details above if needed.'
                : 'Select a student and course from the dropdown above to auto-fill the certificate information.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 