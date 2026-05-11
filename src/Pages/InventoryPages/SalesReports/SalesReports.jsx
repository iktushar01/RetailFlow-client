import React from 'react'
import { TrendingUp } from 'lucide-react'
import InfoCard from '../../../Shared/InfoCard/InfoCard'
import { ReusableFilter } from '../../../Shared/ReusableFilter/ReusableFilter'
import { ReportLoading } from '../../../Components/UI/LoadingAnimation'
import { 
  SalesReportsHeader, 
  SummaryStats, 
  TopProducts, 
  SalesTrendChart, 
  SalesTable 
} from './components'
import { useSalesReports } from './hooks'

const SalesReports = () => {
  const {
    // State
    loading,
    summary,
    filters,
    filterConfig,
    filteredSales,
    products,
    
    // Actions
    fetchData,
    handleFilterChange,
    handleClearFilters,
    handleExport,
    
    // Utilities
    formatCurrency,
    formatDate,
    formatDateTime
  } = useSalesReports()

  if (loading) {
    return <ReportLoading message="Loading sales reports..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <SalesReportsHeader onRefresh={fetchData} />

      {/* Summary Stats */}
      <SummaryStats
        summary={summary}
        formatCurrency={formatCurrency}
      />

      {/* Info Card */}
      <InfoCard
        type="info"
        title="Sales Analytics Dashboard"
        message="Analyze your sales performance with detailed reports. Use date filters to focus on specific periods, and track profit margins to optimize your pricing strategy. Monitor top-selling products to identify trends."
        icon={TrendingUp}
      />

      {/* Top Products */}
      <TopProducts
        topProducts={summary.topProducts}
        formatCurrency={formatCurrency}
      />

      {/* Sales Trend Chart */}
      <SalesTrendChart salesData={filteredSales} analyticsData={summary.salesTrend} />

      {/* Filters */}
      <ReusableFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onExport={handleExport}
        filterConfig={filterConfig}
        title="Sales Filters"
        resultsCount={filteredSales.length}
        totalCount={filteredSales.length}
      />

      {/* Sales Table */}
      <SalesTable
        salesData={filteredSales}
        loading={loading}
        products={products}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        formatDateTime={formatDateTime}
      />
    </div>
  )
}

export default SalesReports
