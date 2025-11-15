# Quick Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas connection string)
- npm or yarn

## Step 1: Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/feedback-system
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

Start the backend:
```bash
npm run dev
```

The backend will run on `http://localhost:4000`

## Step 2: Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:3000`

## Step 3: Create Admin User

After signing up a regular user, you can make them an admin by:

1. Using MongoDB Compass or MongoDB CLI
2. Connect to your database
3. Find the `users` collection
4. Find your user document
5. Update the `role` field from `"user"` to `"admin"`

Or use MongoDB shell:
```javascript
use feedback-system
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## Step 4: Create Initial Categories

1. Login as admin
2. Navigate to "Categories" in the navbar
3. Create categories like: "Feature Request", "Bug Report", "Improvement", etc.

## You're Ready!

- Visit `http://localhost:3000`
- Sign up for a new account
- Start submitting feedback!

