import { useSelector } from 'react-redux';
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { set } from 'mongoose';
import { updateUserFailure,updateUserStart,updateUserSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

export default function Profile() {
  const { currentUser,error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);  
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(currentUser.avatar);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch(); 
  
  

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
      const res = await fetch(`/server/user/update/${currentUser._id}`, {
        method:'POST',
        headers:{
          'Content-Type': 'application/json',
        },
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

  // Handle the file upload to the backend
  const uploadFile = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);  // Append file to form data

    try {
      const response = await axios.post('/server/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setImageUrl(response.data.imageUrl); // Update imageUrl state with the uploaded image URL
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <>
      <div>Profile</div>
      <div className="p-3 max-w-lg mx-auto">
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
        </form>
        <div className="flex justify-between mt-5">
          <span className="text-red-700 cursor-pointer">Delete account</span>
          <span className="text-red-700 cursor-pointer">Sign out</span>
        </div>
        <p className='text-red-700 mt-5'>{error ? error: ''}</p>
        <p className='text-green-700' mt-5>{updateSuccess?"Successfully updated": ""}</p>
      </div>
    </>
  );
}
