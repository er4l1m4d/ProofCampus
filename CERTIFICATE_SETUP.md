# Certificate Generator Setup Guide

## Overview
A comprehensive certificate generation system built with Next.js and Supabase that allows lecturers and admins to create, manage, and verify certificates with QR codes and PDF downloads.

## Features
- ✅ **Certificate Creation**: Form for lecturers/admins to create certificates
- ✅ **Professional Design**: Styled certificates with Tailwind CSS
- ✅ **PDF Download**: Export certificates as PDF using html2pdf.js
- ✅ **QR Code Verification**: QR codes linking to verification pages
- ✅ **Database Storage**: Supabase integration with RLS policies
- ✅ **Role-Based Access**: Only lecturers and admins can create certificates
- ✅ **Certificate Verification**: Public verification page accessible via QR code

## Database Setup

### 1. Run the Certificate Database Setup
Execute the `certificate_setup.sql` script in your Supabase SQL editor:

```sql
-- This creates the certificates table with proper structure and RLS policies
-- Run this in your Supabase dashboard SQL editor
```

### 2. Database Schema
The `certificates` table includes:
- `id` (UUID): Unique certificate identifier
- `student_name` (TEXT): Name of the student
- `course` (TEXT): Course or event name
- `issuer` (TEXT): Issuing organization/person
- `date` (DATE): Certificate issue date
- `created_by` (UUID): User who created the certificate
- `cert_html` (TEXT): Optional HTML content
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

## Installation

### 1. Install Dependencies
```bash
npm install html2pdf.js qrcode.react
```

### 2. Files Created
- `src/types/certificate.ts` - TypeScript interfaces
- `src/lib/certificateService.ts` - Database operations
- `src/components/CertificateForm.tsx` - Creation form
- `src/components/CertificateDisplay.tsx` - Certificate preview
- `src/app/certificates/page.tsx` - Main management page
- `src/app/verify/[id]/page.tsx` - Verification page
- `certificate_setup.sql` - Database setup script

## Usage

### For Lecturers/Admins

1. **Access Certificate Management**
   - Navigate to `/certificates` in the sidebar
   - Click "Create New Certificate"

2. **Create Certificate**
   - Fill in student name, course, issuer, and date
   - Submit the form to create the certificate

3. **Preview and Download**
   - Select a certificate from the list to preview
   - Click "Download PDF" to export as PDF
   - QR code is automatically generated for verification

### For Students/Public

1. **Verify Certificate**
   - Scan QR code on certificate
   - Or visit `/verify/[certificate-id]`
   - View certificate details and verification status

## Security Features

### Row Level Security (RLS)
- **Create**: Only lecturers and admins can create certificates
- **View**: Users can view their own certificates, admins can view all
- **Update**: Users can update their own certificates, admins can update all
- **Delete**: Users can delete their own certificates, admins can delete all

### Certificate Verification
- Each certificate has a unique UUID
- QR codes link to public verification pages
- Verification pages show certificate authenticity
- No authentication required for verification

## Styling

### Certificate Design
- Professional gradient background
- Decorative borders and elements
- Responsive design for different screen sizes
- Print-optimized layout for PDF export

### Color Scheme
- Primary: Blue (#3B82F6)
- Secondary: Amber (#D97706)
- Background: Gray gradients
- Text: Dark gray for readability

## Technical Details

### PDF Generation
- Uses `html2pdf.js` for client-side PDF generation
- Landscape orientation for certificate layout
- High-quality image settings
- Automatic filename generation

### QR Code Generation
- Uses `qrcode.react` for QR code creation
- Links to verification page with certificate ID
- Medium error correction level
- Includes margin for better scanning

### Database Operations
- Supabase client for all database interactions
- Error handling and logging
- TypeScript interfaces for type safety
- Optimized queries with proper indexing

## Troubleshooting

### Common Issues

1. **PDF Download Fails**
   - Check browser console for errors
   - Ensure html2pdf.js is properly installed
   - Try refreshing the page

2. **Certificate Not Found**
   - Verify the certificate ID is correct
   - Check if the certificate exists in the database
   - Ensure RLS policies are properly configured

3. **Permission Errors**
   - Verify user role (lecturer/admin for creation)
   - Check RLS policies in Supabase
   - Ensure user is authenticated

### Database Issues
- Run the `certificate_setup.sql` script again
- Check Supabase logs for errors
- Verify table structure and permissions

## Future Enhancements

### Potential Features
- Certificate templates
- Bulk certificate generation
- Email delivery of certificates
- Digital signatures
- Certificate expiration dates
- Advanced verification methods
- Certificate analytics and reporting

### Performance Optimizations
- Image optimization for certificates
- Caching for frequently accessed certificates
- Pagination for large certificate lists
- Lazy loading for certificate previews

## Support

For issues or questions:
1. Check the browser console for errors
2. Verify database setup and permissions
3. Test with different user roles
4. Check Supabase logs for backend errors 