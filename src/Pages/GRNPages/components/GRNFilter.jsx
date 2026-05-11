import React from 'react'
import { ReusableFilter } from '../../../Shared/ReusableFilter/ReusableFilter'

const GRNFilter = ({ 
  filters, 
  onFilterChange, 
  suppliers = [], 
  resultsCount = 0,
  totalCount = 0 
}) => {
  const filterConfig = [
    {
      type: 'search',
      key: 'search',
      label: 'Search GRN',
      placeholder: 'Search by GRN Number...'
    },
    {
      type: 'select',
      key: 'status',
      label: 'Status',
      placeholder: 'All Statuses',
      options: [
        { value: '', label: 'All Status' },
        { value: 'Pending', label: '🟡 Pending' },
        { value: 'Partially Received', label: '🟠 Partially Received' },
        { value: 'Received', label: '🟢 Received' },
        { value: 'Approved', label: '✅ Approved' }
      ]
    },
    {
      type: 'select',
      key: 'supplier',
      label: 'Supplier',
      placeholder: 'All Suppliers',
      options: [
        { value: '', label: 'All Suppliers' },
        ...suppliers.map(supplier => ({
          value: supplier._id,
          label: supplier.supplierName
        }))
      ]
    },
    {
      type: 'date',
      key: 'dateFrom',
      label: 'Date From',
      placeholder: 'Start Date'
    },
    {
      type: 'date',
      key: 'dateTo',
      label: 'Date To',
      placeholder: 'End Date'
    }
  ]

  const handleClearFilters = () => {
    onFilterChange({
      status: '',
      supplier: '',
      poNumber: '',
      dateFrom: '',
      dateTo: '',
      search: ''
    })
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export GRN data')
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
      title="Filter Goods Receive Notes"
      showExport={true}
      showClear={true}
      resultsCount={resultsCount}
      totalCount={totalCount}
    />
  )
}

export default GRNFilter

