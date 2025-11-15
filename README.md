# MERN Stack Feedback System

A full-stack feedback management system built with React, Node.js, Express, and MongoDB.

## Features

### User Features
- ✅ Signup & Login with JWT authentication
- ✅ Submit feedback with category and rating
- ✅ View all feedback with search, filter, sort, and pagination
- ✅ Upvote feedback
- ✅ Edit/Delete own feedback
- ✅ View "My Feedback" page

### Admin Features
- ✅ Manage all feedback
- ✅ Update feedback status (Open / In-progress / Completed / Rejected)
- ✅ Manage categories (CRUD)
- ✅ Dashboard with statistics (total users, total feedback, average rating, category usage)
- ✅ Delete any feedback
- ✅ View user list

## Tech Stack

**Frontend:**
- React + Vite
- Tailwind CSS
- Axios
- React Router

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Project Structure

```
Feedbacksystem/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── feedbackController.js
│   │   ├── adminController.js
│   │   └── categoryController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── feedbackRoutes.js
│   │   ├── adminRoutes.js
│   │   └── categoryRoutes.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Category.js
│   │   └── Feedback.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── context/
    │   ├── api/
    │   └── App.jsx
    └── package.json
```

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/feedback-system
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

4. Make sure MongoDB is running on your system

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:4000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Auth
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get logged in user

### Feedback
- `POST /api/feedback` - Create feedback
- `GET /api/feedback` - Get all feedback (supports search, filter, sort, pagination)
- `GET /api/feedback/:id` - Get single feedback
- `PUT /api/feedback/:id` - Update own feedback
- `DELETE /api/feedback/:id` - Delete own feedback
- `POST /api/feedback/:id/upvote` - Toggle upvote

### Admin
- `PUT /api/admin/feedback/:id/status` - Update feedback status
- `DELETE /api/admin/feedback/:id` - Delete any feedback
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users

### Categories
- `POST /api/categories` - Create category (admin only)
- `GET /api/categories` - Get all categories
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

## Default Admin User

To create an admin user, you can either:
1. Manually update a user's role in MongoDB to "admin"
2. Or use MongoDB Compass/CLI to set a user's role field to "admin"

## Notes

- Make sure MongoDB is installed and running
- Change the JWT_SECRET in production
- The frontend proxy is configured to forward `/api` requests to the backend
- All admin routes are protected with role-based authorization

