import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../config.js';


function OAuth() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

const handleGoogleClick = async() => {
  try {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({
      prompt: 'select_account'  // This forces Google to show account selection
    })
    const auth = getAuth(app)

    const  result = await signInWithPopup(auth, provider)

    const res = await fetch(`${API_BASE_URL}/auth/google`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      })
    })
    const data = await res.json()
    dispatch(signInSuccess(data.loggedInUser))
    navigate('/')
  } catch (error) {
    console.log("could not sign in with Google", error);
    
  }
} 


  return (
    <button 
    onClick={handleGoogleClick}
    type='button' 
    className='bg-red-600 text-white p-3 rounded-lg uppercase hover:opacity-95'>
      Continue with Google</button>
  )
}

export default OAuth