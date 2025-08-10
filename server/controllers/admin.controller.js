import User from '../models/user.models.js'
import Listing from '../models/listing.models.js'
import Rental from '../models/rental.models.js'

// Get admin dashboard stats
export const getAdminStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' })
        const totalListings = await Listing.countDocuments()
        const totalRentals = await Rental.countDocuments()
        const pendingRentals = await Rental.countDocuments({ status: 'pending' })
        const activeRentals = await Rental.countDocuments({ status: 'active' })
        const completedRentals = await Rental.countDocuments({ status: 'completed' })

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalListings,
                totalRentals,
                pendingRentals,
                activeRentals,
                completedRentals
            }
        })
    } catch (error) {
        next(error)
    }
}

// Get all users for admin
export const getAllUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10 // Back to 10 for pagination
        const skip = (page - 1) * limit

        const users = await User.find({ role: 'user' })
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const totalUsers = await User.countDocuments({ role: 'user' })
        const totalPages = Math.ceil(totalUsers / limit)

        res.status(200).json({
            success: true,
            users,
            pagination: {
                currentPage: page,
                totalPages,
                totalUsers,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        })
    } catch (error) {
        next(error)
    }
}

// Get all listings for admin
export const getAllListings = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10 // Back to 10 for pagination
        const skip = (page - 1) * limit

        console.log('🔍 Fetching listings...')

        const listings = await Listing.find()
            .populate('owner', 'username email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const totalListings = await Listing.countDocuments()
        const totalPages = Math.ceil(totalListings / limit)

        console.log('📋 Found listings:', listings.length)

        res.status(200).json({
            success: true,
            listings,
            pagination: {
                currentPage: page,
                totalPages,
                totalListings,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        })
    } catch (error) {
        console.error('❌ Error fetching listings:', error)
        next(error)
    }
}

// Get all rentals for admin
export const getAllRentals = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 50 // Increased default limit
        const skip = (page - 1) * limit

        console.log('🔍 Fetching rentals...')

        const rentals = await Rental.find()
            .populate('renter', 'username email')
            .populate('listing', 'name images regularPrice')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const totalRentals = await Rental.countDocuments()
        const totalPages = Math.ceil(totalRentals / limit)

        console.log('📦 Found rentals:', rentals.length)

        res.status(200).json({
            success: true,
            rentals,
            pagination: {
                currentPage: page,
                totalPages,
                totalRentals,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        })
    } catch (error) {
        console.error('❌ Error fetching rentals:', error)
        next(error)
    }
}

// Delete user (admin only)
export const deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.params
        
        // Check if user exists
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        // Don't allow deleting admin users
        if (user.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Cannot delete admin users'
            })
        }

        await User.findByIdAndDelete(userId)
        
        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        })
    } catch (error) {
        next(error)
    }
}

// Delete listing (admin only)
export const deleteListing = async (req, res, next) => {
    try {
        const { listingId } = req.params
        
        const listing = await Listing.findById(listingId)
        if (!listing) {
            return res.status(404).json({
                success: false,
                message: 'Listing not found'
            })
        }

        await Listing.findByIdAndDelete(listingId)
        
        res.status(200).json({
            success: true,
            message: 'Listing deleted successfully'
        })
    } catch (error) {
        next(error)
    }
}

// Update rental status (admin only)
export const updateRentalStatus = async (req, res, next) => {
    try {
        const { rentalId } = req.params
        const { status } = req.body

        const validStatuses = ['pending', 'active', 'completed', 'cancelled']
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            })
        }

        const rental = await Rental.findById(rentalId)
        if (!rental) {
            return res.status(404).json({
                success: false,
                message: 'Rental not found'
            })
        }

        rental.status = status
        await rental.save()

        const updatedRental = await Rental.findById(rentalId)
            .populate('userId', 'username email')
            .populate('listingId', 'name imageUrls pricePerDay')

        res.status(200).json({
            success: true,
            message: 'Rental status updated successfully',
            rental: updatedRental
        })
    } catch (error) {
        next(error)
    }
}
