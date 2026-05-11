import React from 'react'
import { ReusableFilter } from '../../../Shared/ReusableFilter/ReusableFilter'

const PaymentFilter = ({ 
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
      label: 'Search Payments',
      placeholder: 'Search by invoice or customer...',
      span: 2
    },
    {
      type: 'select',
      key: 'paymentMethod',
      label: 'Payment Method',
      placeholder: 'All Methods',
      options: [
        { value: '', label: 'All Methods' },
        { value: 'Cash', label: '💵 Cash' },
        { value: 'Card', label: '💳 Card' },
        { value: 'bKash', label: '📱 bKash' },
        { value: 'Nagad', label: '📱 Nagad' },
        { value: 'Rocket', label: '📱 Rocket' },
        { value: 'Bank Transfer', label: '🏦 Bank Transfer' }
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
      paymentMethod: '',
      dateFrom: '',
      dateTo: ''
    })
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export Sales Payments data')
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
      title="Filter Sales Payments"
      showExport={true}
      showClear={true}
      resultsCount={resultsCount}
      totalCount={totalCount}
    />
  )
}

export default PaymentFilter

