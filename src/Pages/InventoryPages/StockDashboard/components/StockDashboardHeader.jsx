import React from 'react'
import { BarChart3, RefreshCw } from 'lucide-react'
import { Button } from "@/Components/ui/button"
import { Card, CardHeader } from "@/Components/ui/card"

const StockDashboardHeader = ({ onRefresh }) => {
  return (
    <Card className="bg-gradient-to-r from-background via-muted/30 to-background border-border shadow-sm">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center">
              <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-primary" />
              Real-time Stock Dashboard
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Monitor warehouse stock in real-time with live updates
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">Refresh</span>
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}

export default StockDashboardHeader
