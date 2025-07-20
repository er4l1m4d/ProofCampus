'use client';

import { useState, useEffect } from "react";
import { UserProfile } from "@/types/user";
import { StudentRecord } from "@/types/fileUpload";
import { fileUploadService } from "@/lib/fileUploadService";
import { Newspaper, Users, Award, Plus } from "lucide-react";
import FileUploadForm from "./FileUploadForm";
import FileList from "./FileList";

interface LecturerDashboardProps {
  userProfile: UserProfile;
}

export default function LecturerDashboard({ userProfile }: LecturerDashboardProps) {
  const [files, setFiles] = useState<StudentRecord[]>([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const filesData = await fileUploadService.getUserFiles();
    setFiles(filesData);
  };

  const handleFileUploadSuccess = () => {
    fetchFiles();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
          Welcome back, {userProfile.display_name || userProfile.email.split('@')[0]}!
        </h1>
        <div className="text-sm text-gray-500 bg-blue-100 px-3 py-1 rounded-full whitespace-nowrap">
          Lecturer
        </div>
      </div>

      {/* Profile Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 bg-white border rounded-xl p-4 md:p-6 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
          {userProfile.display_name?.[0]?.toUpperCase() || userProfile.email[0].toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-semibold text-gray-900 truncate">{userProfile.display_name || userProfile.email}</p>
          <p className="text-gray-500 text-sm">Lecturer Dashboard</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white border rounded-xl p-4 md:p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users size={20} className="text-blue-600 md:w-6 md:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xl md:text-2xl font-bold text-gray-900">156</p>
              <p className="text-gray-500 text-sm truncate">Total Students</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border rounded-xl p-4 md:p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Award size={20} className="text-green-600 md:w-6 md:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xl md:text-2xl font-bold text-gray-900">23</p>
              <p className="text-gray-500 text-sm truncate">Certificates Issued</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border rounded-xl p-4 md:p-6 shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Newspaper size={20} className="text-purple-600 md:w-6 md:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xl md:text-2xl font-bold text-gray-900">8</p>
              <p className="text-gray-500 text-sm truncate">News Articles</p>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Management */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">🎓 Certificate Management</h2>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center">
            <Plus size={16} />
            <span>Issue Certificate</span>
          </button>
        </div>
        <div className="bg-white border rounded-xl p-4 md:p-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 truncate">John Doe</h3>
                <p className="text-gray-600 text-sm truncate">Course: Advanced Mathematics</p>
                <p className="text-gray-500 text-xs">Issued: Dec 15, 2024</p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm whitespace-nowrap">View</button>
                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm whitespace-nowrap">Download</button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 truncate">Jane Smith</h3>
                <p className="text-gray-600 text-sm truncate">Course: Physics Fundamentals</p>
                <p className="text-gray-500 text-xs">Issued: Dec 12, 2024</p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm whitespace-nowrap">View</button>
                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm whitespace-nowrap">Download</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* News Management */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">📰 News Management</h2>
          <button className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors w-full sm:w-auto justify-center">
            <Plus size={16} />
            <span>Create News</span>
          </button>
        </div>
        <div className="bg-white border rounded-xl p-4 md:p-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 truncate">New Course Available: Machine Learning</h3>
                <p className="text-gray-600 text-sm truncate">Learn the fundamentals of ML and AI...</p>
                <p className="text-gray-500 text-xs">Published: Dec 10, 2024</p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm whitespace-nowrap">Edit</button>
                <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm whitespace-nowrap">Delete</button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 truncate">Upcoming Workshop: Data Science</h3>
                <p className="text-gray-600 text-sm truncate">Join us for a hands-on workshop...</p>
                <p className="text-gray-500 text-xs">Published: Dec 8, 2024</p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm whitespace-nowrap">Edit</button>
                <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm whitespace-nowrap">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">📊 Recent Activity</h2>
        <div className="bg-white border rounded-xl p-4 md:p-6 shadow-sm">
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="truncate">Certificate issued to John Doe</span>
              </div>
              <span className="text-gray-500 text-xs sm:text-sm whitespace-nowrap">2 hours ago</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span className="truncate">News article "Machine Learning Course" published</span>
              </div>
              <span className="text-gray-500 text-xs sm:text-sm whitespace-nowrap">1 day ago</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                <span className="truncate">Workshop "Data Science" scheduled</span>
              </div>
              <span className="text-gray-500 text-xs sm:text-sm whitespace-nowrap">2 days ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* File Management */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">📁 File Management</h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Upload Form */}
          <div className="order-2 xl:order-1">
            <FileUploadForm onUploadSuccess={handleFileUploadSuccess} />
          </div>
          
          {/* File List */}
          <div className="order-1 xl:order-2">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Your Files</h3>
            <FileList files={files} onFileDeleted={handleFileUploadSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
} 