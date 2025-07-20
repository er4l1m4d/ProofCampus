'use client';

import { useState } from "react";
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createPagesBrowserClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`, // where user lands after clicking email
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleReset} className="max-w-md p-6 bg-white rounded-xl shadow space-y-4">
        <h2 className="text-2xl font-bold text-center">Reset Your Password</h2>

        {sent ? (
          <p className="text-green-600 text-center">
            ✅ Reset email sent. Please check your inbox.
          </p>
        ) : (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Send Reset Link
            </button>
          </>
        )}
      </form>
    </div>
  );
}
