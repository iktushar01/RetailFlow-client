import React, { useMemo } from 'react'
import { Search, Filter, FileDown, RotateCcw, Package } from 'lucide-react'
import { ReusableFilter } from '../../../Shared/ReusableFilter/ReusableFilter'
import { exportProductsToCSV, downloadCSV } from '../utils/productHelpers'

const ProductFilter = ({
  filters,
  onFilterChange,
  onClearFilters,
  products,
  filteredProducts,
  categories,
  suppliers,
  resultsCount
}) => {
  
  const handleExport = () => {
    const csv = exportProductsToCSV(filteredProducts)
    downloadCSV(csv, `inventory-export-${new Date().toISOString().split('T')[0]}.csv`)
  }

  // Memoize config to prevent unnecessary re-renders of the filter bar
  const filterConfig = useMemo(() => [
    {
      key: 'search',
      label: 'Quick Search',
      type: 'search',
      placeholder: 'Search name, SKU, brand...',
      icon: <Search className="w-4 h-4 text-muted-foreground" />,
      span: 2 // Assuming your ReusableFilter handles grid spans
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
    <div className="space-y-4">
      {/* Dynamic Summary Ribbon */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Product Inventory</h2>
            <p className="text-xs text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{resultsCount}</span> products
            </p>
          </div>
        </div>

        {/* Action buttons could also go here if ReusableFilter doesn't handle them */}
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <ReusableFilter
          filters={filters}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
          onExport={handleExport}
          filterConfig={filterConfig}
          // The title prop is often rendered inside ReusableFilter
          title={
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Filter className="w-4 h-4" />
              Advanced Filters
            </div>
          }
          // Props for the export/clear buttons if your component supports them
          exportLabel="Export CSV"
          exportIcon={<FileDown className="w-4 h-4 mr-2" />}
          clearLabel="Reset"
          clearIcon={<RotateCcw className="w-4 h-4 mr-2" />}
          
          // Enhanced results display
          resultsCount={filteredProducts.length}
          totalCount={products.length}
          
          // Custom class for the filter container
          className="p-6"
        />
      </div>
    </div>
  )
}

export default ProductFilter