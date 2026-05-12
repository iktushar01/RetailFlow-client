import React from 'react'
import {
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Cell,
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
 * SharedPieChart Component (Shadcn + Recharts)
 * Supports Pie and Donut variants.
 */
const SharedPieChart = ({
  data = [],
  title,
  description,
  height = 350,
  showLegend = true,
  dataKey = "value",
  nameKey = "name",
  innerRadius = 0, // Set to > 0 for a Donut chart (e.g., "60%")
  className,
}) => {
  // Map data to Shadcn Chart Config for legend and color sync
  const chartConfig = React.useMemo(() => {
    const config = {}
    data.forEach((item, index) => {
      config[item[nameKey]] = {
        label: item[nameKey],
        // Dynamically assigns theme colors (chart-1, chart-2, etc.)
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      }
    })
    return config
  }, [data, nameKey])

  if (!data || data.length === 0) {
    return (
      <Card className={cn("flex items-center justify-center border-dashed", className)} style={{ height }}>
        <p className="text-sm text-muted-foreground">No data available</p>
      </Card>
    )
  }

  return (
    <Card className={cn("bg-card text-card-foreground shadow-sm flex flex-col", className)}>
      {(title || description) && (
        <CardHeader className="items-center pb-0">
          {title && <CardTitle className="text-base font-semibold">{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className={cn("mx-auto aspect-square", `max-h-[${height}px]`)}
          style={{ height: height }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={data}
                dataKey={dataKey}
                nameKey={nameKey}
                innerRadius={innerRadius}
                strokeWidth={5}
                // Adds a slight gap between segments using the background color
                stroke="hsl(var(--background))"
              >
                {data.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`var(--color-${data[index][nameKey].replace(/\s+/g, '-')})`} 
                    className="hover:opacity-80 transition-opacity"
                  />
                ))}
              </Pie>
              {showLegend && (
                <ChartLegend
                  content={<ChartLegendContent nameKey={nameKey} />}
                  className="-translate-y-2 flex-wrap gap-2 [&>div]:justify-center"
                />
              )}
            </RechartsPieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default SharedPieChart