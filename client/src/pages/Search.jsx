import React from 'react';

function Search() {
 const [sidebardata, setSidebardata] = React.useState(
  {
    searchTerm:'',
    type: 'all',
    gender: 'all',
    category: 'all',
    size: [],
    offer: false,
    sort: 'createdAt',
    order: 'desc'
  }
 );
//  console.log(sidebardata);
 
 const handleChange = (e) => {
  if(e.target.id==='all' ||e.target.id ==='rent' || e.target.id === 'sale') {
    setSidebardata({
      ...sidebardata,
      type: e.target.id
    });
  }
  if(e.target.id==='searchTerm'){
    setSidebardata({
      ...sidebardata,
      searchTerm: e.target.value
    });
  }
   if (e.target.id === 'm' || e.target.id === 'f') {
  setSidebardata({
    ...sidebardata,
    gender: e.target.checked ? e.target.id : 'all'
  });
}

if (['casual', 'wedding', 'party'].includes(e.target.id)) {
  setSidebardata({
    ...sidebardata,
    category: e.target.checked ? e.target.id : 'all'
  });
}

if (['S', 'M', 'L', 'XL'].includes(e.target.id)) {
  const currentSizes = sidebardata.size;
  const clickedSize = e.target.id;
  const newSizes = e.target.checked
    ? [...currentSizes, clickedSize]
    : currentSizes.filter(size => size !== clickedSize);
  setSidebardata({
    ...sidebardata,
    size: newSizes
  });
}

    if (e.target.id === 'sort') {
      const sort  = e.target.value.split('_')[0] || 'createdAt';
      const order = e.target.value.split('_')[1] || 'desc';
  setSidebardata({
    ...sidebardata,
    sort,order
  });
}

if (e.target.id === 'offer') {
  setSidebardata({
    ...sidebardata,
    offer: e.target.checked
  });
}

const handleSubmit = (e) => {
  e.preventDefault();
}


  }
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Search Panel */}
      <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r p-6 bg-gray-50">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
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
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>

          {/* Type Filter */}
          <div className='flex gap-2 flex-wrap items-center'>
            <label>Type:</label>
            <div className="flex items-center gap-1">
              <input type="checkbox" id='all' className='w-5' 
              onChange={handleChange}
              checked={sidebardata.type === 'all'} 
              />
              <span>Rent & Sale</span>
            </div>
          </div>

          {/* Gender Filter */}
          <div className='flex gap-2 flex-wrap items-center'>
            <label>Gender:</label>
            <div className="flex items-center gap-1">
              <input type="checkbox" id='m' className='w-5'
              onChange={handleChange}
              checked={sidebardata.gender === 'm'}
              />
              <span>Male</span>
            </div>
            <div className="flex items-center gap-1">
              <input type="checkbox" id='f' className='w-5'
              onChange={handleChange}
              checked={sidebardata.gender === 'f'}
              />
              <span>Female</span>
            </div>
          </div>

          {/* Category Filter */}
          <div className='flex gap-2 flex-wrap items-center'>
            <label>Category:</label>
            <div className="flex items-center gap-1">
              <input type="checkbox" id='casual' className='w-5'
              onChange={handleChange}
              checked={sidebardata.category === 'casual'}
              />
              <span>Casual</span>
            </div>
            <div className="flex items-center gap-1">
              <input type="checkbox" id='wedding' className='w-5'
              onChange={handleChange}
              checked={sidebardata.category === 'wedding'}
              />
              <span>Wedding</span>
            </div>
            <div className="flex items-center gap-1">
              <input type="checkbox" id='party' className='w-5'
              onChange={handleChange}
              checked={sidebardata.category === 'party'}
              />
              <span>Party</span>
            </div>
          </div>

          
            {/* Size Filter */}
            <div className='flex gap-2 flex-wrap items-center'>
              <label>Size:</label>
              {['S', 'M', 'L', 'XL'].map((size) => (
                <div className="flex items-center gap-1" key={size}>
                  <input
                    type="checkbox"
                    id={size}
                    className="w-5"
                    onChange={handleChange}
                    checked={sidebardata.size.includes(size)}
                  />
                  <span>{size}</span>
                </div>
              ))}
            </div>



          {/* Offer Filter */}
          <div className='flex items-center gap-2'>
            <label>Offer:</label>
            <input type="checkbox" id="offer" className="w-5"
            onChange={handleChange}
            checked={sidebardata.offer}
             />
          </div>

          {/* Sort Filter */}
          <div className="flex flex-col gap-1">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700">
              Sort By:
            </label>
            <select
              onChange={handleChange}
              defaultValue={'createdAt_desc'}
              id="sort"
              className="border border-gray-300 rounded-md p-2 w-40"
            >
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
              <option value="regularPrice_asc">Price Low to High</option>
              <option value="regularPrice_desc">Price High to Low</option>
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
