'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

export interface SessionUser {
  id: string;
  user_id: string;
  full_name: string;
  course_title: string;
  completion_date: string;
  session_id: string;
}

export function useSessionUsers() {
  const [users, setUsers] = useState<SessionUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createPagesBrowserClient();

  const fetchSessionUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to use the enrollment_details view first
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from('enrollment_details')
        .select('*')
        .order('enrollment_date', { ascending: false });

      if (enrollmentError) {
        console.log('Enrollment details view not found, trying alternative approach');
        
        // Fallback: Try to use enrollments table with joins
        const { data: enrollmentsData, error: enrollmentsError } = await supabase
          .from('enrollments')
          .select(`
            id,
            user_id,
            session_id,
            users!inner(display_name),
            sessions!inner(title, end_date)
          `)
          .order('created_at', { ascending: false });

        if (enrollmentsError) {
          console.log('Enrollments table not found, using existing study_sessions approach');
          
          // Final fallback: Use existing study_sessions and courses tables
          const { data: usersData, error: usersError } = await supabase
            .from('users')
            .select(`
              id,
              display_name,
              study_sessions!inner(
                id,
                topic,
                date,
                courses!inner(name, semester, year)
              )
            `)
            .eq('role', 'student')
            .order('created_at', { ascending: false });

          if (usersError) {
            throw usersError;
          }

          // Transform the data to match our interface
          const transformedUsers: SessionUser[] = usersData?.map(user => {
            const firstSession = user.study_sessions?.[0];
            const firstCourse = firstSession?.courses?.[0];
            
            return {
              id: user.id,
              user_id: user.id,
              full_name: user.display_name || 'Unknown Student',
              course_title: firstCourse?.name || 'Unknown Course',
              completion_date: firstSession?.date || new Date().toISOString().split('T')[0],
              session_id: firstSession?.id || ''
            };
          }) || [];

          setUsers(transformedUsers);
        } else {
          // Use enrollments data
          const transformedUsers: SessionUser[] = enrollmentsData?.map(enrollment => {
            const firstUser = enrollment.users?.[0];
            const firstSession = enrollment.sessions?.[0];
            
            return {
              id: enrollment.id,
              user_id: enrollment.user_id,
              full_name: firstUser?.display_name || 'Unknown Student',
              course_title: firstSession?.title || 'Unknown Course',
              completion_date: firstSession?.end_date || new Date().toISOString().split('T')[0],
              session_id: enrollment.session_id
            };
          }) || [];

          setUsers(transformedUsers);
        }
      } else {
        // Use enrollment_details view data
        const transformedUsers: SessionUser[] = enrollmentData?.map(enrollment => ({
          id: enrollment.enrollment_id,
          user_id: enrollment.user_id,
          full_name: enrollment.full_name || 'Unknown Student',
          course_title: enrollment.course_title || 'Unknown Course',
          completion_date: enrollment.completion_date || new Date().toISOString().split('T')[0],
          session_id: enrollment.session_id
        })) || [];

        setUsers(transformedUsers);
      }
    } catch (err) {
      console.error('Error fetching session users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchSessionUsers();
  }, [fetchSessionUsers]);

  const refreshUsers = () => {
    fetchSessionUsers();
  };

  return {
    users,
    loading,
    error,
    refreshUsers
  };
} 