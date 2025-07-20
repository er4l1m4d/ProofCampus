import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { StudentRecord, FileType } from "@/types/fileUpload";

const supabase = createPagesBrowserClient();

export const fileUploadService = {
  // Upload file to Supabase Storage and save metadata to database
  async uploadFile(file: File, type: FileType): Promise<StudentRecord | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('student-records')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error('Failed to upload file');
      }

      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('student-records')
        .getPublicUrl(filePath);

      // Save file metadata to database
      const { data: record, error: dbError } = await supabase
        .from('student_records')
        .insert([
          {
            user_id: user.id,
            filename: file.name,
            file_url: publicUrl,
            type: type
          }
        ])
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        // If database insert fails, delete the uploaded file
        await supabase.storage
          .from('student-records')
          .remove([filePath]);
        throw new Error('Failed to save file metadata');
      }

      return record;
    } catch (error) {
      console.error('Error in uploadFile:', error);
      return null;
    }
  },

  // Get all files for current user
  async getUserFiles(): Promise<StudentRecord[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: files, error } = await supabase
        .from('student_records')
        .select('*')
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false });

      if (error) {
        console.error('Error fetching files:', error);
        return [];
      }

      return files || [];
    } catch (error) {
      console.error('Error in getUserFiles:', error);
      return [];
    }
  },

  // Delete file from storage and database
  async deleteFile(recordId: string, fileUrl: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Extract file path from URL
      const urlParts = fileUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${user.id}/${fileName}`;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('student-records')
        .remove([filePath]);

      if (storageError) {
        console.error('Storage delete error:', storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('student_records')
        .delete()
        .eq('id', recordId)
        .eq('user_id', user.id);

      if (dbError) {
        console.error('Database delete error:', dbError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteFile:', error);
      return false;
    }
  },

  // Download file
  async downloadFile(fileUrl: string, filename: string): Promise<void> {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  }
}; 