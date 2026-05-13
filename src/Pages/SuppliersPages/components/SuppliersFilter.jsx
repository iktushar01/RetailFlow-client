import React, { useMemo } from 'react'
import { Filter, Download, Search, Database, ListFilter } from 'lucide-react'
import { ReusableFilter } from '../../../Shared/ReusableFilter/ReusableFilter'
import { exportSuppliersToCSV, downloadCSV } from '../utils/supplierHelpers'

const SuppliersFilter = ({
  filters = {},
  onFilterChange = () => {},
  onClearFilters = () => {},
  filteredSuppliers = [],
  resultsCount = 0,
  totalCount = 0
}) => {
  
  // Memoize configuration to maintain stability across parent re-renders
  const filterConfig = useMemo(() => [
    {
      key: 'search',
      label: 'Supplier Intelligence',
      type: 'search',
      placeholder: 'Query by name, contact, email, or digital signature...',
      icon: Search,
      span: 2
    },
    {
      key: 'status',
      label: 'Registry Status',
      type: 'select',
      icon: ListFilter,
      options: [
        { value: '', label: 'Full Registry' },
        { value: 'Active', label: 'Active Protocol' },
        { value: 'Inactive', label: 'Inactive' },
        { value: 'Suspended', label: 'Suspended' }
      ]
    },
    {
      key: 'paymentTerms',
      label: 'Financial Terms',
      type: 'select',
      icon: Database,
      options: [
        { value: '', label: 'All Terms' },
        { value: 'Net 15', label: 'Net 15 Days' },
        { value: 'Net 30', label: 'Net 30 Days' },
        { value: 'Net 45', label: 'Net 45 Days' },
        { value: 'Net 60', label: 'Net 60 Days' },
        { value: 'COD', label: 'Cash on Delivery' },
        { value: 'Prepaid', label: 'Prepaid' }
      ]
    }
  ], [])

  const handleExport = () => {
    // Adding a subtle timestamp to the filename for professional record-keeping
    const timestamp = new Date().toISOString().split('T')[0]
    const csv = exportSuppliersToCSV(filteredSuppliers)
    downloadCSV(csv, `SUPPLIER_EXPORT_${timestamp}.csv`)
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
      {/* Search Header Info - Optional but adds to the Executive feel */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <Filter className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/70 italic">
            Filter <span className="text-primary">Engine</span>
          </h2>
        </div>
        
        {/* Results Badge */}
        <div className="flex items-center gap-2 px-3 py-1 bg-muted/50 border rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Showing {resultsCount} <span className="opacity-50">of</span> {totalCount} Entities
          </span>
        </div>
      </div>

      <ReusableFilter
        filters={filters}
        onFilterChange={onFilterChange}
        onClearFilters={onClearFilters}
        onExport={handleExport}
        filterConfig={filterConfig}
        title="Supplier Search"
        resultsCount={resultsCount}
        totalCount={totalCount}
        showExport={true}
        showClear={true}
        // Custom styling to match the Dashboard's Card style
        className="bg-card border rounded-2xl shadow-sm p-6"
        exportIcon={<Download className="w-4 h-4 mr-2" />}
      />
    </div>
  )
}

export default SuppliersFilter
