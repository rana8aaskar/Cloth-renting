import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config.js';
import { useNotification } from '../contexts/NotificationContext.jsx';

export default function RentalDashboard() {
  const [rentals, setRentals] = useState({ asRenter: [], asOwner: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('renter');
  const [error, setError] = useState(null);
  const { showSuccess, showError } = useNotification();

  // Status badge component
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '⏳' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', icon: '✅' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: '❌' },
      active: { bg: 'bg-blue-100', text: 'text-blue-800', icon: '🔄' },
      completed: { bg: 'bg-gray-100', text: 'text-gray-800', icon: '✅' },
      cancelled: { bg: 'bg-gray-100', text: 'text-gray-600', icon: '🚫' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        <span>{config.icon}</span>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/rental/user`, {
        withCredentials: true,
      });
      
      if (response.data.success) {
        setRentals(response.data.rentals);
      }
    } catch (error) {
      setError('Failed to load rentals');
      console.error('Error fetching rentals:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRentalStatus = async (rentalId, status) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/rental/${rentalId}/status`,
        { status },
        { withCredentials: true }
      );

      if (response.data.success) {
        fetchRentals(); // Refresh the list
        const statusMessage = status === 'approved' ? 'Rental approved successfully!' : 
                             status === 'rejected' ? 'Rental rejected successfully!' :
                             status === 'active' ? 'Rental marked as active!' :
                             status === 'completed' ? 'Rental marked as completed!' :
                             'Rental status updated successfully!';
        showSuccess(statusMessage);
      }
    } catch (error) {
      const errorMessage = 'Failed to update rental status';
      showError(errorMessage);
      console.error('Error updating rental:', error);
    }
  };

  const cancelRental = async (rentalId) => {
    if (window.confirm('Are you sure you want to cancel this rental?')) {
      try {
        const response = await axios.patch(
          `${API_BASE_URL}/rental/${rentalId}/cancel`,
          {},
          { withCredentials: true }
        );

        if (response.data.success) {
          fetchRentals(); // Refresh the list
          showSuccess('Rental cancelled successfully!');
        }
      } catch (error) {
        showError('Failed to cancel rental');
        console.error('Error cancelling rental:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg">Loading rentals...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Rental Management</h2>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('renter')}
          className={`px-6 py-3 border-b-2 font-medium text-sm ${
            activeTab === 'renter'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          My Rental Requests ({rentals.asRenter.length})
        </button>
        <button
          onClick={() => setActiveTab('owner')}
          className={`px-6 py-3 border-b-2 font-medium text-sm ${
            activeTab === 'owner'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Rental Requests for My Items ({rentals.asOwner.length})
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Rental Lists */}
      <div className="space-y-4">
        {activeTab === 'renter' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Items You Want to Rent</h3>
            {rentals.asRenter.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No rental requests found.</p>
                <p className="text-sm">Start browsing items to make your first rental request!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rentals.asRenter.map((rental) => (
                  <div key={rental._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Item Image */}
                      <img
                        src={rental.listing.images[0]}
                        alt={rental.listing.name}
                        className="w-full md:w-32 h-32 object-cover rounded-lg"
                      />
                      
                      {/* Rental Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-semibold">{rental.listing.name}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(rental.status)}`}>
                            {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <p><strong>Duration:</strong> {formatDate(rental.startDate)} - {formatDate(rental.endDate)}</p>
                            <p><strong>Days:</strong> {rental.rentalDays}</p>
                            <p><strong>Size:</strong> {rental.selectedSize}</p>
                          </div>
                          <div>
                            <p><strong>Occasion:</strong> {rental.occasion}</p>
                            <p><strong>Total Price:</strong> ₹{rental.totalPrice.toLocaleString('en-US')}</p>
                            <p><strong>Owner:</strong> {rental.owner.username}</p>
                          </div>
                        </div>
                        
                        {rental.specialRequests && (
                          <div className="mt-3">
                            <p className="text-sm"><strong>Special Requests:</strong> {rental.specialRequests}</p>
                          </div>
                        )}

                        {/* Action Buttons for Renter */}
                        <div className="mt-4 flex gap-2">
                          {rental.status === 'pending' && (
                            <button
                              onClick={() => cancelRental(rental._id)}
                              className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition duration-200"
                            >
                              Cancel Request
                            </button>
                          )}
                          
                          {rental.status === 'approved' && (
                            <div className="text-sm text-green-600 font-medium">
                              ✓ Approved! You will receive the item on {formatDate(rental.startDate)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'owner' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Rental Requests for Your Items</h3>
            {rentals.asOwner.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No rental requests received yet.</p>
                <p className="text-sm">When someone requests to rent your items, they'll appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rentals.asOwner.map((rental) => (
                  <div key={rental._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Item Image */}
                      <img
                        src={rental.listing.images[0]}
                        alt={rental.listing.name}
                        className="w-full md:w-32 h-32 object-cover rounded-lg"
                      />
                      
                      {/* Rental Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-semibold">{rental.listing.name}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(rental.status)}`}>
                            {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <p><strong>Duration:</strong> {formatDate(rental.startDate)} - {formatDate(rental.endDate)}</p>
                            <p><strong>Days:</strong> {rental.rentalDays}</p>
                            <p><strong>Size:</strong> {rental.selectedSize}</p>
                          </div>
                          <div>
                            <p><strong>Occasion:</strong> {rental.occasion}</p>
                            <p><strong>Total Earning:</strong> ₹{rental.totalPrice.toLocaleString('en-US')}</p>
                            <p><strong>Renter:</strong> {rental.renter.username}</p>
                          </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="mt-3 text-sm text-gray-600">
                          <p><strong>Delivery Address:</strong></p>
                          <p>{rental.deliveryAddress.street}, {rental.deliveryAddress.city}</p>
                          <p>{rental.deliveryAddress.state} {rental.deliveryAddress.zipCode}</p>
                          <p><strong>Phone:</strong> {rental.deliveryAddress.phone}</p>
                        </div>
                        
                        {rental.specialRequests && (
                          <div className="mt-3">
                            <p className="text-sm"><strong>Special Requests:</strong> {rental.specialRequests}</p>
                          </div>
                        )}

                        {/* Action Buttons for Owner */}
                        <div className="mt-4 flex gap-2">
                          {rental.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateRentalStatus(rental._id, 'approved')}
                                className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition duration-200"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => updateRentalStatus(rental._id, 'rejected')}
                                className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition duration-200"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          
                          {rental.status === 'approved' && (
                            <button
                              onClick={() => updateRentalStatus(rental._id, 'active')}
                              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition duration-200"
                            >
                              Mark as Active
                            </button>
                          )}
                          
                          {rental.status === 'active' && (
                            <button
                              onClick={() => updateRentalStatus(rental._id, 'completed')}
                              className="px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition duration-200"
                            >
                              Mark as Completed
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
