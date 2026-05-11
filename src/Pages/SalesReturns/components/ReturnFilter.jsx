import React from 'react'
import { ReusableFilter } from '../../../Shared/ReusableFilter/ReusableFilter'

const ReturnFilter = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  resultsCount = 0,
  totalCount = 0
}) => {
  const filterConfig = [
    {
      type: 'search',
      key: 'search',
      label: 'Search Returns',
      placeholder: 'Search by return number or invoice...',
      span: 2
    },
    {
      type: 'select',
      key: 'status',
      label: 'Status',
      placeholder: 'All Status',
      options: [
        { value: '', label: 'All Status' },
        { value: 'Pending', label: '🟡 Pending' },
        { value: 'Approved', label: '🟢 Approved' },
        { value: 'Rejected', label: '🔴 Rejected' }
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
      search: '',
      status: '',
      dateFrom: '',
      dateTo: ''
    })
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export Returns data')
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
      title="Filter Sales Returns"
      showExport={true}
      showClear={true}
      resultsCount={resultsCount}
      totalCount={totalCount}
    />
  )
}

export default ReturnFilter

