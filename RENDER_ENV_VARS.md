# Render Environment Variables Setup

## Your PostgreSQL Connection Details

From your Internal Database URL:
```
postgresql://shopswift_db_u4ma_user:Rsr7CwizwasnJEOmwIZv1mJlV0tm23hw@dpg-d4f3ie49c44c73d57ctg-a/shopswift_db_u4ma
```

## Environment Variables for Render Web Service

Add these in your Render Web Service → Environment tab:

```bash
# Database Configuration
SPRING_DATASOURCE_URL=jdbc:postgresql://dpg-d4f3ie49c44c73d57ctg-a:5432/shopswift_db_u4ma
SPRING_DATASOURCE_USERNAME=shopswift_db_u4ma_user
SPRING_DATASOURCE_PASSWORD=Rsr7CwizwasnJEOmwIZv1mJlV0tm23hw

# Server Configuration
SERVER_PORT=8080

# JPA Configuration
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=false

# CORS Configuration (Replace with your actual Vercel URL)
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://your-app.vercel.app
```

## Step-by-Step Setup

1. **Go to Render Dashboard**
   - Navigate to your Web Service (or create one if not done)

2. **Go to Environment Tab**
   - Click on your Web Service
   - Click on "Environment" in the left sidebar

3. **Add Each Variable**
   - Click "Add Environment Variable"
   - Add each variable from the list above
   - **Important**: Replace `https://your-app.vercel.app` with your actual Vercel frontend URL

4. **Save and Redeploy**
   - Click "Save Changes"
   - Go to "Manual Deploy" → "Deploy latest commit"
   - Wait for deployment to complete

## Verify Connection

After deployment, check the logs to ensure:
- ✅ Database connection successful
- ✅ No connection errors
- ✅ Application started successfully

## Security Note

⚠️ **Never commit these credentials to Git!**
- These are already in `.gitignore`
- Only use them in Render's environment variables
- Keep them secure

