import React, { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from "@/Components/UI/button"

const StockAnalysisHeader = ({ onRefresh }) => {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await onRefresh?.()
    setTimeout(() => setIsRefreshing(false), 700)
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-foreground">
          Inventory Movement
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Analyze fast-moving and slow-moving stock to optimize inventory.
        </p>
      </div>

      <Button
        variant="outline"
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="w-full sm:w-auto"
      >
        <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </div>
  )
}

export default StockAnalysisHeader
