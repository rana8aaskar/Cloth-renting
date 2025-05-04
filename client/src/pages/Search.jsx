import React from 'react';

function Search() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Search Panel */}
      <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r p-6 bg-gray-50">
        <form className="flex flex-col gap-8">
          {/* Search Term */}
          <div className='flex items-center gap-2'>
            <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Type Filter */}
          <div className='flex gap-2 flex-wrap items-center'>
            <label>Type:</label>
            <div className="flex items-center gap-1">
              <input type="checkbox" id='all' className='w-5' />
              <span>Rent & Sale</span>
            </div>
          </div>

          {/* Gender Filter */}
          <div className='flex gap-2 flex-wrap items-center'>
            <label>Gender:</label>
            <div className="flex items-center gap-1">
              <input type="checkbox" id='m' className='w-5' />
              <span>Male</span>
            </div>
            <div className="flex items-center gap-1">
              <input type="checkbox" id='f' className='w-5' />
              <span>Female</span>
            </div>
          </div>

          {/* Category Filter */}
          <div className='flex gap-2 flex-wrap items-center'>
            <label>Category:</label>
            <div className="flex items-center gap-1">
              <input type="checkbox" id='casual' className='w-5' />
              <span>Casual</span>
            </div>
            <div className="flex items-center gap-1">
              <input type="checkbox" id='wedding' className='w-5' />
              <span>Wedding</span>
            </div>
            <div className="flex items-center gap-1">
              <input type="checkbox" id='party' className='w-5' />
              <span>Party</span>
            </div>
          </div>

          {/* Size Filter */}
          <div className='flex gap-2 flex-wrap items-center'>
            <label>Size:</label>
            {['S', 'M', 'L', 'XL'].map(size => (
              <div key={size} className="flex items-center gap-1">
                <input type="checkbox" id={size} className='w-5' />
                <span>{size}</span>
              </div>
            ))}
          </div>

          {/* Offer Filter */}
          <div className='flex items-center gap-2'>
            <label>Offer:</label>
            <input type="checkbox" id="offer" className="w-5" />
          </div>

          {/* Sort Filter */}
          <div className="flex flex-col gap-1">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700">
              Sort By:
            </label>
            <select
              id="sort"
              className="border border-gray-300 rounded-md p-2 w-40"
            >
              <option value="createdAt-desc">Latest</option>
              <option value="createdAt-asc">Oldest</option>
              <option value="regularPrice-asc">Price Low to High</option>
              <option value="regularPrice-desc">Price High to Low</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-slate-700 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>
      </div>
 
      {/* Listing Results Panel */}
      <div className="w-full md:w-2/3 p-6">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mb-4">Listing Results</h1>
        {/* Listings would go here */}
      </div>
    </div>
  );
}

export default Search;
