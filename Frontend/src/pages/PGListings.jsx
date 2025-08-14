import React, { useState, useMemo, useCallback } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import SearchBar from '../components/Ui/SearchBar';
import FilterBox from '../components/Ui/FilterBox';
import PGCard from '../components/Ui/PGCard';
import usePagination from '../hook/usePagination';
import { useBreakpoint } from '../hook/useResponsive';

const samplePGs = [
  {
    id: 1,
    name: 'Sunrise PG',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    location: 'Ahmedabad',
    gender: 'Male',
    rating: 4.5,
    amenities: ['WiFi', 'AC', 'Parking', 'Food'],
    roomType: 'Single',
    foodIncluded: true,
    parking: true,
    verified: true
  },
  {
    id: 2,
    name: 'Elite Stay',
    price: 6500,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    location: 'Ahmedabad',
    gender: 'Female',
    rating: 4.8,
    amenities: ['WiFi', 'AC', 'Laundry', 'Food', 'Security'],
    roomType: 'Double',
    foodIncluded: true,
    parking: false,
    verified: true
  },
  {
    id: 3,
    name: 'Comfort Homes',
    price: 5500,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    location: 'Ahmedabad',
    gender: 'Both',
    rating: 4.3,
    amenities: ['WiFi', 'Parking', 'Food', 'Gym'],
    roomType: 'Single',
    foodIncluded: true,
    parking: true,
    verified: false
  },
  {
    id: 4,
    name: 'Modern Living',
    price: 7000,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    location: 'Ahmedabad',
    gender: 'Male',
    rating: 4.6,
    amenities: ['WiFi', 'AC', 'Parking', 'Food', 'Gym', 'Security'],
    roomType: 'Single',
    foodIncluded: true,
    parking: true,
    verified: true
  },
  {
    id: 5,
    name: 'Student Hub',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    location: 'Ahmedabad',
    gender: 'Both',
    rating: 4.2,
    amenities: ['WiFi', 'Study Room', 'Food', 'Laundry'],
    roomType: 'Triple',
    foodIncluded: true,
    parking: false,
    verified: true
  },
  {
    id: 6,
    name: 'Premium Residence',
    price: 8000,
    image: 'https://images.unsplash.com/photo-1566908829077-2174d4a622c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    location: 'Ahmedabad',
    gender: 'Female',
    rating: 4.9,
    amenities: ['WiFi', 'AC', 'Parking', 'Food', 'Gym', 'Security', 'Swimming Pool'],
    roomType: 'Single',
    foodIncluded: true,
    parking: true,
    verified: true
  },
  {
    id: 7,
    name: 'Royal Gardens PG',
    price: 6000,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    location: 'Ahmedabad',
    gender: 'Male',
    rating: 4.4,
    amenities: ['WiFi', 'AC', 'Food', 'Parking', 'Garden'],
    roomType: 'Double',
    foodIncluded: true,
    parking: true,
    verified: true
  },
  {
    id: 8,
    name: 'City Center Stay',
    price: 7500,
    image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    location: 'Ahmedabad',
    gender: 'Both',
    rating: 4.7,
    amenities: ['WiFi', 'AC', 'Food', 'Parking', 'Security', 'Metro Access'],
    roomType: 'Single',
    foodIncluded: true,
    parking: true,
    verified: true
  }
];

function PGListings() {
  const { isMobile } = useBreakpoint();
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [searchResults, setSearchResults] = useState(samplePGs);
  const [filteredData, setFilteredData] = useState(samplePGs);

  // Pagination hook
  const {
    currentPage,
    totalPages,
    currentData,
    hasNextPage,
    hasPrevPage,
    goToPage,
    goToNextPage,
    goToPrevPage
  } = usePagination(filteredData, isMobile ? 6 : 9);

  // Handle search results
  const handleSearch = useCallback((searchData) => {
    let filtered = [...samplePGs];
    
    // Filter by location
    if (searchData.location) {
      filtered = filtered.filter(pg => 
        pg.location.toLowerCase().includes(searchData.location.toLowerCase())
      );
    }
    
    // Filter by price range
    if (searchData.minPrice) {
      filtered = filtered.filter(pg => pg.price >= parseInt(searchData.minPrice));
    }
    if (searchData.maxPrice) {
      filtered = filtered.filter(pg => pg.price <= parseInt(searchData.maxPrice));
    }
    
    // Filter by gender
    if (searchData.gender) {
      filtered = filtered.filter(pg => 
        pg.gender === searchData.gender || pg.gender === 'Both'
      );
    }
    
    // Filter by amenity (for quick filters)
    if (searchData.amenity) {
      filtered = filtered.filter(pg => 
        pg.amenities && pg.amenities.includes(searchData.amenity)
      );
    }
    
    // Filter by food included
    if (searchData.foodIncluded) {
      filtered = filtered.filter(pg => pg.foodIncluded === true);
    }
    
    setSearchResults(filtered);
    setFilteredData(filtered); // Also update filteredData so cards show immediately
  }, []);

  // Handle filter results from FilterBox
  const handleFiltersChange = useCallback((filteredResults, filters, resultsCount) => {
    setFilteredData(filteredResults);
  }, []);

  // Sort functionality
  const sortedData = useMemo(() => {
    let sorted = [...currentData];
    
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'newest':
        return sorted.sort((a, b) => b.id - a.id);
      default:
        return sorted;
    }
  }, [currentData, sortBy]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Header />
      
      {/* Search Section */}
      <section>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-4">
              <FilterBox 
                data={searchResults} 
                onFiltersChange={handleFiltersChange}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="card mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                    PG Listings in Ahmedabad
                  </h1>
                  <p className="mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                    {filteredData.length} properties found • Page {currentPage} of {totalPages}
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Mobile Filter Button */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden btn-primary flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                    </svg>
                    Filters
                  </button>

                  {/* Sort Dropdown */}
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-opacity-50 focus:border-transparent outline-none"
                    style={{ 
                      backgroundColor: 'var(--color-bg)', 
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)',
                      '--tw-ring-color': 'var(--color-primary)'
                    }}
                  >
                    <option value="relevance">Sort by Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest First</option>
                  </select>

                  {/* View Mode Toggle */}
                  <div className="hidden sm:flex rounded-xl p-1" style={{ backgroundColor: 'var(--color-border)' }}>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'grid' 
                          ? 'text-white' 
                          : 'hover:bg-opacity-50'
                      }`}
                      style={{ 
                        backgroundColor: viewMode === 'grid' ? 'var(--color-primary)' : 'transparent',
                        color: viewMode === 'grid' ? 'white' : 'var(--color-text-secondary)'
                      }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'list' 
                          ? 'text-white' 
                          : 'hover:bg-opacity-50'
                      }`}
                      style={{ 
                        backgroundColor: viewMode === 'list' ? 'var(--color-primary)' : 'transparent',
                        color: viewMode === 'list' ? 'white' : 'var(--color-text-secondary)'
                      }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Grid/List */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {sortedData.length > 0 ? (
                sortedData.map(pg => (
                  <PGCard key={pg.id} pg={pg} viewMode={viewMode} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-500 dark:text-gray-400 text-lg">
                    No PG accommodations found matching your criteria.
                  </div>
                  <div className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                    Try adjusting your filters or search terms.
                  </div>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-12 gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {((currentPage - 1) * (isMobile ? 6 : 9)) + 1} to {Math.min(currentPage * (isMobile ? 6 : 9), filteredData.length)} of {filteredData.length} results
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={goToPrevPage}
                    disabled={!hasPrevPage}
                    className="px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  
                  {/* Page Numbers */}
                  <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={goToNextPage}
                    disabled={!hasNextPage}
                    className="px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* No Results State (can be shown conditionally) */}
            {samplePGs.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No PGs Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your filters or search criteria
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors">
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default PGListings;
