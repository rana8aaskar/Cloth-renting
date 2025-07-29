import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.models.js';

dotenv.config();

// Function to make a user admin
const makeUserAdmin = async (email) => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/Cloth_renting`);
    console.log('🔗 Connected to MongoDB');
    
    const user = await User.findOneAndUpdate(
      { email: email },
      { role: 'admin' },
      { new: true }
    );
    
    if (user) {
      console.log(`✅ User ${user.username} (${user.email}) is now an admin!`);
    } else {
      console.log(`❌ User with email ${email} not found`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
  
  process.exit(0);
};

// Usage: Replace with the email of the user you want to make admin
const emailToPromote = 'user@example.com'; // Change this email
makeUserAdmin(emailToPromote);
