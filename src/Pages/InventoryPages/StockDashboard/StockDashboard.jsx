import React from 'react'
import { BarChart3 } from 'lucide-react'
import InfoCard from '../../../Shared/InfoCard/InfoCard'
import { ReusableFilter } from '../../../Shared/ReusableFilter/ReusableFilter'
import { InventoryLoading } from '../../../Components/UI/LoadingAnimation'
import { 
  StockDashboardHeader, 
  StatsCards, 
  StockTable, 
  ProductStockChart 
} from './components'
import { useStockDashboard } from './hooks'

const StockDashboard = () => {
  const {
    // State
    inventory,
    loading,
    filters,
    stats,
    filteredInventory,
    filterConfig,
    
    // Actions
    fetchData,
    handleFilterChange,
    handleClearFilters,
    handleExport,
    
    // Utilities
    getStockStatus,
    getStatusIcon
  } = useStockDashboard()

  if (loading) {
    return <InventoryLoading message="Loading stock data..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <StockDashboardHeader onRefresh={fetchData} />

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Info Card */}
      <InfoCard
        type="info"
        title="Live Stock Monitoring"
        message="This dashboard shows real-time inventory levels across all warehouses. Use the filters to focus on specific products, locations, or stock status. Green indicates healthy stock levels, yellow shows low stock, and red indicates out of stock items."
        icon={BarChart3}
      />

      {/* Filters */}
      <ReusableFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onExport={handleExport}
        filterConfig={filterConfig}
        title="Stock Filters"
        resultsCount={filteredInventory.length}
        totalCount={inventory.length}
      />

      {/* Stock Table */}
      <StockTable
        stockData={filteredInventory}
        loading={loading}
        getStockStatus={getStockStatus}
        getStatusIcon={getStatusIcon}
      />

      {/* Product Stock Chart */}
      <ProductStockChart inventory={filteredInventory} />
    </div>
  )
}

export default StockDashboard
