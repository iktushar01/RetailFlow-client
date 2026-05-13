import React from 'react'
import { Calculator, RefreshCw } from 'lucide-react'
import { Button } from "@/Components/UI/button"
import { Card, CardContent } from "@/Components/UI/card"
import { cn } from "@/lib/utils"

const InventoryValuationHeader = ({ onRefresh, className }) => {
  return (
    <Card className={cn(
      "relative overflow-hidden border-border bg-gradient-to-r from-emerald-500/5 via-primary/5 to-background shadow-md",
      className
    )}>
      {/* Visual accent decoration consistent with other headers */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <CardContent className="p-4 sm:p-6 relative z-10">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Calculator className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Inventory Valuation
              </h1>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground ml-1">
              Track total stock value and cost-based valuation
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="default"
              onClick={onRefresh}
              className="w-full sm:w-auto h-10 px-4 bg-background/50 backdrop-blur-sm border-border hover:bg-accent hover:text-accent-foreground"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Refresh</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default InventoryValuationHeader

