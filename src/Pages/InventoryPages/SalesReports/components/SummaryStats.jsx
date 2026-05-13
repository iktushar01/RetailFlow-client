import React from 'react'
import { FileText, TrendingUp, DollarSign, Target, BarChart2 } from 'lucide-react'
import StatsCard from '../../../../Shared/StatsCard/StatsCard'

const SummaryStats = ({ summary, formatCurrency }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        label="Sales Volume"
        value={summary.totalSales}
        description="Total invoices generated"
        icon={FileText}
        color="primary" // Maps to --primary
      />
      
      <StatsCard
        label="Gross Revenue"
        value={formatCurrency(summary.totalAmount)}
        description="Total value of all sales"
        icon={DollarSign}
        color="emerald" // Maps to a success/emerald shade
      />
      
      <StatsCard
        label="Net Profit"
        value={formatCurrency(summary.totalProfit)}
        description="Revenue minus cost of goods"
        icon={BarChart2}
        color="indigo" // Maps to a sophisticated data shade
      />
      
      <StatsCard
        label="Avg. Order Value"
        value={formatCurrency(summary.averageOrderValue)}
        description="Average revenue per customer"
        icon={Target}
        color="amber" // Maps to a warning/gold shade for "Average" metrics
      />
    </div>
  )
}

export default SummaryStats