import React, { useMemo } from 'react'
import { TrendingUp } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/Components/UI/card'
import { LineChart } from '../../../../Shared/Charts'

const ProductStockChart = ({ inventory = [] }) => {
  const chartData = useMemo(() => {
    if (!inventory || inventory.length === 0) return []

    return [...inventory]
      .sort((a, b) => (b.quantity || b.stockQty || 0) - (a.quantity || a.stockQty || 0))
      .slice(0, 10)
      .map((item) => ({
        name: (item.productName || item.name || 'Unknown').slice(0, 15),
        quantity: item.quantity || item.stockQty || 0,
        value: (item.quantity || item.stockQty || 0) * (item.unitPrice || item.sellingPrice || 0),
      }))
  }, [inventory])

  const totals = useMemo(
    () =>
      chartData.reduce(
        (acc, item) => ({
          qty: acc.qty + item.quantity,
          val: acc.val + item.value,
        }),
        { qty: 0, val: 0 }
      ),
    [chartData]
  )

  return (
    <Card className="bg-card text-card-foreground shadow-sm">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Product Stock Comparison
          </CardTitle>
          <CardDescription>Showing top 10 products by inventory volume</CardDescription>
        </div>
        <div className="flex">
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-xs text-muted-foreground uppercase">Total Quantity</span>
            <span className="text-lg font-bold leading-none sm:text-2xl">{totals.qty.toLocaleString()}</span>
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
        <LineChart
          embedded
          data={chartData}
          lines={[{ dataKey: 'quantity', stroke: 'hsl(var(--chart-1))', name: 'Stock Quantity' }]}
          xAxisKey="name"
          height={320}
          showGrid
          showLegend={false}
        />
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm border-t p-4">
        <div className="flex gap-2 font-medium leading-none">
          Live warehouse data <TrendingUp className="h-4 w-4 text-primary" />
        </div>
        <div className="leading-none text-muted-foreground">
          Calculated based on current unit cost and quantity on hand.
        </div>
      </CardFooter>
    </Card>
  )
}

export default ProductStockChart
