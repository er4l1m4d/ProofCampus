# Certificate Form Setup Guide

This guide explains how to set up and use the new certificate form that allows lecturers to select students from a dropdown and auto-fill certificate information.

## 🎯 **Overview**

The new certificate form replaces manual input fields with a smart dropdown system that:
- Shows all students and their enrolled courses
- Auto-fills certificate data when a student is selected
- Provides manual override options for customization
- Maintains the existing certificate preview and PDF generation

## 📋 **Database Setup**

### 1. Run the Enrollments Setup SQL

Execute the `enrollments_setup.sql` file in your Supabase SQL editor:

```sql
-- This creates the necessary tables and relationships
-- See enrollments_setup.sql for the complete setup
```

### 2. Database Structure

The setup creates:

- **`enrollments`** table: Links users to sessions
- **`sessions`** table: Stores course/session information
- **`enrollment_details`** view: Combines user and session data for easy querying

### 3. Sample Data (Optional)

Uncomment the sample data section in `enrollments_setup.sql` to add test data:

```sql
INSERT INTO sessions (title, description, start_date, end_date, created_by) VALUES
('Introduction to Web Development', 'Learn the basics of HTML, CSS, and JavaScript', '2024-01-15', '2024-03-15', (SELECT id FROM auth.users LIMIT 1)),
('Advanced React Development', 'Master React hooks, context, and advanced patterns', '2024-02-01', '2024-04-01', (SELECT id FROM auth.users LIMIT 1));

INSERT INTO enrollments (user_id, session_id) 
SELECT 
    u.id as user_id,
    s.id as session_id
FROM users u
CROSS JOIN sessions s
WHERE u.role = 'student'
LIMIT 10;
```

## 🔧 **Components Created**

### 1. `useSessionUsers` Hook (`src/lib/useSessionUsers.ts`)

**Features:**
- Fetches students with their course and completion information
- Handles multiple database structures (fallback support)
- Provides loading states and error handling
- Returns formatted data for the certificate form

**Usage:**
```typescript
import { useSessionUsers } from '@/lib/useSessionUsers';

const { users, loading, error, refreshUsers } = useSessionUsers();
```

### 2. Updated Certificate Form (`src/components/CertificateGeneratorForm.tsx`)

**Features:**
- Dropdown selection for students and courses
- Auto-fill certificate data on selection
- Manual override fields for customization
- Loading and error states
- Real-time preview updates

## 🎨 **User Interface**

### Main Dropdown
- Shows "Student Name - Course Title" format
- Required field for certificate generation
- Auto-fills all certificate fields when selected

### Information Display
- Green success box showing selected certificate details
- Formatted date display
- Clear visual feedback

### Manual Override Section
- Optional fields for customizing auto-filled data
- Maintains existing form validation
- Allows fine-tuning of certificate details

## 🔄 **Data Flow**

1. **User Selection**: Lecturer selects student from dropdown
2. **Auto-fill**: Form populates with student's data:
   - `studentName`: User's display name
   - `courseTitle`: Session/course title
   - `completionDate`: Session end date
3. **Preview Update**: Certificate preview updates automatically
4. **Manual Override**: Optional customization of auto-filled data
5. **PDF Generation**: Download certificate with final data

## 🛠 **Fallback Support**

The system supports multiple database structures:

1. **Primary**: `enrollment_details` view (recommended)
2. **Secondary**: `enrollments` table with joins
3. **Fallback**: Existing `study_sessions` and `courses` tables

This ensures compatibility with existing data structures.

## 🔐 **Security & Permissions**

### Row Level Security (RLS)
- Users can only view their own enrollments
- Lecturers can view all enrollments
- Admins have full access

### Role-Based Access
- Students: View own enrollments only
- Lecturers: View and manage all enrollments
- Admins: Full system access

## 📱 **Responsive Design**

The form is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

All dropdowns and form fields adapt to screen size.

## 🚀 **Getting Started**

### 1. Database Setup
```bash
# Run the SQL setup in Supabase
# Copy and paste enrollments_setup.sql content
```

### 2. Test the Form
1. Navigate to `/dashboard/certificate`
2. Select a student from the dropdown
3. Verify auto-fill functionality
4. Test manual override fields
5. Generate PDF certificate

### 3. Add Sample Data (Optional)
```sql
-- Add some test sessions and enrollments
-- See the commented section in enrollments_setup.sql
```

## 🔧 **Customization**

### Adding New Fields
To add new certificate fields:

1. Update `CertificateData` interface in `src/types/certificate.ts`
2. Add field to the form component
3. Update the preview component
4. Modify the PDF generation logic

### Styling Changes
The form uses Tailwind CSS classes for consistent styling:
- Form fields: `w-full px-4 py-3 border border-gray-300 rounded-lg`
- Dropdowns: Same styling as inputs
- Status boxes: Color-coded for different states

## 🐛 **Troubleshooting**

### Common Issues

1. **No students showing in dropdown**
   - Check if users have `role = 'student'`
   - Verify enrollments exist
   - Check RLS policies

2. **Database errors**
   - Ensure tables are created
   - Verify foreign key relationships
   - Check user permissions

3. **Auto-fill not working**
   - Verify data structure matches interface
   - Check console for errors
   - Ensure proper data transformation

### Debug Mode
Enable console logging to see data flow:
```typescript
// In useSessionUsers.ts, uncomment console.log statements
console.log('Enrollment data:', enrollmentData);
```

## 📞 **Support**

For issues or questions:
1. Check the console for error messages
2. Verify database setup
3. Test with sample data
4. Review RLS policies

The system is designed to be robust and provide clear error messages for troubleshooting. 