'use client';

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from "next/navigation";

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
      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
    >
      Logout
    </button>
  );
}
