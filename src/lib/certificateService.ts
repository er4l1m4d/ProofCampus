import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { Certificate, CreateCertificateData } from "@/types/certificate";

const supabase = createPagesBrowserClient();

export const certificateService = {
  // Create a new certificate
  async createCertificate(data: CreateCertificateData): Promise<Certificate | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: certificate, error } = await supabase
        .from('certificates')
        .insert([
          {
            student_name: data.student_name,
            course: data.course,
            issuer: data.issuer,
            date: data.date,
            created_by: user.id
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating certificate:', error);
        return null;
      }

      return certificate;
    } catch (error) {
      console.error('Error in createCertificate:', error);
      return null;
    }
  },

  // Get certificate by ID
  async getCertificateById(id: string): Promise<Certificate | null> {
    try {
      const { data: certificate, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching certificate:', error);
        return null;
      }

      return certificate;
    } catch (error) {
      console.error('Error in getCertificateById:', error);
      return null;
    }
  },

  // Get all certificates for current user
  async getUserCertificates(): Promise<Certificate[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: certificates, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user certificates:', error);
        return [];
      }

      return certificates || [];
    } catch (error) {
      console.error('Error in getUserCertificates:', error);
      return [];
    }
  },

  // Get all certificates (admin only)
  async getAllCertificates(): Promise<Certificate[]> {
    try {
      const { data: certificates, error } = await supabase
        .from('certificates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all certificates:', error);
        return [];
      }

      return certificates || [];
    } catch (error) {
      console.error('Error in getAllCertificates:', error);
      return [];
    }
  },

  // Update certificate HTML
  async updateCertificateHtml(id: string, html: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('certificates')
        .update({ cert_html: html })
        .eq('id', id);

      if (error) {
        console.error('Error updating certificate HTML:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateCertificateHtml:', error);
      return false;
    }
  },

  // Delete certificate
  async deleteCertificate(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting certificate:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteCertificate:', error);
      return false;
    }
  }
}; 