import React from 'react'
import { ReusableFilter } from '../../../Shared/ReusableFilter/ReusableFilter'
import { exportBatchToCSV, downloadCSV } from '../utils/batchHelpers'

const BatchFilter = ({
  filters = {},
  onFilterChange = () => {},
  onClearFilters = () => {},
  inventory = [],
  filteredInventory = [],
  resultsCount = 0,
  totalCount = 0
}) => {
  const filterConfig = [
    {
      key: 'search',
      label: 'Search Products',
      type: 'search',
      placeholder: 'Search by name, ID, or batch number...',
      span: 2
    },
    {
      key: 'warehouse',
      label: 'Warehouse',
      type: 'select',
      options: [
        { value: '', label: 'All Warehouses' },
        ...inventory.map(item => item.location).filter(Boolean).filter((value, index, self) => self.indexOf(value) === index).map(location => ({ value: location, label: location }))
      ]
    },
    {
      key: 'expiryStatus',
      label: 'Expiry Status',
      type: 'select',
      options: [
        { value: '', label: 'All Status' },
        { value: 'valid', label: 'Valid' },
        { value: 'near-expiry', label: 'Near Expiry' },
        { value: 'expired', label: 'Expired' },
        { value: 'unknown', label: 'Unknown' }
      ]
    }
  ]

  const handleExport = () => {
    const csv = exportBatchToCSV(filteredInventory)
    downloadCSV(csv, `batch-tracking-${Date.now()}.csv`)
  }

  return (
    <ReusableFilter
      filters={filters}
      onFilterChange={onFilterChange}
      onClearFilters={onClearFilters}
      onExport={handleExport}
      filterConfig={filterConfig}
      title="Batch Tracking Filters"
      resultsCount={resultsCount}
      totalCount={totalCount}
      showExport={true}
      showClear={true}
    />
  )
}

export default BatchFilter
