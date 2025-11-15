import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

// Generate a token for testing
// Replace 'USER_ID_HERE' with an actual user ID from your database
const userId = process.argv[2] || 'USER_ID_HERE';
const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

if (userId === 'USER_ID_HERE') {
  console.log('Usage: node scripts/generateToken.js <USER_ID>');
  console.log('\nTo get a USER_ID:');
  console.log('1. Sign up or login through the API');
  console.log('2. Or check MongoDB users collection for _id');
  console.log('\nExample:');
  console.log('node scripts/generateToken.js 65a1b2c3d4e5f6g7h8i9j0k1');
  process.exit(1);
}

const token = jwt.sign({ id: userId }, jwtSecret, {
  expiresIn: '30d'
});

console.log('\n✅ Generated Token:');
console.log(token);
console.log('\n📋 Use this in your requests:');
console.log(`Authorization: Bearer ${token}`);
console.log('\n⚠️  Note: Make sure the USER_ID exists in your database!');

