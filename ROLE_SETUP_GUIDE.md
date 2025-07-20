# User Role Setup Guide

## 🎯 How to Set Up User Roles for Certificate Creation

### **Problem Solved:**
Previously, all users were registering as students, but only **lecturers** and **admins** can create certificates.

### **✅ Solution Implemented:**

#### **1. Updated Signup Form**
- **Role Selection**: Users can now choose their role during signup
- **Three Options**: Student, Lecturer, Admin
- **Role Descriptions**: Clear explanation of each role's permissions

#### **2. Updated Database Trigger**
- **Role Storage**: User roles are now saved from signup metadata
- **Automatic Assignment**: Roles are properly assigned to user profiles

#### **3. Admin Management**
- **Admin Panel**: Admins can view and change user roles
- **User Management**: Full user management interface
- **Role Updates**: Change roles without re-registration

## 🚀 How to Get Started

### **Step 1: Create an Admin Account**
1. **Sign up** with a new email
2. **Select "⚙️ Admin"** role during registration
3. **Verify your email** if required
4. **Login** to access admin features

### **Step 2: Set Up Database**
1. Go to **Supabase Dashboard**
2. Run the **`user_profile_trigger.sql`** script
3. Run the **`certificate_setup.sql`** script

### **Step 3: Create Lecturer Accounts**
**Option A: Direct Registration**
1. Have lecturers **sign up** directly
2. They select **"👨‍🏫 Lecturer"** role
3. They can immediately create certificates

**Option B: Admin Management**
1. **Admin** creates accounts for lecturers
2. **Admin** changes their roles to "lecturer"
3. Lecturers can then create certificates

## 👥 Role Permissions

### **🎓 Student**
- ✅ View courses
- ✅ View certificates (if shared with them)
- ❌ Cannot create certificates
- ❌ Cannot access admin panel

### **👨‍🏫 Lecturer**
- ✅ View courses
- ✅ **Create certificates** for students
- ✅ Manage their own certificates
- ✅ View certificate verification pages
- ❌ Cannot access admin panel

### **⚙️ Admin**
- ✅ All lecturer permissions
- ✅ **Full system access**
- ✅ **Manage all users**
- ✅ **Change user roles**
- ✅ **View all certificates**
- ✅ **Access admin dashboard**

## 🔧 Admin Panel Features

### **User Management**
- **View all users** in the system
- **Change user roles** with dropdown
- **User statistics** (total, students, lecturers, admins)
- **User creation dates**

### **Quick Actions**
- **Manage Certificates**: Direct link to certificate system
- **View Dashboard**: Access main dashboard
- **System Info**: Current admin details

### **Access Control**
- **Admin-only access**: Only admins can view this page
- **Role-based permissions**: Secure access control
- **Real-time updates**: Changes reflect immediately

## 📋 Step-by-Step Setup

### **For New Users:**
1. **Sign up** at `/signup`
2. **Select role**: Student, Lecturer, or Admin
3. **Complete registration**
4. **Access appropriate features**

### **For Existing Users:**
1. **Admin** logs into admin panel (`/admin`)
2. **Finds user** in the user table
3. **Changes role** using dropdown
4. **User** now has new permissions

### **For Certificate Creation:**
1. **Lecturer/Admin** goes to `/certificates`
2. **Clicks "Create New Certificate"**
3. **Fills in certificate details**
4. **Creates and shares certificate**

## 🎯 Quick Test

### **Test Certificate Creation:**
1. **Register as Lecturer** or **Admin**
2. **Go to `/certificates`**
3. **Click "Create New Certificate"**
4. **Fill form and submit**
5. **Preview and download certificate**

### **Test Role Management:**
1. **Register as Admin**
2. **Go to `/admin`**
3. **View user statistics**
4. **Change a user's role**
5. **Verify changes take effect**

## 🔒 Security Notes

- **Role-based access**: Each role has specific permissions
- **Admin protection**: Only admins can change roles
- **Database security**: RLS policies protect data
- **Audit trail**: All changes are logged

## 💡 Tips

1. **Start with Admin**: Create an admin account first
2. **Use descriptive names**: Makes user management easier
3. **Regular audits**: Check user roles periodically
4. **Backup roles**: Keep track of important role assignments
5. **Test permissions**: Verify each role works as expected

## 🚨 Troubleshooting

### **"Cannot create certificates"**
- Check if user has lecturer/admin role
- Verify database setup is complete
- Check RLS policies are active

### **"Admin panel not accessible"**
- Ensure user has admin role
- Check if admin page exists
- Verify user is logged in

### **"Role not saving"**
- Check database trigger is active
- Verify signup metadata is being passed
- Check user profile creation

The role system is now fully functional! Users can register with proper roles, and admins can manage all users through the admin panel. 