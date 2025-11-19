# Understanding Vercel URLs

## Why Vercel URLs Change

Vercel creates **different URLs** for different types of deployments:

### 1. Production URL (Stable - Doesn't Change)
- **Format:** `https://your-project-name.vercel.app`
- **When:** Deployments to your main branch (usually `main` or `master`)
- **Stability:** ✅ **This URL NEVER changes** - use this for production!
- **Example:** `https://shop-swift-yly6.vercel.app`

### 2. Preview URLs (Change Every Deployment)
- **Format:** `https://your-project-name-{hash}-{username}-{project}.vercel.app`
- **When:** Every commit, pull request, or branch deployment
- **Stability:** ❌ **Changes with every deployment**
- **Examples:**
  - `https://shop-swift-yly6-88pj77go6-devanshu0311-9257s-projects.vercel.app`
  - `https://shop-swift-yly6-ad49vi5hr-devanshu0311-9257s-projects.vercel.app`
  - `https://shop-swift-yly6-fcmlxauan-devanshu0311-9257s-projects.vercel.app`

### 3. Branch URLs (Change Per Branch)
- **Format:** `https://your-project-name-git-{branch}-{username}-{project}.vercel.app`
- **When:** Deployments from specific branches
- **Stability:** ⚠️ Changes when branch is updated
- **Example:** `https://shop-swift-yly6-git-main-devanshu0311-9257s-projects.vercel.app`

## The Solution: Use Production URL

### For Production (Recommended)

**Use your stable production URL in CORS:**

```
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://shop-swift-yly6.vercel.app
```

**Benefits:**
- ✅ Never changes
- ✅ Always works
- ✅ Clean and simple
- ✅ Production-ready

### For Development/Preview (If Needed)

If you want to test preview deployments, you have two options:

#### Option 1: Add Preview URLs Manually
Every time you deploy, add the new preview URL to CORS:
```
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://shop-swift-yly6.vercel.app,https://shop-swift-yly6-{new-hash}-devanshu0311-9257s-projects.vercel.app
```

**Problem:** You have to update CORS every time you deploy ❌

#### Option 2: Use Wildcard Pattern (If Supported)
Some CORS implementations support wildcards:
```
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://shop-swift-yly6.vercel.app,https://*.vercel.app
```

**Check if your backend supports this** - Spring Boot CORS might not support wildcards in the middle of domains.

#### Option 3: Allow All Origins (Development Only - NOT Recommended for Production)
```java
configuration.setAllowedOrigins(Arrays.asList("*"));
```

**⚠️ WARNING:** This won't work with `setAllowCredentials(true)` and is insecure for production!

## Best Practice

### For Production:
1. **Use Production URL only:**
   ```
   CORS_ALLOWED_ORIGINS=http://localhost:3000,https://shop-swift-yly6.vercel.app
   ```

2. **Always deploy to production branch** (main/master) for stable URL

3. **Test on production URL** instead of preview URLs

### For Development:
1. **Use localhost** for local development
2. **Use production URL** for testing
3. **Only add preview URLs** if absolutely necessary for testing

## Your Current Setup

Based on your deployment:
- **Production URL:** `https://shop-swift-yly6.vercel.app` ✅ Use this!
- **Preview URLs:** Change every deployment ❌ Don't rely on these

## Recommended CORS Configuration

**In Render Environment Variables:**

```
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://shop-swift-yly6.vercel.app
```

This will:
- ✅ Work for local development
- ✅ Work for production
- ✅ Never need updating
- ✅ Be stable and reliable

## Summary

- **Production URL:** Stable, use this! ✅
- **Preview URLs:** Change every deployment, avoid if possible ❌
- **Solution:** Use production URL in CORS configuration
- **Result:** No more CORS errors, no more URL updates needed!

