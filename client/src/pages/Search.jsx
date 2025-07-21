import { set } from 'mongoose';
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebardata, setSidebardata] = React.useState({
    searchTerm: '',
    type: 'all',
    gender: 'all',
    category: 'all',
    size: [],
    offer: false,
    sort: 'createdAt',
    order: 'desc',
  });

  const [loading, setLoading] = React.useState(false);
  const [listings, setListings] = React.useState([]);
  
  // Log listings on every render
  console.log('Current listings:', listings);
  
  useEffect(() => {
    

    // Use location.search instead of window.location.search for consistency with React Router
    const urlParams = new URLSearchParams(location.search);
    
    const searchTermFromUrl = urlParams.get('searchTerm') || '';
    const typeFromUrl = urlParams.get('type') || 'all';
    const genderFromUrl = urlParams.get('gender') || 'all';
    const categoryFromUrl = urlParams.get('category') || 'all';
    const sizeFromUrl = urlParams.get('size') ? urlParams.get('size').split(',') : [];
    const offerFromUrl = urlParams.get('offer') === 'true';
    const sortFromUrl = urlParams.get('sort') || 'createdAt';
    const orderFromUrl = urlParams.get('order') || 'desc';

    
    if (
      searchTermFromUrl ||
      typeFromUrl !== 'all' ||
      genderFromUrl !== 'all' ||
      categoryFromUrl !== 'all' ||
      sizeFromUrl.length > 0 ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl,
        type: typeFromUrl,
        gender: genderFromUrl,
        category: categoryFromUrl,
        size: sizeFromUrl,
        offer: offerFromUrl,
        sort: sortFromUrl,
        order: orderFromUrl,
      });
    } else {
      // Optionally reset sidebar data if no query params
      setSidebardata({
        searchTerm: '',
        type: 'all',
        gender: 'all',
        category: 'all',
        size: [],
        offer: false,
        sort: 'createdAt',
        order: 'desc',
      });
    }

    const fetchListings = async () => {
      try {
        setLoading(true);
        const searchQuery = urlParams.toString();
        
        const res = await fetch(`/server/listing/get?${searchQuery}`);

        if (!res.ok) {
          const errorText = await res.text();
          console.error('Fetch failed:', errorText);
          setLoading(false);
          return;
        }

        const data = await res.json();
        
        setListings(data.listings);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    

    if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
      setSidebardata({
        ...sidebardata,
        type: e.target.id,
      });
    }
    if (e.target.id === 'searchTerm') {
      setSidebardata({
        ...sidebardata,
        searchTerm: e.target.value,
      });
    }
    if (e.target.id === 'm' || e.target.id === 'f') {
      setSidebardata({
        ...sidebardata,
        gender: e.target.checked ? e.target.id : 'all',
      });
    }

    // Fixed typo here: 'ethnic' not 'etnic'
    if (['casual', 'wedding', 'party', 'ethnic', 'formal'].includes(e.target.id)) {
      setSidebardata({
        ...sidebardata,
        category: e.target.checked ? e.target.id : 'all',
      });
    }

    if (['XS', 'S', 'M', 'L', 'XL'].includes(e.target.id)) {
      const currentSizes = sidebardata.size;
      const clickedSize = e.target.id;
      const newSizes = e.target.checked
        ? [...currentSizes, clickedSize]
        : currentSizes.filter((size) => size !== clickedSize);
      setSidebardata({
        ...sidebardata,
        size: newSizes,
      });
    }

    if (e.target.id === 'sort') {
      const sort = e.target.value.split('_')[0] || 'createdAt';
      const order = e.target.value.split('_')[1] || 'desc';
      setSidebardata({
        ...sidebardata,
        sort,
        order,
      });
    }

    if (e.target.id === 'offer') {
      setSidebardata({
        ...sidebardata,
        offer: e.target.checked,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('gender', sidebardata.gender);
    urlParams.set('category', sidebardata.category);
    urlParams.set('size', sidebardata.size.join(','));
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    // console.log('Navigating to:', `/search?${searchQuery}`);
    navigate(`/search?${searchQuery}`);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Search Panel */}
      <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r p-6 bg-gray-50">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Search Term */}
          <div className="flex items-center gap-2">
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
          <div className="flex gap-2 flex-wrap items-center">
            <label>Type:</label>
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === 'all'}
              />
              <span>Rent & Sale</span>
            </div>
          </div>

          {/* Gender Filter */}
          <div className="flex gap-2 flex-wrap items-center">
            <label>Gender:</label>
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                id="m"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.gender === 'm'}
              />
              <span>Male</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                id="f"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.gender === 'f'}
              />
              <span>Female</span>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap items-center">
            <label>Category:</label>
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                id="formal"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.category === 'formal'}
              />
              <span>Formal</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                id="ethnic"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.category === 'ethnic'}
              />
              <span>Ethnic</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                id="casual"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.category === 'casual'}
              />
              <span>Casual</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                id="wedding"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.category === 'wedding'}
              />
              <span>Wedding</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                id="party"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.category === 'party'}
              />
              <span>Party</span>
            </div>
          </div>

          {/* Size Filter */}
          <div className="flex gap-2 flex-wrap items-center">
            <label>Size:</label>
            {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
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
          <div className="flex items-center gap-2">
            <label>Offer:</label>
            <input
              type="checkbox"
              id="offer"
              className="w-5"
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
        {/* Render listings for debugging */}
        {loading ? (
          <p>Loading listings...</p>
        ) : listings.length === 0 ? (
          <p>No listings found</p>
        ) : (
          <ul>
            {listings.map((listing) => (
              <li key={listing._id}>
                <strong>{listing.name}</strong> - {listing.category} - {listing.gender} - {listing.size.join(', ')}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Search;
