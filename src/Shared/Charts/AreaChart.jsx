import React from 'react'
import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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

const SharedAreaChart = ({
  data = [],
  areas = [],
  xAxisKey = 'name',
  title,
  description,
  height = 300,
  showGrid = true,
  showLegend = true,
  stackId = null,
  className,
  embedded = false,
}) => {
  const chartConfig = React.useMemo(() => {
    const config = {}
    areas.forEach((area, index) => {
      config[area.dataKey] = {
        label: area.label || area.name || area.dataKey,
        color: area.stroke || CHART_COLORS[index % CHART_COLORS.length],
      }
    })
    return config
  }, [areas])

  if (!data || data.length === 0) {
    const empty = <p className="text-sm text-muted-foreground">No data available to display</p>
    return embedded ? (
      <div className={cn('flex items-center justify-center w-full', className)} style={{ height }}>
        {empty}
      </div>
    ) : (
      <Card className={cn('flex flex-col items-center justify-center border-dashed', className)} style={{ height }}>
        {empty}
      </Card>
    )
  }

  const chartBody = (
    <ChartContainer config={chartConfig} className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            {areas.map((area, index) => (
              <linearGradient key={index} id={`fill_${area.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={area.stroke || CHART_COLORS[index % CHART_COLORS.length]} stopOpacity={0.3} />
                <stop offset="95%" stopColor={area.stroke || CHART_COLORS[index % CHART_COLORS.length]} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          {showGrid && <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />}
          <XAxis dataKey={xAxisKey} tickLine={false} axisLine={false} tickMargin={8} className="text-xs font-medium fill-muted-foreground" />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} className="text-xs font-medium fill-muted-foreground" />
          <ChartTooltip cursor={{ stroke: 'var(--border)', strokeWidth: 1 }} content={<ChartTooltipContent indicator="dot" />} />
          {showLegend && <ChartLegend content={<ChartLegendContent />} className="pt-4" />}
          {areas.map((area, index) => (
            <Area
              key={area.dataKey}
              type="monotone"
              dataKey={area.dataKey}
              stroke={area.stroke || CHART_COLORS[index % CHART_COLORS.length]}
              fill={`url(#fill_${area.dataKey})`}
              strokeWidth={2}
              stackId={area.stackId || stackId}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          ))}
        </RechartsAreaChart>
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
          {title && <CardTitle className="text-base font-semibold tracking-tight">{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className="pt-4">{chartBody}</CardContent>
    </Card>
  )
}

export default SharedAreaChart
