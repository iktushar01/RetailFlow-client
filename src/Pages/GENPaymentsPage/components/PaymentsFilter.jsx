import React from 'react'
import { ReusableFilter } from '../../../Shared/ReusableFilter/ReusableFilter'

const PaymentsFilter = ({ 
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
      label: 'Search Payments',
      placeholder: 'Search by GRN or PO Number...'
    },
    {
      type: 'select',
      key: 'status',
      label: 'Payment Status',
      placeholder: 'All Statuses',
      options: [
        { value: '', label: 'All Statuses' },
        { value: 'Due', label: '🔴 Due' },
        { value: 'Partial', label: '🟡 Partial' },
        { value: 'Paid', label: '🟢 Paid' }
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
      dateFrom: '',
      dateTo: '',
      search: ''
    })
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export Payments data')
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
      title="Filter Supplier Payments"
      showExport={true}
      showClear={true}
      resultsCount={resultsCount}
      totalCount={totalCount}
    />
  )
}

export default PaymentsFilter

