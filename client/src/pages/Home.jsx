import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import { motion } from 'framer-motion';
import 'swiper/css/bundle';

function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [formalListings, setFormalListings] = useState([]);
  const [casualListings, setCasualListings] = useState([]);
  const [ethnicListings, setEthnicListings] = useState([]);

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
    };

    const fetchFormalListings = async () => {
      try {
        const res = await fetch('/server/listing/get?category=formal&limit=4');
        const data = await res.json();
        setFormalListings(data.listings);
        fetchCasualListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchCasualListings = async () => {
      try {
        const res = await fetch('/server/listing/get?category=casual&limit=4');
        const data = await res.json();
        setCasualListings(data.listings);
        fetchEthnicListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchEthnicListings = async () => {
      try {
        const res = await fetch('/server/listing/get?category=ethnic&limit=4');
        const data = await res.json();
        setEthnicListings(data.listings);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  const SectionTitle = ({ children }) => (
    <motion.h1
      className="text-slate-700 font-bold text-3xl lg:text-4xl"
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {children}
    </motion.h1>
  );

  return (
    <div>
      <div>
        {/* top intro */}
        <div className="flex flex-col gap-6 pt-16 pb-12 px-3 max-w-6xl mx-auto">
          <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
            Rent your <span className="text-slate-500">style</span>
            <br />
            without breaking the bank
          </h1>
          <div className="text-gray-400 text-xs sm:text-sm">
            Discover premium fashion on a budget.
            <br />
            From casual to couture, rent outfits for any occasion – delivered to your door.
            <Link
              to={'/search'}
              className="text-xs sm:text-sm text-blue-800 font-bold hover:underline block mt-2"
            >
              Browse collections now →
            </Link>
          </div>
        </div>

        {/* fancy swiper */}
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={30}
          slidesPerView={1}
          className="w-full flex justify-center items-center"
        >
          {offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div className="relative w-full max-w-[600px] h-[500px] mx-auto flex items-center justify-center bg-neutral-900 rounded-xl overflow-hidden shadow-2xl group animate-fade-in">
                {/* background blur */}
                <div
                  className="absolute inset-0 bg-center bg-cover blur-md scale-110 opacity-50"
                  style={{
                    backgroundImage: `url(${listing.images[0] || '/image.png'})`,
                  }}
                />
                {/* portrait image */}
                <img
                  src={listing.images[0] || '/image.png'}
                  alt={listing.name}
                  className="relative z-10 h-[420px] w-auto object-contain rounded-xl drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                />
                {/* frosted panel */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-lg px-6 py-4 rounded-2xl z-20 border border-white/30 shadow-xl transition-all duration-500 group-hover:backdrop-blur-xl">
                  <p className="text-white text-xl font-bold text-center tracking-wide drop-shadow-sm">
                    {listing.name}
                  </p>
                  <p className="text-white text-sm text-center mt-1">
                    ₹
                    {listing.offer
                      ? listing.discountPrice.toLocaleString('en-US')
                      : listing.regularPrice.toLocaleString('en-US')}
                    <span className="text-xs text-gray-100"> /day</span>
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* reusable section grid */}
        {[
          { title: 'Offers', listings: offerListings, link: '/search' },
          { title: 'Formal Wear', listings: formalListings, link: '/search?category=formal' },
          { title: 'Casual Wear', listings: casualListings, link: '/search?category=casual' },
          { title: 'Ethnic Wear', listings: ethnicListings, link: '/search?category=ethnic' },
        ].map((section) => (
          <div className="flex flex-col gap-2 pt-12 pb-8 px-3 max-w-6xl mx-auto" key={section.title}>
            <SectionTitle>{section.title}:</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {section.listings.map((listing) => (
                <Link to={`/listings/${listing._id}`} key={listing._id}>
                  <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full">
                    <div className="h-[280px] w-full overflow-hidden rounded-t-lg bg-gray-100">
                      <img
                        src={listing.images[0] || '/image.png'}
                        alt={listing.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-lg font-semibold text-slate-700 truncate">{listing.name}</p>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-2">{listing.description}</p>
                      <div className="flex justify-between items-center mt-4">
                        <p className="text-slate-700 font-semibold text-base">
                          ₹
                          {listing.offer
                            ? listing.discountPrice.toLocaleString('en-US')
                            : listing.regularPrice.toLocaleString('en-US')}
                          {listing.availability === true && (
                            <span className="text-xs text-gray-500"> /day</span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500 px-2 py-1 bg-gray-100 rounded">
                          {listing.category}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <Link
              to={section.link}
              className="text-xs sm:text-sm text-blue-800 font-bold hover:underline mt-1"
            >
              Browse all {section.title.toLowerCase()} →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
