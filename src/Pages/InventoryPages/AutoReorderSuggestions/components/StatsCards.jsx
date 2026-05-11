import React from 'react'
import { Package, TrendingUp } from 'lucide-react'
import StatsCard from '../../../../Shared/StatsCard/StatsCard'

const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        label="Total Suggestions"
        value={stats.totalSuggestions}
        icon={Package}
        color="purple"
      />
      <StatsCard
        label="High Priority"
        value={stats.highPriority}
        icon={TrendingUp}
        color="red"
      />
      <StatsCard
        label="Medium Priority"
        value={stats.mediumPriority}
        icon={TrendingUp}
        color="yellow"
      />
      <StatsCard
        label="Low Priority"
        value={stats.lowPriority}
        icon={TrendingUp}
        color="green"
      />
    </div>
  )
}

export default StatsCards
