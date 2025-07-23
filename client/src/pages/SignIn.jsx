

import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart,signInSuccess,signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';
import { API_BASE_URL } from '../config.js';

export default function SignIn() {
  const [formData, setFormData] = useState({})
  const {loading,error} = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      })
    }

    const handleSubmit = async (e) => {
      e.preventDefault()
      try {
        dispatch(signInStart())
        const res = await fetch(`${API_BASE_URL}/auth/signin`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(formData),
          }
        ) 
        const data = await res.json()
        if(data.success === false) {
          dispatch(signInFailure(data.message))
          return
        }
        dispatch(signInSuccess(data.loggedInUser))
        navigate("/")
      } catch (error) {
        dispatch(signInFailure(error.message))
      }
      
    }
    
    
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
       
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
        <p>Dont have an account?</p>
        <Link  to ={"/sign-up"}>
        <span className='text-blue-700'>Sign Up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 text-center mt-4'>{error}</p>}
    </div>
  );
}


