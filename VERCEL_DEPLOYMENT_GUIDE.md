# Vercel Deployment Guide - ProofCampus

This guide will walk you through deploying your ProofCampus application to Vercel.

## 🚀 Prerequisites

- [Vercel Account](https://vercel.com/signup) (free tier available)
- [GitHub Account](https://github.com) (recommended for easy deployment)
- Your code pushed to a Git repository

## 📋 Pre-Deployment Checklist

### ✅ Code Ready
- [x] Next.js 15.4.1 configured
- [x] TypeScript setup complete
- [x] Tailwind CSS configured
- [x] All dependencies in package.json
- [x] Build script configured (`next build`)

### ✅ Environment Variables Required
You'll need to set these in Vercel:

#### Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

#### Irys Configuration
```
IRYS_PRIVATE_KEY=your_irys_private_key
IRYS_ETH_RPC=your_ethereum_rpc_url
IRYS_NETWORK=devnet
```

## 🎯 Deployment Steps

### Method 1: GitHub Integration (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   - In the Vercel dashboard, go to your project
   - Navigate to Settings → Environment Variables
   - Add all the environment variables listed above

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically

### Method 2: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Follow the prompts**
   - Link to existing project or create new
   - Set environment variables when prompted

## 🔧 Environment Variables Setup

### In Vercel Dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each variable:

#### Supabase Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

#### Irys Variables
```
IRYS_PRIVATE_KEY=your_private_key_here
IRYS_ETH_RPC=https://sepolia.infura.io/v3/your_project_id
IRYS_NETWORK=devnet
```

## 🏗️ Build Configuration

### Vercel Auto-Detection
Vercel will automatically detect:
- **Framework**: Next.js
- **Build Command**: `next build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Custom Build Settings (if needed)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

## 🔍 Post-Deployment Checklist

### ✅ Verify Deployment
- [ ] Build completed successfully
- [ ] No TypeScript errors
- [ ] All pages load correctly
- [ ] Authentication works
- [ ] Certificate generation works
- [ ] Irys uploads work

### ✅ Test Functionality
- [ ] User registration/login
- [ ] Role code system
- [ ] Certificate generation
- [ ] Irys uploads
- [ ] Admin dashboard
- [ ] Mobile responsiveness

## 🚨 Common Issues & Solutions

### 1. Build Failures
**Issue**: TypeScript errors during build
**Solution**: 
```bash
npm run lint
npm run build
```
Fix any TypeScript errors before deploying.

### 2. Environment Variables
**Issue**: App works locally but fails on Vercel
**Solution**: 
- Double-check all environment variables are set in Vercel
- Ensure no typos in variable names
- Verify Supabase and Irys credentials

### 3. Irys Network Issues
**Issue**: Irys uploads fail on production
**Solution**:
- Ensure `IRYS_NETWORK=devnet` for testing
- Check RPC URL is accessible from Vercel
- Verify wallet has sufficient balance

### 4. Supabase Connection
**Issue**: Database connection fails
**Solution**:
- Verify Supabase URL and keys
- Check RLS policies allow Vercel IPs
- Ensure database is properly set up

## 🔄 Continuous Deployment

### Automatic Deployments
- Every push to `main` branch triggers deployment
- Preview deployments for pull requests
- Automatic rollback on build failures

### Manual Deployments
```bash
vercel --prod
```

## 📊 Monitoring & Analytics

### Vercel Analytics
- Enable in project settings
- Track page views and performance
- Monitor Core Web Vitals

### Error Monitoring
- Check Vercel Function Logs
- Monitor build logs for issues
- Set up error notifications

## 🔒 Security Considerations

### Environment Variables
- Never commit sensitive keys to Git
- Use Vercel's encrypted environment variables
- Rotate keys regularly

### Supabase Security
- Use Row Level Security (RLS)
- Limit service role key usage
- Monitor database access

### Irys Security
- Keep private keys secure
- Use environment variables for all keys
- Monitor wallet balances

## 🎉 Success!

Once deployed, your ProofCampus application will be available at:
```
https://your-project-name.vercel.app
```

### Next Steps
1. **Custom Domain**: Add your own domain in Vercel settings
2. **SSL Certificate**: Automatically provided by Vercel
3. **CDN**: Global edge network for fast loading
4. **Monitoring**: Set up performance monitoring

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review environment variables
3. Test locally with production environment
4. Contact Vercel support if needed

Your ProofCampus application is now ready for production! 🚀 