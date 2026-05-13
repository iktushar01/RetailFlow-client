import React from 'react'
import {
  Bar,
  BarChart as RechartsBarChart,
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
 * SharedBarChart Component (Shadcn + Recharts)
 * Automatically adapts to light/dark mode via index.css variables.
 */
const SharedBarChart = ({
  data = [],
  bars = [], // [{dataKey, fill, label}]
  xAxisKey = 'name',
  title,
  description,
  height = 350,
  showGrid = true,
  showLegend = true,
  layout = 'horizontal',
  className,
}) => {
  // Map bars to Shadcn Chart Config
  const chartConfig = React.useMemo(() => {
    const config = {}
    bars.forEach((bar) => {
      config[bar.dataKey] = {
        label: bar.label || bar.name || bar.dataKey,
        color: bar.fill || "hsl(var(--primary))",
      }
    })
    return config
  }, [bars])

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
          {title && <CardTitle className="text-base font-semibold">{title}</CardTitle>}
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
            <RechartsBarChart
              data={data}
              layout={layout}
              margin={{ 
                top: 5, 
                right: 10, 
                left: layout === 'horizontal' ? -20 : 0, 
                bottom: 0 
              }}
            >
              {showGrid && (
                <CartesianGrid 
                  vertical={layout === 'vertical'} 
                  horizontal={layout === 'horizontal'}
                  strokeDasharray="3 3" 
                  className="stroke-border" 
                />
              )}

              <XAxis
                type={layout === 'horizontal' ? 'category' : 'number'}
                dataKey={layout === 'horizontal' ? xAxisKey : undefined}
                hide={layout === 'vertical'}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs font-medium fill-muted-foreground"
              />

              <YAxis
                type={layout === 'horizontal' ? 'number' : 'category'}
                dataKey={layout === 'vertical' ? xAxisKey : undefined}
                hide={layout === 'horizontal'}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs font-medium fill-muted-foreground"
              />

              <ChartTooltip 
                cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                content={<ChartTooltipContent indicator="dashed" />} 
              />

              {showLegend && (
                <ChartLegend content={<ChartLegendContent />} className="pt-4" />
              )}

              {bars.map((bar) => (
                <Bar
                  key={bar.dataKey}
                  dataKey={bar.dataKey}
                  fill={bar.fill || "var(--color-primary)"}
                  name={bar.name || bar.dataKey}
                  // Top-only rounding for horizontal, Right-only for vertical
                  radius={layout === 'horizontal' ? [4, 4, 0, 0] : [0, 4, 4, 0]}
                  barSize={layout === 'vertical' ? 20 : undefined}
                />
              ))}
            </RechartsBarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default SharedBarChart
