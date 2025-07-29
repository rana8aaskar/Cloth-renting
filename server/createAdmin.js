import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/clothrental', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  createAdmin();
}).catch(err => {
  console.error('Database connection error:', err);
  process.exit(1);
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('✅ Admin already exists:');
      console.log('Username:', existingAdmin.username);
      console.log('Email:', existingAdmin.email);
      console.log('Password: admin123 (if you haven\'t changed it)');
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = bcryptjs.hashSync('admin123', 10);
    
    const adminUser = new User({
      username: 'admin',
      email: 'admin@clothrental.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    await adminUser.save();
    
    console.log('✅ Admin user created successfully!');
    console.log('==========================================');
    console.log('Admin Credentials:');
    console.log('Username: admin');
    console.log('Email: admin@clothrental.com');
    console.log('Password: admin123');
    console.log('==========================================');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
}
