import React from 'react'
import { PieChart, ArrowRight, Wallet } from 'lucide-react'

// shadcn/ui components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/UI/card"
import { Progress } from "@/Components/UI/progress"
import { Badge } from "@/Components/UI/badge"

const ExpenseBreakdown = ({ expenseBreakdown = [], formatCurrency }) => {
  // Calculate total to determine percentage for progress bars
  const totalExpenses = expenseBreakdown.reduce((sum, item) => sum + item.amount, 0)

  return (
    <Card className="shadow-sm border-border bg-card h-full animate-in fade-in duration-700">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Expense Breakdown
            </CardTitle>
            <CardDescription>Categorized spending for this period</CardDescription>
          </div>
          <Badge variant="outline" className="bg-muted/50 font-mono">
            {expenseBreakdown.length} Categories
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {expenseBreakdown.length > 0 ? (
            expenseBreakdown.map((expense, index) => {
              const percentage = totalExpenses > 0 
                ? (expense.amount / totalExpenses) * 100 
                : 0

              return (
                <div key={index} className="space-y-2 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Color indicator with pulse effect on hover */}
                      <div 
                        className={`w-3 h-3 rounded-full ${expense.color} ring-offset-2 group-hover:ring-2 transition-all duration-300`} 
                        style={{ backgroundColor: expense.color.includes('#') ? expense.color : undefined }}
                      />
                      <span className="text-sm font-semibold text-foreground tracking-tight">
                        {expense.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground font-medium">
                        {percentage.toFixed(1)}%
                      </span>
                      <span className="text-sm font-bold text-foreground">
                        {formatCurrency(expense.amount)}
                      </span>
                    </div>
                  </div>

                  {/* Visual progress bar */}
                  <Progress 
                    value={percentage} 
                    className="h-1.5" 
                    // Note: In shadcn/ui, the indicator color is typically controlled via CSS. 
                    // For dynamic colors, you might need an inline style or custom variant.
                  />
                </div>
              )
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
              <div className="p-3 bg-muted rounded-full">
                <Wallet className="w-6 h-6 text-muted-foreground/50" />
              </div>
              <p className="text-sm text-muted-foreground">No expense data recorded.</p>
            </div>
          )}
        </div>

        {/* Summary Footer */}
        {totalExpenses > 0 && (
          <div className="mt-8 pt-6 border-t border-dashed border-border flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Total Outflow
            </span>
            <div className="flex items-center gap-2 text-destructive font-bold">
              <ArrowRight className="w-4 h-4" />
              <span className="text-lg">{formatCurrency(totalExpenses)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ExpenseBreakdown

