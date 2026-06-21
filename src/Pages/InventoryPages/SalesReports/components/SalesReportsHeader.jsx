import React from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/Components/UI/button'

const SalesReportsHeader = ({ onRefresh, isRefreshing = false }) => {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b pb-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-foreground">
          Sales Reports
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          View revenue, product performance, and sales trends.
        </p>
      </div>

      <Button
        variant="outline"
        onClick={onRefresh}
        disabled={isRefreshing}
        className="w-full sm:w-auto"
      >
        <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
        {isRefreshing ? 'Updating...' : 'Refresh'}
      </Button>
    </div>
  )
}

export default SalesReportsHeader
