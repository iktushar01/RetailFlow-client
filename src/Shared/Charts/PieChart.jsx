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

const SharedPieChart = ({
  data = [],
  title,
  description,
  height = 300,
  showLegend = true,
  dataKey = 'value',
  nameKey = 'name',
  innerRadius = 60,
  className,
  embedded = false,
}) => {
  const chartConfig = React.useMemo(() => {
    const config = {}
    data.forEach((item, index) => {
      const key = item[nameKey]
      config[key] = {
        label: key,
        color: CHART_COLORS[index % CHART_COLORS.length],
      }
    })
    return config
  }, [data, nameKey])

  if (!data || data.length === 0) {
    const empty = <p className="text-sm text-muted-foreground">No data available</p>
    return embedded ? (
      <div className={cn('flex items-center justify-center w-full', className)} style={{ height }}>
        {empty}
      </div>
    ) : (
      <Card className={cn('flex items-center justify-center border-dashed', className)} style={{ height }}>
        {empty}
      </Card>
    )
  }

  const chartBody = (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            innerRadius={innerRadius}
            strokeWidth={5}
            stroke="hsl(var(--background))"
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
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
  )

  if (embedded) {
    return <div className={cn('w-full', className)}>{chartBody}</div>
  }

  return (
    <Card className={cn('bg-card text-card-foreground shadow-sm flex flex-col', className)}>
      {(title || description) && (
        <CardHeader className="items-center pb-0">
          {title && <CardTitle className="text-base font-semibold">{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className="flex-1 pb-0">{chartBody}</CardContent>
    </Card>
  )
}

export default SharedPieChart
