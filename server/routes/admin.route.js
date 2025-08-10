import express from 'express'
import { 
    getAdminStats, 
    getAllUsers, 
    getAllListings, 
    getAllRentals, 
    deleteUser, 
    deleteListing, 
    updateRentalStatus 
} from '../controllers/admin.controller.js'
import { verifyToken } from '../utils/verifyUser.js'

const router = express.Router()

// Middleware to verify admin role
const verifyAdmin = async (req, res, next) => {
    try {
        // First verify the token
        verifyToken(req, res, (err) => {
            if (err) {
                return next(err)
            }
            
            // Then check if user is admin
            if (req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. Admin only.'
                })
            }
            next()
        })
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        })
    }
}

// Admin dashboard stats
router.get('/stats', verifyAdmin, getAdminStats)

// User management
router.get('/users', verifyAdmin, getAllUsers)
router.delete('/users/:userId', verifyAdmin, deleteUser)

// Listing management
router.get('/listings', verifyAdmin, getAllListings)
router.delete('/listings/:listingId', verifyAdmin, deleteListing)

// Rental management
router.get('/rentals', verifyAdmin, getAllRentals)
router.patch('/rentals/:rentalId/status', verifyAdmin, updateRentalStatus)

export default router
