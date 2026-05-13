import React from 'react'
import { TrendingUp, RefreshCw, LayoutDashboard } from 'lucide-react'
import { Button } from '@/Components/UI/button' // Adjusted to standard shadcn path

const SalesReportsHeader = ({ onRefresh, isRefreshing = false }) => {
  return (
    <div className="relative overflow-hidden bg-card p-6 sm:p-8 rounded-xl shadow-sm border border-border">
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Analytics Dashboard</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center">
            <div className="p-2 bg-primary/10 rounded-lg mr-3">
              <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
            </div>
            Sales Reports
          </h1>
          
          <p className="text-sm sm:text-base text-muted-foreground max-w-md">
            Monitor real-time revenue streams, product performance, and market velocity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="w-full sm:w-auto font-semibold shadow-sm hover:bg-accent group"
          >
            <RefreshCw className={`w-4 h-4 mr-2 transition-transform duration-500 ${isRefreshing ? 'animate-spin' : 'group-active:rotate-180'}`} />
            {isRefreshing ? 'Updating...' : 'Refresh Data'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SalesReportsHeader

