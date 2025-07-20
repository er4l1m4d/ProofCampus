import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-4 text-gray-900">Welcome to ProofCampus</h1>
      <p className="mb-8 text-lg text-gray-700">Your platform for managing courses.</p>
      <div className="flex gap-6">
        <Link href="/login" className="px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Login</Link>
        <Link href="/signup" className="px-6 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition">Sign Up</Link>
      </div>
    </div>
  );
}
