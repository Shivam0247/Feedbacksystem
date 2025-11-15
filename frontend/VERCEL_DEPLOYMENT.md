# Vercel Deployment Guide

## Environment Variables Setup

To deploy the frontend on Vercel, you need to set the following environment variable:

### Required Environment Variable

**VITE_API_URL**: The backend API URL

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add a new variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://feedbacksystem-xy3i.onrender.com/api`
   - **Environment**: Production, Preview, Development (select all)

### Setting Environment Variables in Vercel

1. Open your project on [Vercel Dashboard](https://vercel.com/dashboard)
2. Go to **Settings** → **Environment Variables**
3. Click **Add New**
4. Enter:
   - Key: `VITE_API_URL`
   - Value: `https://feedbacksystem-xy3i.onrender.com/api`
   - Select all environments (Production, Preview, Development)
5. Click **Save**
6. **Redeploy** your application for changes to take effect

### Alternative: Using Vercel CLI

```bash
vercel env add VITE_API_URL
# Enter: https://feedbacksystem-xy3i.onrender.com/api
# Select: Production, Preview, Development
```

Then redeploy:
```bash
vercel --prod
```

## Troubleshooting

### 405 Method Not Allowed Error

If you see `405 Method Not Allowed` when trying to login:

1. **Check Environment Variable**: Make sure `VITE_API_URL` is set in Vercel
2. **Verify the URL**: Should be `https://feedbacksystem-xy3i.onrender.com/api` (with `/api` at the end)
3. **Redeploy**: After setting the environment variable, you must redeploy
4. **Check Browser Console**: Look for the actual API URL being used

### Verify Configuration

After deployment, check the browser's Network tab:
- API requests should go to: `https://feedbacksystem-xy3i.onrender.com/api/auth/login`
- NOT to: `https://feedbacksystem-kappa.vercel.app/auth/login`

### Default Fallback

If `VITE_API_URL` is not set, the app will use the default backend URL: `https://feedbacksystem-xy3i.onrender.com/api`

However, it's recommended to set it explicitly in Vercel environment variables.

