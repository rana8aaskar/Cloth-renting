import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Listingitem({ listing }) {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const createdDate = new Date(listing.createdAt);
  const now = new Date();
  const isNew = (now - createdDate) / (1000 * 60 * 60 * 24) <= 7; // within 7 days

  const imageUrl = listing.images?.[0] || '/image.png';
  const isFallback = !listing.images?.[0];

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    // TODO: Add to favorites in localStorage or backend
  };

  return (
    <div className='relative bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
      <Link to={`/listing/${listing.id}`}>
        {/* Force fixed height container */}
        <div className="h-[220px] w-full overflow-hidden rounded-t-lg relative bg-gray-100">
          <img
            src={imageUrl}
            alt={listing.title}
            className={`absolute top-0 left-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300 ${isFallback ? 'opacity-60' : ''}`}
          />
        </div>

        {/* New Arrival Badge */}
        {isNew && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded shadow">
            ✨ New
          </span>
        )}

        {/* Availability Badge */}
        <span className={`absolute top-2 right-10 text-xs font-semibold px-2 py-1 rounded shadow ${
          listing.availability 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {listing.availability ? '✅ Available' : '❌ Rented'}
        </span>

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all duration-200 group"
        >
          <svg 
            className={`w-5 h-5 transition-colors ${
              isFavorite 
                ? 'text-red-500 fill-current' 
                : 'text-gray-400 group-hover:text-red-400'
            }`} 
            fill={isFavorite ? 'currentColor' : 'none'} 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        <div className='p-3'>
          <p className='text-lg font-semibold text-slate-700 truncate'>
            {listing.name}
          </p>

          <p className='text-sm text-gray-600 line-clamp-2 mt-2'>
            {listing.description}
          </p>

          <div className='flex justify-between items-center mt-4'>
            <div>
              <p className='text-slate-700 font-semibold text-lg'>
                ₹{listing.offer
                  ? listing.discountPrice.toLocaleString('en-US')
                  : listing.regularPrice.toLocaleString('en-US')}
                <span className='text-xs text-gray-500 ml-1'>/day</span>
              </p>
              {listing.offer && (
                <p className='text-sm text-gray-400 line-through'>
                  ₹{listing.regularPrice.toLocaleString('en-US')}
                </p>
              )}
            </div>

            <div className='text-right'>
              <p className='text-sm text-gray-500 px-2 py-1 bg-gray-100 rounded capitalize'>
                {listing.category}
              </p>
              <p className='text-xs text-gray-400 mt-1'>
                Size: {listing.size?.join(', ') || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default Listingitem;
