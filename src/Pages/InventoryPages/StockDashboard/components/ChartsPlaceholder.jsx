import React, { useMemo } from 'react'
import { BarChart3, TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/UI/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/Components/UI/chart"

const ProductStockChart = ({ inventory = [] }) => {
  // Memoized data transformation
  const chartData = useMemo(() => {
    if (!inventory || inventory.length === 0) {
      return [
        { product: 'Headphones', quantity: 150, value: 45000 },
        { product: 'Mouse', quantity: 120, value: 36000 },
        { product: 'USB Cable', quantity: 200, value: 20000 },
        { product: 'Charger', quantity: 180, value: 27000 },
        { product: 'Stand', quantity: 85, value: 42500 },
        { product: 'Keyboard', quantity: 95, value: 47500 },
        { product: 'Webcam', quantity: 65, value: 32500 },
        { product: 'Monitor', quantity: 40, value: 60000 },
        { product: 'Mouse Pad', quantity: 250, value: 12500 },
        { product: 'HDMI Cable', quantity: 160, value: 24000 }
      ]
    }

    return [...inventory]
      .sort((a, b) => (b.quantity || 0) - (a.quantity || 0))
      .slice(0, 10)
      .map(item => ({
        product: item.productName || item.name || 'Unknown',
        quantity: item.quantity || 0,
        value: (item.quantity || 0) * (item.unitPrice || 0)
      }))
  }, [inventory])

  const totals = useMemo(() => {
    return chartData.reduce((acc, item) => ({
      qty: acc.qty + item.quantity,
      val: acc.val + item.value
    }), { qty: 0, val: 0 })
  }, [chartData])

  // shadcn chart configuration
  const chartConfig = {
    quantity: {
      label: "Stock Quantity",
      color: "var(--primary)",
    },
  }

  return (
    <Card className="bg-card text-card-foreground shadow-sm">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Product Stock Comparison
          </CardTitle>
          <CardDescription>
            Showing top 10 products by inventory volume
          </CardDescription>
        </div>
        <div className="flex">
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-xs text-muted-foreground uppercase">Total Quantity</span>
            <span className="text-lg font-bold leading-none sm:text-2xl">
              {totals.qty.toLocaleString()}
            </span>
          </div>
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-xs text-muted-foreground uppercase">Total Value</span>
            <span className="text-lg font-bold leading-none sm:text-2xl text-primary">
              {totals.val.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">BDT</span>
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ left: 12, right: 12, top: 10 }}
            >
              <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis
                dataKey="product"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => value.length > 12 ? `${value.slice(0, 10)}..` : value}
                className="text-muted-foreground text-xs"
              />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                className="text-muted-foreground text-xs"
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px] border-border bg-popover text-popover-foreground"
                    nameKey="quantity"
                    labelFormatter={(value) => value}
                  />
                }
              />
              <Bar 
                dataKey="quantity" 
                fill="var(--primary)" 
                radius={[4, 4, 0, 0]} 
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm border-t p-4">
        <div className="flex gap-2 font-medium leading-none">
          Live warehouse data active <TrendingUp className="h-4 w-4 text-primary" />
        </div>
        <div className="leading-none text-muted-foreground">
          Calculated based on current unit cost and quantity on hand.
        </div>
      </CardFooter>
    </Card>
  )
}

export default ProductStockChart

