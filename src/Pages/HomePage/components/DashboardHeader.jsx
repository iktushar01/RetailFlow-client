import React from 'react'
import { RefreshCw, Download, Loader2, LayoutDashboard } from 'lucide-react'
import { Button } from "@/Components/ui/button"
import { Separator } from "@/Components/ui/separator"
import TimeFilter from './TimeFilter'
import { cn } from "@/lib/utils"

const DashboardHeader = ({ 
  timeFilter, 
  setTimeFilter, 
  onRefresh, 
  onExport, 
  refreshing 
}) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Upper Meta Section (Optional but looks Pro) */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <LayoutDashboard className="h-4 w-4" />
        <span>Dashboard</span>
        <span>/</span>
        <span className="text-foreground font-medium capitalize">{timeFilter} Overview</span>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Header Text Section */}
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
            Business Snapshot
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Real-time analytics for your sales and inventory performance.
          </p>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          
          {/* Time Filter - Now naturally responsive */}
          <TimeFilter 
            timeFilter={timeFilter} 
            setTimeFilter={setTimeFilter} 
            size="md"
          />

          {/* Action Buttons Group */}
          <div className="flex items-center gap-2">
            <Button
              onClick={onRefresh}
              disabled={refreshing}
              variant="outline"
              size="default"
              className={cn(
                "flex-1 sm:w-[120px] transition-all",
                refreshing && "opacity-80"
              )}
            >
              {refreshing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              {refreshing ? 'Updating' : 'Refresh'}
            </Button>

            <Button
              onClick={onExport}
              variant="default"
              size="default"
              className="flex-1 sm:flex-none shadow-md hover:shadow-lg transition-all"
            >
              <Download className="mr-2 h-4 w-4" />
              <span>Export</span>
              <span className="hidden xl:inline ml-1">Report</span>
            </Button>
          </div>
        </div>
      </div>
      
      <Separator className="opacity-50" />
    </div>
  )
}

export default DashboardHeader
