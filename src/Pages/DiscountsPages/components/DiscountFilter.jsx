import React from 'react'
import { ReusableFilter } from '../../../Shared/ReusableFilter/ReusableFilter'

const DiscountFilter = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  discounts = [], 
  filteredDiscounts = [],
  resultsCount = 0,
  totalCount = 0
}) => {
  const filterConfig = [
    {
      type: 'search',
      key: 'search',
      label: 'Search Offers',
      placeholder: 'Search by offer name or description...',
      span: 2
    },
    {
      type: 'select',
      key: 'status',
      label: 'Status',
      placeholder: 'All Status',
      options: [
        { value: '', label: 'All Status' },
        { value: 'Active', label: '🟢 Active' },
        { value: 'Inactive', label: '🔴 Inactive' }
      ]
    },
    {
      type: 'select',
      key: 'type',
      label: 'Discount Type',
      placeholder: 'All Types',
      options: [
        { value: '', label: 'All Types' },
        { value: 'Percentage', label: '📊 Percentage' },
        { value: 'Flat', label: '💰 Flat Amount' },
        { value: 'BOGO', label: '🎁 Buy 1 Get 1' }
      ]
    }
  ]

  const handleClearFilters = () => {
    onFilterChange({
      search: '',
      status: '',
      type: ''
    })
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export Discounts data')
  }

  const handleFilterChangeInternal = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    })
  }

  return (
    <ReusableFilter
      filters={filters}
      onFilterChange={handleFilterChangeInternal}
      onClearFilters={handleClearFilters}
      onExport={handleExport}
      filterConfig={filterConfig}
      title="Filter Discounts & Offers"
      showExport={true}
      showClear={true}
      resultsCount={resultsCount}
      totalCount={totalCount}
    />
  )
}

export default DiscountFilter

