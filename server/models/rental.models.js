import mongoose from 'mongoose';

const rentalSchema = new mongoose.Schema({
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    renter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    selectedSize: {
        type: String,
        required: true
    },
    occasion: {
        type: String,
        required: true
    },
    specialRequests: {
        type: String,
        default: ''
    },
    rentalDays: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'active', 'completed', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending'
    },
    deliveryAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        phone: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Calculate rental days automatically
rentalSchema.pre('save', function(next) {
    if (this.startDate && this.endDate) {
        const timeDiff = this.endDate.getTime() - this.startDate.getTime();
        this.rentalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    }
    next();
});

const Rental = mongoose.model('Rental', rentalSchema);
export default Rental;
