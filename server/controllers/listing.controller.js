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

    let query = {};

    // Offer filter
    if (req.query.offer && req.query.offer !== 'undefined') {
      query.offer = req.query.offer === 'true';
    }

    // Size filter
    if (req.query.size && req.query.size !== 'undefined' && req.query.size !== '') {
      const size = req.query.size.split(',');
      query.size = { $in: size };
    }

    // Gender filter - skip if 'all' or empty
    if (req.query.gender && req.query.gender !== 'undefined' && req.query.gender !== 'all') {
      const gender = req.query.gender.split(',');
      query.gender = { $in: gender };
    }

    // Category filter - skip if 'all' or empty
    if (req.query.category && req.query.category !== 'undefined' && req.query.category !== 'all') {
      const category = req.query.category.split(',');
      query.category = { $in: category };
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1; // convert to 1 or -1 for mongoose

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      ...query,
    })
    .sort({ [sort]: order })
    .limit(limit)
    .skip(startIndex);

    res.status(200).json({ success: true, listings });
  } catch (error) {
    next(error);
  }
};