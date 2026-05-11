import React from 'react'
import { RefreshCw, Calendar } from 'lucide-react'
import Button from '../../../Components/UI/Button'
import TimeFilter from './TimeFilter'

const DashboardHeader = ({ 
  timeFilter, 
  setTimeFilter, 
  onRefresh, 
  onExport, 
  refreshing 
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Hello Admin, here's your business snapshot today
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of sales, inventory and activities
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Desktop Time Filter */}
        <div className="hidden sm:flex">
          <TimeFilter 
            timeFilter={timeFilter} 
            setTimeFilter={setTimeFilter} 
            size="md"
          />
        </div>
        
        {/* Mobile Time Filter */}
        <div className="sm:hidden w-full">
          <TimeFilter 
            timeFilter={timeFilter} 
            setTimeFilter={setTimeFilter} 
            isMobile={true}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            onClick={onRefresh}
            disabled={refreshing}
            loading={refreshing}
            variant="secondary"
            size="sm"
            className="flex-1 sm:flex-none"
          >
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </div>
          </Button>
          <Button
            onClick={onExport}
            variant="primary"
            size="sm"
            className="flex-1 sm:flex-none"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Export Snapshot</span>
              <span className="sm:hidden">Export</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DashboardHeader
