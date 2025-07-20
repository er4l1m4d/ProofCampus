import { CertificateData } from '@/types/certificate';

export interface UploadResult {
  success: boolean;
  transactionId?: string;
  url?: string;
  message?: string;
  error?: string;
  fileType?: string;
}

export interface UploadOptions {
  fileType: 'image/png' | 'application/pdf';
  certificateData: CertificateData;
}

/**
 * Create a consistent certificate container for all formats
 */
const createCertificateContainer = (certificateRef: React.RefObject<HTMLDivElement | null>) => {
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.top = '-9999px';
  tempContainer.style.width = '595px'; // A4 width in points
  tempContainer.style.height = '842px'; // A4 height in points
  tempContainer.style.background = '#ffffff';
  tempContainer.style.border = '20px double #6b7280';
  tempContainer.style.borderRadius = '8px';
  tempContainer.style.padding = '48px';
  tempContainer.style.display = 'flex';
  tempContainer.style.flexDirection = 'column';
  tempContainer.style.justifyContent = 'space-between';
  tempContainer.style.position = 'relative';
  tempContainer.style.overflow = 'hidden';
  tempContainer.style.fontFamily = 'Playfair Display, serif';
  
  // Copy the certificate content
  if (certificateRef.current) {
    tempContainer.innerHTML = certificateRef.current.innerHTML;
  }
  
  return tempContainer;
};

/**
 * Upload certificate to Irys datachain
 */
export const uploadCertificateToIrys = async (
  data: HTMLCanvasElement | string,
  options: UploadOptions
): Promise<UploadResult> => {
  try {
    let base64Data: string;
    
    if (typeof data === 'string') {
      // If data is already a base64 string (PDF)
      base64Data = data;
    } else {
      // If data is a canvas (PNG)
      base64Data = data.toDataURL(options.fileType, 0.9);
    }
    
    // Prepare upload data
    const uploadData = {
      certificateData: base64Data,
      fileType: options.fileType,
      studentName: options.certificateData.studentName,
      courseTitle: options.certificateData.courseTitle,
      completionDate: options.certificateData.completionDate
    };

    // Upload to our API route
    const response = await fetch('/api/uploadCertificate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Upload failed',
        message: result.details
      };
    }

    return {
      success: true,
      transactionId: result.transactionId,
      url: result.url,
      message: result.message,
      fileType: options.fileType
    };

  } catch (error) {
    console.error('Error uploading certificate:', error);
    return {
      success: false,
      error: 'Network error or upload failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Generate certificate as PNG and upload to Irys
 */
export const generateAndUploadPNG = async (
  certificateRef: React.RefObject<HTMLDivElement | null>,
  certificateData: CertificateData
): Promise<UploadResult> => {
  try {
    if (!certificateRef.current) {
      return {
        success: false,
        error: 'Certificate element not found'
      };
    }

    console.log('Starting PNG generation...');

    // Dynamic import to avoid SSR issues
    const html2canvas = (await import('html2canvas')).default;

    // Create consistent certificate container
    const tempContainer = createCertificateContainer(certificateRef);
    document.body.appendChild(tempContainer);

    console.log('Capturing certificate as canvas for PNG...');

    // Capture the certificate as canvas with same settings as PDF
    const canvas = await html2canvas(tempContainer, {
      scale: 3, // Same high quality as PDF
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 595, // A4 width
      height: 842, // A4 height
      scrollX: 0,
      scrollY: 0
    });

    // Remove temporary container
    document.body.removeChild(tempContainer);

    console.log('PNG generation complete');

    // Upload to Irys
    return await uploadCertificateToIrys(canvas, {
      fileType: 'image/png',
      certificateData
    });

  } catch (error) {
    console.error('Error generating PNG:', error);
    return {
      success: false,
      error: 'Failed to generate PNG',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Generate certificate as PDF and upload to Irys
 */
export const generateAndUploadPDF = async (
  certificateRef: React.RefObject<HTMLDivElement | null>,
  certificateData: CertificateData
): Promise<UploadResult> => {
  try {
    if (!certificateRef.current) {
      return {
        success: false,
        error: 'Certificate element not found'
      };
    }

    console.log('Starting PDF generation...');

    // Dynamic import to avoid SSR issues
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');

    // Create consistent certificate container
    const tempContainer = createCertificateContainer(certificateRef);
    document.body.appendChild(tempContainer);

    console.log('Capturing certificate as canvas...');

    // Capture the certificate as canvas
    const canvas = await html2canvas(tempContainer, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 800,
      height: 600,
      scrollX: 0,
      scrollY: 0
    });

    // Remove temporary container
    document.body.removeChild(tempContainer);

    console.log('Creating PDF...');

    // Create PDF
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const imgWidth = 297; // A4 landscape width in mm
    const imgHeight = 210; // A4 landscape height in mm
    const imgData = canvas.toDataURL('image/png', 1.0);
    
    // Add the image to PDF
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    console.log('Converting PDF to base64...');

    // Convert PDF to base64
    const pdfBase64 = pdf.output('datauristring');
    
    console.log('PDF base64 length:', pdfBase64.length);
    console.log('PDF base64 starts with:', pdfBase64.substring(0, 50));

    // Upload to Irys with PDF data
    console.log('Uploading PDF to Irys...');
    const result = await uploadCertificateToIrys(pdfBase64, {
      fileType: 'application/pdf',
      certificateData
    });

    console.log('PDF upload result:', result);
    return result;

  } catch (error) {
    console.error('Error generating PDF:', error);
    return {
      success: false,
      error: 'Failed to generate PDF',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}; 