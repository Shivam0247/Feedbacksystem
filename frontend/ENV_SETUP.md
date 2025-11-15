# Environment Variables Setup

## Backend API URL Configuration

The frontend is configured to use the deployed backend URL by default. 

### Current Configuration

The backend API URL is set to: `https://feedbacksystem-xy3i.onrender.com/api`

### Option 1: Using Environment Variable (Recommended)

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=https://feedbacksystem-xy3i.onrender.com/api
```

### Option 2: Default Configuration

If no `.env` file is found, the application will use the deployed backend URL as the default.

### For Local Development

If you want to use a local backend during development, create a `.env.local` file:

```env
VITE_API_URL=http://localhost:4000/api
```

**Note:** `.env.local` takes precedence over `.env` and is ignored by git.

### Environment Variables Priority

1. `.env.local` (highest priority, not committed to git)
2. `.env` (committed to git)
3. Default value in code (lowest priority)

### After Creating .env File

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. The changes will take effect immediately after restart.

### Verify Configuration

You can verify the API URL is being used correctly by checking the browser's Network tab in Developer Tools. All API requests should go to `https://feedbacksystem-xy3i.onrender.com/api`.

