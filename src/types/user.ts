export type UserRole = 'student' | 'lecturer' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email?: string; // allow undefined
  user_metadata?: {
    full_name?: string;
    role?: string; // add this
  };
} 