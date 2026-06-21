import React, { useMemo } from 'react'
import { TrendingUp, PieChart as PieChartIcon, Inbox } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/Components/UI/card'
import { LineChart, PieChart } from '../../../../Shared/Charts'

const ChartsPlaceholder = ({ analysisData = [] }) => {
  const top10Products = useMemo(() => {
    return analysisData
      .slice()
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 10)
      .map((item) => ({
        name: item.productName?.slice(0, 15) || 'Unknown',
        value: item.totalSold,
      }))
  }, [analysisData])

  const movementDistribution = useMemo(() => {
    const fastMoving = analysisData.filter((item) => item.movementCategory === 'fast-moving').length
    const slowMoving = analysisData.filter((item) => item.movementCategory === 'slow-moving').length
    const deadStock = analysisData.filter((item) => item.movementCategory === 'dead-stock').length

    return [
      { name: 'Fast Moving', value: fastMoving },
      { name: 'Slow Moving', value: slowMoving },
      { name: 'Dead Stock', value: deadStock },
    ].filter((item) => item.value > 0)
  }, [analysisData])

  const categoryPerformance = useMemo(() => {
    const categoryMap = {}
    analysisData.forEach((item) => {
      const category = item.category || 'Uncategorized'
      categoryMap[category] = (categoryMap[category] || 0) + item.totalSold
    })

    return Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [analysisData])

  const velocityData = useMemo(() => {
    return analysisData
      .slice()
      .sort((a, b) => b.velocity - a.velocity)
      .slice(0, 10)
      .map((item) => ({
        name: item.productName?.slice(0, 15) || 'Unknown',
        velocity: parseFloat(item.velocity.toFixed(2)),
      }))
  }, [analysisData])

  if (!analysisData || analysisData.length === 0) {
    return (
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
            Product Analysis Charts
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-20 text-center">
          <div className="p-4 bg-muted rounded-full mb-4">
            <Inbox className="w-10 h-10 text-muted-foreground/40" />
          </div>
          <h4 className="text-foreground font-semibold">No analytics data available</h4>
          <p className="text-sm text-muted-foreground max-w-xs">
            Visual reports will be generated once inventory movement is recorded.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <Card className="border-border bg-card shadow-sm overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Sales Volume Leaderboard
          </CardTitle>
          <CardDescription>Top 10 performing products by total units sold</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <LineChart
            embedded
            data={top10Products}
            lines={[{ dataKey: 'value', stroke: 'hsl(var(--chart-1))', name: 'Units Sold' }]}
            xAxisKey="name"
            height={300}
            showGrid
            showLegend={false}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-primary" />
              Inventory Health
            </CardTitle>
            <CardDescription>Ratio of moving vs. stagnant stock</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <PieChart
              embedded
              data={movementDistribution}
              height={300}
              showLegend
              dataKey="value"
              nameKey="name"
            />
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-primary" />
              Category Performance
            </CardTitle>
            <CardDescription>Sales contribution by product category</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <PieChart
              embedded
              data={categoryPerformance}
              height={300}
              showLegend
              dataKey="value"
              nameKey="name"
            />
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card shadow-sm border-l-4 border-l-primary">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Sales Velocity
          </CardTitle>
          <CardDescription>Average units sold per day (Momentum Analysis)</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <LineChart
            embedded
            data={velocityData}
            lines={[{ dataKey: 'velocity', stroke: 'hsl(var(--chart-3))', name: 'Units/Day' }]}
            xAxisKey="name"
            height={300}
            showGrid
            showLegend={false}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default ChartsPlaceholder
