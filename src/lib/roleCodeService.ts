import { supabase } from '@/utils/supabaseClient';

export interface RoleCode {
  id: string;
  code: string;
  role: 'lecturer' | 'admin';
  used: boolean;
  created_at: string;
  used_at?: string;
  used_by?: string;
}

export interface ValidateRoleCodeResult {
  valid: boolean;
  role?: 'lecturer' | 'admin';
  error?: string;
}

/**
 * Validate a role code and return the associated role if valid
 */
export const validateRoleCode = async (code: string): Promise<ValidateRoleCodeResult> => {
  try {
    if (!code || code.trim() === '') {
      return { valid: false, error: 'Role code is required' };
    }

    const { data, error } = await supabase
      .from('role_codes')
      .select('*')
      .eq('code', code.trim().toUpperCase())
      .eq('used', false)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { valid: false, error: 'Invalid or already used role code' };
      }
      throw error;
    }

    if (!data) {
      return { valid: false, error: 'Invalid or already used role code' };
    }

    return {
      valid: true,
      role: data.role
    };
  } catch (error) {
    console.error('Error validating role code:', error);
    return { valid: false, error: 'Failed to validate role code' };
  }
};

/**
 * Mark a role code as used by a specific user
 */
export const useRoleCode = async (code: string, userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('role_codes')
      .update({
        used: true,
        used_at: new Date().toISOString(),
        used_by: userId
      })
      .eq('code', code.trim().toUpperCase())
      .eq('used', false);

    if (error) {
      console.error('Error using role code:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error using role code:', error);
    return false;
  }
};

/**
 * Get all role codes (admin only)
 */
export const getAllRoleCodes = async (): Promise<RoleCode[]> => {
  try {
    const { data, error } = await supabase
      .from('role_codes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching role codes:', error);
    return [];
  }
};

/**
 * Create a new role code (admin only)
 */
export const createRoleCode = async (code: string, role: 'lecturer' | 'admin'): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('role_codes')
      .insert({
        code: code.trim().toUpperCase(),
        role
      });

    if (error) {
      console.error('Error creating role code:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error creating role code:', error);
    return false;
  }
}; 