import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { UserProfile, UserRole, AuthUser } from "@/types/user";

const supabase = createPagesBrowserClient();

export const userService = {
  // Get current user's profile
  async getCurrentUserProfile(): Promise<UserProfile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      console.log('Fetching profile for user:', user.id, user.email);

      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error.message, error.details, error.hint);
        
        // If profile doesn't exist, try to create it manually (trigger might have failed)
        if (error.code === 'PGRST116' || error.message?.includes('not found') || error.message?.includes('0 rows returned')) {
          console.log('User profile not found, attempting to create it manually...');
          
          // Try to create the profile manually
          const safeUser = {
            ...user,
            email: user.email ?? "unknown@example.com",
            user_metadata: {
              ...user.user_metadata,
              role: user.user_metadata?.role ?? 'student'
            }
          };
          const createdProfile = await this.createUserProfile(safeUser);
          if (createdProfile) {
            console.log('Profile created manually:', createdProfile);
            return createdProfile;
          }
          
          console.error('Failed to create user profile manually');
          return null;
        }
        
        return null;
      }

      console.log('Profile found:', profile);
      return profile;
    } catch (error) {
      console.error('Error in getCurrentUserProfile:', error);
      return null;
    }
  },

  // Create user profile manually (fallback)
  async createUserProfile(authUser: AuthUser): Promise<UserProfile | null> {
    try {
      console.log('Creating user profile for:', authUser.id, authUser.email);
      
      // First, try to get the role from user metadata
      const role = authUser.user_metadata?.role || 'student';
      const displayName = authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Unknown';
      
      console.log('Using role:', role, 'and display name:', displayName);
      
      const { data: profile, error } = await supabase
        .from('users')
        .insert([
          {
            id: authUser.id,
            email: authUser.email,
            display_name: displayName,
            role: role
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile:', error.message, error.details, error.hint);
        
        // If it's a duplicate key error, try to fetch the existing profile
        if (error.code === '23505') {
          console.log('Profile already exists, fetching it...');
          const { data: existingProfile, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single();
            
          if (fetchError) {
            console.error('Error fetching existing profile:', fetchError.message);
            return null;
          }
          
          console.log('Existing profile found:', existingProfile);
          return existingProfile;
        }
        
        return null;
      }

      console.log('Profile created successfully:', profile);
      return profile;
    } catch (error) {
      console.error('Error in createUserProfile:', error);
      return null;
    }
  },

  // Update user profile
  async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating user profile:', error);
        return null;
      }

      return profile;
    } catch (error) {
      console.error('Error in updateUserProfile:', error);
      return null;
    }
  },

  // Update user role (admin only)
  async updateUserRole(userId: string, role: UserRole): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user role:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateUserRole:', error);
      return false;
    }
  },

  // Get all users (admin only)
  async getAllUsers(): Promise<UserProfile[]> {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        return [];
      }

      return users || [];
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      return [];
    }
  }
}; 