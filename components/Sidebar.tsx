'use client';

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Home, BookOpen, User, Settings, LogOut } from "lucide-react";
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from "next/navigation";

interface SidebarProps {
  user?: {
    email?: string;
  };
}

export function Sidebar({ user }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const supabase = createPagesBrowserClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const navigationItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/courses", icon: BookOpen, label: "My Courses" },
    { href: "/profile", icon: User, label: "Profile" },
    { href: "/admin", icon: Settings, label: "Admin" },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile overlay */}
      {open && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-40 top-0 left-0 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-transform transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
              ProofCampus
            </h2>
            {user?.email && (
              <p className="text-sm text-gray-400 mt-2 truncate">
                {user.email}
              </p>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200"
                    onClick={() => setOpen(false)}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer with Logout */}
          <div className="p-6 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors duration-200"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

// Client wrapper for server components
export function SidebarWrapper({ user }: SidebarProps) {
  return <Sidebar user={user} />;
}

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createPagesBrowserClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
    >
      <LogOut size={16} />
      <span>Logout</span>
    </button>
  );
} 