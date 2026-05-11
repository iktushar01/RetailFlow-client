import React from 'react'
import { ReusableFilter } from '../../../Shared/ReusableFilter/ReusableFilter'
import { exportSuppliersToCSV, downloadCSV } from '../utils/supplierHelpers'

const SuppliersFilter = ({
  filters = {},
  onFilterChange = () => {},
  onClearFilters = () => {},
  suppliers = [],
  filteredSuppliers = [],
  resultsCount = 0,
  totalCount = 0
}) => {
  const filterConfig = [
    {
      key: 'search',
      label: 'Search Suppliers',
      type: 'search',
      placeholder: 'Search by name, contact, email, or phone...',
      span: 2
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: '', label: 'All Status' },
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
        { value: 'Suspended', label: 'Suspended' }
      ]
    },
    {
      key: 'paymentTerms',
      label: 'Payment Terms',
      type: 'select',
      options: [
        { value: '', label: 'All Payment Terms' },
        { value: 'Net 15', label: 'Net 15' },
        { value: 'Net 30', label: 'Net 30' },
        { value: 'Net 45', label: 'Net 45' },
        { value: 'Net 60', label: 'Net 60' },
        { value: 'COD', label: 'COD' },
        { value: 'Prepaid', label: 'Prepaid' }
      ]
    }
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
      title="Suppliers Filters & Search"
      resultsCount={resultsCount}
      totalCount={totalCount}
      showExport={true}
      showClear={true}
    />
  )
}

export default SuppliersFilter
