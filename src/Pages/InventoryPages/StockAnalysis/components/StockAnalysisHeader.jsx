import React, { useState } from 'react'
import { Activity, RefreshCw, Box, Layers } from 'lucide-react'

// shadcn/ui components
import { Button } from "@/Components/ui/button"
import { Badge } from "@/Components/ui/badge"

const StockAnalysisHeader = ({ onRefresh }) => {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await onRefresh?.()
    // Smooth reset for the spinning animation
    setTimeout(() => setIsRefreshing(false), 700)
  }

  return (
    <div className="relative overflow-hidden bg-card p-6 sm:p-8 rounded-xl border border-border shadow-sm">
      {/* Subtle background texture/glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-muted/30 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
      
      <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <div className="p-2.5 bg-secondary rounded-lg shadow-inner">
              <Activity className="w-6 h-6 sm:w-7 sm:h-7 text-secondary-foreground" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Inventory Movement
            </h1>
            <Badge variant="secondary" className="hidden lg:flex gap-1.5 items-center px-2 py-0.5 font-bold uppercase tracking-wider text-[10px]">
              <Layers className="w-3 h-3" />
              Live Analytics
            </Badge>
          </div>
          
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
            Real-time analysis of <span className="text-foreground font-medium">Fast-moving</span> and 
            <span className="text-destructive font-medium ml-1">Dead Stock</span> to optimize your supply chain.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Refresh Button with dynamic animation */}
          <Button
            variant="outline"
            size="lg"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex-1 sm:flex-none border-border hover:bg-muted transition-all active:scale-95 shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin text-primary' : 'text-muted-foreground'}`} />
            <span className="text-sm font-semibold">
              {isRefreshing ? 'Syncing...' : 'Refresh Data'}
            </span>
          </Button>

          {/* Quick Action for Stock Insight */}
          <Button variant="default" className="hidden md:flex shadow-md shadow-primary/10">
            <Box className="w-4 h-4 mr-2" />
            Stock Reports
          </Button>
        </div>
      </div>
    </div>
  )
}

export default StockAnalysisHeader
