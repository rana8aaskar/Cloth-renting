import { useSelector } from 'react-redux';
import React, { useState, useRef } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import { updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess
 } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { API_BASE_URL } from '../config.js';


export default function Profile() {
  const { currentUser,error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);  
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(currentUser.avatar);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch(); 
  const [showListingError, setShowListingError] = useState(false); 
  const [userListings, setUserListings] = useState([]);
  

  // Handle the file input change (when the user selects a file)
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    uploadFile(selectedFile); // Upload the selected file
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value }); // Update form data state with the new value
  }
  const handleSubmit = async (e) => {
     e.preventDefault();
     try {
      dispatch(updateUserStart());
      const res = await fetch(`${API_BASE_URL}/user/update/${currentUser._id}`, {
        method:'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)

      })
      const data = await res.json(); 
      if(data.success==false){
       dispatch(updateUserFailure(data.message)); 
       return;
      }
      
      dispatch(updateUserSuccess(data.user)); 
      setUpdateSuccess(true); 
      
     } catch (error) {
      dispatch(updateUserFailure(error.message)); 
     }
    
  }
  const handleDeleteUser = async () => {
      try {
        dispatch(deleteUserStart());
        const res = await fetch(`${API_BASE_URL}/user/delete/${currentUser._id}`, {
          method:'DELETE',
          credentials: 'include',
        });
        const data = await res.json();
        if(data.success==false){
          dispatch(deleteUserFailure(data.message)); 
          return;
        }
        dispatch(deleteUserSuccess(data)); // Dispatch success action

        
        
      } catch (error) {
        dispatch(deleteUserFailure(error.message));
        
      }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart()); 
      const res = await fetch(`${API_BASE_URL}/auth/signout`, {
        credentials: 'include',
      });
      const data = await res.json(); 
      if(data.success==false){
        dispatch(signOutUserFailure(data.message)); 
        return;
      }
      dispatch(signOutUserSuccess(data)); 
    } catch (error) {
      dispatch(signOutUserFailure(error.message)); 
      
    }
  }

  // Handle the file upload to the backend
  const uploadFile = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);  // Append file to form data

    try {
      const response = await axios.post(`${API_BASE_URL}/upload/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      setImageUrl(response.data.imageUrl); // Update imageUrl state with the uploaded image URL
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleShowListing = async () => {
    try {
      setShowListingError(false);
      const res= await fetch(`${API_BASE_URL}/user/listings/${currentUser._id}`, {
        credentials: 'include',
      });
      const data = await res.json();
      if(data.success==false){
        setShowListingError(true); 
        return;
      }
      setUserListings(data.listings); // Set user listings state with the fetched listings

    } catch (error) {
      setShowListingError(true); 
    }
  };

  const handleListingDelete = async (listingId) => {
   try {
    const res = await fetch(`${API_BASE_URL}/listing/delete/${listingId}`, {
      method:'DELETE',
      credentials: 'include',
    });
    const data = await res.json();
    if(data.success==false){
      console.log(data.message);
      
      return;
    }
    setUserListings((prevListings) => prevListings.filter((listing) => listing._id !== listingId)); // Remove deleted listing from state
   } catch (error) {
      console.log(error.message);
      
   }
    
  }

  return (
    <>
      
      <div className="p-3 max-w-lg mx-auto ">
        <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Hidden input for file selection */}
          <input
            onChange={handleFileChange}
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
          />
          {/* Profile image display */}
          <img
            onClick={() => fileRef.current.click()} // Trigger file input click when the image is clicked
            src={imageUrl} // Display current or updated image
            alt="profile"
            className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          />
          {/* User details form */}
          <input
            type="text"
            placeholder="username"
            defaultValue={currentUser.username}
            id="username"
            className="border p-3 rounded-lg"
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="email"
            defaultValue={currentUser.email}
            id="email"
            className="border p-3 rounded-lg"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="password"
            id="password"
            className="border p-3 rounded-lg"
            onChange={handleChange}
          />
          {/* Update button */}
          <button
            className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
            disabled={loading} // Disable button during upload
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
          <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95 '  to={"/create-listing"}>
          Create Listing</Link>
          <Link className='bg-blue-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95 '  to={"/rentals"}>
          Manage Rentals</Link>
        </form>
        <div className="flex justify-between mt-5">
          <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete account</span>
          <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign out</span>
        </div>
        <p className='text-red-700 mt-5'>{error ? error: ''}</p>
        <p className='text-green-700 mt-5'>{updateSuccess?"Successfully updated": ""}</p>
        <button onClick={handleShowListing} className='text-green-700 w-full'> Show Listings</button>
        <p className='text-red-500 mt-5'> {showListingError?"Error showing listings":""}</p>
        {/* /* Display user listings here */ }
        {userListings&& userListings.length > 0 && 
        <div className=" flex flex-col space-y-4"> 
          <h1 className='uppercase text-center my-7 text-2xl  font-semibold'> your listings </h1>

        {userListings.map((listing) =>
          <div key={listing._id} className='shadow-md rounded-lg p-4 flex gap-4 justify-between items-center bg-white'>

          <Link to={`/listing/${listing._id}`} >
            <img src={listing.images[0]} alt="listing" className='h-16 w-16 object-contain ' />
          </Link>
          <Link className='flex-1 text-slate-700 font-semibold  hover:underline truncate' to={`/listing/${listing._id}`} >
           <p >{listing.name}</p>
          </Link>
          <div className='flex flex-col gap-2'>
            <button onClick={() => handleListingDelete(listing._id)} className='text-red-700 uppercase'>Delete</button>
            <Link to={`/update-listing/${listing._id }`}>
            <button className='text-green-700 uppercase'>edit</button>
            </Link>
          </div>
        </div>
        ) }
        </div>}

      </div>
    </>
  );
}
