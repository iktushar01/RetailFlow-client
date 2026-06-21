import React, { useMemo } from 'react'
import { PieChart as PieChartIcon, Package } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/Components/UI/card"
import { PieChart } from '../../../Shared/Charts'

const StockDistribution = ({ data }) => {
  const chartData = useMemo(() => {
    // 1. Safety check for inventory
    const inventory = data?.inventory || []
    if (inventory.length === 0) return []

    // 2. Create a robust product lookup map
    const productMap = {}
    const products = data?.products || []
    products.forEach(p => {
      // Check every possible ID field
      const id = p._id || p.id || p.productId || p.itemCode
      if (id) productMap[id.toString()] = p
    })

    const categoryMap = {}

    inventory.forEach(item => {
      // 3. Robust ID lookup
      const itemId = (item.productId || item._id || item.id || '').toString()
      const productInfo = productMap[itemId] || {}
      
      // 4. Fallback chain for Category
      let category = productInfo.category || 
                     productInfo.productCategory || 
                     item.category || 
                     item.productCategory || 
                     'Other'

      // Clean up category name (Capitalize)
      category = category.charAt(0).toUpperCase() + category.slice(1)
      
      // 5. Aggressive Stock Calculation
      let stockQty = 0
      
      if (item.totalStock !== undefined) {
        stockQty = parseFloat(item.totalStock)
      } else if (Array.isArray(item.stockQty)) {
        stockQty = item.stockQty.reduce((sum, qty) => sum + (parseFloat(qty) || 0), 0)
      } else {
        stockQty = parseFloat(item.stockQty) || 
                   parseFloat(item.quantity) || 
                   parseFloat(item.stock) || 
                   parseFloat(item.currentStock) || 0
      }

      // Handle location-based stock if still 0
      if (stockQty === 0 && Array.isArray(item.locations)) {
        stockQty = item.locations.reduce((sum, loc) => sum + (parseFloat(loc.quantity) || 0), 0)
      }
      
      // Add to map even if stock is 0 for debugging
      if (stockQty > 0) {
        categoryMap[category] = (categoryMap[category] || 0) + stockQty
      }
    })

    return Object.entries(categoryMap).map(([name, value]) => ({ name, value }))
  }, [data.inventory, data.products])

  const totalProducts = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0)
  }, [chartData])

  // Vibrant Multi-color palette
  const chartColors = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#f43f5e']

  return (
    <Card className="bg-card/70 backdrop-blur border-border shadow-sm flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <PieChartIcon className="h-5 w-5 text-primary" />
          Stock Distribution
        </CardTitle>
      </CardHeader>
      
      {/* Normalized vertical padding for seamless alignment */}
      <CardContent className="flex-1 py-2">
        <div className="h-64 w-full">
          {chartData.length > 0 ? (
            <PieChart
              data={chartData}
              colors={chartColors} // Passes down the distinct array values for multi-color support
              height={256} 
              showLegend={true}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={4}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground animate-pulse">
              <Package className="w-10 h-10 mb-2 opacity-20" />
              <p className="text-sm">No stock data detected</p>
            </div>
          )}
        </div>
      </CardContent>

      {/* Reduced top padding to tighten the layout up against the inner border line */}
      <CardFooter className="pt-2 pb-4">
        <div className="flex w-full flex-col items-center border-t border-border pt-2 pb-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
            Total Units in Warehouse
          </p>
          <p className="text-3xl font-black tracking-tighter text-foreground mt-1">
            {totalProducts > 0 ? totalProducts.toLocaleString() : "0"}
          </p>
        </div>
      </CardFooter>
    </Card>
  )
}

export default StockDistribution