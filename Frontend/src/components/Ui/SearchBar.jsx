
import React, { useState, useEffect } from 'react';
import useDebounce from '../../hook/useDebounce';

function SearchBar({ onSearch }) {
  const [searchData, setSearchData] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    gender: ''
  });

  // Debounce the search to avoid excessive API calls
  const debouncedSearchData = useDebounce(searchData, 300);

  // Call onSearch when debounced search data changes
  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearchData);
    }
  }, [debouncedSearchData, onSearch]);

  // Initial search on component mount to show all PGs
  useEffect(() => {
    if (onSearch) {
      onSearch(searchData);
    }
  }, []); // Only run once on mount

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search data:', searchData);
    // The search is already handled by the useEffect with debounced data
    // This function handles the form submission but the actual search happens automatically
    if (onSearch) {
      onSearch(searchData);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto mb-8">
      <form onSubmit={handleSearch} className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          {/* Location Input */}
          <div className="lg:col-span-2 form-group">
            <label className="form-label">
              📍 Location
            </label>
            <input
              type="text"
              name="location"
              placeholder="Enter city or area"
              value={searchData.location}
              onChange={handleInputChange}
              className="input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              💰 Min Price
            </label>
            <input
              type="number"
              name="minPrice"
              placeholder="₹ 0"
              value={searchData.minPrice}
              onChange={handleInputChange}
              className="input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              💰 Max Price
            </label>
            <input
              type="number"
              name="maxPrice"
              placeholder="₹ 50,000"
              value={searchData.maxPrice}
              onChange={handleInputChange}
              className="input"
            />
          </div>

          {/* Gender Selection */}
          <div className="form-group">
            <label className="form-label">
              👥 Gender
            </label>
            <select
              name="gender"
              value={searchData.gender}
              onChange={handleInputChange}
              className="input"
            >
              <option value="">Any</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Both">Both</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="lg:col-span-1">
            <button
              type="submit"
              className="btn-primary w-full"
            >
              🔍 Search
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SearchBar;
