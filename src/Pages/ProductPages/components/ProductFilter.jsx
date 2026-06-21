import React, { useMemo } from 'react'
import { ReusableFilter } from '../../../Shared/ReusableFilter/ReusableFilter'
import { exportProductsToCSV, downloadCSV } from '../utils/productHelpers'

const ProductFilter = ({
  filters,
  onFilterChange,
  onClearFilters,
  filteredProducts,
  categories,
  suppliers,
  resultsCount,
  products,
}) => {
  const handleExport = () => {
    const csv = exportProductsToCSV(filteredProducts)
    downloadCSV(csv, `inventory-export-${new Date().toISOString().split('T')[0]}.csv`)
  }

  const filterConfig = useMemo(() => [
    {
      key: 'search',
      label: 'Search',
      type: 'search',
      placeholder: 'Search name, SKU, brand...',
      span: 2,
    },
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      options: [
        { value: '', label: 'All Categories' },
        ...(categories || []).map(cat => ({ value: cat, label: cat }))
      ]
    },
    {
      key: 'supplier',
      label: 'Supplier',
      type: 'select',
      options: [
        { value: '', label: 'All Suppliers' },
        ...(suppliers || []).map(sup => ({ value: sup, label: sup }))
      ]
    }
  ], [categories, suppliers])

  return (
    <ReusableFilter
      filters={filters}
      onFilterChange={onFilterChange}
      onClearFilters={onClearFilters}
      onExport={handleExport}
      filterConfig={filterConfig}
      showExport
      resultsCount={resultsCount ?? filteredProducts?.length ?? 0}
      totalCount={products?.length ?? 0}
    />
  )
}

export default ProductFilter
