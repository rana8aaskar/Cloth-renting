import { set } from 'mongoose'
import React, { use, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {Swiper, SwiperSlide} from 'swiper/react'
import SwiperCore from 'swiper'
import {Navigation } from 'swiper/modules'
import 'swiper/css/bundle';



export default function Listing() {
  SwiperCore.use([Navigation])
  const params = useParams()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)  

  useEffect(() => {
    const fetchListing = async() =>{
       try {
        setLoading(true)
        const res = await fetch(`/server/listing/get/${params.listingId}`);
        const data = await res.json();
        if(data.success===false){
          setError(true)
          setLoading(false)
         return;
        }
        setListing(data)
        setLoading(false)
       } catch (error) {
        setError(true)
        setLoading(false)
       }
    }
    fetchListing()
  }, [])



  return (
    <main className="p-4">
  {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
  {error && <p className='text-center my-7 text-2xl'>Something went wrong</p>}
  {listing && !loading && !error && (
    <div className="flex justify-start mt-20 ml-40"> {/* 👈 adds top + left spacing */}
      <div className="w-full md:w-[500px]">
        <Swiper navigation>
          {listing.images.map((url) => (
            <SwiperSlide key={url}>
              <div
                className='h-[500px] w-full bg-center bg-cover rounded-md shadow-lg'
                style={{ backgroundImage: `url(${url})` }}
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )}
</main>


  )
}
