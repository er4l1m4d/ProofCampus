export type FileType = 'result' | 'certificate';

export interface StudentRecord {
  id: string;
  user_id: string;
  filename: string;
  file_url: string;
  type: FileType;
  uploaded_at: string;
}

export interface FileUploadForm {
  file: File | null;
  type: FileType;
} 