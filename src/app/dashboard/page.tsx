'use client';

import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserProfile } from "@/types/user";
import { userService } from "@/lib/userService";
import StudentDashboard from "@/components/StudentDashboard";
import LecturerDashboard from "@/components/LecturerDashboard";
import AdminDashboard from "@/components/AdminDashboard";

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const supabase = createPagesBrowserClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
        router.push("/login");
        return;
      }
      
      // Fetch user profile
      const profile = await userService.getCurrentUserProfile();
      setUserProfile(profile);
      setLoading(false);
    };

    checkSession();
  }, [supabase.auth, router]);

  if (loading) {
  return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Error loading user profile</div>
      </div>
    );
  }

  // Render different dashboards based on user role
  switch (userProfile.role) {
    case 'student':
      return <StudentDashboard userProfile={userProfile} />;
    case 'lecturer':
      return <LecturerDashboard userProfile={userProfile} />;
    case 'admin':
      return <AdminDashboard userProfile={userProfile} />;
    default:
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-lg">Unknown user role</div>
    </div>
  );
  }
}
