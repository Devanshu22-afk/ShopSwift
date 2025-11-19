# Fix CORS Error - Quick Guide

## The Problem
Your Vercel frontend is being blocked by CORS because the backend doesn't recognize the Vercel preview URL.

## Solution: Update CORS in Render

### Step 1: Go to Render Dashboard
1. Open your Web Service: `shopswift-backend-084u`
2. Go to **Environment** tab

### Step 2: Update CORS_ALLOWED_ORIGINS
Find the `CORS_ALLOWED_ORIGINS` variable and update it to include **both** Vercel URLs:

```
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://shop-swift-yly6-783v6kjjl-devanshu0311-9257s-projects.vercel.app,https://shop-swift-yly6-fcmlxauan-devanshu0311-9257s-projects.vercel.app
```

**OR** if you want to allow all Vercel preview deployments, you can add your production domain pattern (see below).

### Step 3: Save and Redeploy
1. Click **"Save Changes"**
2. Go to **"Manual Deploy"** → **"Deploy latest commit"**
3. Wait for deployment to complete (~2 minutes)

## Better Solution: Use Production Domain

Vercel preview deployments have different URLs. For production, you should:

1. **Get your production Vercel URL:**
   - Go to Vercel Dashboard → Your Project
   - Find your **Production** deployment
   - Copy the production URL (usually `https://your-project-name.vercel.app`)

2. **Update CORS in Render:**
   ```
   CORS_ALLOWED_ORIGINS=http://localhost:3000,https://your-project-name.vercel.app
   ```

3. **Redeploy backend**

## Quick Fix (Allow All Vercel Domains)

If you want to allow all Vercel preview deployments (for development), you can temporarily use a more permissive approach. However, Spring CORS doesn't support wildcards in the middle of domains.

**Alternative:** Update your CORS config to allow all origins for development (NOT recommended for production):

Update `CorsConfig.java` to allow all origins temporarily:
```java
configuration.setAllowedOrigins(Arrays.asList("*")); // TEMPORARY - for development only
```

**But this won't work with `setAllowCredentials(true)`** - you'll need to set `setAllowCredentials(false)` if using wildcard.

## Recommended Approach

1. Add your **production Vercel URL** to CORS
2. For preview deployments, add them individually as needed
3. Or use a custom domain that doesn't change

## After Fixing

1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Test the login again

The CORS error should be resolved!

