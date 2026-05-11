import React from 'react'
import { ReusableFilter } from '../../../Shared/ReusableFilter/ReusableFilter'

const POFilter = ({ filters, onFilterChange, suppliers, resultsCount, totalCount }) => {
  const filterConfig = [
    {
      type: 'select',
      key: 'status',
      label: 'Status',
      placeholder: 'All Statuses',
      options: [
        { value: '', label: 'All Statuses' },
        { value: 'Pending', label: '🟡 Pending' },
        { value: 'Sent', label: '🔵 Sent' },
        { value: 'Completed', label: '🟢 Completed' },
        { value: 'Cancelled', label: '🔴 Cancelled' }
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
    },
    {
      type: 'search',
      key: 'search',
      label: 'Search PO',
      placeholder: 'Search by PO Number...'
    }
  ]

  const handleClearFilters = () => {
    onFilterChange({
      status: '',
      supplier: '',
      dateFrom: '',
      dateTo: '',
      search: ''
    })
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export PO data')
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
      title="Filter Purchase Orders"
      showExport={true}
      showClear={true}
      resultsCount={resultsCount}
      totalCount={totalCount}
    />
  )
}

export default POFilter

