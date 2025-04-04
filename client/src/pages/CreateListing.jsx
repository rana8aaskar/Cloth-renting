import React from 'react';

export default function CreateListing() {
  return (
    <main className='p-6 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center mb-8'>Create a Listing</h1>

      <form className='flex flex-col sm:flex-row gap-8'>
        {/* Left side - Form Inputs */}
        <div className='flex flex-col space-y-6 flex-1'>
          {/* Name and Description */}
          <div>
            <input
              type='text'
              placeholder='Name'
              className='border p-3 rounded-lg w-full'
              maxLength='62'
              minLength='10'
              required
            />
          </div>

          <div>
            <textarea
              placeholder='Description'
              className='border p-3 rounded-lg w-full'
              required
            />
          </div>

          {/* Price Information */}
          <div className='flex flex-col space-y-4'>
            <div className='flex space-x-4'>
              <div className='flex-1'>
                <label htmlFor="regularPrice" className='block text-lg font-medium'>Regular Price</label>
                <input
                  type='number'
                  placeholder='$0'
                  className='border p-4 rounded-lg w-full'
                  required
                />
              </div>

              <div className='flex-1'>
                <label htmlFor="discountPrice" className='block text-lg font-medium'>Discount Price</label>
                <input
                  type='number'
                  placeholder='$0'
                  className='border p-4 rounded-lg w-full'
                  required
                />
              </div>
            </div>
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className='block text-lg font-medium'>Gender</label>
            <select
              className='border p-4 rounded-lg w-full'
              required
            >
              <option value=''>Select Gender</option>
              <option value='m'>Male</option>
              <option value='f'>Female</option>
            </select>
          </div>

          {/* Size Options (Checkboxes) */}
          <div>
            <label className='block text-lg font-medium'>Size</label>
            <div className='flex gap-4'>
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                <div key={size} className='flex items-center'>
                  <input
                    type='checkbox'
                    id={`size-${size}`}
                    className='w-5 h-5'
                  />
                  <label htmlFor={`size-${size}`} className='ml-2'>{size}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className='block text-lg font-medium'>Category</label>
            <select
              className='border p-4 rounded-lg w-full'
              required
            >
              <option value=''>Select Category</option>
              <option value='ethnic'>Ethnic</option>
              <option value='formal'>Formal</option>
              <option value='casual'>Casual</option>
              <option value='party'>Party</option>
              <option value='wedding'>Wedding</option>
            </select>
          </div>

          {/* Availability */}
          <div className='flex items-center space-x-4'>
            <input
              type='checkbox'
              id='availability'
            />
            <label htmlFor="availability" className='text-lg font-medium'>Available for Rent</label>
          </div>
        </div>

        {/* Right side - Image Upload and Submit Button */}
        <div className='flex flex-col space-y-6 flex-1'>
          {/* Image Upload */}
          <div>
            <label htmlFor="images" className='block text-lg font-medium'>Upload Images (Max 5)</label>
            <div className='relative'>
              <input
                type='file'
                accept='image/*'
                multiple
                className='p-3 border border-gray-300 rounded w-full shadow-md hover:border-gray-500 transition duration-200'
              />
              <button
                type='button'
                className='p-3 bg-green-700 border text-white border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80 mt-2 w-full'
              >
                Upload
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className='flex justify-end'>
            <button
              type='submit'
              className='bg-slate-700 text-white py-3 px-8 rounded-lg w-full hover:opacity-90'
            >
              Create Listing
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
