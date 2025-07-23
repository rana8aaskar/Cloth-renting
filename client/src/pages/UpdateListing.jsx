import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate, useParams} from 'react-router-dom';
import { API_BASE_URL } from '../config.js';

export default function UpdateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    regularPrice: '',
    discountPrice: '',
    gender: '',
    size: [],
    category: '',
    availableForRent: false,
    images: [],
  });
  const currentUser = useSelector((state) => state.user.currentUser);

  const [imageUrls, setImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const params = useParams();
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/listing/get/${params.listingId}`, {
          credentials: 'include',
        });
        const data = await res.json();
  
        // console.log("Fetched listing data:", data);
  
        if (data.success === false) {
          console.error("Fetch error:", data.message);
          return;
        }
  
        setFormData({
          name: data.name || '',
          description: data.description || '',
          regularPrice: data.regularPrice || '',
          discountPrice: data.discountPrice || '',
          gender: data.gender || '',
          size: data.size || [],
          category: data.category || '',
          availableForRent: data.availableForRent || false,
          images: data.images || [],
        });
  
        setImageUrls(data.images || []);
      } catch (error) {
        console.error("Error fetching listing:", error.message);
      }
    };
  
    fetchListing();
  }, [params.listingId]);
  

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (files.length > 0 && files.length <= 5) {
      setUploading(true);
      const uploadedUrls = [];

      for (let i = 0; i < files.length; i++) {
        try {
          const formData = new FormData();
          formData.append('file', files[i]);

          const response = await axios.post(`${API_BASE_URL}/upload/image`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
          });

          uploadedUrls.push(response.data.imageUrl);
        } catch (error) {
          console.error(`Error uploading image ${i + 1}:`, error);
        }
      }

      setFormData((prevData) => ({
        ...prevData,
        images: uploadedUrls,
      }));
      setImageUrls(uploadedUrls);
      setUploading(false);
    } else {
      alert('You can only upload between 1 and 5 images.');
    }
  };

  const handleImageDelete = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, i) => i !== index),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox' && name === 'availableForRent') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSizeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        size: [...prev.size, value],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        size: prev.size.filter((s) => s !== value),
      }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
  
    try {
      setLoading(true);
      setError(null);
  
      if (!currentUser || !currentUser._id) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }
  
      const payload = {
        ...formData,
        images: formData.images,
        owner: currentUser?._id,
      };
  
      const res = await axios.post(`${API_BASE_URL}/listing/update/${params.listingId}`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
  
      const data = await res.data;
  
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        return;
      }
  
      navigate(`/listing/${data._id}`);
      
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center mb-8">Update a Listing</h1>

      <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-8">
        <div className="flex flex-col space-y-6 flex-1">
          <div>
            <input
              name="name"
              type="text"
              placeholder="Name"
              className="border p-3 rounded-lg w-full"
              maxLength="62"
              minLength="10"
              required
              onChange={handleInputChange}
              value={formData.name}
            />
          </div>

          <div>
            <textarea
              name="description"
              placeholder="Description"
              className="border p-3 rounded-lg w-full"
              required
              onChange={handleInputChange}
              value={formData.description}
            />
          </div>

          <div className="flex flex-col space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="regularPrice" className="block text-lg font-medium">
                  Regular Price
                </label>
                <input
                  type="number"
                  name="regularPrice"
                  placeholder="$0"
                  className="border p-4 rounded-lg w-full"
                  required
                  value={formData.regularPrice}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex-1">
                <label htmlFor="discountPrice" className="block text-lg font-medium">
                  Discount Price
                </label>
                <input
                  type="number"
                  name="discountPrice"
                  placeholder="$0"
                  className="border p-4 rounded-lg w-full"
                  required
                  value={formData.discountPrice}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="gender" className="block text-lg font-medium">
              Gender
            </label>
            <select
              name="gender"
              className="border p-4 rounded-lg w-full"
              required
              value={formData.gender}
              onChange={handleInputChange}
            >
              <option value="">Select Gender</option>
              <option value="m">Male</option>
              <option value="f">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-lg font-medium">Size</label>
            <div className="flex gap-4">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                <div key={size} className="flex items-center">
                  <input
                    type="checkbox"
                    value={size}
                    checked={formData.size.includes(size)}
                    onChange={handleSizeChange}
                    className="w-5 h-5"
                  />
                  <label htmlFor={`size-${size}`} className="ml-2">{size}</label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-lg font-medium">
              Category
            </label>
            <select
              name="category"
              className="border p-4 rounded-lg w-full"
              required
              value={formData.category}
              onChange={handleInputChange}
            >
              <option value="">Select Category</option>
              <option value="ethnic">Ethnic</option>
              <option value="formal">Formal</option>
              <option value="casual">Casual</option>
              <option value="party">Party</option>
              <option value="wedding">Wedding</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              name="availableForRent"
              checked={formData.availableForRent}
              onChange={handleInputChange}
            />
            <label htmlFor="availability" className="text-lg font-medium">
              Available for Rent
            </label>
          </div>
        </div>

        <div className="flex flex-col space-y-6 flex-1">
          <div>
            <label htmlFor="images" className="block text-lg font-medium">
              Upload Images (Max 5)
            </label>
            <div className="relative">
              <input
                onChange={(e) => setFiles(e.target.files)}
                type="file"
                accept="image/*"
                multiple
                className="p-3 border border-gray-300 rounded w-full shadow-md hover:border-gray-500 transition duration-200"
              />
              <button
                onClick={handleImageSubmit}
                type="button"
                className="p-3 bg-green-700 border text-white border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80 mt-2 w-full"
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>

          <div className="mt-6">
            {imageUrls.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {imageUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative bg-white rounded-2xl shadow-md overflow-hidden group transition-transform hover:scale-105"
                  >
                    <img
                      src={url}
                      alt={`Uploaded ${index}`}
                      className="w-full h-40 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageDelete(index)}
                      className="absolute top-2 right-2 bg-black text-white p-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-slate-700 text-white py-3 px-8 rounded-lg w-full hover:opacity-90"
            >
              {loading ? "Updating..." : "Update Listing"}
            </button>
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </form>
    </main>
  );
}
