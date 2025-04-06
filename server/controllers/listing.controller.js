import Listing from "../models/listing.models.js";

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