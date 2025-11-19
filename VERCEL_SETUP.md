# Vercel Setup & Troubleshooting Guide

## Framework Detection Issue - "No Framework Detected"

If Vercel shows "No Framework Detected", follow these steps:

### Step 1: Verify Root Directory in Vercel
1. Go to https://vercel.com/dashboard
2. Click on your **ShopSwift** project
3. Go to **Settings** → **General**
4. Scroll down to **Root Directory**
5. **IMPORTANT**: Set it to `root` (not empty, not the repo root)
6. Click **Save**

### Step 2: Manually Set Framework Preset
1. Still in **Settings** → **General**
2. Scroll to **Framework Preset**
3. **Manually select**: `Next.js` from the dropdown
4. Click **Save**

### Step 3: Verify Build Settings
1. In **Settings** → **General**, check:
   - **Build Command**: Should be `npm run build` (or leave empty for auto-detection)
   - **Output Directory**: Should be `.next` (or leave empty for auto-detection)
   - **Install Command**: Should be `npm install` (or leave empty for auto-detection)

### Step 4: Redeploy After Changing Settings

1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Select **"Redeploy"**
4. Make sure it says "Redeploy" (not "Redeploy with existing build cache")
5. Wait for the build to complete

### Step 5: Verify Build Success
Check the build logs to ensure:
- ✅ Build completed successfully
- ✅ No errors in the deployment
- ✅ Status shows "Ready"

### Step 6: Check Your Deployment URL
- Your app URL should be: `https://your-project-name.vercel.app`
- Make sure you're visiting the root URL, not a sub-path
- Try: `https://your-project-name.vercel.app/` (with trailing slash)

## Common Issues:

### Issue 1: Root Directory Not Set
**Symptom**: 404 error on all routes
**Solution**: Set Root Directory to `root` in Vercel settings

### Issue 2: Wrong Branch
**Symptom**: Old code is deployed
**Solution**: Check Settings → Git → Production Branch is set to `main`

### Issue 3: Build Fails
**Symptom**: Deployment shows "Error" status
**Solution**: Check build logs for errors and fix them

## Quick Fix Checklist:
- [ ] Root Directory = `root`
- [ ] Framework Preset = `Next.js` (manually set)
- [ ] Production Branch = `main`
- [ ] Latest commit is deployed
- [ ] Build completed successfully
- [ ] Visiting correct URL (root domain, not sub-path)

## Still Getting 404?

1. **Delete and Re-import the project:**
   - Go to Vercel dashboard
   - Delete the current project
   - Click "Add New Project"
   - Import from GitHub again
   - **Set Root Directory to `root` during import**
   - Deploy

2. **Check Vercel Build Logs:**
   - Go to Deployments → Click on latest deployment
   - Check "Build Logs" tab
   - Look for any errors or warnings

3. **Verify File Structure:**
   - Make sure `root/src/app/page.tsx` exists
   - Make sure `root/src/app/layout.tsx` exists
   - Make sure `root/package.json` exists

## Contact Support:
If none of the above works, the issue might be with Vercel's detection. Try:
- Removing `vercel.json` temporarily
- Or contact Vercel support with your deployment URL

