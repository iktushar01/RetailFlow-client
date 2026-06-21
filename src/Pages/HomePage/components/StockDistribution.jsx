import React, { useMemo } from 'react'
import { PieChart as PieChartIcon, Package } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/Components/UI/card'
import { PieChart } from '../../../Shared/Charts'

const getStockQty = (item) => {
  if (item.totalStock !== undefined) return parseFloat(item.totalStock) || 0
  if (Array.isArray(item.stockQty)) {
    return item.stockQty.reduce((sum, qty) => sum + (parseFloat(qty) || 0), 0)
  }
  let stockQty =
    parseFloat(item.stockQty) ||
    parseFloat(item.quantity) ||
    parseFloat(item.stock) ||
    parseFloat(item.currentStock) ||
    0
  if (stockQty === 0 && Array.isArray(item.locations)) {
    stockQty = item.locations.reduce(
      (sum, loc) => sum + (parseFloat(loc.quantity) || parseFloat(loc.stockQty) || 0),
      0
    )
  }
  return stockQty
}

const StockDistribution = ({ data }) => {
  const chartData = useMemo(() => {
    const inventory = data?.enrichedInventory || data?.inventory || []
    if (inventory.length === 0) return []

    const categoryMap = {}

    inventory.forEach((item) => {
      let category = item.category || item.productCategory || 'Other'
      category = category.charAt(0).toUpperCase() + category.slice(1)
      const stockQty = getStockQty(item)
      if (stockQty > 0) {
        categoryMap[category] = (categoryMap[category] || 0) + stockQty
      }
    })

    return Object.entries(categoryMap).map(([name, value]) => ({ name, value }))
  }, [data?.enrichedInventory, data?.inventory])

  const totalProducts = useMemo(
    () => chartData.reduce((sum, item) => sum + item.value, 0),
    [chartData]
  )

  return (
    <Card className="bg-card/70 backdrop-blur border-border shadow-sm flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <PieChartIcon className="h-5 w-5 text-primary" />
          Stock Distribution
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 py-2">
        <div className="h-[300px] w-full">
          {chartData.length > 0 ? (
            <PieChart
              embedded
              data={chartData}
              height={300}
              showLegend
              dataKey="value"
              nameKey="name"
              innerRadius={60}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Package className="w-10 h-10 mb-2 opacity-20" />
              <p className="text-sm">No stock data detected</p>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2 pb-4">
        <div className="flex w-full flex-col items-center border-t border-border pt-2 pb-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
            Total Units in Warehouse
          </p>
          <p className="text-3xl font-black tracking-tighter text-foreground mt-1">
            {totalProducts > 0 ? totalProducts.toLocaleString() : '0'}
          </p>
        </div>
      </CardFooter>
    </Card>
  )
}

export default StockDistribution
