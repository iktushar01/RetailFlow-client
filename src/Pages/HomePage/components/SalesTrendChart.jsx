import React, { useMemo } from 'react'
import { TrendingUp, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/UI/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/Components/UI/tooltip'
import { LineChart } from '../../../Shared/Charts'

const SalesTrendChart = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data.salesData?.labels || data.salesData.labels.length === 0) {
      return []
    }

    return data.salesData.labels.map((label, index) => ({
      name: label,
      sales: data.salesData.datasets?.[0]?.data[index] || 0,
      revenue: data.salesData.datasets?.[1]?.data[index] || 0,
    }))
  }, [data.salesData])

  return (
    <Card className="xl:col-span-2 bg-card/70 backdrop-blur border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <TrendingUp className="h-5 w-5 text-primary" />
            Sales Trend
          </CardTitle>
          <CardDescription>Visualizing your revenue and sales volume</CardDescription>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Comparing unit sales vs total BDT revenue</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>

      <CardContent>
        <div className="h-[300px] w-full">
          {chartData.length > 0 ? (
            <LineChart
              embedded
              data={chartData}
              lines={[
                { dataKey: 'sales', stroke: 'hsl(var(--chart-1))', name: 'Sales Count' },
                { dataKey: 'revenue', stroke: 'hsl(var(--chart-2))', name: 'Revenue (BDT)' },
              ]}
              xAxisKey="name"
              height={300}
              showGrid
              showLegend
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full space-y-3">
              <div className="rounded-full bg-muted p-4">
                <TrendingUp className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <div className="text-center">
                <p className="font-medium text-muted-foreground">No data for this period</p>
                <p className="text-xs text-muted-foreground/70">Try adjusting your time filter</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default SalesTrendChart
