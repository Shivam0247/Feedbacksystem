import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://shivampatel3650:Shivam.mongo.%40%40@rmscluster.rp33wwc.mongodb.net/feedback-system?retryWrites=true&w=majority&appName=RMSCluster');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const makeAdmin = async () => {
  await connectDB();

  const email = process.argv[2];

  if (!email) {
    console.log('\n❌ Please provide an email address');
    console.log('\nUsage: node scripts/makeAdmin.js <email>');
    console.log('\nExample:');
    console.log('node scripts/makeAdmin.js user@example.com');
    process.exit(1);
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`\n❌ User with email "${email}" not found`);
      process.exit(1);
    }

    if (user.role === 'admin') {
      console.log(`\n✅ User "${email}" is already an admin`);
      process.exit(0);
    }

    user.role = 'admin';
    await user.save();

    console.log(`\n✅ Successfully made "${email}" an admin!`);
    console.log(`\n📋 User Details:`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`\n⚠️  Note: User needs to login again to get a new token with admin privileges`);
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
};

makeAdmin();

