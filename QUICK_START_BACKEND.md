# Quick Start: Backend Deployment on Render

## 🚀 Fastest Way to Deploy (5 Steps)

### Step 1: Create PostgreSQL Database
1. Go to https://render.com → Sign up/Login
2. Click **"New +"** → **"PostgreSQL"**
3. Name: `shopswift-db`
4. Database: `Demo`
5. Plan: **Free**
6. Click **"Create Database"**
7. **Copy the Internal Database URL** (you'll need it)

### Step 2: Deploy Backend
1. Click **"New +"** → **"Web Service"**
2. Connect GitHub → Select **ShopSwift** repo
3. Configure:
   - **Name**: `shopswift-backend`
   - **Environment**: `Java`
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar target/SpringEcom-0.0.1-SNAPSHOT.jar`
   - **Plan**: **Free**

### Step 3: Add Environment Variables
In the Web Service, go to **Environment** tab and add:

```bash
# Database (from PostgreSQL service)
SPRING_DATASOURCE_URL=jdbc:postgresql://[HOST]:[PORT]/[DATABASE]
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=[PASSWORD]

# Server
SERVER_PORT=8080

# JPA
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=false

# CORS (Replace with your Vercel URL)
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://your-app.vercel.app
```

**How to get database URL:**
- Go to your PostgreSQL service
- Copy **Internal Database URL**
- Format: `postgresql://user:pass@host:port/db`
- Convert to JDBC: `jdbc:postgresql://host:port/db`

**Example:**
```
Internal: postgresql://postgres:abc123@dpg-xxx.oregon-postgres.render.com/demo_db
Becomes:
SPRING_DATASOURCE_URL=jdbc:postgresql://dpg-xxx.oregon-postgres.render.com:5432/demo_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=abc123
```

### Step 4: Deploy
1. Click **"Create Web Service"**
2. Wait 5-10 minutes for first build
3. Your backend URL: `https://shopswift-backend.onrender.com`

### Step 5: Update Frontend
1. Go to Vercel → Your Project → Settings → Environment Variables
2. Add/Update:
   ```
   NEXT_PUBLIC_API_URL=https://shopswift-backend.onrender.com/api
   ```
3. Redeploy frontend

## ✅ Test Your Backend

```bash
# Test products endpoint
curl https://shopswift-backend.onrender.com/api/products

# Should return JSON array of products
```

## 🔧 Troubleshooting

**Build Fails:**
- Check build logs in Render
- Verify Maven wrapper exists (`mvnw` file)
- Check Java version (needs Java 17+)

**Database Connection Error:**
- Verify database is running
- Check credentials match
- Ensure database name is correct

**CORS Error:**
- Add your Vercel URL to `CORS_ALLOWED_ORIGINS`
- Restart backend after updating

**404 Not Found:**
- Check backend URL is correct
- Verify `/api` prefix in frontend calls
- Check backend logs

## 📝 Important Notes

1. **Free Tier Limitations:**
   - Backend spins down after 15 min inactivity
   - First request after spin-down takes ~30 seconds
   - Consider paid plan for production

2. **Database:**
   - Free tier has 90-day data retention
   - Upgrade for production use

3. **Environment Variables:**
   - Never commit passwords to Git
   - Use Render's environment variables
   - Update CORS when frontend URL changes

## 🎯 Next Steps

1. ✅ Backend deployed
2. ✅ Database connected
3. ✅ Frontend updated with backend URL
4. ✅ Test login/registration
5. ✅ Test product browsing
6. ✅ Test checkout flow

---

**Need more details?** See `BACKEND_DEPLOYMENT.md` for comprehensive guide.

