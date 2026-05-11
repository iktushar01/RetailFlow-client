import React, { useMemo } from 'react'
import { BarChart3 } from 'lucide-react'
import { BarChart } from '../../../../Shared/Charts'

const ProductStockChart = ({ inventory = [] }) => {
  // Get top 10 products by stock quantity
  const chartData = useMemo(() => {
    if (!inventory || inventory.length === 0) {
      // Generate sample data if no real data
      return [
        { product: 'Bluetooth Headphones', quantity: 150, value: 45000 },
        { product: 'Wireless Mouse', quantity: 120, value: 36000 },
        { product: 'USB Cable', quantity: 200, value: 20000 },
        { product: 'Phone Charger', quantity: 180, value: 27000 },
        { product: 'Laptop Stand', quantity: 85, value: 42500 },
        { product: 'Keyboard', quantity: 95, value: 47500 },
        { product: 'Webcam', quantity: 65, value: 32500 },
        { product: 'Monitor', quantity: 40, value: 60000 },
        { product: 'Mouse Pad', quantity: 250, value: 12500 },
        { product: 'HDMI Cable', quantity: 160, value: 24000 }
      ]
    }

    // Sort by quantity and take top 10
    const sortedInventory = [...inventory]
      .sort((a, b) => (b.quantity || 0) - (a.quantity || 0))
      .slice(0, 10)

    // Transform data for chart
    return sortedInventory.map(item => ({
      product: item.productName || item.name || 'Unknown',
      quantity: item.quantity || 0,
      value: (item.quantity || 0) * (item.unitPrice || 0)
    }))
  }, [inventory])

  // Calculate totals
  const totalQuantity = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.quantity, 0)
  }, [chartData])

  const totalValue = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0)
  }, [chartData])

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Product Stock Comparison</h3>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="text-right">
            <p className="text-gray-500">Total Quantity</p>
            <p className="font-semibold text-gray-900">{totalQuantity.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500">Total Value</p>
            <p className="font-semibold text-green-600">BDT {totalValue.toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-b from-slate-50/50 to-white rounded-lg border border-gray-200 p-4">
        <BarChart
          data={chartData}
          bars={[
            { 
              dataKey: 'quantity', 
              fill: '#3b82f6', 
              name: 'Stock Quantity' 
            }
          ]}
          xAxisKey="product"
          height={320}
          showGrid={true}
          showLegend={false}
        />
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Showing top 10 products by stock quantity
        </p>
      </div>
    </div>
  )
}

export default ProductStockChart
