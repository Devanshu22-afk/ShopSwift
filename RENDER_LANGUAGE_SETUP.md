# Render Language Selection for Spring Boot

## ✅ Correct Selection: **Docker**

Since Java is not available in Render's language dropdown, select **"Docker"** from the Language dropdown.

I've created a `Dockerfile` in your project root that will build and run your Spring Boot application.

## Complete Render Configuration

Once you select **Docker**, configure these settings:

### Language
- **Select**: `Docker`

### Branch
- **Select**: `main` (or your default branch)

### Region
- **Select**: `Singapore` (since you already have services there, or choose closest to you)

### Root Directory
- **Leave EMPTY** (since your Spring Boot app is at the root of the repository)

### Dockerfile Path
- **Leave EMPTY** (Render will auto-detect `Dockerfile` in root)

### Build & Start Commands
- **Leave EMPTY** (Dockerfile handles everything automatically)

## Dockerfile Created ✅

I've created a `Dockerfile` in your project root that:
- Uses Maven to build your Spring Boot application
- Uses Java 17 runtime
- Exposes port 8080
- Runs your application automatically

The Dockerfile is ready to use - no additional configuration needed!

## Quick Checklist

- [ ] Language: **Docker** ✅
- [ ] Branch: **main**
- [ ] Region: **Singapore** (or your preferred region)
- [ ] Root Directory: **EMPTY**
- [ ] Dockerfile Path: **EMPTY** (auto-detected)
- [ ] Build/Start Commands: **EMPTY** (handled by Dockerfile)

## Next Steps After Configuration

1. Click **"Create Web Service"**
2. Go to **Environment** tab
3. Add the database environment variables (from `RENDER_ENV_VARS.md`)
4. Deploy!

