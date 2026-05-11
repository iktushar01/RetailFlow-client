import React from 'react'
import { ReusableFilter } from '../../../Shared/ReusableFilter/ReusableFilter'
import { exportProductsToCSV, downloadCSV } from '../utils/productHelpers'

const ProductFilter = ({
  filters,
  onFilterChange,
  onClearFilters,
  products,
  filteredProducts,
  categories,
  suppliers
}) => {
  const handleExport = () => {
    const csv = exportProductsToCSV(filteredProducts)
    downloadCSV(csv, `products-${Date.now()}.csv`)
  }

  const filterConfig = [
    {
      key: 'search',
      label: 'Search',
      type: 'search',
      placeholder: 'Search by name, SKU, brand, or QR code...',
      span: 2
    },
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      options: [
        { value: '', label: 'All Categories' },
        ...categories.map(cat => ({ value: cat, label: cat }))
      ]
    },
    {
      key: 'supplier',
      label: 'Supplier',
      type: 'select',
      options: [
        { value: '', label: 'All Suppliers' },
        ...suppliers.map(sup => ({ value: sup, label: sup }))
      ]
    }
  ]

  return (
    <ReusableFilter
      filters={filters}
      onFilterChange={onFilterChange}
      onClearFilters={onClearFilters}
      onExport={handleExport}
      filterConfig={filterConfig}
      title="Search & Filter Products"
      resultsCount={filteredProducts.length}
      totalCount={products.length}
    />
  )
}

export default ProductFilter

