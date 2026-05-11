import React from 'react'
import { ReusableFilter } from '../../../Shared/ReusableFilter/ReusableFilter'

const InventoryFilter = ({ 
  filters, 
  onFilterChange, 
  categories = [],
  resultsCount = 0,
  totalCount = 0
}) => {
  const filterConfig = [
    {
      type: 'search',
      key: 'search',
      label: 'Search Products',
      placeholder: 'Search by product name...'
    },
    {
      type: 'select',
      key: 'category',
      label: 'Category',
      placeholder: 'All Categories',
      options: [
        { value: '', label: 'All Categories' },
        ...categories.map(category => ({
          value: category,
          label: category
        }))
      ]
    },
    {
      type: 'select',
      key: 'stockStatus',
      label: 'Stock Status',
      placeholder: 'All Stock Levels',
      options: [
        { value: '', label: 'All Stock Levels' },
        { value: 'in-stock', label: '🟢 In Stock' },
        { value: 'low-stock', label: '🟡 Low Stock' },
        { value: 'out-of-stock', label: '🔴 Out of Stock' }
      ]
    },
    {
      type: 'select',
      key: 'expiryStatus',
      label: 'Expiry Status',
      placeholder: 'All',
      options: [
        { value: '', label: 'All' },
        { value: 'expired', label: '🔴 Expired' },
        { value: 'expiring-soon', label: '🟡 Expiring Soon' },
        { value: 'valid', label: '🟢 Valid' }
      ]
    },
    {
      type: 'search',
      key: 'location',
      label: 'Location',
      placeholder: 'Warehouse location...'
    }
  ]

  const handleClearFilters = () => {
    onFilterChange({
      search: '',
      category: '',
      stockStatus: '',
      expiryStatus: '',
      location: ''
    })
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export Inventory data')
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
      title="Filter Inventory Products"
      showExport={true}
      showClear={true}
      resultsCount={resultsCount}
      totalCount={totalCount}
    />
  )
}

export default InventoryFilter

