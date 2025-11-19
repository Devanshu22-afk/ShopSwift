# Backend Deployment Guide - Spring Boot + PostgreSQL

This guide covers deploying your Spring Boot backend to **Render** (recommended) and setting up PostgreSQL database.

## Option 1: Deploy to Render (Recommended - Free Tier Available)

### Step 1: Prepare Your Repository
1. Make sure all your code is pushed to GitHub
2. Verify `pom.xml` has the Spring Boot Maven plugin

### Step 2: Create PostgreSQL Database on Render
1. Go to https://render.com and sign up/login
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `shopswift-db` (or any name)
   - **Database**: `Demo` (or leave default)
   - **User**: `postgres` (or leave default)
   - **Region**: Choose closest to you
   - **PostgreSQL Version**: 15 or 16
   - **Plan**: Free (or paid for production)
4. Click **"Create Database"**
5. **IMPORTANT**: Copy these credentials (you'll need them):
   - **Internal Database URL** (for Render services)
   - **External Database URL** (for local access)
   - **Host**
   - **Port**
   - **Database Name**
   - **Username**
   - **Password**

### Step 3: Deploy Spring Boot Backend to Render
1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select your **ShopSwift** repository
4. Configure the service:
   - **Name**: `shopswift-backend` (or any name)
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: Leave empty (root of repo)
   - **Environment**: `Java`
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar target/SpringEcom-0.0.1-SNAPSHOT.jar`
   - **Plan**: Free (or paid for production)

### Step 4: Add Environment Variables in Render
In your Web Service settings, go to **"Environment"** and add:

```bash
# Database Configuration (from PostgreSQL service)
SPRING_DATASOURCE_URL=jdbc:postgresql://[HOST]:[PORT]/[DATABASE]
SPRING_DATASOURCE_USERNAME=[USERNAME]
SPRING_DATASOURCE_PASSWORD=[PASSWORD]

# Server Configuration
SERVER_PORT=8080

# JPA Configuration
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=false

# CORS Configuration (Add your Vercel frontend URL)
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,https://your-frontend.vercel.app

# JWT Secret (Generate a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**How to get database values:**
- Go to your PostgreSQL service in Render
- Click on the service
- Copy the **Internal Database URL**
- Format: `jdbc:postgresql://[host]:[port]/[database]`
- Extract username and password from the URL

**Example:**
```
Internal URL: postgresql://postgres:password123@dpg-xxxxx-a.oregon-postgres.render.com/demo_db
Becomes:
SPRING_DATASOURCE_URL=jdbc:postgresql://dpg-xxxxx-a.oregon-postgres.render.com:5432/demo_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=password123
```

### Step 5: Update application.properties for Production
Create a production profile or use environment variables:

**Option A: Use Environment Variables (Recommended)**
Update `src/main/resources/application.properties` to use environment variables:

```properties
spring.application.name=SpringEcom

# Database Configuration (from environment variables)
spring.datasource.url=${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5432/Demo}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME:postgres}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD:Welcome123}
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=${SPRING_JPA_HIBERNATE_DDL_AUTO:update}
spring.jpa.show-sql=${SPRING_JPA_SHOW_SQL:false}
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Server Configuration
server.port=${SERVER_PORT:8080}
server.address=0.0.0.0

# File upload size limits
spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# CORS Configuration
cors.allowed.origins=${CORS_ALLOWED_ORIGINS:http://localhost:5173,http://localhost:3000}
```

### Step 6: Deploy
1. Click **"Create Web Service"**
2. Wait for build to complete (5-10 minutes first time)
3. Your backend will be available at: `https://your-service-name.onrender.com`

### Step 7: Update Frontend API URL
1. Go to your Vercel project
2. Go to **Settings** → **Environment Variables**
3. Update or add:
   ```
   NEXT_PUBLIC_API_URL=https://your-service-name.onrender.com/api
   ```
4. Redeploy your frontend

---

## Option 2: Deploy to Railway (Alternative)

### Step 1: Create PostgreSQL Database
1. Go to https://railway.app
2. Click **"New Project"** → **"Provision PostgreSQL"**
3. Copy the database connection string

### Step 2: Deploy Backend
1. Click **"New"** → **"GitHub Repo"**
2. Select your repository
3. Railway will auto-detect Java/Spring Boot
4. Add environment variables (same as Render)
5. Deploy

---

## Option 3: Deploy to Heroku (Alternative)

### Step 1: Install Heroku CLI
```bash
# Download from https://devcenter.heroku.com/articles/heroku-cli
```

### Step 2: Create Procfile
Create `Procfile` in project root:
```
web: java -jar target/SpringEcom-0.0.1-SNAPSHOT.jar
```

### Step 3: Add PostgreSQL Add-on
```bash
heroku create shopswift-backend
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set SPRING_DATASOURCE_URL=$(heroku config:get DATABASE_URL)
```

### Step 4: Deploy
```bash
git push heroku main
```

---

## PostgreSQL Setup Options

### Option A: Cloud Database (Recommended for Production)

**Free Options:**
1. **Render PostgreSQL** - Free tier available
2. **Railway PostgreSQL** - Free tier available
3. **Supabase** - Free tier, PostgreSQL compatible
4. **Neon** - Free tier, serverless PostgreSQL
5. **ElephantSQL** - Free tier available

**Paid Options:**
1. **AWS RDS** - Production-grade
2. **Google Cloud SQL** - Production-grade
3. **Azure Database** - Production-grade

### Option B: Local PostgreSQL (For Development)

1. **Install PostgreSQL:**
   - Windows: Download from https://www.postgresql.org/download/windows/
   - Mac: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql`

2. **Create Database:**
   ```sql
   CREATE DATABASE Demo;
   ```

3. **Update application.properties:**
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/Demo
   spring.datasource.username=postgres
   spring.datasource.password=your_password
   ```

---

## Environment Variables Reference

### Required Variables:
```bash
SPRING_DATASOURCE_URL=jdbc:postgresql://host:port/database
SPRING_DATASOURCE_USERNAME=username
SPRING_DATASOURCE_PASSWORD=password
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend.vercel.app
```

### Optional Variables:
```bash
SERVER_PORT=8080
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=false
JWT_SECRET=your-secret-key
```

---

## Testing Your Deployment

### 1. Test Backend Health
```bash
curl https://your-backend-url.onrender.com/api/products
```

### 2. Test from Frontend
- Open your Vercel frontend
- Try browsing products
- Try logging in
- Check browser console for errors

### 3. Common Issues:

**Issue: Database Connection Failed**
- Check database credentials
- Verify database is running
- Check firewall/network settings

**Issue: CORS Error**
- Add your Vercel URL to `CORS_ALLOWED_ORIGINS`
- Restart backend after updating

**Issue: 401 Unauthorized**
- Check JWT token is being sent
- Verify backend is receiving requests
- Check authentication endpoints

---

## Security Best Practices

1. **Never commit credentials:**
   - Use environment variables
   - Add `application.properties` to `.gitignore` (if it contains secrets)

2. **Use strong JWT secret:**
   - Generate random string: `openssl rand -base64 32`
   - Store in environment variable

3. **Enable HTTPS:**
   - Render/Railway provide HTTPS by default
   - Update CORS to use HTTPS URLs

4. **Database Security:**
   - Use strong passwords
   - Restrict database access
   - Enable SSL connections

---

## Quick Checklist

- [ ] PostgreSQL database created (cloud or local)
- [ ] Database credentials copied
- [ ] Backend deployed to Render/Railway/Heroku
- [ ] Environment variables configured
- [ ] CORS updated with Vercel frontend URL
- [ ] Frontend `NEXT_PUBLIC_API_URL` updated
- [ ] Backend health check passes
- [ ] Frontend can connect to backend
- [ ] Login/registration works
- [ ] Products load correctly

---

## Support

If you encounter issues:
1. Check Render/Railway build logs
2. Check backend logs for errors
3. Verify environment variables are set correctly
4. Test database connection separately
5. Check CORS configuration

---

## Next Steps After Deployment

1. **Update Frontend:**
   - Set `NEXT_PUBLIC_API_URL` in Vercel to your backend URL
   - Redeploy frontend

2. **Test Everything:**
   - User registration
   - Login (user and admin)
   - Browse products
   - Add to cart
   - Checkout
   - View orders

3. **Monitor:**
   - Check backend logs regularly
   - Monitor database usage
   - Set up alerts if available

