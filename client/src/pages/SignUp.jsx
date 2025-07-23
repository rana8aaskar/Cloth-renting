

import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  
    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      })
    }

    const handleSubmit = async (e) => {
      e.preventDefault()
      try {
        setLoading(true)
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/signup`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          }
        ) 
        const data = await res.json()
        if(data.success === false) {
          setError(data.message)
          setLoading(false)
          return
        }
        setLoading(false)
        setError(null)
        navigate("/sign-in")
      } catch (error) {
        setLoading(false)
        setError("Something went wrong")
      }

      
      
    }
    
    
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          className="bg-white border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          className="bg-white border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="bg-white border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="password"
          onChange={handleChange}
        />
        <button disabled={loading} className='bg-slate-700 text-white  p-3  rounded-lg  uppercase  hover:opacity-95 disabled:opacity-80'>
          {loading? 'loadiing...':'Sign Up' }</button>
          <OAuth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link  to ={"/sign-in"}>
        <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
      {error && <p className='text-red-500 text-center mt-4'>{error}</p>}
    </div>
  );
}


