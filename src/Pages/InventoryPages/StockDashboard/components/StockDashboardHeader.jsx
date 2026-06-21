import React from 'react'
import { BarChart3, RefreshCw } from 'lucide-react'
import { Button } from "@/Components/UI/button"

const StockDashboardHeader = ({ onRefresh }) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-foreground">
          Stock Dashboard
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Monitor warehouse stock levels in real time.
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onRefresh}>
        <RefreshCw className="w-4 h-4 mr-2" />
        Refresh
      </Button>
    </div>
  )
}

export default StockDashboardHeader
