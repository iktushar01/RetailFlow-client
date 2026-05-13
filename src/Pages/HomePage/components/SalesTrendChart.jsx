import React, { useMemo } from 'react'
import { BarChart3, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip"
import TimeFilter from './TimeFilter'
import { AreaChart } from '../../../Shared/Charts'

const SalesTrendChart = ({ data, timeFilter, setTimeFilter }) => {
  const chartData = useMemo(() => {
    if (!data.salesData?.labels || data.salesData.labels.length === 0) {
      return []
    }

    return data.salesData.labels.map((label, index) => ({
      name: label,
      sales: data.salesData.datasets?.[0]?.data[index] || 0,
      revenue: data.salesData.datasets?.[1]?.data[index] || 0
    }))
  }, [data.salesData])

  return (
    <Card className="xl:col-span-2 bg-card/70 backdrop-blur border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <BarChart3 className="h-5 w-5 text-primary" />
            Sales Trend
          </CardTitle>
          <CardDescription>
            Visualizing your revenue and sales volume
          </CardDescription>
        </div>
        <div className="flex items-center gap-4">
          <TimeFilter 
            timeFilter={timeFilter} 
            setTimeFilter={setTimeFilter} 
            size="sm"
          />
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
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-[300px] w-full rounded-xl border border-border bg-muted/20 p-4">
          {chartData.length > 0 ? (
            <AreaChart
              data={chartData}
              areas={[
                { 
                  dataKey: 'sales', 
                  // Using your CSS Variable for Chart 1 (Primary-ish)
                  stroke: 'var(--chart-1)', 
                  name: 'Sales Count' 
                },
                { 
                  dataKey: 'revenue', 
                  // Using your CSS Variable for Chart 2 (Secondary-ish)
                  stroke: 'var(--chart-2)', 
                  name: 'Revenue (BDT)' 
                }
              ]}
              xAxisKey="name"
              height={260}
              showGrid={true}
              showLegend={true}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full space-y-3">
              <div className="rounded-full bg-muted p-4">
                <BarChart3 className="w-10 h-10 text-muted-foreground/50" />
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