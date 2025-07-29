import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.models.js';
import Listing from './models/listing.models.js';
import Rental from './models/rental.models.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(`${process.env.MONGODB_URL}/Cloth_renting`).then(async () => {
  console.log('🔗 Connected to MongoDB');
  
  try {
    // Check users
    const totalUsers = await User.countDocuments();
    const regularUsers = await User.countDocuments({ role: 'user' });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    
    console.log('👥 Users:');
    console.log(`  Total: ${totalUsers}`);
    console.log(`  Regular users: ${regularUsers}`);
    console.log(`  Admin users: ${adminUsers}`);
    
    // Check listings
    const totalListings = await Listing.countDocuments();
    console.log(`👕 Listings: ${totalListings}`);
    
    if (totalListings > 0) {
      const sampleListing = await Listing.findOne().populate('owner', 'username email');
      console.log('Sample listing:', {
        name: sampleListing.name,
        owner: sampleListing.owner,
        price: sampleListing.regularPrice
      });
    }
    
    // Check rentals
    const totalRentals = await Rental.countDocuments();
    console.log(`📦 Rentals: ${totalRentals}`);
    
    if (totalRentals > 0) {
      const sampleRental = await Rental.findOne()
        .populate('renter', 'username email')
        .populate('listing', 'name');
      console.log('Sample rental:', {
        listing: sampleRental.listing?.name,
        renter: sampleRental.renter?.username,
        status: sampleRental.status
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
  
  process.exit(0);
}).catch(err => {
  console.error('Database connection error:', err);
  process.exit(1);
});
