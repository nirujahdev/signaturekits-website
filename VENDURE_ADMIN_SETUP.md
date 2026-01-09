# Vendure Admin Dashboard Setup

## Overview

The Vendure admin dashboard runs as a separate server from the Next.js frontend. To connect it to your Vercel deployment, you need to:

1. Deploy Vendure server separately (Railway, Render, or VPS)
2. Configure environment variables in Vercel
3. Update the admin link

## Deployment Options

### Option 1: Deploy Vendure on Railway (Recommended)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up/login

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository

3. **Configure Environment Variables**
   Add these in Railway:
   ```
   NODE_ENV=production
   VENDURE_PORT=3000
   DB_HOST=your-supabase-host
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your-supabase-password
   DB_NAME=postgres
   SESSION_SECRET=your-secret-key
   ALLOWED_ORIGINS=https://signaturekits-website-zbgo.vercel.app
   ```

4. **Set Build Command**
   ```
   npm run vendure:build
   ```

5. **Set Start Command**
   ```
   npm run vendure:start
   ```

6. **Get Your Railway URL**
   - Railway will provide a URL like: `https://your-app.railway.app`
   - Your admin dashboard will be at: `https://your-app.railway.app/admin`

### Option 2: Deploy Vendure on Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up/login

2. **Create New Web Service**
   - Connect your GitHub repository
   - Set build command: `npm run vendure:build`
   - Set start command: `npm run vendure:start`
   - Add environment variables (same as Railway)

3. **Get Your Render URL**
   - Render will provide a URL like: `https://your-app.onrender.com`
   - Your admin dashboard will be at: `https://your-app.onrender.com/admin`

## Configure Vercel Environment Variables

1. **Go to Vercel Dashboard**
   - Navigate to your project settings
   - Go to "Environment Variables"

2. **Add Environment Variable**
   ```
   NEXT_PUBLIC_VENDURE_ADMIN_URL=https://your-vendure-server.com/admin
   ```
   Replace `your-vendure-server.com` with your actual Vendure deployment URL.

3. **Also Update API URL** (if needed)
   ```
   NEXT_PUBLIC_VENDURE_API_URL=https://your-vendure-server.com/shop-api
   ```

4. **Redeploy**
   - After adding environment variables, redeploy your Vercel project

## Access Admin Dashboard

Once configured:
- Visit: `https://signaturekits-website-zbgo.vercel.app/admin`
- This will redirect to your Vendure admin dashboard
- Default login: `superadmin` / `superadmin` (change immediately!)

## Development Setup

For local development:

1. **Start Vendure Server**
   ```bash
   npm run vendure:dev
   ```

2. **Set Local Environment Variable**
   In your `.env` file:
   ```
   NEXT_PUBLIC_VENDURE_ADMIN_URL=http://localhost:3000/admin
   ```

3. **Access Admin**
   - Visit: `http://localhost:3000/admin` (direct)
   - Or: `http://localhost:3001/admin` (via Next.js redirect)

## Troubleshooting

### Admin link not working
- Check that `NEXT_PUBLIC_VENDURE_ADMIN_URL` is set in Vercel
- Verify your Vendure server is running and accessible
- Check CORS settings in Vendure config

### CORS Errors
Update Vendure `vendure-config.ts`:
```typescript
cors: {
  origin: [
    'https://signaturekits-website-zbgo.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
}
```

### Database Connection Issues
- Verify Supabase connection string
- Check that Supabase allows connections from your Vendure server IP
- Ensure database credentials are correct

## Security Notes

1. **Change Default Admin Password**
   - Immediately change the default `superadmin` password
   - Use a strong password

2. **Secure Session Secret**
   - Use a strong, random `SESSION_SECRET`
   - Never commit secrets to Git

3. **Restrict Admin Access**
   - Consider IP whitelisting for admin routes
   - Use authentication middleware if needed

