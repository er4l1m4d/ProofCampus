'use client';

import { useState, useEffect } from "react";
import { UserProfile, UserRole } from "@/types/user";
import { userService } from "@/lib/userService";
import { Users, Shield, Settings, BarChart3, Edit, Plus, X, Key } from "lucide-react";
import RoleCodeManager from "./RoleCodeManager";

interface AdminDashboardProps {
  userProfile: UserProfile;
}

export default function AdminDashboard({ userProfile }: AdminDashboardProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'users' | 'roleCodes'>('users');
  const [userForm, setUserForm] = useState({
    display_name: '',
    role: 'student' as UserRole
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const allUsers = await userService.getAllUsers();
    setUsers(allUsers);
    setLoading(false);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const success = await userService.updateUserRole(editingUser.id, userForm.role);
    if (success) {
      await fetchUsers();
      setShowUserModal(false);
      setEditingUser(null);
      setUserForm({ display_name: '', role: 'student' });
    }
  };

  const openEditUserModal = (user: UserProfile) => {
    setEditingUser(user);
    setUserForm({
      display_name: user.display_name || '',
      role: user.role
    });
    setShowUserModal(true);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
          Welcome back, {userProfile.display_name || userProfile.email.split('@')[0]}!
        </h1>
        <div className="text-sm text-gray-500 bg-red-100 px-3 py-1 rounded-full whitespace-nowrap">
          Administrator
        </div>
      </div>

      {/* Profile Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 bg-white border rounded-xl p-4 md:p-6 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
          {userProfile.display_name?.[0]?.toUpperCase() || userProfile.email[0].toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-semibold text-gray-900 truncate">{userProfile.display_name || userProfile.email}</p>
          <p className="text-gray-500 text-sm">System Administrator</p>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white border rounded-xl p-4 md:p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users size={20} className="text-blue-600 md:w-6 md:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xl md:text-2xl font-bold text-gray-900">{users.length}</p>
              <p className="text-gray-500 text-sm truncate">Total Users</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border rounded-xl p-4 md:p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users size={20} className="text-green-600 md:w-6 md:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xl md:text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'student').length}</p>
              <p className="text-gray-500 text-sm truncate">Students</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border rounded-xl p-4 md:p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield size={20} className="text-blue-600 md:w-6 md:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xl md:text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'lecturer').length}</p>
              <p className="text-gray-500 text-sm truncate">Lecturers</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border rounded-xl p-4 md:p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Settings size={20} className="text-red-600 md:w-6 md:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xl md:text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'admin').length}</p>
              <p className="text-gray-500 text-sm truncate">Admins</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Users size={16} />
              <span>User Management</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('roleCodes')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'roleCodes'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Key size={16} />
              <span>Role Codes</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'users' && (
        <>
          {/* User Management */}
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">👥 User Management</h2>
              <button className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light transition-colors w-full sm:w-auto justify-center">
                <Plus size={16} />
                <span>Add User</span>
              </button>
            </div>
            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
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
                        Joined
                      </th>
                      <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-3 md:px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                              {user.display_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                            </div>
                            <div className="ml-3 md:ml-4 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {user.display_name || 'No name'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 md:px-6 py-4 text-sm text-gray-900">
                          <div className="truncate max-w-[150px] md:max-w-none">{user.email}</div>
                        </td>
                        <td className="px-3 md:px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                            user.role === 'admin' ? 'bg-red-100 text-red-800' :
                            user.role === 'lecturer' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-3 md:px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-3 md:px-6 py-4 text-sm font-medium">
                          <button
                            onClick={() => openEditUserModal(user)}
                            className="text-primary hover:text-primary-dark p-1"
                            title="Edit user"
                          >
                            <Edit size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* System Analytics */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">📊 System Analytics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border rounded-xl p-4 md:p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">User Growth</h3>
                <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg">
                  <BarChart3 size={48} className="text-gray-400" />
                </div>
                <p className="text-center text-gray-500 text-sm mt-2">Chart placeholder</p>
              </div>
              
              <div className="bg-white border rounded-xl p-4 md:p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Role Distribution</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Students</span>
                    <span className="text-sm font-semibold text-gray-900">{users.filter(u => u.role === 'student').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Lecturers</span>
                    <span className="text-sm font-semibold text-gray-900">{users.filter(u => u.role === 'lecturer').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Admins</span>
                    <span className="text-sm font-semibold text-gray-900">{users.filter(u => u.role === 'admin').length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'roleCodes' && (
        <RoleCodeManager />
      )}

      {/* Edit User Modal */}
      {showUserModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 md:p-6 w-full max-w-md mx-auto modal-content">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit User</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={userForm.display_name}
                  onChange={(e) => setUserForm({ ...userForm, display_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value as UserRole })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="student">Student</option>
                  <option value="lecturer">Lecturer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light transition-colors"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 