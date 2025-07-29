import React, { useState, useEffect } from 'react'
import { API_BASE_URL } from '../config'

export default function Listings() {
  const [listings, setListings] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchListings(1, true) // Reset on initial load
  }, [])

  const fetchListings = async (page = 1, reset = false) => {
    try {
      if (page === 1 && reset) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      const res = await fetch(`${API_BASE_URL}/admin/listings?page=${page}&limit=10`, {
        credentials: 'include',
      })
      const data = await res.json()
      
      if (data.success) {
        if (reset) {
          setListings(data.listings)
        } else {
          setListings(prev => [...prev, ...data.listings])
        }
        setPagination(data.pagination)
        setCurrentPage(page)
        setHasMore(data.pagination.hasNextPage)
      } else {
        console.error('Failed to fetch listings:', data.message)
      }
    } catch (error) {
      console.error('Error fetching listings:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleShowMore = () => {
    fetchListings(currentPage + 1, false)
  }

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return
    
    setDeleting(listingId)
    try {
      const res = await fetch(`${API_BASE_URL}/admin/listings/${listingId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await res.json()
      
      if (data.success) {
        setListings(listings.filter(listing => listing._id !== listingId))
        alert('Listing deleted successfully')
      } else {
        alert('Failed to delete listing: ' + data.message)
      }
    } catch (error) {
      console.error('Error deleting listing:', error)
      alert('Error deleting listing')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Listings Management</h1>
      
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              All Listings 
              {pagination && (
                <span className="text-sm text-gray-500 ml-2">
                  (Showing {listings.length} of {pagination.totalListings} total)
                </span>
              )}
            </h3>
          </div>
        </div>
        
        {listings.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No listings found
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {listings.map((listing) => (
                <div key={listing._id} className="border rounded-lg overflow-hidden">
                  <img 
                    src={listing.imageUrls?.[0] || listing.images?.[0] || '/placeholder.jpg'} 
                    alt={listing.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{listing.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{listing.description}</p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-green-600 font-bold">₹{listing.regularPrice}/day</span>
                      <span className="text-sm text-gray-500">{listing.size?.join(', ')}</span>
                    </div>
                    <div className="text-sm text-gray-500 mb-3">
                      Owner: {listing.owner?.username || 'Unknown'}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">
                        {new Date(listing.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => handleDeleteListing(listing._id)}
                        disabled={deleting === listing._id}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                      >
                        {deleting === listing._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Show More Button */}
            {hasMore && (
              <div className="p-6 border-t border-gray-200 text-center">
                <button
                  onClick={handleShowMore}
                  disabled={loadingMore}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Loading more...
                    </span>
                  ) : (
                    `Show More (${pagination?.totalListings - listings.length} remaining)`
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
