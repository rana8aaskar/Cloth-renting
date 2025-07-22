import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import { useSelector } from 'react-redux';
import 'swiper/css/bundle';
import Contact from '../components/Contact';

SwiperCore.use([Navigation]);

export default function Listing() {
  const params = useParams();
  const {currentUser} = useSelector((state) => state.user);

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/listing/get/${params.listingId}`);
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
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && <p className="text-center my-7 text-2xl">Something went wrong</p>}
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
            <p className="text-gray-700 mb-4 text-lg">{listing.description}</p>

            <div className="mb-4 text-xl text-gray-500 font-semibold">
              Category: <span className="capitalize text-black ">{listing.category}</span>
            </div>
            <div className="mb-4 text-xl text-gray-500 font-semibold">
              Gender: <span className="uppercase text-black">{listing.gender}</span>
            </div>
            <div className="mb-4 text-xl text-gray-500 font-semibold">
              Size: <span className="text-black font-medium">{listing.size.join(', ')}</span>
            </div>
            <div className="mb-6 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="text-xl font-medium text-gray-500 line-through">₹{listing.regularPrice.toLocaleString('en-US')}</span>
              <span className="text-2xl font-bold text-red-600">Save {getDiscountPercent(listing.regularPrice, listing.discountPrice)}%</span>
            </div>
            <div className="text-3xl font-bold text-green-700">
              Final Price: ₹{listing.discountPrice.toLocaleString('en-US')}
            </div>
          </div>


            <div className="mb-6">
              <span className={`text-sm px-3 py-1 rounded-full ${listing.availability ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {listing.availability ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <div className="flex flex-col gap-4 mt-6 w-full">
                  <div>
                    <button
                      disabled={!listing.availability}
                      className={`w-full px-8 py-3 text-white text-lg rounded-lg shadow transition duration-200 ${
                        listing.availability ? 'bg-black hover:bg-gray-800' : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Rent Now
                    </button>
                  </div>

                  {currentUser && listing.owner !== currentUser._id && !contact && (
                    <div>
                      <button
                        onClick={() => setContact(true)}
                        className="w-full px-8 py-3 bg-slate-700 text-white border border-black text-lg rounded-lg shadow hover:opacity-95 transition duration-200"
                      >
                        Contact Landlord
                      </button>
                    </div>
                  )}

                  {contact && <Contact  listing = {listing} />}
                </div>


          </div>
        </div>
      )}
    </main>
  );
}
