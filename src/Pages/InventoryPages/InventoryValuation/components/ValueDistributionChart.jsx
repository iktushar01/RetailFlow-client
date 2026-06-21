import React, { useMemo } from 'react'
import { TrendingUp, PieChart as PieChartIcon, Info } from 'lucide-react'
import { PieChart } from '../../../../Shared/Charts'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/UI/card'
import { Badge } from '@/Components/UI/badge'
import { cn } from '@/lib/utils'

const ValueDistributionChart = ({ valuationData = [], className }) => {
  const chartData = useMemo(() => {
    if (!valuationData || valuationData.length === 0) return []

    const categoryMap = {}
    valuationData.forEach((item) => {
      const category = item.category || 'Uncategorized'
      if (!categoryMap[category]) {
        categoryMap[category] = { totalValue: 0, itemCount: 0 }
      }
      categoryMap[category].totalValue += item.totalValue || 0
      categoryMap[category].itemCount += 1
    })

    return Object.entries(categoryMap)
      .map(([name, data]) => ({
        name,
        value: data.totalValue,
        itemCount: data.itemCount,
      }))
      .sort((a, b) => b.value - a.value)
  }, [valuationData])

  const totals = useMemo(() => {
    const value = chartData.reduce((sum, item) => sum + item.value, 0)
    const items = chartData.reduce((sum, item) => sum + item.itemCount, 0)
    return { value, items, top: chartData[0] || null }
  }, [chartData])

  return (
    <Card className={cn('border-border bg-card shadow-sm', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border/50 bg-muted/20 pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <PieChartIcon className="w-5 h-5 text-primary" />
          Value Distribution
        </CardTitle>
        <div className="flex items-center gap-2 sm:gap-3">
          <Badge variant="outline" className="bg-background font-mono text-primary border-primary/20">
            BDT {totals.value.toLocaleString()}
          </Badge>
          <Badge variant="secondary" className="hidden sm:flex">
            {totals.items} Items
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="rounded-xl border border-border bg-muted/30 p-4 mb-6">
          <PieChart
            embedded
            data={chartData}
            dataKey="value"
            nameKey="name"
            height={300}
            showLegend
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatBox
            label="Avg Value/Item"
            value={`BDT ${totals.items > 0 ? (totals.value / totals.items).toFixed(0) : 0}`}
            icon={<TrendingUp className="w-4 h-4 text-emerald-500" />}
          />
          <StatBox
            label="Top Category"
            value={totals.top?.name || 'N/A'}
            subValue={`BDT ${totals.top?.value?.toLocaleString() || 0}`}
            icon={<PieChartIcon className="w-4 h-4 text-primary" />}
          />
          <StatBox
            label="Categories"
            value={chartData.length}
            icon={<Info className="w-4 h-4 text-muted-foreground" />}
          />
        </div>
      </CardContent>
    </Card>
  )
}

const StatBox = ({ label, value, subValue, icon }) => (
  <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/50 transition-all hover:bg-muted/80">
    <div className="mt-1">{icon}</div>
    <div className="space-y-1">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground leading-none">
        {label}
      </p>
      <p className="text-sm font-bold text-foreground">{value}</p>
      {subValue && (
        <p className="text-[10px] text-muted-foreground font-medium italic">{subValue}</p>
      )}
    </div>
  </div>
)

export default ValueDistributionChart
