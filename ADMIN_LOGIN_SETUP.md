# Admin Login Setup Guide

## Issue: Internal Server Error on Login

If you're getting an "Internal server error" when trying to log in, it's most likely because the `SUPABASE_SERVICE_ROLE_KEY` environment variable is not set in Vercel.

## Steps to Fix:

### 1. Get Your Supabase Service Role Key

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/rmrdwwnuyuanribkcbew
2. Navigate to **Settings** → **API**
3. Find the **Service Role Key** (NOT the anon key)
4. Copy this key (it starts with `eyJ...`)

### 2. Add to Vercel Environment Variables

1. Go to your Vercel project: https://vercel.com/dashboard
2. Select your project: `signaturekits-website`
3. Go to **Settings** → **Environment Variables**
4. Add the following variable:
   - **Name**: `SUPABASE_SERVICE_ROLE_KEY`
   - **Value**: (paste your service role key from step 1)
   - **Environment**: Production, Preview, Development (select all)
5. Click **Save**
6. **Redeploy** your application (go to Deployments → click the three dots → Redeploy)

### 3. Verify Setup

After redeploying, you can test the connection by visiting:
- `https://your-site.vercel.app/api/admin/auth/test`

This endpoint will check if:
- Supabase environment variables are set
- Database connection works
- Admin users table is accessible

### 4. Admin Credentials

- **Username**: `benaiah`
- **Password**: `benaiah1234`

## Alternative: Check Vercel Logs

If the error persists after adding the environment variable:

1. Go to Vercel Dashboard → Your Project → **Deployments**
2. Click on the latest deployment
3. Click **Functions** tab
4. Find `/api/admin/auth/login`
5. Check the logs for detailed error messages

## Common Issues:

1. **Missing Service Role Key**: The most common issue. Make sure it's set in Vercel.
2. **Wrong Key**: Make sure you're using the **Service Role Key**, not the anon key.
3. **Not Redeployed**: After adding env vars, you must redeploy for changes to take effect.
4. **Password Hash Mismatch**: If password verification fails, the hash might need to be regenerated.

