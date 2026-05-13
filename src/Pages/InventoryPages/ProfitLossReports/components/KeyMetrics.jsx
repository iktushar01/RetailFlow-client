import React from 'react'
import { PieChart, TrendingDown, BarChart3, ArrowUpRight, Wallet, Calendar } from 'lucide-react'

// shadcn/ui components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const KeyMetrics = ({ summary, filters, formatCurrency, formatPercentage, getProfitColor }) => {
  // Format the date for the period card
  const periodDate = new Date(filters.year, filters.month - 1).toLocaleString('default', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2 duration-500">
      
      {/* Profit Margin Card */}
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 border-border bg-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Profit Margin
              </p>
              <div className="flex items-baseline gap-2">
                <p className={`text-3xl font-bold tracking-tight ${getProfitColor(summary.profitMargin)}`}>
                  {formatPercentage(summary.profitMargin)}
                </p>
                <ArrowUpRight className={`w-4 h-4 ${summary.profitMargin >= 0 ? 'text-green-500' : 'text-destructive'}`} />
              </div>
            </div>
            <div className="p-3 bg-primary/10 rounded-xl">
              <PieChart className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="mt-4">
            <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${summary.profitMargin >= 0 ? 'bg-primary' : 'bg-destructive'}`} 
                style={{ width: `${Math.min(Math.max(summary.profitMargin, 0), 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Expenses Card */}
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 border-border bg-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Total Expenses
              </p>
              <p className="text-3xl font-bold tracking-tight text-foreground">
                {formatCurrency(summary.totalExpenses)}
              </p>
            </div>
            <div className="p-3 bg-destructive/10 rounded-xl">
              <Wallet className="w-6 h-6 text-destructive" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-mono py-0 text-destructive border-destructive/20">
              <TrendingDown className="w-3 h-3 mr-1" />
              Outflow
            </Badge>
            <span className="text-[10px] text-muted-foreground italic">Based on current period</span>
          </div>
        </CardContent>
      </Card>

      {/* Period Card */}
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 border-border bg-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Reporting Period
              </p>
              <p className="text-2xl font-bold tracking-tight text-foreground truncate max-w-[180px]">
                {periodDate}
              </p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-5 flex items-center gap-1.5">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-5 h-5 rounded-full border-2 border-card bg-muted flex items-center justify-center">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                </div>
              ))}
            </div>
            <span className="text-[10px] font-medium text-muted-foreground">Year-to-date Analytics</span>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}

export default KeyMetrics