import React from 'react'
import { ReusableFilter } from '../../../Shared/ReusableFilter/ReusableFilter'

const InvoiceFilter = ({ 
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
      label: 'Search Invoices',
      placeholder: 'Search by invoice number or customer...',
      span: 2
    },
    {
      type: 'select',
      key: 'paymentStatus',
      label: 'Payment Status',
      placeholder: 'All Status',
      options: [
        { value: '', label: 'All Status' },
        { value: 'Paid', label: '🟢 Paid' },
        { value: 'Partial', label: '🟡 Partial' },
        { value: 'Due', label: '🔴 Due' }
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
      paymentStatus: '',
      dateFrom: '',
      dateTo: ''
    })
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export Invoices data')
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
      title="Filter Sales Invoices"
      showExport={true}
      showClear={true}
      resultsCount={resultsCount}
      totalCount={totalCount}
    />
  )
}

export default InvoiceFilter

