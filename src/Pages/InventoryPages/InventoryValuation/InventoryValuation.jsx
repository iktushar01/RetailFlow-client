import React from 'react'
import { Calculator } from 'lucide-react'
import InfoCard from '../../../Shared/InfoCard/InfoCard'
import { ReusableFilter } from '../../../Shared/ReusableFilter/ReusableFilter'
import { ChartLoading } from '../../../Components/UI/LoadingAnimation'
import { 
  InventoryValuationHeader, 
  SummaryStats, 
  CategoryBreakdown, 
  ValuationTable, 
  ValueDistributionChart 
} from './components'
import { useInventoryValuation } from './hooks'

const InventoryValuation = () => {
  const {
    // State
    loading,
    summary,
    filteredValuation,
    filterConfig,
    filters,
    
    // Actions
    fetchData,
    handleFilterChange,
    handleClearFilters,
    handleExport,
    getMarginColor,
    getValueRange
  } = useInventoryValuation()

  if (loading) {
    return <ChartLoading message="Calculating inventory valuation..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <InventoryValuationHeader onRefresh={fetchData} />

      {/* Summary Stats */}
      <SummaryStats summary={summary} />

      {/* Info Card */}
      <InfoCard
        type="info"
        title="Inventory Valuation Analysis"
        message="This report shows the current value of your inventory based on cost prices. Monitor margin percentages to identify high-value items and optimize your pricing strategy. Green margins indicate healthy profitability."
        icon={Calculator}
      />

      {/* Category Breakdown */}
      <CategoryBreakdown
        categoryBreakdown={summary.categoryBreakdown}
        getMarginColor={getMarginColor}
      />

      {/* Filters */}
      <ReusableFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onExport={handleExport}
        filterConfig={filterConfig}
        title="Valuation Filters"
        resultsCount={filteredValuation.length}
        totalCount={filteredValuation.length}
      />

      {/* Valuation Table */}
      <ValuationTable
        valuationData={filteredValuation}
        loading={loading}
        getMarginColor={getMarginColor}
        getValueRange={getValueRange}
      />

      {/* Value Distribution Chart */}
      <ValueDistributionChart valuationData={filteredValuation} />
    </div>
  )
}

export default InventoryValuation
