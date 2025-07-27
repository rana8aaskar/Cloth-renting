import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config.js';
import { useNotification } from '../contexts/NotificationContext.jsx';

export default function RentalForm({ listing, onClose }) {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    selectedSize: '',
    occasion: '',
    specialRequests: '',
    deliveryAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      phone: ''
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rentalDays, setRentalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [formErrors, setFormErrors] = useState({});

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate max date (30 days from today)
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  // Calculate rental days and total price when dates change
  const calculatePrice = (start, end) => {
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const timeDiff = endDate.getTime() - startDate.getTime();
      const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      if (days > 0) {
        setRentalDays(days);
        setTotalPrice(listing.discountPrice * days);
        // Clear date errors if calculation is successful
        setFormErrors(prev => ({
          ...prev,
          startDate: '',
          endDate: ''
        }));
      } else {
        setRentalDays(0);
        setTotalPrice(0);
        setFormErrors(prev => ({
          ...prev,
          endDate: 'End date must be after start date'
        }));
      }
    }
  };

  // Validate form fields
  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'startDate':
        if (!value) error = 'Start date is required';
        else if (new Date(value) < new Date(today)) error = 'Start date cannot be in the past';
        break;
      case 'endDate':
        if (!value) error = 'End date is required';
        else if (formData.startDate && new Date(value) <= new Date(formData.startDate)) {
          error = 'End date must be after start date';
        }
        break;
      case 'selectedSize':
        if (!value) error = 'Please select a size';
        break;
      case 'occasion':
        if (!value) error = 'Please specify the occasion';
        break;
      case 'deliveryAddress.street':
        if (!value) error = 'Street address is required';
        break;
      case 'deliveryAddress.city':
        if (!value) error = 'City is required';
        break;
      case 'deliveryAddress.state':
        if (!value) error = 'State is required';
        break;
      case 'deliveryAddress.zipCode':
        if (!value) error = 'ZIP code is required';
        else if (!/^\d{5,6}$/.test(value)) error = 'Enter a valid ZIP code';
        break;
      case 'deliveryAddress.phone':
        if (!value) error = 'Phone number is required';
        else if (!/^\d{10}$/.test(value.replace(/\D/g, ''))) error = 'Enter a valid 10-digit phone number';
        break;
    }
    
    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        deliveryAddress: {
          ...prev.deliveryAddress,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Calculate price when dates change
      if (name === 'startDate' || name === 'endDate') {
        const startDate = name === 'startDate' ? value : formData.startDate;
        const endDate = name === 'endDate' ? value : formData.endDate;
        calculatePrice(startDate, endDate);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      navigate('/sign-in');
      return;
    }

    if (rentalDays <= 0) {
      setError('Please select valid dates');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('=== RENTAL FORM SUBMISSION ===');
      console.log('API URL:', `${API_BASE_URL}/rental/create`);
      console.log('Listing ID:', listing._id);
      console.log('Form Data:', formData);
      console.log('==============================');
      
      const response = await axios.post(`${API_BASE_URL}/rental/create`, {
        listingId: listing._id,
        ...formData
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (response.data.success) {
        showSuccess('Rental request submitted successfully! You will be notified once the owner responds.');
        onClose();
        navigate('/rentals'); // Redirect to rentals page to see rental requests
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to submit rental request';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get tomorrow's date for min date validation
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Rent {listing.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Item Preview */}
          <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <img 
              src={listing.images[0]} 
              alt={listing.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div>
              <h3 className="font-semibold">{listing.name}</h3>
              <p className="text-gray-600">₹{listing.discountPrice}/day</p>
              <p className="text-sm text-gray-500">{listing.category}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  onBlur={(e) => validateField('startDate', e.target.value)}
                  min={today}
                  max={maxDateStr}
                  required
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                    formErrors.startDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {formErrors.startDate && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.startDate}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Date *</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  onBlur={(e) => validateField('endDate', e.target.value)}
                  min={formData.startDate || today}
                  max={maxDateStr}
                  required
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                    formErrors.endDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {formErrors.endDate && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.endDate}</p>
                )}
                {rentalDays > 0 && (
                  <p className="text-green-600 text-sm mt-1">✅ {rentalDays} day{rentalDays > 1 ? 's' : ''} rental</p>
                )}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Select Size *</label>
              <select
                name="selectedSize"
                value={formData.selectedSize}
                onChange={handleInputChange}
                onBlur={(e) => validateField('selectedSize', e.target.value)}
                required
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                  formErrors.selectedSize ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Choose size</option>
                {listing.size.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              {formErrors.selectedSize && (
                <p className="text-red-500 text-sm mt-1">{formErrors.selectedSize}</p>
              )}
            </div>

            {/* Occasion */}
            <div>
              <label className="block text-sm font-medium mb-2">Occasion *</label>
              <select
                name="occasion"
                value={formData.occasion}
                onChange={handleInputChange}
                onBlur={(e) => validateField('occasion', e.target.value)}
                required
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                  formErrors.occasion ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Select occasion</option>
                <option value="wedding">Wedding</option>
                <option value="party">Party</option>
                <option value="business">Business Meeting</option>
                <option value="date">Date Night</option>
                <option value="formal-event">Formal Event</option>
                <option value="cultural-event">Cultural Event</option>
                <option value="other">Other</option>
              </select>
              {formErrors.occasion && (
                <p className="text-red-500 text-sm mt-1">{formErrors.occasion}</p>
              )}
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-sm font-medium mb-2">Special Requests (Optional)</label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                rows="3"
                placeholder="Any special requirements or notes..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Delivery Address */}
            <div className="space-y-4">
              <h3 className="font-semibold">Delivery Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="address.street"
                  value={formData.deliveryAddress.street}
                  onChange={handleInputChange}
                  placeholder="Street Address"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  type="text"
                  name="address.city"
                  value={formData.deliveryAddress.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  type="text"
                  name="address.state"
                  value={formData.deliveryAddress.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  type="text"
                  name="address.zipCode"
                  value={formData.deliveryAddress.zipCode}
                  onChange={handleInputChange}
                  placeholder="ZIP Code"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <input
                type="tel"
                name="address.phone"
                value={formData.deliveryAddress.phone}
                onChange={handleInputChange}
                placeholder="Phone Number"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Price Summary */}
            {rentalDays > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Rental Summary</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Rental Duration:</span>
                    <span>{rentalDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price per day:</span>
                    <span>₹{listing.discountPrice}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Amount:</span>
                    <span>₹{totalPrice.toLocaleString('en-US')}</span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || rentalDays <= 0 || Object.values(formErrors).some(error => error)}
                className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    🛍️ Submit Request {totalPrice > 0 && `(₹${totalPrice.toLocaleString('en-US')})`}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
