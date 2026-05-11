import React from 'react'
import { DollarSign, Package, TrendingUp, PieChart } from 'lucide-react'
import StatsCard from '../../../../Shared/StatsCard/StatsCard'

const SummaryStats = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        label="Total Stock Value"
        value={`BDT ${summary.totalValue.toFixed(2)}`}
        icon={DollarSign}
        color="green"
      />
      <StatsCard
        label="Total Items"
        value={summary.totalItems}
        icon={Package}
        color="blue"
      />
      <StatsCard
        label="Average Margin"
        value={`${summary.averageMargin.toFixed(1)}%`}
        icon={TrendingUp}
        color="purple"
      />
      <StatsCard
        label="Categories"
        value={summary.categoryBreakdown.length}
        icon={PieChart}
        color="yellow"
      />
    </div>
  )
}

export default SummaryStats
