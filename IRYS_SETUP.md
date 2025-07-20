# Irys Datachain Integration Setup Guide

This guide will help you set up the Irys datachain integration for storing certificates permanently on the decentralized network.

## 🔧 Prerequisites

1. **Irys Account**: Sign up at [irys.xyz](https://irys.xyz)
2. **Private Key**: Generate or obtain your private key from Irys
3. **Network**: Choose between `devnet` (testing) or `mainnet` (production)

## 📋 Environment Variables

Create or update your `.env.local` file:

```bash
# Irys Configuration
IRYS_PRIVATE_KEY=your_private_key_here
IRYS_NETWORK=devnet  # or 'mainnet' for production

# Optional: Supabase (for storing certificate metadata)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 🗄️ Database Setup (Optional)

If you want to store certificate metadata in Supabase, run this SQL:

```sql
-- Create certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES auth.users(id),
  session_id UUID REFERENCES sessions(id),
  irys_transaction_id TEXT NOT NULL UNIQUE,
  irys_url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image/png', 'application/pdf')),
  student_name TEXT NOT NULL,
  course_title TEXT NOT NULL,
  completion_date DATE NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own certificates" ON certificates
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Lecturers can view all certificates" ON certificates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND role = 'lecturer'
    )
  );

CREATE POLICY "System can insert certificates" ON certificates
  FOR INSERT WITH CHECK (true);

-- Indexes for performance
CREATE INDEX idx_certificates_student_id ON certificates(student_id);
CREATE INDEX idx_certificates_session_id ON certificates(session_id);
CREATE INDEX idx_certificates_irys_transaction_id ON certificates(irys_transaction_id);
```

## 🚀 Installation

1. **Install Dependencies**:
   ```bash
   npm install @irys/sdk
   ```

2. **Verify Installation**:
   ```bash
   npm list @irys/sdk
   ```

## 📁 File Structure

```
src/
├── app/
│   └── api/
│       └── uploadCertificate/
│           └── route.ts              # API route for uploads
├── components/
│   ├── CertificateGeneratorPreview.tsx  # Updated with upload buttons
│   └── CertificateUploadButton.tsx      # New upload component
├── lib/
│   └── certificateUploadService.ts      # Frontend upload service
├── types/
│   └── certificate.ts                   # TypeScript interfaces
└── utils/
    └── irysClient.ts                    # Irys client helper
```

## 🔐 Security Considerations

### ✅ Secure Practices
- **Server-side uploads**: All uploads go through the API route
- **Environment variables**: Private key never exposed to client
- **Input validation**: File type and size validation
- **Error handling**: Comprehensive error handling and logging

### ⚠️ Important Notes
- **Private Key Security**: Never commit your private key to version control
- **Network Selection**: Use `devnet` for testing, `mainnet` for production
- **File Size Limits**: API configured for 10MB max payload
- **Rate Limiting**: Consider implementing rate limiting for production

## 🎯 Usage

### 1. Basic Upload
```typescript
import { generateAndUploadPNG } from '@/lib/certificateUploadService';

const result = await generateAndUploadPNG(certificateRef, certificateData);
if (result.success) {
  console.log('Uploaded to:', result.url);
}
```

### 2. Component Integration
```tsx
import CertificateUploadButton from '@/components/CertificateUploadButton';

<CertificateUploadButton
  certificateRef={certificateRef}
  certificateData={data}
  onUploadComplete={(result) => {
    if (result.success) {
      // Handle success
    }
  }}
/>
```

### 3. API Usage
```typescript
const response = await fetch('/api/uploadCertificate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    certificateData: base64String,
    fileType: 'image/png',
    studentName: 'John Doe',
    courseTitle: 'Web Development',
    completionDate: '2024-01-15'
  })
});
```

## 🔍 Verification

### 1. Test Upload
1. Fill in certificate form
2. Click "Upload PNG" or "Upload PDF"
3. Check console for success/error messages
4. Visit the returned Irys URL

### 2. Verify on Irys
- Visit: `https://devnet.irys.xyz/<transaction_id>` (devnet)
- Visit: `https://gateway.irys.xyz/<transaction_id>` (mainnet)

### 3. Check Tags
Each upload includes metadata tags:
- `Content-Type`: File MIME type
- `App-Name`: "ProofCampus"
- `App-Version`: "1.0.0"
- `Type`: "Certificate"
- `Student`: Student name
- `Course`: Course title
- `CompletionDate`: Completion date
- `UploadedAt`: Upload timestamp

## 🛠️ Troubleshooting

### Common Issues

1. **"IRYS_PRIVATE_KEY environment variable is required"**
   - Check your `.env.local` file
   - Restart your development server

2. **"Invalid file type"**
   - Ensure fileType is 'image/png' or 'application/pdf'

3. **"Upload failed"**
   - Check network connectivity
   - Verify Irys account has sufficient funds
   - Check console for detailed error messages

4. **Large file uploads fail**
   - Ensure API route has `bodyParser.sizeLimit: "10mb"`
   - Consider compressing images before upload

### Debug Mode
Add to your `.env.local`:
```bash
DEBUG=irys:*
```

## 📊 Monitoring

### Logs to Monitor
- Upload success/failure rates
- File sizes and types
- Error messages and stack traces
- Transaction IDs for verification

### Metrics to Track
- Upload volume per day/week
- Success rate percentage
- Average file size
- Most common error types

## 🔄 Production Deployment

1. **Environment Variables**:
   ```bash
   IRYS_NETWORK=mainnet
   IRYS_PRIVATE_KEY=your_production_private_key
   ```

2. **Rate Limiting**: Implement rate limiting for the API route

3. **Monitoring**: Set up error tracking and monitoring

4. **Backup**: Consider backing up certificate metadata to Supabase

## 📚 Additional Resources

- [Irys Documentation](https://docs.irys.xyz/)
- [Irys SDK Reference](https://docs.irys.xyz/sdk)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Supabase Documentation](https://supabase.com/docs)

## 🤝 Support

For issues related to:
- **Irys**: Check [Irys Discord](https://discord.gg/irys)
- **Next.js**: Check [Next.js GitHub](https://github.com/vercel/next.js)
- **This Integration**: Check the troubleshooting section above 