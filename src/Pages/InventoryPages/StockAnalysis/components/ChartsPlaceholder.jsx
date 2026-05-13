import React, { useMemo } from 'react'
import { BarChart3, PieChart as PieChartIcon, TrendingUp, Inbox } from 'lucide-react'

// shadcn/ui components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// Your Shared Components
import { BarChart, PieChart } from '../../../../Shared/Charts'

const ChartsPlaceholder = ({ analysisData = [] }) => {
  
  // Data processing remains the same for logic integrity
  const top10Products = useMemo(() => {
    return analysisData
      .slice()
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 10)
      .map(item => ({
        name: item.productName?.slice(0, 15) || 'Unknown',
        value: item.totalSold,
        fullName: item.productName
      }))
  }, [analysisData])

  const movementDistribution = useMemo(() => {
    const fastMoving = analysisData.filter(item => item.movementCategory === 'fast-moving').length
    const slowMoving = analysisData.filter(item => item.movementCategory === 'slow-moving').length
    const deadStock = analysisData.filter(item => item.movementCategory === 'dead-stock').length
    
    return [
      { name: 'Fast Moving', value: fastMoving },
      { name: 'Slow Moving', value: slowMoving },
      { name: 'Dead Stock', value: deadStock }
    ].filter(item => item.value > 0)
  }, [analysisData])

  const categoryPerformance = useMemo(() => {
    const categoryMap = {}
    analysisData.forEach(item => {
      const category = item.category || 'Uncategorized'
      if (!categoryMap[category]) {
        categoryMap[category] = { total: 0, products: 0 }
      }
      categoryMap[category].total += item.totalSold
      categoryMap[category].products += 1
    })
    
    return Object.entries(categoryMap)
      .map(([name, data]) => ({
        name,
        sales: data.total,
        products: data.products
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 8)
  }, [analysisData])

  const velocityData = useMemo(() => {
    return analysisData
      .slice()
      .sort((a, b) => b.velocity - a.velocity)
      .slice(0, 10)
      .map(item => ({
        name: item.productName?.slice(0, 15) || 'Unknown',
        velocity: parseFloat(item.velocity.toFixed(2))
      }))
  }, [analysisData])

  // Empty State
  if (!analysisData || analysisData.length === 0) {
    return (
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-muted-foreground" />
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
      
      {/* Top 10 Products by Sales */}
      <Card className="border-border bg-card shadow-sm overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Sales Volume Leaderboard
          </CardTitle>
          <CardDescription>Top 10 performing products by total units sold</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-80 w-full">
            <BarChart
              data={top10Products}
              bars={[{ dataKey: 'value', fill: 'var(--primary)', name: 'Units Sold' }]}
              xAxisKey="name"
              height={300}
              showGrid={true}
              showLegend={false}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Movement Distribution */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-emerald-500" />
              Inventory Health
            </CardTitle>
            <CardDescription>Ratio of moving vs. stagnant stock</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-72">
              <PieChart
                data={movementDistribution}
                colors={['#10b981', '#f59e0b', '#ef4444']}
                height={250}
                showLegend={true}
                dataKey="value"
                nameKey="name"
              />
            </div>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Category Performance
            </CardTitle>
            <CardDescription>Sales contribution by product category</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-72">
              <BarChart
                data={categoryPerformance}
                bars={[{ dataKey: 'sales', fill: '#3b82f6', name: 'Total Sales' }]}
                xAxisKey="name"
                height={250}
                showGrid={true}
                showLegend={false}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Velocity Analysis */}
      <Card className="border-border bg-card shadow-sm border-l-4 border-l-purple-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            Sales Velocity
          </CardTitle>
          <CardDescription>Average units sold per day (Momentum Analysis)</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-80 w-full">
            <BarChart
              data={velocityData}
              bars={[{ dataKey: 'velocity', fill: '#a855f7', name: 'Units/Day' }]}
              xAxisKey="name"
              height={300}
              showGrid={true}
              showLegend={false}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ChartsPlaceholder