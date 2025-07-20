'use client';

import { useState, useEffect } from 'react';
import { userService } from '@/lib/userService';
import { UserProfile, UserRole } from '@/types/user';

export default function AdminPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const profile = await userService.getCurrentUserProfile();
        setCurrentUser(profile);

        if (profile?.role === 'admin') {
          const allUsers = await userService.getAllUsers();
          setUsers(allUsers);
        } else {
          setError('Access denied. Admin privileges required.');
        }
      } catch (error) {
        console.error('Error loading admin data:', error);
        setError('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleRoleUpdate = async (userId: string, newRole: UserRole) => {
    try {
      const success = await userService.updateUserRole(userId, newRole);
      if (success) {
        // Update the local state
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
      } else {
        setError('Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      setError('Failed to update user role');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm md:text-base">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (error || currentUser?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-600 text-4xl md:text-6xl mb-4">🚫</div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600 text-sm md:text-base">
            {error || 'You need admin privileges to access this page.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 text-sm md:text-base">Manage users and system settings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <div className="text-xl md:text-2xl font-bold text-blue-600">
              {users.length}
            </div>
            <div className="text-xs md:text-sm text-gray-600">Total Users</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <div className="text-xl md:text-2xl font-bold text-green-600">
              {users.filter(u => u.role === 'student').length}
            </div>
            <div className="text-xs md:text-sm text-gray-600">Students</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <div className="text-xl md:text-2xl font-bold text-purple-600">
              {users.filter(u => u.role === 'lecturer').length}
            </div>
            <div className="text-xs md:text-sm text-gray-600">Lecturers</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <div className="text-xl md:text-2xl font-bold text-red-600">
              {users.filter(u => u.role === 'admin').length}
            </div>
            <div className="text-xs md:text-sm text-gray-600">Admins</div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">User Management</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-3 md:px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-[120px] md:max-w-none">
                        {user.display_name || 'No name'}
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4">
                      <div className="text-sm text-gray-900 truncate max-w-[150px] md:max-w-none">{user.email}</div>
                    </td>
                    <td className="px-3 md:px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                        user.role === 'lecturer' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-3 md:px-6 py-4 text-sm font-medium">
                      {user.id !== currentUser.id && (
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleUpdate(user.id, e.target.value as UserRole)}
                          className="text-xs md:text-sm border rounded px-1 md:px-2 py-1"
                        >
                          <option value="student">Student</option>
                          <option value="lecturer">Lecturer</option>
                          <option value="admin">Admin</option>
                        </select>
                      )}
                      {user.id === currentUser.id && (
                        <span className="text-gray-400 text-xs md:text-sm">Current User</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 md:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <a
                href="/certificates"
                className="block w-full text-center bg-blue-600 text-white py-2 md:py-3 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm md:text-base font-medium"
              >
                Manage Certificates
              </a>
              <a
                href="/dashboard"
                className="block w-full text-center bg-gray-600 text-white py-2 md:py-3 px-4 rounded-md hover:bg-gray-700 transition-colors text-sm md:text-base font-medium"
              >
                View Dashboard
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">System Info</h3>
            <div className="space-y-2 text-xs md:text-sm">
              <div>
                <span className="font-medium text-gray-600">Current Admin:</span>
                <span className="ml-2 text-gray-800 truncate">{currentUser.display_name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Admin Email:</span>
                <span className="ml-2 text-gray-800 truncate">{currentUser.email}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Last Login:</span>
                <span className="ml-2 text-gray-800">
                  {new Date(currentUser.updated_at).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
  