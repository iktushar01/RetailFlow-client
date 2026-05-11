import React from 'react'
import { Activity } from 'lucide-react'
import InfoCard from '../../../Shared/InfoCard/InfoCard'
import { ReusableFilter } from '../../../Shared/ReusableFilter/ReusableFilter'
import { ChartLoading } from '../../../Components/UI/LoadingAnimation'
import { 
  StockAnalysisHeader, 
  StatsCards, 
  AnalysisTabs, 
  AnalysisTable, 
  ChartsPlaceholder as StockAnalysisCharts, 
  Recommendations 
} from './components'
import { useStockAnalysis } from './hooks'

const StockAnalysis = () => {
  const {
    // State
    loading,
    stats,
    activeTab,
    filters,
    filterConfig,
    filteredData,
    tabs,
    
    // Actions
    fetchData,
    handleFilterChange,
    handleClearFilters,
    handleExport,
    handleTabChange
  } = useStockAnalysis()

  if (loading) {
    return <ChartLoading message="Analyzing stock movement..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <StockAnalysisHeader onRefresh={fetchData} />

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Info Card */}
      <InfoCard
        type="info"
        title="Stock Movement Analysis"
        message="This analysis helps you identify which products are selling well (fast-moving), which need attention (slow-moving), and which are not selling at all (dead stock). Use this data to optimize your inventory, pricing, and marketing strategies."
        icon={Activity}
      />

      {/* Tabs */}
      <AnalysisTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Filters */}
      <ReusableFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onExport={handleExport}
        filterConfig={filterConfig}
        title="Analysis Filters"
        resultsCount={filteredData.length}
        totalCount={filteredData.length}
      />

      {/* Analysis Table */}
      <AnalysisTable
        analysisData={filteredData}
        loading={loading}
      />

      {/* Charts with Real Data */}
      <StockAnalysisCharts analysisData={filteredData} />

      {/* Recommendations */}
      <Recommendations />
    </div>
  )
}

export default StockAnalysis
