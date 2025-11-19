# Fix 404 Error - API URL Configuration

## The Problem
Your frontend is calling `https://shopswift-backend-084u.onrender.com/products` but it should be calling `https://shopswift-backend-084u.onrender.com/api/products`.

## The Solution

### Option 1: Update Vercel Environment Variable (Recommended)

1. **Go to Vercel Dashboard:**
   - Open your project
   - Go to **Settings** → **Environment Variables**

2. **Find or Add `NEXT_PUBLIC_API_URL`:**
   - If it exists, click to edit
   - If it doesn't exist, click **"Add New"**

3. **Set the value to:**
   ```
   https://shopswift-backend-084u.onrender.com/api
   ```
   **IMPORTANT:** Make sure it ends with `/api` (not just the base URL)

4. **Save and Redeploy:**
   - Click **"Save"**
   - Go to **Deployments** tab
   - Click **"..."** on latest deployment → **"Redeploy"**
   - Wait for deployment to complete

### Option 2: Update Frontend Code (Alternative)

If you can't update the environment variable, you can update the helpers to include `/api`:

Update `root/src/helpers/index.ts`:
- Change `/products` to `/api/products`
- Change `/products/${id}` to `/api/products/${id}`

But **Option 1 is better** because it fixes all API calls at once.

## Verify the Fix

After updating:

1. **Check the environment variable:**
   - Should be: `https://shopswift-backend-084u.onrender.com/api`
   - NOT: `https://shopswift-backend-084u.onrender.com`

2. **Test the API:**
   - Open browser console
   - Try to load products
   - Should see request to: `https://shopswift-backend-084u.onrender.com/api/products`
   - Should return 200 OK (not 404)

## Current vs Correct

**Current (Wrong):**
```
NEXT_PUBLIC_API_URL = https://shopswift-backend-084u.onrender.com
Request: /products
Result: https://shopswift-backend-084u.onrender.com/products ❌ 404
```

**Correct:**
```
NEXT_PUBLIC_API_URL = https://shopswift-backend-084u.onrender.com/api
Request: /products
Result: https://shopswift-backend-084u.onrender.com/api/products ✅ 200
```

