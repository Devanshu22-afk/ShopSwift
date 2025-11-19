# Fix Both CORS and 404 Errors

## Issue 1: CORS Error - New Vercel Preview URL

Your Vercel preview URL has changed to:
`https://shop-swift-yly6-ad49vi5hr-devanshu0311-9257s-projects.vercel.app`

This needs to be added to Render CORS configuration.

## Issue 2: 404 Error - Missing /api Prefix

The frontend is still calling `/products` instead of `/api/products`.

## Fix Both Issues

### Step 1: Update Render CORS (Backend)

1. **Go to Render Dashboard** → Your Web Service → **Environment** tab
2. **Find** `CORS_ALLOWED_ORIGINS`
3. **Update it to include ALL Vercel URLs:**

```
http://localhost:3000,https://shop-swift-yly6-783v6kjjl-devanshu0311-9257s-projects.vercel.app,https://shop-swift-yly6-fcmlxauan-devanshu0311-9257s-projects.vercel.app,https://shop-swift-yly6-ad49vi5hr-devanshu0311-9257s-projects.vercel.app
```

4. **Save** and **Redeploy** backend

### Step 2: Fix Vercel Environment Variable (Frontend)

1. **Go to Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. **Find/Add** `NEXT_PUBLIC_API_URL`
3. **Set value to:**
   ```
   https://shopswift-backend-084u.onrender.com/api
   ```
   **CRITICAL:** Must end with `/api`
4. **Make sure it's enabled for:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. **Save**

### Step 3: Redeploy Frontend

1. **Go to Deployments** tab
2. Click **"..."** on latest deployment
3. Select **"Redeploy"**
4. **Wait for completion** (2-3 minutes)

### Step 4: Clear Browser Cache

1. **Hard refresh:** Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Or **clear cache** completely

## Verify After Fix

After both redeployments, check browser console:

**Should see:**
- ✅ `https://shopswift-backend-084u.onrender.com/api/products` (200 OK)
- ✅ No CORS errors
- ✅ Products loading

**Should NOT see:**
- ❌ `https://shopswift-backend-084u.onrender.com/products` (404)
- ❌ CORS policy errors
- ❌ Failed to fetch errors

## Why Vercel URLs Keep Changing

Vercel creates a new preview URL for each deployment. For production, you should:

1. **Get your production Vercel URL:**
   - Go to Vercel → Your Project
   - Find the **Production** deployment (not Preview)
   - Copy that URL (usually `https://your-project-name.vercel.app`)

2. **Use production URL in CORS:**
   - This URL doesn't change
   - Add it to Render CORS: `CORS_ALLOWED_ORIGINS=http://localhost:3000,https://your-project-name.vercel.app`

3. **For preview deployments:**
   - Add them individually as they appear
   - Or use a wildcard pattern (if supported)

## Quick Checklist

- [ ] Updated Render CORS with new Vercel URL
- [ ] Redeployed backend
- [ ] Verified Vercel `NEXT_PUBLIC_API_URL` = `https://shopswift-backend-084u.onrender.com/api`
- [ ] Redeployed frontend
- [ ] Cleared browser cache
- [ ] Tested - products load correctly

