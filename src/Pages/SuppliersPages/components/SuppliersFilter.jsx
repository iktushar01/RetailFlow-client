import React from 'react'
import { ReusableFilter } from '../../../Shared/ReusableFilter/ReusableFilter'
import { exportSuppliersToCSV, downloadCSV } from '../utils/supplierHelpers'

const SuppliersFilter = ({
  filters,
  onFilterChange,
  onClearFilters,
  suppliers = [],
  filteredSuppliers = [],
  resultsCount = 0,
  totalCount = 0,
}) => {
  const filterConfig = [
    {
      key: 'search',
      label: 'Search',
      type: 'search',
      placeholder: 'Name, email, phone...',
      span: 2,
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: '', label: 'All Statuses' },
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
      ],
    },
  ]

  const handleExport = () => {
    const csv = exportSuppliersToCSV(filteredSuppliers)
    downloadCSV(csv, `suppliers-${Date.now()}.csv`)
  }

  return (
    <ReusableFilter
      filters={filters}
      onFilterChange={onFilterChange}
      onClearFilters={onClearFilters}
      onExport={handleExport}
      filterConfig={filterConfig}
      showExport
      resultsCount={resultsCount}
      totalCount={totalCount}
    />
  )
}

export default SuppliersFilter
