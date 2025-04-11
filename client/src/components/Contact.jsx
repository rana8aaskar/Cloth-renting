

import React, { use, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';



export default function Contact({listing}) {
    const [landlord,setLandlord] = useState(null);
    const [message,setMessage] = useState('');
    const handleChange = (e) => {
        setMessage(e.target.value); 
    }
    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                const res = await fetch(`/server/user/${listing.owner}`);
                const data = await res.json();
                setLandlord(data.user);
            } catch (error) {
                console.log(error);
                
            }
        }
        fetchLandlord();
    },[listing.owner])
  return (
    <>
    {landlord && (
      <div className="bg-white shadow-md rounded-lg p-5 text-lg mt-6">
        <p className="mb-3">
          Contact <span className="font-semibold">{landlord.username}</span> for{' '}
          <span className="font-semibold">{listing.name.toLowerCase()}</span>
        </p>
        <textarea
          name="message"
          id="message"
          rows="3"
          value={message}
          onChange={handleChange}
          placeholder="Enter your message here..."
          className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
        ></textarea>
        <Link
        to = {`mailto:${landlord.email}?subject=${listing.name}&body=${message}`}
        className = 'bg-slate-700 text-white  text-center p-3 uppercase rounded-lg hover-opacity-90 transition duration-200 mt-4 block'
        >
        Send Message
        </Link>
      </div>
    )}
  </>
  
  )
}

