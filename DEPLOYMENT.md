# Deployment Guide - ShopSwift Frontend on Vercel

## Prerequisites
- GitHub account with your ShopSwift repository
- Vercel account (free tier available)

## Step-by-Step Deployment

### 1. Sign up for Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" and choose "Continue with GitHub"
3. Authorize Vercel to access your GitHub account

### 2. Import Your Project
1. In Vercel dashboard, click **"Add New..."** → **"Project"**
2. Find and select your **ShopSwift** repository
3. Click **"Import"**

### 3. Configure Project Settings
1. **Root Directory**: Set to `New Frontend`
   - Click "Edit" next to Root Directory
   - Enter: `New Frontend`
   - Click "Continue"

2. **Framework Preset**: Should auto-detect as "Next.js"
   - If not, select "Next.js" from dropdown

3. **Build Command**: Leave as default (`npm run build`)

4. **Output Directory**: Leave as default (`.next`)

### 4. Add Environment Variables
Click on **"Environment Variables"** and add:

```
NEXT_PUBLIC_API_URL = https://your-backend-url.com/api
```

**Important Notes:**
- Replace `your-backend-url.com` with your actual backend URL
- If your backend is on Heroku, Railway, or another platform, use that URL
- For local development, this will use `http://localhost:8080/api` (default)
- The `NEXT_PUBLIC_` prefix makes it available in the browser

### 5. Deploy
1. Click **"Deploy"** button
2. Wait for the build to complete (usually 2-3 minutes)
3. Once deployed, you'll get a URL like: `https://shopswift.vercel.app`

### 6. Custom Domain (Optional)
1. Go to your project settings
2. Click **"Domains"**
3. Add your custom domain (e.g., `shopswift.com`)
4. Follow the DNS configuration instructions

## Updating Your Deployment

Every time you push to the `main` branch on GitHub:
- Vercel will automatically detect the changes
- Build and deploy the new version
- You'll get a notification when deployment is complete

## Environment Variables for Different Environments

### Production
```
NEXT_PUBLIC_API_URL=https://your-production-backend.com/api
```

### Preview (for pull requests)
```
NEXT_PUBLIC_API_URL=https://your-staging-backend.com/api
```

### Development (local)
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Troubleshooting

### Build Fails
- Check the build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version (should be 18+)

### API Calls Not Working
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check CORS settings on your backend
- Ensure backend is accessible from the internet

### Images Not Loading
- Check if image domains are configured in `next.config.js`
- Verify image paths are correct

## Backend Deployment Options

Since your frontend needs a backend, here are options:

### Option 1: Railway (Recommended)
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project → Deploy from GitHub
4. Select your ShopSwift repository
5. Set root directory to project root (not New Frontend)
6. Add PostgreSQL database
7. Set environment variables for database
8. Deploy!

### Option 2: Heroku
1. Go to [heroku.com](https://heroku.com)
2. Create new app
3. Connect GitHub repository
4. Add PostgreSQL addon
5. Configure environment variables
6. Deploy

### Option 3: Render
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Add PostgreSQL database
5. Configure and deploy

## Quick Checklist

- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] Root directory set to `New Frontend`
- [ ] Environment variable `NEXT_PUBLIC_API_URL` added
- [ ] Backend deployed and accessible
- [ ] CORS configured on backend to allow Vercel domain
- [ ] First deployment successful
- [ ] Tested all features on deployed site

## Support

If you encounter issues:
1. Check Vercel build logs
2. Check browser console for errors
3. Verify backend is running and accessible
4. Check CORS configuration

