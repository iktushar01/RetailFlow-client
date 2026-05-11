import React from 'react'
import { Package, TrendingUp, AlertTriangle } from 'lucide-react'
import StatsCard from '../../../../Shared/StatsCard/StatsCard'

const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        label="Total Products in Stock"
        value={stats.totalProducts}
        icon={Package}
        color="blue"
      />
      <StatsCard
        label="Total Stock Value"
        value={`BDT ${stats.totalValue}`}
        icon={TrendingUp}
        color="green"
      />
      <StatsCard
        label="Fast-moving Products"
        value={stats.fastMoving}
        icon={TrendingUp}
        color="purple"
      />
      <StatsCard
        label="Low Stock Count"
        value={stats.lowStock}
        icon={AlertTriangle}
        color="red"
      />
    </div>
  )
}

export default StatsCards
