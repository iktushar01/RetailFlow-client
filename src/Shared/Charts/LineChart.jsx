import React from 'react'
import {
  Line,
  LineChart as RechartsLineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../Components/UI/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "../../Components/UI/chart"
import { cn } from "@/lib/utils"

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

const SharedLineChart = ({
  data = [],
  lines = [],
  xAxisKey = 'name',
  title,
  description,
  height = 300,
  showGrid = true,
  showLegend = true,
  strokeWidth = 2,
  dot = false,
  className,
  embedded = false,
}) => {
  const chartConfig = React.useMemo(() => {
    const config = {}
    lines.forEach((line, index) => {
      config[line.dataKey] = {
        label: line.label || line.name || line.dataKey,
        color: line.stroke || CHART_COLORS[index % CHART_COLORS.length],
      }
    })
    return config
  }, [lines])

  const emptyState = (
    <div
      className={cn(
        'flex items-center justify-center',
        embedded ? 'h-full w-full' : 'border-dashed rounded-xl border',
        className
      )}
      style={{ height: embedded ? height : height }}
    >
      <p className="text-sm text-muted-foreground">No data available</p>
    </div>
  )

  if (!data || data.length === 0) {
    return embedded ? emptyState : (
      <Card className={cn('flex items-center justify-center border-dashed', className)} style={{ height }}>
        <p className="text-sm text-muted-foreground">No data available</p>
      </Card>
    )
  }

  const chartBody = (
    <ChartContainer
      config={chartConfig}
      className="w-full"
      style={{ height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
        >
          {showGrid && (
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
          )}
          <XAxis
            dataKey={xAxisKey}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            className="text-xs font-medium fill-muted-foreground"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            className="text-xs font-medium fill-muted-foreground"
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          {showLegend && (
            <ChartLegend content={<ChartLegendContent />} className="pt-4" />
          )}
          {lines.map((line, index) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.stroke || CHART_COLORS[index % CHART_COLORS.length]}
              strokeWidth={line.strokeWidth ?? strokeWidth}
              strokeDasharray={line.strokeDasharray}
              name={line.name || line.dataKey}
              dot={dot}
              activeDot={{
                r: 4,
                strokeWidth: 0,
                fill: line.stroke || CHART_COLORS[index % CHART_COLORS.length],
              }}
              animationDuration={1000}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )

  if (embedded) {
    return <div className={cn('w-full', className)}>{chartBody}</div>
  }

  return (
    <Card className={cn('bg-card text-card-foreground shadow-sm', className)}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle className="text-base font-semibold leading-none">{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className="pt-4">{chartBody}</CardContent>
    </Card>
  )
}

export default SharedLineChart
