import React from 'react'
import { RotateCcw, CheckCircle, RefreshCw } from 'lucide-react'
import { Button } from "@/Components/UI/button"
import { Card, CardContent } from "@/Components/UI/card"

const AutoReorderHeader = ({ onGenerateAll, onRefresh, hasSuggestions }) => {
  return (
    <Card className="relative overflow-hidden border-border bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 shadow-md">
      {/* Subtle background decoration using theme variables */}
      <div className="pointer-events-none absolute right-0 top-0 -mr-4 -mt-4 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
      
      <CardContent className="p-4 sm:p-6">
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 sm:gap-3">
              <RotateCcw className="h-6 w-6 text-primary sm:h-8 sm:w-8" />
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Auto Reorder Suggestions
              </h1>
            </div>
            <p className="text-sm text-muted-foreground sm:text-base">
              AI-powered suggestions for optimal inventory management
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <Button
              variant="default"
              size="default"
              onClick={onGenerateAll}
              disabled={!hasSuggestions}
              className="h-10 w-full px-4 sm:w-auto"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              <span className="text-sm sm:text-base">Generate All</span>
            </Button>
            
            <Button
              variant="outline"
              size="default"
              onClick={onRefresh}
              className="h-10 w-full border-border bg-background/50 px-4 backdrop-blur-sm sm:w-auto hover:bg-accent"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              <span className="text-sm sm:text-base">Refresh</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default AutoReorderHeader

