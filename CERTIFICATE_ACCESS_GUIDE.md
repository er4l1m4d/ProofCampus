# Certificate System Access Guide

## 🎯 How to Access the Certificate Generator

### **Step 1: Database Setup**
First, you need to set up the database:
1. Go to your **Supabase Dashboard**
2. Open the **SQL Editor**
3. Copy and paste the contents of `certificate_setup.sql`
4. Click **Run** to create the certificates table

### **Step 2: Access the Certificate System**
1. **Login** to your ProofCampus account
2. **Navigate** to the sidebar and click **📜 Certificates**
3. You'll be taken to `/certificates` page

### **Step 3: Create Certificates (Lecturers/Admins Only)**
If you're a **lecturer** or **admin**:
1. Click **"Create New Certificate"** button
2. Fill in the form:
   - **Student Name**: Full name of the student
   - **Course/Event Name**: Name of the course or event
   - **Issuer**: Your name or organization
   - **Date**: Issue date
3. Click **"Create Certificate"**

### **Step 4: View and Manage Certificates**
- **Left Panel**: Shows your created certificates
- **Right Panel**: Shows certificate preview
- **Click** on any certificate to preview it

### **Step 5: Share and Download**
For each certificate, you can:
- **📄 Download PDF**: Get a high-quality PDF version
- **🔗 Share Certificate**: Copy the verification link
- **📱 QR Code**: Scan to verify the certificate

## 🔗 How to Share Certificates

### **Method 1: Share Button**
1. Select a certificate from the list
2. Click **"Share Certificate"** button
3. The verification link is copied to clipboard
4. Share the link with others

### **Method 2: Direct Link**
Each certificate has a unique verification URL:
```
https://your-domain.com/verify/[certificate-id]
```

### **Method 3: QR Code**
1. The QR code on each certificate links to the verification page
2. Anyone can scan it with their phone
3. They'll see the certificate verification page

## ✅ How to Verify Certificates

### **For Recipients/Public:**
1. **Visit** the verification URL or scan the QR code
2. **View** the certificate details
3. **Verify** the authenticity with the green checkmark

### **Verification Page Features:**
- ✅ **Authenticity Check**: Shows if certificate is valid
- 📋 **Certificate Details**: Student name, course, issuer, date
- 🔍 **Certificate ID**: Unique identifier
- 📱 **QR Code**: For easy sharing
- 📅 **Creation Date**: When the certificate was created

## 🎨 Certificate Features

### **Professional Design:**
- **Gradient Background**: Professional appearance
- **Decorative Borders**: Official document look
- **QR Code Integration**: Easy verification
- **PDF Export**: High-quality downloads

### **Security Features:**
- **Unique IDs**: Each certificate has a UUID
- **Database Storage**: All certificates stored securely
- **Public Verification**: Anyone can verify without login
- **Role-Based Access**: Only lecturers/admins can create

## 🚨 Troubleshooting

### **"No certificates found"**
- Make sure you're logged in
- Check if you have the right role (lecturer/admin to create)
- Verify the database setup was completed

### **"Create New Certificate" button not showing**
- You need to be a **lecturer** or **admin** role
- Check your user profile in the dashboard

### **PDF download not working**
- Make sure you have internet connection
- Try refreshing the page
- Check browser console for errors

### **QR code not scanning**
- Make sure the certificate is selected
- Try downloading the PDF instead
- The QR code links to the verification page

## 📱 Mobile Access

The certificate system works on all devices:
- **Desktop**: Full functionality
- **Tablet**: Responsive design
- **Mobile**: Touch-friendly interface
- **QR Scanning**: Works with any QR scanner app

## 🔄 Quick Start Checklist

- [ ] Run `certificate_setup.sql` in Supabase
- [ ] Login to ProofCampus
- [ ] Navigate to **📜 Certificates** in sidebar
- [ ] Click **"Create New Certificate"** (if lecturer/admin)
- [ ] Fill in certificate details
- [ ] Preview and download PDF
- [ ] Share verification link with recipient

## 💡 Tips

1. **Use descriptive course names** for better identification
2. **Keep verification links** for future reference
3. **Download PDFs** for offline storage
4. **Share QR codes** for easy mobile verification
5. **Check certificate list** regularly for new certificates 