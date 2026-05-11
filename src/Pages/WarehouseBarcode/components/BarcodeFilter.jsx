import React from 'react'
import { ReusableFilter } from '../../../Shared/ReusableFilter/ReusableFilter'
import { exportBarcodeToCSV, downloadCSV } from '../utils/barcodeHelpers'

const BarcodeFilter = ({
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
      placeholder: 'Search by name, ID, SKU, barcode, or QR code...',
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
      key: 'barcodeStatus',
      label: 'Barcode Status',
      type: 'select',
      options: [
        { value: '', label: 'All Status' },
        { value: 'assigned', label: 'Assigned' },
        { value: 'unassigned', label: 'Unassigned' }
      ]
    }
  ]

  const handleExport = () => {
    const csv = exportBarcodeToCSV(filteredInventory)
    downloadCSV(csv, `barcode-data-${Date.now()}.csv`)
  }

  return (
    <ReusableFilter
      filters={filters}
      onFilterChange={onFilterChange}
      onClearFilters={onClearFilters}
      onExport={handleExport}
      filterConfig={filterConfig}
      title="Barcode Management Filters"
      resultsCount={resultsCount}
      totalCount={totalCount}
      showExport={true}
      showClear={true}
    />
  )
}

export default BarcodeFilter
