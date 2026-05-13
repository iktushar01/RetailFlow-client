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
 * SharedLineChart Component (Shadcn + Recharts)
 * Theme-aware component using OKLCH variables.
 */
const SharedLineChart = ({
  data = [],
  lines = [], // [{dataKey, stroke, label}]
  xAxisKey = 'name',
  title,
  description,
  height = 350,
  showGrid = true,
  showLegend = true,
  strokeWidth = 2,
  dot = false, // Defaulting to false for a cleaner modern look
  className,
}) => {
  // Generate Shadcn Chart Config
  const chartConfig = React.useMemo(() => {
    const config = {}
    lines.forEach((line) => {
      config[line.dataKey] = {
        label: line.label || line.name || line.dataKey,
        color: line.stroke || "hsl(var(--primary))",
      }
    })
    return config
  }, [lines])

  if (!data || data.length === 0) {
    return (
      <Card className={cn("flex items-center justify-center border-dashed", className)} style={{ height }}>
        <p className="text-sm text-muted-foreground">No data available</p>
      </Card>
    )
  }

  return (
    <Card className={cn("bg-card text-card-foreground shadow-sm", className)}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle className="text-base font-semibold leading-none">{title}</CardTitle>}
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
            <RechartsLineChart
              data={data}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
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
                content={<ChartTooltipContent />} 
              />

              {showLegend && (
                <ChartLegend content={<ChartLegendContent />} className="pt-4" />
              )}

              {lines.map((line) => (
                <Line
                  key={line.dataKey}
                  type="monotone"
                  dataKey={line.dataKey}
                  stroke={line.stroke || "var(--color-primary)"}
                  strokeWidth={strokeWidth}
                  name={line.name || line.dataKey}
                  dot={dot}
                  activeDot={{
                    r: 4,
                    strokeWidth: 0,
                    fill: line.stroke || "hsl(var(--primary))"
                  }}
                  animationDuration={1000}
                />
              ))}
            </RechartsLineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default SharedLineChart
