import React from 'react'
import { PieChart, Layers } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"
import { Progress } from "@/Components/ui/progress"
import { cn } from "@/lib/utils"

const CategoryBreakdown = ({ categoryBreakdown = [], getMarginColor, className }) => {
  // Calculate total items to determine progress bar percentages
  const totalItems = categoryBreakdown.reduce((sum, cat) => sum + cat.count, 0)

  return (
    <Card className={cn("border-border bg-card shadow-sm", className)}>
      <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center">
          <PieChart className="w-5 h-5 mr-2 text-primary" />
          Category-wise Breakdown
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryBreakdown.map((category, index) => (
            <div 
              key={index} 
              className="group relative overflow-hidden rounded-xl border border-border bg-muted/30 p-4 transition-all hover:bg-muted/50 hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-background border border-border">
                    <Layers className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <h4 className="font-semibold text-foreground tracking-tight">
                    {category.category}
                  </h4>
                </div>
                <Badge variant="secondary" className="font-mono text-[10px]">
                  {category.count} items
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Inventory Value</span>
                    <span className="font-bold text-foreground">
                      BDT {category.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <Progress 
                    value={(category.count / totalItems) * 100} 
                    className="h-1.5 bg-background" 
                  />
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-border/40">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                    Avg. Margin
                  </span>
                  <span className={cn(
                    "text-sm font-bold",
                    getMarginColor(category.marginPercentage) // Uses your existing logic for OKLCH colors
                  )}>
                    {category.marginPercentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default CategoryBreakdown
