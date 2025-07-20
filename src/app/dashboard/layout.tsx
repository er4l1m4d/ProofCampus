'use client';

import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, X, LayoutDashboard, BookOpen, User, LogOut, FileText, Award } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Start closed on mobile
  const router = useRouter();
  const supabase = createPagesBrowserClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      // setUser(session.user); // Removed unused variable
      setLoading(false);
    };

    checkSession();
  }, [supabase.auth, router]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-3 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors border border-gray-200 md:hidden"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed md:static z-40 top-0 left-0 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out transform ${
        sidebarOpen 
          ? 'w-64 translate-x-0' 
          : 'w-0 md:w-20 -translate-x-full md:translate-x-0'
      }`}>
        <div className={`h-full flex flex-col ${sidebarOpen ? 'p-4 md:p-6' : 'p-2 md:p-4'}`}>
          {/* Logo/Title */}
          <div className="mb-6 md:mb-8">
            {sidebarOpen ? (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  P
                </div>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 truncate">ProofCampus</h2>
              </div>
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center text-white font-bold text-sm mx-auto">
                P
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 md:space-y-2">
            <Link 
              href="/dashboard" 
              className={`flex items-center space-x-3 px-2 md:px-3 py-2 md:py-3 rounded-lg text-gray-700 hover:text-primary hover:bg-primary-50 transition-colors ${
                !sidebarOpen && 'justify-center'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <LayoutDashboard size={20} className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
              {sidebarOpen && <span className="truncate">Dashboard</span>}
            </Link>
            
            <Link 
              href="/courses" 
              className={`flex items-center space-x-3 px-2 md:px-3 py-2 md:py-3 rounded-lg text-gray-700 hover:text-primary hover:bg-primary-50 transition-colors ${
                !sidebarOpen && 'justify-center'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <BookOpen size={20} className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
              {sidebarOpen && <span className="truncate">My Courses</span>}
            </Link>

            <Link 
              href="/dashboard/certificate" 
              className={`flex items-center space-x-3 px-2 md:px-3 py-2 md:py-3 rounded-lg text-gray-700 hover:text-primary hover:bg-primary-50 transition-colors ${
                !sidebarOpen && 'justify-center'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <Award size={20} className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
              {sidebarOpen && <span className="truncate">Certificate Generator</span>}
            </Link>

            <Link 
              href="/profile" 
              className={`flex items-center space-x-3 px-2 md:px-3 py-2 md:py-3 rounded-lg text-gray-700 hover:text-primary hover:bg-primary-50 transition-colors ${
                !sidebarOpen && 'justify-center'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <User size={20} className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
              {sidebarOpen && <span className="truncate">Profile</span>}
            </Link>

            <Link 
              href="/admin" 
              className={`flex items-center space-x-3 px-2 md:px-3 py-2 md:py-3 rounded-lg text-gray-700 hover:text-primary hover:bg-primary-50 transition-colors ${
                !sidebarOpen && 'justify-center'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <FileText size={20} className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
              {sidebarOpen && <span className="truncate">Admin</span>}
            </Link>
          </nav>

          {/* Logout */}
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/login");
            }}
            className={`flex items-center space-x-3 px-2 md:px-3 py-2 md:py-3 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors ${
              !sidebarOpen && 'justify-center'
            }`}
          >
            <LogOut size={20} className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
            {sidebarOpen && <span className="truncate">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'md:ml-0' : 'md:ml-20'
      }`}>
        <div className="p-4 md:p-6 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}