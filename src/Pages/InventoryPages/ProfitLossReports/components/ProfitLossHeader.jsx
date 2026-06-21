import React, { useState } from 'react'
import { RefreshCw, Download, FileText } from 'lucide-react'
import { Button } from "@/Components/UI/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/UI/dropdown-menu"

const ProfitLossHeader = ({ onRefresh }) => {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await onRefresh?.()
    setTimeout(() => setIsRefreshing(false), 600)
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b pb-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-foreground">
          Profit & Loss Reports
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Analyze revenue, costs, and net profitability.
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default">
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
  )
}

export default ProfitLossHeader
