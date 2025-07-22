import React from 'react'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';


function Home() {
const [offerListings, setOfferListings] = useState([]);
const [formalListings, setFormalListings] = useState([]);
const [casualListings, setCasualListings] = useState([]);
const [ethnicListings, setEthnicListings] = useState([]);
console.log('fetching ethnic listings:', ethnicListings);
console.log('Offer Listings:', offerListings);

SwiperCore.use([Navigation]);


useEffect(() => {
  const fetchOfferListings = async () => {
    try {
      const res = await fetch('/server/listing/get?offer=true&limit=4');
      const data = await res.json();
      setOfferListings(data.listings);
      fetchFormalListings();
      
    } catch (error) {
      console.log(error);
      
    }
  }
  const fetchFormalListings = async () => {
    try {
      const res = await fetch('/server/listing/get?category=formal&limit=4');
      const data = await res.json();
      setFormalListings(data.listings);
      fetchCasualListings();
    } catch (error) {
      console.log(error);
    }
  }
  const fetchCasualListings = async () => {
    try {
      const res = await fetch('/server/listing/get?category=casual&limit=4');
      const data = await res.json();
      setCasualListings(data.listings);
      fetchEtnicListings();
    } catch (error) {
      console.log(error);
    }
  }

   const fetchEtnicListings = async () => {
    try {
      const res = await fetch('/server/listing/get?category=ethnic&limit=4');
      const data = await res.json();
      setEthnicListings(data.listings);
    } catch (error) {
      console.log(error);
    }
  }
  fetchOfferListings();

},[])

 

  return (
    <div>
      
        <div>
          {/* top */}
          <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Rent your <span className='text-slate-500'>style</span>
          <br />
          without breaking the bank
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          Discover premium fashion on a budget. 
          <br />
          From casual to couture, rent outfits for any occasion – delivered to your door.
        <Link
          to={'/search'}
          className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
        >
          Browse collections now →
        </Link>
      </div>


    {/*swiper*/}

          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={50}
            slidesPerView={1}
            className="w-full h-[500px]"
          >
          
            {offerListings && offerListings.length > 0 &&
              offerListings.map((listing) => (
                <SwiperSlide key={listing._id}>
                  {listing.images && listing.images.length > 0 && (
                    <div
                      className="h-[500px] bg-center bg-no-repeat bg-cover"
                      style={{ backgroundImage: `url(${listing.images[0]})` }}
                    ></div>
                  )}
                </SwiperSlide>
              ))}
          </Swiper>



    {/* listings */}
          <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
            <h1 className='text-slate-700 font-bold text-3xl lg:text-4xl'>
              Offers:
            </h1>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {offerListings.map((listing) => (
                <Link to={`/listings/${listing._id}`} key={listing._id}>
                  <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full'>
                    <img
                      src={listing.images[0] || '/image.png'}
                      alt={listing.title}
                      className='h-[320px] w-full object-cover hover:scale-105 transition-scale duration-300'
                    />
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
                  </div>
                </Link>
              ))}
            </div>
            <Link
              to={'/search'}
              className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
            >
              Browse all offers →
            </Link>
          </div>
          <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
            <h1 className='text-slate-700 font-bold text-3xl lg:text-4xl'>
              Formal Wear:
            </h1>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {formalListings.map((listing) => (
                <Link to={`/listings/${listing._id}`} key={listing._id}>
                  <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full'>
                    <img
                      src={listing.images[0] || '/image.png'}
                      alt={listing.title}
                      className='h-[320px] w-full object-cover hover:scale-105 transition-scale duration-300'
                    />
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
                  </div>
                </Link>
              ))}
            </div>
            <Link
              to={'/search?category=formal'}
              className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
            >
              Browse all formal wear →
            </Link>

          </div>
          <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
            <h1 className='text-slate-700 font-bold text-3xl lg:text-4xl'>
              Casual Wear:
            </h1>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {casualListings.map((listing) => (
                <Link to={`/listings/${listing._id}`} key={listing._id}>
                  <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full'>
                    <img
                      src={listing.images[0] || '/image.png'}
                      alt={listing.title}
                      className='h-[320px] w-full object-cover hover:scale-105 transition-scale duration-300'
                    />
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
                  </div>
                </Link>
              ))}
            </div>
            <Link
              to={'/search?category=casual'}
              className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
            >
              Browse all casual wear →
            </Link>
          </div>
          </div>
          <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
            <h1 className='text-slate-700 font-bold text-3xl lg:text-4xl'>
              Ethnic Wear:
            </h1>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {ethnicListings.map((listing) => (
                <Link to={`/listings/${listing._id}`} key={listing._id}>
                  <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full'>
                    <img
                      src={listing.images[0] || '/image.png'}
                      alt={listing.title}
                      className='h-[320px] w-full object-cover hover:scale-105 transition-scale duration-300'
                    />
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
                  </div>
                </Link>
              ))}
            </div>
            <Link
              to={'/search?category=casual'}
              className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
            >
              Browse all ethnic wear →
            </Link>
          </div>
        </div>
      </div>
  )
}

export default Home