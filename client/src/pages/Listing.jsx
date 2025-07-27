import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import { useSelector } from 'react-redux';
import 'swiper/css/bundle';
import Contact from '../components/Contact';
import RentalForm from '../components/RentalForm';
import { useNotification } from '../contexts/NotificationContext';
import { API_BASE_URL } from '../config.js';

SwiperCore.use([Navigation]);

export default function Listing() {
  const params = useParams();
  const navigate = useNavigate();
  const {currentUser} = useSelector((state) => state.user);
  const { showNotification } = useNotification();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);
  const [showRentalForm, setShowRentalForm] = useState(false);
  const [isBookingInProgress, setIsBookingInProgress] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, []);

  const getDiscountPercent = (regular, discount) => {
    const save = regular - discount;
    return Math.round((save / regular) * 100);
  };

  return (
    <main className="p-4 max-w-screen-xl mx-auto">
      {/* Back Navigation */}
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Search
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      )}
      
      {error && (
        <div className="text-center py-20">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 inline-block">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Oops! Something went wrong</h3>
            <p className="text-red-600 mb-4">We couldn't load this listing. Please try again.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      {listing && !loading && !error && (
        <div className="flex flex-col md:flex-row gap-20 mt-16">
          {/* Left: Image Slider */}
          <div className="w-full md:w-[500px] ml-2 md:ml-0">
            <Swiper navigation>
              {listing.images.map((url) => (
                <SwiperSlide key={url}>
                  <div
                    className="h-[500px] w-full bg-center bg-cover rounded-md shadow-md"
                    style={{ backgroundImage: `url(${url})` }}
                  ></div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Right: Product Details */}
          <div className="flex-1 md:ml-24 mt-4 md:mt-10">
            <h1 className="text-4xl font-bold mb-4">{listing.name}</h1>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">{listing.description}</p>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="text-sm font-medium text-blue-800">Category</span>
                </div>
                <p className="text-lg font-semibold text-blue-900 capitalize">{listing.category}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm font-medium text-purple-800">Gender</span>
                </div>
                <p className="text-lg font-semibold text-purple-900 uppercase">{listing.gender}</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  <span className="text-sm font-medium text-green-800">Available Sizes</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {listing.size.map((size, index) => (
                    <span key={index} className="bg-green-200 text-green-800 text-sm px-2 py-1 rounded-md font-medium">
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl font-medium text-gray-500 line-through">₹{listing.regularPrice.toLocaleString('en-US')}</span>
                    <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded-full">
                      Save {getDiscountPercent(listing.regularPrice, listing.discountPrice)}%
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-green-700">
                    ₹{listing.discountPrice.toLocaleString('en-US')} <span className="text-lg text-gray-600">/day</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                    listing.availability 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}>
                    {listing.availability ? (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Available Now
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        Out of Stock
                      </>
                    )}
                  </div>
                  {listing.availability && (
                    <p className="text-sm text-gray-500 mt-1">Ready for immediate booking</p>
                  )}
                </div>
              </div>
            </div>

            {/* Share Button */}
            <div className="mb-6">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  showNotification('Link copied to clipboard! Share this listing with friends.', 'success');
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 px-4 py-2 rounded-lg border border-blue-200 transition-all duration-200 hover:shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span className="font-medium">Share this listing</span>
              </button>
            </div>

            <div className="flex flex-col gap-4 mt-6 w-full">
                  <div>
                    <button
                      onClick={() => {
                        if (!currentUser) {
                          showNotification('Please sign in to rent items', 'error');
                          return;
                        }
                        setIsBookingInProgress(true);
                        setShowRentalForm(true);
                      }}
                      disabled={listing.availability === false || (currentUser && listing.owner === currentUser._id) || isBookingInProgress}
                      className={`w-full px-8 py-3 text-white text-lg rounded-lg shadow transition duration-200 flex items-center justify-center gap-2 ${
                        listing.availability !== false && !(currentUser && listing.owner === currentUser._id) && !isBookingInProgress
                          ? 'bg-black hover:bg-gray-800' 
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isBookingInProgress ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          {!currentUser 
                            ? 'Sign In to Rent'
                            : currentUser && listing.owner === currentUser._id 
                              ? 'Your Own Listing'
                              : listing.availability !== false 
                                ? '🛍️ Rent Now' 
                                : 'Not Available'}
                        </>
                      )}
                    </button>
                  </div>

                      {currentUser && listing.owner !== currentUser._id && !contact && (
                        <div>
                          <button
                            onClick={() => setContact(true)}
                            className="w-full px-8 py-3 bg-slate-700 text-white border border-black text-lg rounded-lg shadow hover:opacity-95 transition duration-200 flex items-center justify-center gap-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Contact Owner
                          </button>
                        </div>
                      )}

                  {contact && <Contact  listing = {listing} />}
                </div>


          </div>
        </div>
      )}
      
      {/* Rental Form Modal */}
      {showRentalForm && listing && (
        <RentalForm 
          listing={listing} 
          onClose={() => {
            setShowRentalForm(false);
            setIsBookingInProgress(false);
          }} 
        />
      )}
    </main>
  );
}
