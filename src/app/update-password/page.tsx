'use client';

import { useState } from "react";
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const supabase = createPagesBrowserClient();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleUpdate} className="max-w-md p-6 bg-white rounded-xl shadow space-y-4">
        <h2 className="text-2xl font-bold text-center">Choose a New Password</h2>

        {success ? (
          <p className="text-green-600 text-center">✅ Password updated! Redirecting...</p>
        ) : (
          <>
            <input
              type="password"
              placeholder="New password"
              className="w-full px-4 py-2 border rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              Update Password
            </button>
          </>
        )}
      </form>
    </div>
  );
}
