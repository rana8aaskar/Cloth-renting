import Rental from "../models/rental.models.js";
import Listing from "../models/listing.models.js";
import { errorHandler } from "../utils/errorHandler.js";

// Create a new rental request
export const createRental = async (req, res, next) => {
    try {
        console.log('=== RENTAL CREATE REQUEST ===');
        console.log('Body:', req.body);
        console.log('User:', req.user?.id);
        console.log('===============================');
        
        const {
            listingId,
            startDate,
            endDate,
            selectedSize,
            occasion,
            specialRequests,
            deliveryAddress
        } = req.body;

        // Validate listing exists and is available
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return next(errorHandler(404, "Listing not found"));
        }

        if (listing.availability === false) {
            return next(errorHandler(400, "This item is not available for rent"));
        }

        // Check if user is trying to rent their own item
        if (listing.owner.toString() === req.user.id) {
            return next(errorHandler(400, "You cannot rent your own item"));
        }

        // Calculate rental days and total price
        const start = new Date(startDate);
        const end = new Date(endDate);
        const timeDiff = end.getTime() - start.getTime();
        const rentalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (rentalDays <= 0) {
            return next(errorHandler(400, "End date must be after start date"));
        }

        const totalPrice = listing.discountPrice * rentalDays;

        const rental = await Rental.create({
            listing: listingId,
            renter: req.user.id,
            owner: listing.owner,
            startDate: start,
            endDate: end,
            selectedSize,
            occasion,
            specialRequests,
            rentalDays,
            totalPrice,
            deliveryAddress
        });

        // Populate the rental with listing and user details
        const populatedRental = await Rental.findById(rental._id)
            .populate('listing', 'name images category')
            .populate('renter', 'username email')
            .populate('owner', 'username email');

        res.status(201).json({
            success: true,
            message: "Rental request created successfully",
            rental: populatedRental
        });

    } catch (error) {
        console.log('=== RENTAL CREATE ERROR ===');
        console.log('Error:', error.message);
        console.log('Stack:', error.stack);
        console.log('===========================');
        next(error);
    }
};

// Get all rentals for a user (both as renter and owner)
export const getUserRentals = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Get rentals as a renter
        const asRenter = await Rental.find({ renter: userId })
            .populate('listing', 'name images category discountPrice')
            .populate('owner', 'username email')
            .sort({ createdAt: -1 });

        // Get rentals as an owner
        const asOwner = await Rental.find({ owner: userId })
            .populate('listing', 'name images category discountPrice')
            .populate('renter', 'username email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            rentals: {
                asRenter,
                asOwner
            }
        });

    } catch (error) {
        next(error);
    }
};

// Update rental status (for owners)
export const updateRentalStatus = async (req, res, next) => {
    try {
        const { rentalId } = req.params;
        const { status } = req.body;

        const rental = await Rental.findById(rentalId);
        if (!rental) {
            return next(errorHandler(404, "Rental not found"));
        }

        // Check if user is the owner of the listing
        if (rental.owner.toString() !== req.user.id) {
            return next(errorHandler(403, "You can only update your own rental requests"));
        }

        rental.status = status;
        rental.updatedAt = new Date();
        await rental.save();

        const updatedRental = await Rental.findById(rentalId)
            .populate('listing', 'name images category')
            .populate('renter', 'username email');

        res.status(200).json({
            success: true,
            message: "Rental status updated successfully",
            rental: updatedRental
        });

    } catch (error) {
        next(error);
    }
};

// Get specific rental details
export const getRental = async (req, res, next) => {
    try {
        const { rentalId } = req.params;

        const rental = await Rental.findById(rentalId)
            .populate('listing')
            .populate('renter', 'username email')
            .populate('owner', 'username email');

        if (!rental) {
            return next(errorHandler(404, "Rental not found"));
        }

        // Check if user is involved in this rental
        if (rental.renter.toString() !== req.user.id && rental.owner.toString() !== req.user.id) {
            return next(errorHandler(403, "Access denied"));
        }

        res.status(200).json({
            success: true,
            rental
        });

    } catch (error) {
        next(error);
    }
};

// Cancel rental (for renters)
export const cancelRental = async (req, res, next) => {
    try {
        const { rentalId } = req.params;

        const rental = await Rental.findById(rentalId);
        if (!rental) {
            return next(errorHandler(404, "Rental not found"));
        }

        // Check if user is the renter
        if (rental.renter.toString() !== req.user.id) {
            return next(errorHandler(403, "You can only cancel your own rentals"));
        }

        // Check if rental can be cancelled
        if (rental.status === 'completed' || rental.status === 'cancelled') {
            return next(errorHandler(400, "Cannot cancel this rental"));
        }

        rental.status = 'cancelled';
        rental.updatedAt = new Date();
        await rental.save();

        res.status(200).json({
            success: true,
            message: "Rental cancelled successfully"
        });

    } catch (error) {
        next(error);
    }
};
