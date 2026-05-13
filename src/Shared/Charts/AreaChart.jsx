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
} from "../../Components/UI/Card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "../../Components/UI/Chart"
import { cn } from "@/lib/utils"

/**
 * Reusable Area Chart Component (Shadcn + Recharts)
 * Uses OKLCH variables for theme consistency.
 */
const SharedAreaChart = ({
  data = [],
  areas = [], // [{dataKey, stroke, label}]
  xAxisKey = 'name',
  title,
  description,
  height = 350,
  showGrid = true,
  showLegend = true,
  stackId = null,
  className,
}) => {
  // Shadcn Chart Configuration
  // Map your areas to the chart config for automated legend/label handling
  const chartConfig = React.useMemo(() => {
    const config = {}
    areas.forEach((area) => {
      config[area.dataKey] = {
        label: area.label || area.name || area.dataKey,
        color: area.stroke || "hsl(var(--primary))",
      }
    })
    return config
  }, [areas])

  if (!data || data.length === 0) {
    return (
      <Card className={cn("flex flex-col items-center justify-center border-dashed", className)} style={{ height }}>
        <p className="text-sm text-muted-foreground">No data available to display</p>
      </Card>
    )
  }

  return (
    <Card className={cn("bg-card text-card-foreground shadow-sm", className)}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle className="text-base font-semibold tracking-tight">{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className="pt-4">
        <ChartContainer 
          config={chartConfig} 
          className={cn("w-full", `h-[${height}px]`)}
          style={{ height: height }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <RechartsAreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                {areas.map((area, index) => (
                  <linearGradient key={index} id={`fill_${area.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                    <stop 
                      offset="5%" 
                      stopColor={area.stroke || "var(--color-primary)"} 
                      stopOpacity={0.3}
                    />
                    <stop 
                      offset="95%" 
                      stopColor={area.stroke || "var(--color-primary)"} 
                      stopOpacity={0}
                    />
                  </linearGradient>
                ))}
              </defs>

              {showGrid && (
                <CartesianGrid 
                  vertical={false} 
                  strokeDasharray="3 3" 
                  className="stroke-border" 
                />
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

              <ChartTooltip 
                cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
                content={<ChartTooltipContent indicator="dot" />} 
              />

              {showLegend && (
                <ChartLegend content={<ChartLegendContent />} className="pt-4" />
              )}

              {areas.map((area) => (
                <Area
                  key={area.dataKey}
                  type="monotone"
                  dataKey={area.dataKey}
                  stroke={area.stroke || "hsl(var(--primary))"}
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
      </CardContent>
    </Card>
  )
}

export default SharedAreaChart
