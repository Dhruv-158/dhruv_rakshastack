import { useState, useEffect, useMemo } from 'react';

/**
 * Custom hook for filtering data
 * @param {Array} data - The data array to filter
 * @param {Object} initialFilters - Initial filter values
 * @returns {Object} - Filtered data and filter methods
 */
function useFilter(data, initialFilters = {}) {
  const [filters, setFilters] = useState(initialFilters);

  // Memoize filtered data to prevent unnecessary recalculations
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }
    
    let filtered = [...data];

    Object.keys(filters).forEach(key => {
      const filterValue = filters[key];
      
      // Skip empty, null, undefined values AND false boolean values (only filter when true)
      if (filterValue !== '' && 
          filterValue !== null && 
          filterValue !== undefined && 
          filterValue !== false &&
          !(Array.isArray(filterValue) && filterValue.length === 0)) {
        
        filtered = filtered.filter(item => {
          // Special handling for priceRange filter
          if (key === 'priceRange') {
            const itemPrice = parseFloat(item.price);
            const min = filterValue.min !== null && filterValue.min !== undefined ? parseFloat(filterValue.min) : -Infinity;
            const max = filterValue.max !== null && filterValue.max !== undefined ? parseFloat(filterValue.max) : Infinity;
            return itemPrice >= min && itemPrice <= max;
          }
          
          if (typeof filterValue === 'string') {
            // String filters (case-insensitive partial match)
            return item[key]?.toString().toLowerCase().includes(filterValue.toLowerCase());
          } else if (typeof filterValue === 'number') {
            // Number filters (exact match)
            return item[key] === filterValue;
          } else if (typeof filterValue === 'boolean') {
            // Boolean filters (only filter when true)
            return item[key] === filterValue;
          } else if (Array.isArray(filterValue) && filterValue.length > 0) {
            // Array filters (check if item value is in filter array)
            return filterValue.includes(item[key]);
          } else if (typeof filterValue === 'object' && filterValue.min !== undefined && filterValue.max !== undefined) {
            // Range filters (min/max)
            const itemValue = parseFloat(item[key]);
            const min = filterValue.min !== null && filterValue.min !== undefined ? parseFloat(filterValue.min) : -Infinity;
            const max = filterValue.max !== null && filterValue.max !== undefined ? parseFloat(filterValue.max) : Infinity;
            return itemValue >= min && itemValue <= max;
          }
          return true;
        });
      }
    });

    return filtered;
  }, [data, filters]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const clearFilter = (key) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  return {
    filteredData,
    filters,
    updateFilter,
    updateFilters,
    resetFilters,
    clearFilter,
    resultsCount: filteredData.length
  };
}

export default useFilter;
