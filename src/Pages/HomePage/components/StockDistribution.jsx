import React, { useMemo } from 'react'
import { PieChart as PieChartIcon } from 'lucide-react'
import { PieChart } from '../../../Shared/Charts'

const StockDistribution = ({ data }) => {
  // Transform inventory data for the pie chart
  const chartData = useMemo(() => {
    if (!data.inventory || data.inventory.length === 0) {
      return []
    }

    // Create a product lookup map to get categories
    const productMap = {}
    if (data.products && data.products.length > 0) {
      data.products.forEach(product => {
        const productId = (product._id || product.productId || '').toString()
        if (productId) {
          productMap[productId] = product
        }
      })
    }

    // Group inventory by category (from products)
    const categoryMap = {}
    data.inventory.forEach(item => {
      // Get product info to access category
      const productId = (item.productId || item._id || '').toString()
      const product = productMap[productId] || {}
      
      // Get category from product, with multiple fallbacks
      const category = product.category || product.productCategory || 
                      item.category || item.productCategory || 'Uncategorized'
      
      // Calculate stock quantity - handle arrays and different field names
      // /inventory/products endpoint uses totalStock
      let stockQty = parseFloat(item.totalStock) || 0
      
      if (stockQty === 0) {
        if (Array.isArray(item.stockQty)) {
          stockQty = item.stockQty.reduce((sum, qty) => sum + (parseFloat(qty) || 0), 0)
        } else {
          stockQty = parseFloat(item.stockQty) || parseFloat(item.quantity) || 
                    parseFloat(item.stock) || 0
        }
      }
      
      // Handle locations array if no direct stockQty
      if (stockQty === 0 && item.locations && Array.isArray(item.locations)) {
        stockQty = item.locations.reduce((sum, loc) => sum + (parseFloat(loc.quantity) || 0), 0)
      }
      
      if (stockQty > 0) {
        categoryMap[category] = (categoryMap[category] || 0) + stockQty
      }
    })

    // Convert to array format for chart
    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value
    }))
  }, [data.inventory, data.products])

  const totalProducts = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0)
  }, [chartData])

  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur ring-1 ring-slate-200/70 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <PieChartIcon className="text-emerald-600" />
        <h2 className="font-semibold">Stock Distribution</h2>
      </div>
      <div className="h-64 rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50/50 to-white p-4">
        {chartData.length > 0 ? (
          <PieChart
            data={chartData}
            colors={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']}
            height={220}
            showLegend={true}
            dataKey="value"
            nameKey="name"
            innerRadius={0}
            outerRadius={70}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">
            <div className="text-center">
              <PieChartIcon className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p>No inventory data available</p>
              <p className="text-sm text-slate-400">Stock distribution will appear here when available</p>
            </div>
          </div>
        )}
      </div>
      <div className="mt-3 text-center">
        <p className="text-xs text-slate-500">
          Total Products: <span className="font-semibold text-slate-700">{totalProducts.toLocaleString()}</span>
        </p>
      </div>
    </div>
  )
}

export default StockDistribution
