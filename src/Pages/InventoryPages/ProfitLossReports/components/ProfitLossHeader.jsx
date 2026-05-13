import React, { useState } from 'react'
import { PieChart, RefreshCw, Download, FileText } from 'lucide-react'

// shadcn/ui components
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const ProfitLossHeader = ({ onRefresh }) => {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await onRefresh?.()
    // Small timeout to make the animation feel substantial
    setTimeout(() => setIsRefreshing(false), 600)
  }

  return (
    <div className="relative overflow-hidden bg-card p-6 sm:p-8 rounded-xl border border-border shadow-sm">
      {/* Decorative background gradient accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
      
      <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-lg">
              <PieChart className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Profit & Loss Reports
            </h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md">
            Analyze your revenue streams, operational costs, and net profitability 
            across your business period.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Refresh Button with animation */}
          <Button
            variant="outline"
            size="default"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex-1 sm:flex-none shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Update Data</span>
            <span className="sm:hidden">Refresh</span>
          </Button>

          {/* Added an Export Dropdown for better UX */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" className="flex-1 sm:flex-none shadow-md shadow-primary/20">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Download Format</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <FileText className="w-4 h-4 mr-2" /> PDF Report
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Download className="w-4 h-4 mr-2" /> Excel Spreadsheet
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

export default ProfitLossHeader