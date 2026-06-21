import React, { useMemo } from 'react'
import { TrendingUp, PieChart as PieChartIcon, Calendar } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/Components/UI/card'
import { Badge } from '@/Components/UI/badge'
import { Separator } from '@/Components/UI/separator'
import { LineChart, PieChart } from '../../../../Shared/Charts'

const ChartsPlaceholder = ({ monthlyBreakdown = [], expenseBreakdown = [] }) => {
  const profitTrendData = useMemo(() => {
    if (!monthlyBreakdown || monthlyBreakdown.length === 0) return []

    return monthlyBreakdown.map((month) => ({
      month: month.monthName,
      profit: month.profit,
      sales: month.sales,
      expenses: month.expenses,
    }))
  }, [monthlyBreakdown])

  const expenseData = useMemo(() => {
    if (!expenseBreakdown || expenseBreakdown.length === 0) return []

    return expenseBreakdown
      .map((expense) => ({
        name: expense.category,
        value: expense.amount,
      }))
      .filter((expense) => expense.value > 0)
  }, [expenseBreakdown])

  const totalProfit = useMemo(
    () => profitTrendData.reduce((sum, m) => sum + m.profit, 0),
    [profitTrendData]
  )
  const totalExpenses = useMemo(
    () => expenseData.reduce((sum, e) => sum + e.value, 0),
    [expenseData]
  )
  const profitableMonths = useMemo(
    () => profitTrendData.filter((m) => m.profit > 0).length,
    [profitTrendData]
  )

  const bestMonth = useMemo(() => {
    return profitTrendData.reduce(
      (best, m) => (m.profit > best.profit ? m : best),
      profitTrendData[0] || { month: 'N/A', profit: 0 }
    )
  }, [profitTrendData])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="shadow-sm border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div className="space-y-1">
            <CardTitle className="text-xl flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Profit Trend
            </CardTitle>
            <CardDescription>Monthly financial performance overview</CardDescription>
          </div>
          <Badge variant="outline" className="font-mono px-2 py-1">
            {profitableMonths}/{profitTrendData.length || 12} Profitable
          </Badge>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-2 bg-muted/40 p-3 rounded-lg border border-dashed">
            <div className="text-center md:text-left">
              <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Total Profit</p>
              <p className={`text-sm font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                ৳{totalProfit.toLocaleString()}
              </p>
            </div>
            <div className="text-center border-x border-border/50">
              <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Best Period</p>
              <p className="text-sm font-bold text-primary flex items-center justify-center gap-1">
                <Calendar className="w-3 h-3" /> {bestMonth.month}
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Peak Profit</p>
              <p className="text-sm font-bold text-orange-500">৳{bestMonth.profit.toLocaleString()}</p>
            </div>
          </div>

          <div className="h-[280px] w-full mt-2">
            <LineChart
              embedded
              data={profitTrendData}
              lines={[
                { dataKey: 'profit', stroke: 'hsl(var(--chart-1))', name: 'Net Profit', strokeWidth: 3 },
                { dataKey: 'sales', stroke: 'hsl(var(--chart-2))', name: 'Sales', strokeWidth: 2 },
                { dataKey: 'expenses', stroke: 'hsl(var(--chart-4))', name: 'Expenses', strokeWidth: 2 },
              ]}
              xAxisKey="month"
              height={280}
              showGrid
              showLegend
              dot
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div className="space-y-1">
            <CardTitle className="text-xl flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-primary" />
              Expense Distribution
            </CardTitle>
            <CardDescription>Breakdown by spending category</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Total Outflow</p>
            <p className="text-sm font-bold text-destructive">৳{totalExpenses.toLocaleString()}</p>
          </div>
        </CardHeader>

        <CardContent>
          <div className="h-[280px] w-full flex items-center justify-center">
            <PieChart
              embedded
              data={expenseData}
              dataKey="value"
              nameKey="name"
              height={280}
              showLegend={false}
            />
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {expenseData.length > 0 ? (
              expenseData.map((expense, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: `hsl(var(--chart-${(index % 5) + 1}))` }}
                    />
                    <span className="text-xs text-muted-foreground truncate">{expense.name}</span>
                  </div>
                  <span className="text-xs font-mono font-bold">৳{expense.value.toLocaleString()}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground col-span-full text-center py-4">
                No expense data available
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ChartsPlaceholder
