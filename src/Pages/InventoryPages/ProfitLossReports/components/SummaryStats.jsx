import React from 'react'
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import StatsCard from '../../../../Shared/StatsCard/StatsCard'

const SummaryStats = ({ summary, formatCurrency, getProfitIcon }) => {
  const ProfitIcon = getProfitIcon(summary.netProfit)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        label="Total Sales"
        value={formatCurrency(summary.totalSales)}
        icon={DollarSign}
        color="blue"
      />
      <StatsCard
        label="Total COGS"
        value={formatCurrency(summary.totalCOGS)}
        icon={TrendingDown}
        color="red"
      />
      <StatsCard
        label="Gross Profit"
        value={formatCurrency(summary.grossProfit)}
        icon={TrendingUp}
        color="green"
      />
      <StatsCard
        label="Net Profit"
        value={formatCurrency(summary.netProfit)}
        icon={ProfitIcon}
        color={summary.netProfit >= 0 ? 'green' : 'red'}
      />
    </div>
  )
}

export default SummaryStats
