import mongoose from 'mongoose';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/clothrental').then(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Update the user with your specific ID to have admin role
    const result = await mongoose.connection.db.collection('users').updateOne(
      { _id: new mongoose.Types.ObjectId('68885ba21156555d60fc2d28') },
      { $set: { role: 'admin' } }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ User updated to admin successfully!');
      console.log('==========================================');
      console.log('Your admin credentials are:');
      console.log('Email: aaskar08admin@gmail.com');
      console.log('Password: (the password you used when creating this user)');
      console.log('==========================================');
      console.log('You can now login to admin panel at http://localhost:5175');
    } else {
      console.log('❌ No user was updated');
    }
  } catch (error) {
    console.error('❌ Error updating user:', error.message);
  }
  
  process.exit(0);
}).catch(err => {
  console.error('Database connection error:', err);
  process.exit(1);
});
