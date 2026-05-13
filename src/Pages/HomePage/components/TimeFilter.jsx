import React from 'react'
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const TimeFilter = ({ timeFilter, setTimeFilter, className, size = 'sm' }) => {
  const options = [
    { label: 'Today', value: 'today' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' }
  ]

  return (
    <Tabs 
      value={timeFilter} 
      onValueChange={setTimeFilter} 
      // Responsive width: full on mobile, auto on sm screens up
      className={cn("w-full sm:w-fit", className)}
    >
      <TabsList className={cn(
        // Use flex instead of grid for more natural spacing
        // Glassmorphism and standard Shadcn muted styling
        "inline-flex w-full items-center justify-center rounded-full border border-border bg-muted/50 p-1 backdrop-blur-md",
        size === 'sm' ? "h-9" : "h-11"
      )}>
        {options.map((option) => (
          <TabsTrigger
            key={option.value}
            value={option.value}
            className={cn(
              "flex-1 sm:flex-none rounded-full transition-all duration-200",
              // Semantic states
              "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
              "text-muted-foreground hover:text-foreground",
              // Sizing logic
              size === 'sm' 
                ? "px-3 py-1 text-xs font-medium min-w-[70px]" 
                : "px-6 py-1.5 text-sm font-semibold min-w-[90px]"
            )}
          >
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

export default TimeFilter