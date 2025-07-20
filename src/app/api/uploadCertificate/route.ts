import { NextRequest, NextResponse } from 'next/server';
import { uploadToIrys } from '../../../../utils/irysClient';

// Configure for large payloads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { certificateData, fileType, studentName, courseTitle, completionDate } = body;

    console.log('API: Received upload request');
    console.log('API: File type:', fileType);
    console.log('API: Data length:', certificateData?.length || 0);
    console.log('API: Data starts with:', certificateData?.substring(0, 50) || 'No data');

    // Validate required fields
    if (!certificateData || !fileType) {
      return NextResponse.json(
        { error: 'Missing required fields: certificateData and fileType' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/png', 'application/pdf'];
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PNG and PDF are supported.' },
        { status: 400 }
      );
    }

    // Convert base64 to Buffer
    let buffer: Buffer;
    try {
      // Remove data URL prefix if present
      const base64Data = certificateData.replace(/^data:[^;]+;base64,/, '');
      console.log('API: Base64 data length after prefix removal:', base64Data.length);
      buffer = Buffer.from(base64Data, 'base64');
      console.log('API: Buffer size:', buffer.length);
    } catch (error) {
      console.error('API: Error converting base64 to buffer:', error);
      return NextResponse.json(
        { error: 'Invalid base64 data' },
        { status: 400 }
      );
    }

    // Prepare additional tags for the certificate
    const tags = [
      { name: 'Type', value: 'Certificate' },
      { name: 'Student', value: studentName || 'Unknown' },
      { name: 'Course', value: courseTitle || 'Unknown' },
      { name: 'CompletionDate', value: completionDate || new Date().toISOString() },
      { name: 'UploadedAt', value: new Date().toISOString() }
    ];

    console.log('API: Uploading to Irys...');
    // Upload to Irys
    const result = await uploadToIrys(buffer, fileType, tags);
    console.log('API: Upload successful, transaction ID:', result.transactionId);

    // Return success response
    return NextResponse.json({
      success: true,
      transactionId: result.transactionId,
      url: result.url,
      message: 'Certificate uploaded successfully to Irys'
    });

  } catch (error) {
    console.error('Error in uploadCertificate API:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to upload certificate',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 