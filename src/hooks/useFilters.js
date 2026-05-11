import { useState, useCallback, useEffect } from 'react'

/**
 * Custom hook for managing filters
 * @param {Array} data - Data to filter
 * @param {Function} filterFunction - Filter function that takes (data, filters) and returns filtered data
 * @param {Object} initialFilters - Initial filter state
 */
export const useFilters = (data, filterFunction, initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters)
  const [filteredData, setFilteredData] = useState(data)

  // Apply filters whenever data or filters change
  const applyFilters = useCallback(() => {
    const filtered = filterFunction(data, filters)
    setFilteredData(filtered)
  }, [data, filters, filterFunction])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  // Update a specific filter
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters(initialFilters)
  }, [initialFilters])

  // Reset to specific filter values
  const resetFilters = useCallback((newFilters) => {
    setFilters(newFilters)
  }, [])

  return {
    filters,
    filteredData,
    handleFilterChange,
    clearFilters,
    resetFilters,
    setFilters
  }
}

export default useFilters

