import { parse } from "dotenv";
import Listing from "../models/listing.models.js";
import { errorHandler } from "../utils/errorHandler.js";

export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json({
            success: true,
            message: "Listing created successfully",
            listing,
        })

    } catch (error) {
        next(error);
    }
}
export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if(!listing) {
        return res.status(404).json({
            success: false,
            message: "Listing not found",
        })
    }
    console.log("Listing owner:", listing.owner);
console.log("User ID:", req.user.id);
    if(listing.owner.toString() !== req.user.id.toString()) {
        return res.status(403).json({
            success: false,
            message: "You can only delete your own listing",
            
        })
        
    }
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Listing deleted successfully",
        })
    } catch (error) {
        next(error);
    }

}

export const updateListing = async (req, res, next) => {
const listing = await Listing.findById(req.params.id);
if(!listing) {
    return res.status(404).json({
        success: false,
        message: "Listing not found",
    })
}
if(listing.owner.toString() !== req.user.id.toString()) {
    return next(errorHandler(403, "You can only update your own listing"));
}

try {
    const updateListing = await Listing.findByIdAndUpdate(
        req.params.id,
         req.body,
        {new: true}
    );
    res.status(200).json(updateListing);
} catch (error) {
    next(error);
}
}
export const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id)
        if(!listing) {
            return res.status(404).json({
                success: false,
                message: "Listing not found",
            })
        }
        res.status(200).json(listing)
    } catch (error) {
        next(error);
    }
}

export const getListings = async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit) || 9;
      const startIndex = parseInt(req.query.startIndex) || 0;
    
      // Initialize query object
      let query = {};
  
      // Handle offer (availability) filter
      let offer = req.query.offer;
      if (offer !== 'undefined' && offer !== undefined) {
        offer = offer === 'true';  // Convert to boolean (true or false)
        query.offer = offer;       // Add to query if it's defined
      }
  
      // Handle size filter
      let size = req.query.size;
      if (size && size !== 'undefined') {
        // If `size` is a comma-separated string like "S,M,L", convert it to an array
        size = size.split(',');
        query.size = { $in: size };  // Match any of the sizes
      }
  
      // Handle gender filter
      let gender = req.query.gender;
      if (gender && gender !== 'undefined') {
        // Accept single or multiple values (e.g., 'm,f')
        gender = gender.split(',');
        query.gender = { $in: gender };  // Match any of the genders
      }
  
      // Handle category filter
      let category = req.query.category;
      if (category && category !== 'undefined') {
        // Accept single or multiple values (e.g., 'casual,formal')
        category = category.split(',');
        query.category = { $in: category };  // Match any of the categories
      }
  
      // Handle search term (case-insensitive)
      const searchTerm = req.query.searchTerm || '';
      
      // Sorting options
      const sort = req.query.sort || 'createdAt';
      const order = req.query.order || 'desc';
      
      // Combine search term with other filters and apply to the query
      const listings = await Listing.find({
        name: { $regex: searchTerm, $options: 'i' },  // Case-insensitive search
        ...query,  // Spread the query object to include all filters
      })
      .sort({ [sort]: order })  // Sorting based on provided parameters
      .limit(limit)  // Apply limit
      .skip(startIndex);  // Apply pagination
  
      // Send the response with listings
      res.status(200).json({ success: true, listings });
    } catch (error) {
      next(error);  // Error handling
    }
  };
  
  