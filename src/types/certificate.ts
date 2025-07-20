// New Certificate Generator Types
export interface CertificateData {
  studentName: string;
  courseTitle: string;
  completionDate: string;
}

export interface CertificateFormProps {
  data: CertificateData;
  onChange: (data: CertificateData) => void;
}

export interface CertificatePreviewProps {
  data: CertificateData;
}

export interface CertificateUploadProps {
  certificateRef: React.RefObject<HTMLDivElement>;
  certificateData: CertificateData;
  onUploadComplete?: (result: UploadResult) => void;
}

export interface UploadResult {
  success: boolean;
  transactionId?: string;
  url?: string;
  message?: string;
  error?: string;
  fileType?: string;
}

// Existing Certificate System Types
export interface Certificate {
  id: string;
  student_name: string;
  course: string;
  issuer: string;
  date: string;
  created_by: string;
  cert_html?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCertificateData {
  student_name: string;
  course: string;
  issuer: string;
  date: string;
}

export interface CertificateFormData {
  student_name: string;
  course: string;
  issuer: string;
  date: string;
} 