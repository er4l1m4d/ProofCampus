# Certificate Generator Guide

## Overview

The Certificate Generator is a feature that allows users to create and preview certificates for course completion. It's located at `/dashboard/certificate` and provides a live preview of certificates as you fill out the form.

## Features

### ✅ Currently Implemented

1. **Certificate Form** (`CertificateForm.tsx`)
   - Student name input
   - Course title input
   - Completion date picker
   - Real-time form validation
   - Responsive design

2. **Certificate Preview** (`CertificatePreview.tsx`)
   - Live preview of certificate design
   - Professional certificate layout
   - Decorative borders and styling
   - Date formatting
   - Placeholder for signature and seal

3. **Main Page** (`/dashboard/certificate/page.tsx`)
   - Side-by-side form and preview layout
   - Responsive grid design
   - Clean, modern UI

4. **Navigation Integration**
   - Added to sidebar navigation
   - Accessible via "Certificate Generator" link

### 🚧 Coming Soon

1. **PDF Download**
   - Generate downloadable PDF certificates
   - High-quality print-ready format
   - Custom styling preservation

2. **PNG Download**
   - Export certificates as images
   - Shareable format
   - Social media ready

3. **Supabase Integration**
   - Save certificates to database
   - Link to user sessions
   - Certificate history and management
   - QR code verification

## File Structure

```
src/
├── app/
│   └── dashboard/
│       └── certificate/
│           └── page.tsx              # Main certificate generator page
├── components/
│   ├── CertificateForm.tsx          # Form component
│   └── CertificatePreview.tsx       # Preview component
└── types/
    └── certificate.ts               # TypeScript interfaces
```

## Usage

1. **Navigate to Certificate Generator**
   - Click "Certificate Generator" in the sidebar
   - Or visit `/dashboard/certificate`

2. **Fill Out the Form**
   - Enter student's full name
   - Add course title
   - Select completion date

3. **Preview Certificate**
   - See live preview on the right side
   - Certificate updates in real-time
   - Professional design with decorative elements

4. **Download (Coming Soon)**
   - PDF download for printing
   - PNG download for sharing

## Technical Details

### Components

#### CertificateForm
- **Props**: `data` (CertificateData), `onChange` (function)
- **Features**: Form validation, real-time updates, responsive design
- **Styling**: Tailwind CSS with focus states and transitions

#### CertificatePreview
- **Props**: `data` (CertificateData)
- **Features**: Live preview, date formatting, decorative design
- **Styling**: Gradient backgrounds, borders, professional layout

### Types

```typescript
interface CertificateData {
  studentName: string;
  courseTitle: string;
  completionDate: string;
}
```

### Responsive Design

- **Mobile**: Stacked layout (form above preview)
- **Desktop**: Side-by-side layout
- **Tablet**: Adaptive grid system
- **Touch-friendly**: Large input fields and buttons

## Future Enhancements

1. **Database Integration**
   - Save certificates to Supabase
   - User certificate history
   - Certificate verification system

2. **Advanced Features**
   - Custom certificate templates
   - Multiple signature options
   - Institution branding
   - QR code generation

3. **Export Options**
   - Multiple file formats
   - Batch certificate generation
   - Email delivery

4. **Security**
   - Certificate verification
   - Digital signatures
   - Tamper-proof certificates

## Development Notes

- Built with Next.js 13+ App Router
- Uses functional components with hooks
- Styled with Tailwind CSS
- TypeScript for type safety
- Responsive design principles
- Accessibility considerations

## Getting Started

1. Ensure you're logged into the application
2. Navigate to the Certificate Generator
3. Fill out the form to see the live preview
4. Explore the responsive design on different screen sizes

The certificate generator is ready for use and provides a solid foundation for future enhancements! 