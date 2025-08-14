
import React, { useState, useEffect } from 'react';
import useFilter from '../../hook/useFilter';
import useClickOutside from '../../hook/useClickOutside';
import { useBreakpoint } from '../../hook/useResponsive';

function FilterBox({ data = [], onFiltersChange }) {
  const { isMobile } = useBreakpoint();
  
  const initialFilters = {
    priceRange: { min: 0, max: 50000 },
    amenities: [],
    gender: '',
    roomType: '',
    foodIncluded: false,
    parking: false
  };

  const {
    filteredData,
    filters,
    updateFilter,
    resetFilters,
    resultsCount
  } = useFilter(data, initialFilters);

  const [isOpen, setIsOpen] = useState(false);
  const [isApplyingFilters, setIsApplyingFilters] = useState(false);
  
  const filterRef = useClickOutside(() => {
    if (isMobile) setIsOpen(false);
  });

  const amenitiesList = ['WiFi', 'AC', 'Laundry', 'Gym', 'Security', 'Cleaning'];
  const roomTypes = ['Single', 'Double', 'Triple', 'Shared'];

  // DON'T automatically apply filters - only when button is clicked
  // useEffect(() => {
  //   if (onFiltersChange) {
  //     onFiltersChange(filteredData, filters, resultsCount);
  //   }
  // }, [filteredData, filters, resultsCount]);

  const handleAmenityChange = (amenity) => {
    const currentAmenities = filters.amenities || [];
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];
    
    updateFilter('amenities', newAmenities);
  };

  const handlePriceChange = (type, value) => {
    const currentRange = filters.priceRange || { min: 0, max: 50000 };
    updateFilter('priceRange', {
      ...currentRange,
      [type]: value
    });
  };

  const clearFilters = () => {
    resetFilters();
  };

  return (
    <div 
      ref={filterRef}
      className="card mb-6"
    >
      {/* Filter Header */}
      <div className="card-header flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg">🔍</span>
          </div>
          <div>
            <h3 className="card-title text-gradient">
              Smart Filters
            </h3>
            <p className="card-description">
              {resultsCount} properties found
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={clearFilters}
            className="btn-secondary text-sm"
          >
            Clear All
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden btn-secondary p-2"
          >
            <svg className={`w-5 h-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filter Content */}
      <div className={`p-4 space-y-6 ${isOpen ? 'block' : 'hidden lg:block'}`}>
        {/* Price Range */}
        <div className="form-group">
          <label className="form-label">
            💰 Price Range
          </label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.priceRange?.min || 0}
                onChange={(e) => handlePriceChange('min', parseInt(e.target.value) || 0)}
                className="input flex-1"
              />
              <span style={{ color: 'var(--color-text-muted)' }}>to</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.priceRange?.max || 50000}
                onChange={(e) => handlePriceChange('max', parseInt(e.target.value) || 50000)}
                className="input flex-1"
              />
            </div>
            <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              ₹{(filters.priceRange?.min || 0).toLocaleString()} - ₹{(filters.priceRange?.max || 50000).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Gender Preference */}
        <div className="form-group">
          <label className="form-label">
            👥 Gender Preference
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['Male', 'Female', 'Both'].map((gender) => (
              <button
                key={gender}
                onClick={() => updateFilter('gender', filters.gender === gender ? '' : gender)}
                className={`text-sm ${
                  filters.gender === gender ? 'btn-primary' : 'btn-outline'
                }`}
              >
                {gender}
              </button>
            ))}
          </div>
        </div>

        {/* Room Type */}
        <div className="form-group">
          <label className="form-label">
            🏠 Room Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {roomTypes.map((type) => (
              <button
                key={type}
                onClick={() => updateFilter('roomType', filters.roomType === type ? '' : type)}
                className={`text-sm ${
                  filters.roomType === type ? 'btn-primary' : 'btn-outline'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div className="form-group">
          <label className="form-label">
            ⚡ Amenities
          </label>
          <div className="grid grid-cols-2 gap-2">
            {amenitiesList.map((amenity) => (
              <label
                key={amenity}
                className="flex items-center space-x-2 p-2 rounded-lg border cursor-pointer transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                style={{ 
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'var(--color-card-bg)'
                }}
              >
                <input
                  type="checkbox"
                  checked={filters.amenities.includes(amenity)}
                  onChange={() => handleAmenityChange(amenity)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm" style={{ color: 'var(--color-text)' }}>{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Additional Features */}
        <div className="form-group">
          <label className="form-label">
            🍽️ Additional Features
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 p-2 rounded-lg border cursor-pointer transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              style={{ 
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-card-bg)'
              }}
            >
              <input
                type="checkbox"
                checked={filters.foodIncluded}
                onChange={(e) => updateFilter('foodIncluded', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm" style={{ color: 'var(--color-text)' }}>Food Included</span>
            </label>
            <label className="flex items-center space-x-2 p-2 rounded-lg border cursor-pointer transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              style={{ 
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-card-bg)'
              }}
            >
              <input
                type="checkbox"
                checked={filters.parking}
                onChange={(e) => updateFilter('parking', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm" style={{ color: 'var(--color-text)' }}>Parking Available</span>
            </label>
          </div>
        </div>

        {/* Apply Filters Button */}
        <div className="pt-4">
          <div className="divider"></div>
          <button
            onClick={async () => {
              setIsApplyingFilters(true);
              
              // Force trigger filter update
              if (onFiltersChange) {
                onFiltersChange(filteredData, filters, resultsCount);
              }
              
              // Add small delay for visual feedback
              setTimeout(() => {
                setIsApplyingFilters(false);
              }, 300);
            }}
            className={`btn-primary w-full ${isApplyingFilters ? 'loading' : ''}`}
            disabled={isApplyingFilters}
          >
            {isApplyingFilters ? (
              <>
                <div className="spinner"></div>
                Applying...
              </>
            ) : (
              <>Apply Filters</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterBox;
