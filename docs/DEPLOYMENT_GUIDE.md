# DRLTAS Deployment Guide for Render

This guide will walk you through deploying both the **backend** and **frontend** to Render.

---

## Architecture Overview

DRLTAS consists of two separate services:
1. **Backend API** - Node.js/Express/PostgreSQL (deployed as Web Service)
2. **Frontend** - Next.js application (deployed as Web Service)

---

## Prerequisites

- [ ] GitHub repository pushed with latest changes
- [ ] Render account created at https://render.com
- [ ] PostgreSQL database ready (can create on Render)
- [ ] Redis instance (optional, can create on Render)

---

## Part 1: Deploy Backend API

### Step 1: Create PostgreSQL Database

1. Go to Render Dashboard → Click **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name**: `drltas-database`
   - **Database**: `drltas_db`
   - **User**: `drltas_user` (auto-generated)
   - **Region**: Choose closest to your users
   - **Plan**: Free tier for testing, Starter for production
3. Click **"Create Database"**
4. **Save the connection details**:
   - Internal Database URL (for backend)
   - External Database URL (for migrations)

### Step 2: Create Backend Web Service

1. Go to Render Dashboard → Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure the service:

```yaml
Name: drltas-backend
Environment: Node
Region: [Same as database]
Branch: [your-branch-name]
Root Directory: backend
Build Command: npm install && npx prisma generate && npx prisma migrate deploy && npm run build
Start Command: npm start
```

### Step 3: Configure Backend Environment Variables

Add these environment variables in Render dashboard:

```bash
# Database
DATABASE_URL=[Copy from PostgreSQL Internal URL]

# JWT Secrets (generate strong random strings)
JWT_SECRET=[generate-strong-random-string]
JWT_REFRESH_SECRET=[generate-strong-random-string]
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Node Environment
NODE_ENV=production
PORT=3001

# CORS (will update after frontend is deployed)
CORS_ORIGIN=https://your-frontend-url.onrender.com

# Redis (Optional - create Redis instance first)
REDIS_URL=[Redis connection URL]
REDIS_PASSWORD=[Redis password]

# Optional: Logging
LOG_LEVEL=info
```

**How to generate strong secrets:**
```bash
# In your terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Deploy Backend

1. Click **"Create Web Service"**
2. Wait for build to complete (~3-5 minutes)
3. Check logs for errors
4. Once deployed, note your backend URL: `https://drltas-backend.onrender.com`

### Step 5: Run Database Migrations

Migrations run automatically during build, but to run manually:

1. Go to your backend service → **"Shell"** tab
2. Run:
```bash
npx prisma migrate deploy
npx prisma db seed  # If you have seed data
```

---

## Part 2: Deploy Frontend

### Step 1: Create Frontend Web Service

1. Go to Render Dashboard → Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure the service:

```yaml
Name: drltas-frontend
Environment: Node
Region: [Same as backend]
Branch: [your-branch-name]
Root Directory: frontend
Build Command: npm install && npm run build
Start Command: npm start
```

### Step 2: Configure Frontend Environment Variables

Add these environment variables:

```bash
# API Configuration (use your backend URL from Part 1)
NEXT_PUBLIC_API_URL=https://drltas-backend.onrender.com
NEXT_PUBLIC_API_PREFIX=/api/v1

# App Configuration
NEXT_PUBLIC_APP_NAME=DRLTAS
NEXT_PUBLIC_APP_URL=https://drltas-frontend.onrender.com

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_PDF_DOWNLOAD=true

# Authentication
NEXT_PUBLIC_TOKEN_STORAGE_KEY=drltas_token
NEXT_PUBLIC_REFRESH_TOKEN_KEY=drltas_refresh_token

# Node Environment
NODE_ENV=production
```

### Step 3: Deploy Frontend

1. Click **"Create Web Service"**
2. Wait for build to complete (~3-5 minutes)
3. Once deployed, note your frontend URL: `https://drltas-frontend.onrender.com`

### Step 4: Update Backend CORS Settings

1. Go back to backend service → **"Environment"** tab
2. Update `CORS_ORIGIN` to your frontend URL:
```bash
CORS_ORIGIN=https://drltas-frontend.onrender.com
```
3. Save and redeploy backend

---

## Part 3: Verify Deployment

### Backend Health Check

Visit: `https://drltas-backend.onrender.com/health`

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-21T00:00:00.000Z"
}
```

### Frontend Access

1. Visit: `https://drltas-frontend.onrender.com`
2. You should see the DRLTAS landing/login page
3. Try registering a new account
4. Test creating a business profile
5. Test starting an assessment

### Test Complete Flow

1. **Register** → Create account
2. **Login** → Authenticate
3. **Create Business Profile** → Add company details
4. **Start Assessment** → Take assessment
5. **View Results** → Check scores, risks, recommendations
6. **Download PDF** → Generate and download report

---

## Part 4: Database Seeding (Optional)

To add initial modules and questions:

1. Go to backend service → **"Shell"** tab
2. Run:
```bash
npx prisma db seed
```

Or create a custom seed script in `backend/prisma/seed.ts`

---

## Troubleshooting

### Build Errors

**Error: Prisma Client not generated**
- **Solution**: Ensure build command includes `npx prisma generate`

**Error: Cannot find module**
- **Solution**: Check that all dependencies are in `package.json`, not just `devDependencies`

**Error: TypeScript compilation failed**
- **Solution**: This was already fixed in commit `19f129f`. Make sure you're deploying the latest commit.

### Runtime Errors

**Database connection failed**
- **Solution**: Check `DATABASE_URL` is set correctly and database is running

**CORS errors in browser**
- **Solution**: Verify `CORS_ORIGIN` in backend matches exact frontend URL (no trailing slash)

**401 Unauthorized errors**
- **Solution**: Check JWT secrets are set and cookies are being sent/received

### Performance Issues

**Slow cold starts**
- **Solution**: This is normal on Render free tier. Upgrade to paid plan for faster spin-up.

**Timeouts during build**
- **Solution**: Consider separating build steps or increasing timeout limits

---

## Custom Domain Setup (Optional)

### Frontend Custom Domain

1. Go to frontend service → **"Settings"** → **"Custom Domain"**
2. Add your domain: `app.yourdomain.com`
3. Add CNAME record in your DNS:
   ```
   CNAME   app   drltas-frontend.onrender.com
   ```
4. Wait for SSL certificate (automatic)

### Backend Custom Domain

1. Go to backend service → **"Settings"** → **"Custom Domain"**
2. Add your domain: `api.yourdomain.com`
3. Add CNAME record in your DNS:
   ```
   CNAME   api   drltas-backend.onrender.com
   ```
4. Update frontend `NEXT_PUBLIC_API_URL` to use new domain

---

## Monitoring & Logs

### View Logs

- Backend: Render Dashboard → drltas-backend → **"Logs"** tab
- Frontend: Render Dashboard → drltas-frontend → **"Logs"** tab

### Monitor Performance

- Backend: Render Dashboard → drltas-backend → **"Metrics"** tab
- View CPU, memory usage, response times

### Set Up Alerts

1. Go to service → **"Notifications"**
2. Add email for deploy failures
3. Add webhook for monitoring services (optional)

---

## Security Checklist

- [ ] All environment variables set with strong secrets
- [ ] DATABASE_URL uses internal connection (not external)
- [ ] CORS_ORIGIN set to exact frontend URL
- [ ] JWT secrets are 32+ character random strings
- [ ] NODE_ENV=production set for both services
- [ ] SSL/HTTPS enabled (automatic on Render)
- [ ] Rate limiting configured in backend
- [ ] Database backups enabled (Render paid plan)

---

## Scaling Considerations

### Free Tier Limitations

- Backend: Spins down after 15 minutes of inactivity
- Database: 256MB storage limit
- No auto-scaling

### Upgrading for Production

1. **Backend**: Starter ($7/mo) or higher
2. **Database**: Starter ($7/mo) - 256GB storage, daily backups
3. **Redis**: Starter ($10/mo) - for session management
4. Enable **Auto-Deploy** from main branch

---

## Next Steps

After successful deployment:

1. **Test thoroughly** using TESTING_GUIDE.md
2. **Create admin user** for system management
3. **Add modules/questions** via seed script or admin panel
4. **Set up monitoring** with external service (Sentry, LogRocket)
5. **Configure backups** for database
6. **Document API** for integrations
7. **Set up CI/CD** for automated testing before deploy

---

## Support Resources

- **Render Docs**: https://render.com/docs
- **Prisma Deployment**: https://www.prisma.io/docs/guides/deployment
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **DRLTAS Issues**: [Your GitHub repo issues page]

---

## Deployment Checklist

### Pre-Deployment
- [ ] All code committed and pushed to GitHub
- [ ] Environment variables documented
- [ ] Database migrations tested locally
- [ ] Build scripts working locally
- [ ] API endpoints tested

### Backend Deployment
- [ ] PostgreSQL database created
- [ ] Redis instance created (optional)
- [ ] Backend web service created
- [ ] Environment variables configured
- [ ] Build successful
- [ ] Migrations executed
- [ ] Health check passing

### Frontend Deployment
- [ ] Frontend web service created
- [ ] Environment variables configured (with backend URL)
- [ ] Build successful
- [ ] Can access frontend URL
- [ ] CORS configured in backend

### Post-Deployment
- [ ] Full application flow tested
- [ ] User registration working
- [ ] Assessment creation working
- [ ] PDF generation working
- [ ] Custom domains configured (if applicable)
- [ ] Monitoring and alerts set up
- [ ] Team has access to Render dashboard

---

**Deployment Complete!** 🎉

Your DRLTAS application is now live and ready for testing.
