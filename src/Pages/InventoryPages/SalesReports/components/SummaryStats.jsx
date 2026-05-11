import React from 'react'
import { FileText, TrendingUp, Users } from 'lucide-react'
import StatsCard from '../../../../Shared/StatsCard/StatsCard'

const SummaryStats = ({ summary, formatCurrency }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        label="Total Sales"
        value={summary.totalSales}
        icon={FileText}
        color="blue"
      />
      <StatsCard
        label="Total Amount"
        value={formatCurrency(summary.totalAmount)}
        icon={TrendingUp}
        color="green"
      />
      <StatsCard
        label="Total Profit"
        value={formatCurrency(summary.totalProfit)}
        icon={TrendingUp}
        color="purple"
      />
      <StatsCard
        label="Avg Order Value"
        value={formatCurrency(summary.averageOrderValue)}
        icon={Users}
        color="yellow"
      />
    </div>
  )
}

export default SummaryStats
