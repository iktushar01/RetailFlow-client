import React from 'react'
import { PieChart } from 'lucide-react'
import InfoCard from '../../../Shared/InfoCard/InfoCard'
import { ReusableFilter } from '../../../Shared/ReusableFilter/ReusableFilter'
import { ReportLoading } from '../../../Components/UI/LoadingAnimation'
import { 
  ProfitLossHeader, 
  SummaryStats, 
  KeyMetrics, 
  ExpenseBreakdown, 
  MonthlyBreakdownTable, 
  ChartsPlaceholder 
} from './components'
import { useProfitLoss } from './hooks'

const ProfitLossReports = () => {
  const {
    // State
    loading,
    summary,
    filters,
    filterConfig,
    
    // Actions
    fetchData,
    handleFilterChange,
    handleClearFilters,
    handleExport,
    
    // Utilities
    formatCurrency,
    formatPercentage,
    getProfitColor,
    getProfitIcon
  } = useProfitLoss()

  if (loading) {
    return <ReportLoading message="Calculating profit & loss..." />
  }

  const ProfitIcon = getProfitIcon(summary.netProfit)

  return (
    <div className="space-y-6">
      {/* Header */}
      <ProfitLossHeader onRefresh={fetchData} />

      {/* P&L Summary Cards */}
      <SummaryStats
        summary={summary}
        formatCurrency={formatCurrency}
        getProfitIcon={getProfitIcon}
      />

      {/* Key Metrics */}
      <KeyMetrics
        summary={summary}
        filters={filters}
        formatCurrency={formatCurrency}
        formatPercentage={formatPercentage}
        getProfitColor={getProfitColor}
      />

      {/* Info Card */}
      <InfoCard
        type={summary.netProfit >= 0 ? 'success' : 'warning'}
        title="Profit & Loss Analysis"
        message={`Your business ${summary.netProfit >= 0 ? 'is profitable' : 'is experiencing losses'} for ${new Date(filters.year, filters.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}. ${summary.netProfit >= 0 ? 'Continue monitoring expenses and optimizing sales strategies.' : 'Consider reviewing expenses and pricing strategies to improve profitability.'}`}
        icon={ProfitIcon}
      />

      {/* Expense Breakdown */}
      <ExpenseBreakdown
        expenseBreakdown={summary.expenseBreakdown}
        formatCurrency={formatCurrency}
      />

      {/* Filters */}
      <ReusableFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onExport={handleExport}
        filterConfig={filterConfig}
        title="P&L Filters"
        resultsCount={1}
        totalCount={1}
      />

      {/* Monthly Breakdown Table */}
      <MonthlyBreakdownTable
        monthlyBreakdown={summary.monthlyBreakdown}
        loading={loading}
        filters={filters}
        formatCurrency={formatCurrency}
        getProfitColor={getProfitColor}
        getProfitIcon={getProfitIcon}
      />

      {/* Charts */}
      <ChartsPlaceholder 
        monthlyBreakdown={summary.monthlyBreakdown}
        expenseBreakdown={summary.expenseBreakdown}
      />
    </div>
  )
}

export default ProfitLossReports
