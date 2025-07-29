import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.models.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(`${process.env.MONGODB_URL}/Cloth_renting`).then(async () => {
  console.log('🔗 Connected to MongoDB');
  
  try {
    // Update all users without a role field to have role: 'user'
    const result = await User.updateMany(
      { 
        role: { $exists: false } // Users without role field
      },
      { 
        $set: { role: 'user' } 
      }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} users to have role: 'user'`);
    
    // Also update any users with null/undefined role
    const result2 = await User.updateMany(
      { 
        role: { $in: [null, undefined] },
        email: { $ne: 'aaskar08admin@gmail.com' } // Don't change admin
      },
      { 
        $set: { role: 'user' } 
      }
    );
    
    console.log(`✅ Updated ${result2.modifiedCount} additional users`);
    
    // Check final counts
    const totalUsers = await User.countDocuments();
    const regularUsers = await User.countDocuments({ role: 'user' });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    
    console.log('👥 Final user counts:');
    console.log(`  Total: ${totalUsers}`);
    console.log(`  Regular users: ${regularUsers}`);
    console.log(`  Admin users: ${adminUsers}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
  
  process.exit(0);
}).catch(err => {
  console.error('Database connection error:', err);
  process.exit(1);
});
