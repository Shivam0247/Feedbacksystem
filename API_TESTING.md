# API Testing Guide - Getting Authentication Token

## Method 1: Sign Up / Login (Recommended)

### Step 1: Sign Up a New User

**POST** `http://localhost:4000/api/auth/signup`

**Request Body:**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "name": "Test User",
  "email": "test@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Copy the `token` from the response!**

### Step 2: Login (Alternative)

**POST** `http://localhost:4000/api/auth/login`

**Request Body:**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "name": "Test User",
  "email": "test@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Method 2: Using cURL

### Sign Up:
```bash
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login:
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Method 3: Using Postman / Thunder Client

1. Create a new request
2. Method: **POST**
3. URL: `http://localhost:4000/api/auth/login`
4. Headers: `Content-Type: application/json`
5. Body (raw JSON):
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```
6. Send request
7. Copy the `token` from response

## Using the Token

Once you have the token, use it in the `Authorization` header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

### Example: Create Category (Admin Only)

```bash
curl -X POST http://localhost:4000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Feature Request"
  }'
```

## Making a User Admin

To test admin endpoints, you need to make a user an admin. Here are two methods:

### Method 1: Using the Script (Easiest) ⭐

```bash
cd backend
node scripts/makeAdmin.js your-email@example.com
```

This will:
- Find the user by email
- Update their role to "admin"
- Show confirmation

**Then login again to get a new token with admin privileges!**

### Method 2: Manual MongoDB Update

1. Login and get the user's email
2. Update the user in MongoDB:

```javascript
// In MongoDB shell or Compass
use feedback-system
db.users.updateOne(
  { email: "test@example.com" },
  { $set: { role: "admin" } }
)
```

3. Login again to get a new token with admin privileges

## Method 4: Generate Token Script (Advanced)

If you already have a user ID from the database:

```bash
cd backend
node scripts/generateToken.js <USER_ID>
```

This will generate a token for that user ID.

## Troubleshooting: "Not authorized as admin" Error

If you get this error, it means your user doesn't have admin role. Follow these steps:

1. **Make your user an admin:**
   ```bash
   cd backend
   node scripts/makeAdmin.js your-email@example.com
   ```

2. **Login again to get a new token:**
   ```bash
   curl -X POST http://localhost:4000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"your-email@example.com","password":"yourpassword"}'
   ```

3. **Use the new token** - it will now have admin privileges!

## Quick Test Token (For Development Only)

If you want to quickly test, here's a sample token structure (won't work without matching JWT_SECRET):

The token format is: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.<payload>.<signature>`

**⚠️ Important:** You must use a real token from signup/login or the generateToken script!

