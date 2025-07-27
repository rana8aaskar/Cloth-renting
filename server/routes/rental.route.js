import express from 'express';
import { 
    createRental, 
    getUserRentals, 
    updateRentalStatus, 
    getRental, 
    cancelRental 
} from '../controllers/rental.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Test route without authentication to debug
router.post('/test', (req, res) => {
    console.log('=== TEST ROUTE HIT ===');
    console.log('Body:', req.body);
    console.log('Cookies:', req.cookies);
    res.json({ message: 'Test route working', cookies: req.cookies });
});

// Create a new rental request
router.post('/create', verifyToken, createRental);

// Get all rentals for authenticated user
router.get('/user', verifyToken, getUserRentals);

// Get specific rental details
router.get('/:rentalId', verifyToken, getRental);

// Update rental status (for owners)
router.patch('/:rentalId/status', verifyToken, updateRentalStatus);

// Cancel rental (for renters)
router.patch('/:rentalId/cancel', verifyToken, cancelRental);

export default router;
