# Role Codes Setup Guide

This guide explains how to set up and use the role codes feature in your ProofCampus application.

## 🎯 Overview

The role codes feature allows administrators to create special codes that users can enter during signup to automatically get assigned specific roles (lecturer or admin) instead of the default student role.

## 📋 Features

- **Secure Role Assignment**: Users can only get elevated roles through valid codes
- **One-Time Use**: Each code can only be used once
- **Admin Management**: Admins can create, view, and manage role codes
- **Real-time Validation**: Codes are validated as users type
- **Audit Trail**: Track when codes were created and used

## 🗄️ Database Setup

### 1. Create the role_codes table

Run the SQL script in your Supabase SQL editor:

```sql
-- Execute the contents of role_codes_setup.sql
```

This will create:
- `role_codes` table with proper constraints
- Indexes for performance
- Sample role codes for testing
- Row Level Security (RLS) policies

### 2. Sample Role Codes

The setup script includes these sample codes:
- `LECTURER2024` → Lecturer role
- `ADMIN2024` → Admin role
- `TEACHER001` → Lecturer role
- `ADMIN001` → Admin role
- `FACULTY2024` → Lecturer role

## 🔧 Implementation Details

### Files Created/Modified

1. **`role_codes_setup.sql`** - Database schema and sample data
2. **`src/lib/roleCodeService.ts`** - Service functions for role code operations
3. **`src/components/AuthForm.tsx`** - Updated signup form with role code input
4. **`src/components/RoleCodeManager.tsx`** - Admin interface for managing codes
5. **`src/components/AdminDashboard.tsx`** - Added role code management tab

### Key Functions

#### `validateRoleCode(code: string)`
- Validates if a role code exists and is unused
- Returns role type if valid
- Handles errors gracefully

#### `useRoleCode(code: string, userId: string)`
- Marks a code as used by a specific user
- Records usage timestamp
- Prevents reuse

#### `createRoleCode(code: string, role: 'lecturer' | 'admin')`
- Creates new role codes (admin only)
- Ensures uniqueness
- Validates role type

## 🚀 Usage

### For Users (Signup)

1. **Normal Signup**: Leave role code empty → assigned as student
2. **With Role Code**: Enter valid code → assigned corresponding role
3. **Invalid Code**: Shows error message, defaults to student

### For Admins (Management)

1. **Access**: Go to Admin Dashboard → "Role Codes" tab
2. **View**: See all codes with usage statistics
3. **Create**: Generate new codes for lecturers/admins
4. **Monitor**: Track which codes are used/unused

## 🎨 User Interface

### Signup Form Changes

- **Before**: Dropdown to select role
- **After**: Optional role code input field
- **Validation**: Real-time feedback with loading spinner
- **Error Handling**: Clear error messages for invalid codes

### Admin Dashboard

- **New Tab**: "Role Codes" alongside "User Management"
- **Statistics**: Total, used, and available codes
- **Create Form**: Generate new codes with role selection
- **Code Table**: View all codes with status and usage info

## 🔒 Security Features

### Row Level Security (RLS)

```sql
-- Users can only read unused codes
CREATE POLICY "Allow read unused role codes" ON role_codes
  FOR SELECT USING (used = FALSE);

-- Users can only update codes they use
CREATE POLICY "Allow update used role codes" ON role_codes
  FOR UPDATE USING (auth.uid() = used_by);

-- Admins can manage all codes
CREATE POLICY "Allow admin manage role codes" ON role_codes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );
```

### Validation Rules

- Codes are case-insensitive (automatically converted to uppercase)
- Codes must be unique
- Codes can only be used once
- Invalid codes default to student role
- Only admins can create new codes

## 🧪 Testing

### Test Scenarios

1. **Valid Lecturer Code**
   - Enter `LECTURER2024` during signup
   - Should be assigned lecturer role
   - Code should be marked as used

2. **Valid Admin Code**
   - Enter `ADMIN2024` during signup
   - Should be assigned admin role
   - Code should be marked as used

3. **Invalid Code**
   - Enter `INVALID123` during signup
   - Should show error message
   - Should default to student role

4. **Used Code**
   - Try to use a code that's already been used
   - Should show "already used" error
   - Should default to student role

5. **Empty Code**
   - Leave role code field empty
   - Should assign student role
   - No validation errors

### Admin Testing

1. **Create New Code**
   - Go to Role Codes tab
   - Create code `TEST001` for lecturer
   - Verify it appears in the list

2. **View Statistics**
   - Check total, used, and available counts
   - Verify they update after code usage

## 🔧 Customization

### Adding More Sample Codes

Edit `role_codes_setup.sql` and add more INSERT statements:

```sql
INSERT INTO role_codes (code, role) VALUES
  ('YOURCODE123', 'lecturer'),
  ('ADMIN2025', 'admin')
ON CONFLICT (code) DO NOTHING;
```

### Modifying Validation

Update `src/lib/roleCodeService.ts` to add custom validation rules:

```typescript
// Example: Add expiration date validation
export const validateRoleCode = async (code: string): Promise<ValidateRoleCodeResult> => {
  // ... existing validation ...
  
  // Add custom rules here
  if (data.expires_at && new Date() > new Date(data.expires_at)) {
    return { valid: false, error: 'Role code has expired' };
  }
  
  // ... rest of function ...
};
```

### Styling Changes

Modify the components to match your design system:

- Update colors in `AuthForm.tsx`
- Modify button styles in `RoleCodeManager.tsx`
- Adjust spacing and typography

## 🚨 Troubleshooting

### Common Issues

1. **"Invalid role code" error**
   - Check if code exists in database
   - Verify code hasn't been used already
   - Ensure proper case (automatically handled)

2. **Permission denied errors**
   - Verify RLS policies are enabled
   - Check user has admin role for management
   - Ensure proper authentication

3. **Codes not appearing in admin panel**
   - Check admin role assignment
   - Verify RLS policies allow admin access
   - Refresh the page after creating codes

### Debug Steps

1. **Check Database**
   ```sql
   SELECT * FROM role_codes ORDER BY created_at DESC;
   ```

2. **Verify RLS**
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'role_codes';
   ```

3. **Test Validation**
   ```typescript
   // In browser console
   import { validateRoleCode } from '@/lib/roleCodeService';
   validateRoleCode('LECTURER2024').then(console.log);
   ```

## 📈 Future Enhancements

### Potential Features

1. **Code Expiration**: Add expiration dates to codes
2. **Bulk Generation**: Create multiple codes at once
3. **Usage Analytics**: Track code usage patterns
4. **Email Notifications**: Notify when codes are used
5. **Code Categories**: Organize codes by department/course
6. **Temporary Codes**: Time-limited access codes

### Implementation Notes

- All enhancements should maintain backward compatibility
- Consider adding database migrations for new features
- Update TypeScript interfaces as needed
- Maintain security best practices

## ✅ Checklist

- [ ] Run `role_codes_setup.sql` in Supabase
- [ ] Verify sample codes are created
- [ ] Test signup with valid codes
- [ ] Test signup with invalid codes
- [ ] Test admin role code management
- [ ] Verify RLS policies work correctly
- [ ] Check error handling and validation
- [ ] Test on different devices/browsers
- [ ] Update documentation if needed

## 🎉 Success!

Your role codes feature is now fully implemented and ready for use! Users can sign up with role codes to get elevated permissions, and admins can manage the code system through the dashboard. 