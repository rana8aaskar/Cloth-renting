import React from 'react';
import { Link } from 'react-router-dom';

function Listingitem({ listing }) {
  const createdDate = new Date(listing.createdAt);
  const now = new Date();
  const isNew = (now - createdDate) / (1000 * 60 * 60 * 24) <= 7; // within 7 days

  const imageUrl = listing.images?.[0] || '/image.png';
  const isFallback = !listing.images?.[0];

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
            New Arrival
          </span>
        )}

        <div className='p-3'>
          <p className='text-lg font-semibold text-slate-700 truncate'>
            {listing.name}
          </p>

          <p className='text-sm text-gray-600 line-clamp-2 mt-2'>
            {listing.description}
          </p>

          <div className='flex justify-between items-center mt-4'>
            <p className='text-slate-700 font-semibold text-base'>
              ₹{listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.availability === true && (
                <span className='text-xs text-gray-500'> /day</span>
              )}
            </p>

            <p className='text-sm text-gray-500 px-2 py-1 bg-gray-100 rounded'>
              {listing.category}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default Listingitem;
