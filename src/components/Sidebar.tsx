import React, { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { supabase } from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-primary hover:underline"
    >
      Logout
    </button>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="md:hidden p-4 focus:outline-none"
        onClick={() => setOpen(!open)}
      >
        <Menu />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-40 top-0 left-0 h-full w-64 bg-primary text-white p-6 transition-transform transform 
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <h2 className="text-2xl font-bold mb-6">ProofCampus</h2>
        <nav className="flex flex-col space-y-4">
          <Link href="/dashboard" className="hover:text-primary-200">🏠 Dashboard</Link>
          <Link href="/courses" className="hover:text-primary-200">📚 My Courses</Link>
          <Link href="/certificates" className="hover:text-primary-200">📜 Certificates</Link>
          <Link href="/profile" className="hover:text-primary-200">👤 Profile</Link>
          <Link href="/admin" className="hover:text-primary-200">⚙️ Admin</Link>
          <Link href="/logout" className="hover:text-primary-200">🚪 Logout</Link>
        </nav>
      </aside>
    </>
  );
} 