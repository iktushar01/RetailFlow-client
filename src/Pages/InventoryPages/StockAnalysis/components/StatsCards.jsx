import React from 'react'
import { TrendingUp, TrendingDown, AlertTriangle, Activity } from 'lucide-react'
import StatsCard from '../../../../Shared/StatsCard/StatsCard'

const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        label="Fast Moving"
        value={stats.fastMoving}
        icon={TrendingUp}
        color="green"
      />
      <StatsCard
        label="Slow Moving"
        value={stats.slowMoving}
        icon={TrendingDown}
        color="yellow"
      />
      <StatsCard
        label="Dead Stock"
        value={stats.deadStock}
        icon={AlertTriangle}
        color="red"
      />
      <StatsCard
        label="Total Products"
        value={stats.totalProducts}
        icon={Activity}
        color="blue"
      />
    </div>
  )
}

export default StatsCards
