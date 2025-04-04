import mongoose from 'mongoose';

const arrayLimit = (val) => {
    return val.length <= 5;  // You can change the number as needed
  };

const listingSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    regularPrice:{
        type:Number,
        required:true,
    },
    discountPrice:{
        type:Number,
        required:true,
    },
    gender:{
        type:String,
        enum: ['m', 'f'],
        required:true,
    },
    size: {
        type: [String], // multiple sizes like ['S', 'M', 'L']
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        required: true
      },
      images: {
        type: [String], // store Cloudinary URLs or file paths
        validate: [arrayLimit, '{PATH} exceeds the limit of 6']
      },
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      availability: {
        type: Boolean,
        default: true
      },
      category: {
        type: String,
        enum: ['ethnic', 'formal', 'casual', 'party', 'wedding'],
        required: true
      },
},{timestamps:true});

const Listing = mongoose.model('Listing', listingSchema);
export default Listing;
