import React, { useMemo } from 'react'
import { BarChart3 } from 'lucide-react'
import { BarChart } from '../../../../Shared/Charts'

const ValueDistributionChart = ({ valuationData = [] }) => {
  // Calculate category-wise value distribution
  const chartData = useMemo(() => {
    if (!valuationData || valuationData.length === 0) {
      // Generate sample data if no real data
      return [
        { category: 'Electronics', totalValue: 45000, itemCount: 15, avgValue: 3000 },
        { category: 'Clothing', totalValue: 32000, itemCount: 25, avgValue: 1280 },
        { category: 'Food & Beverage', totalValue: 28000, itemCount: 40, avgValue: 700 },
        { category: 'Home & Garden', totalValue: 22000, itemCount: 18, avgValue: 1222 },
        { category: 'Sports', totalValue: 18000, itemCount: 12, avgValue: 1500 },
        { category: 'Books', totalValue: 12000, itemCount: 30, avgValue: 400 },
        { category: 'Health & Beauty', totalValue: 15000, itemCount: 20, avgValue: 750 },
        { category: 'Toys & Games', totalValue: 8000, itemCount: 15, avgValue: 533 }
      ]
    }

    // Group by category and calculate totals
    const categoryMap = {}
    valuationData.forEach(item => {
      const category = item.category || 'Uncategorized'
      if (!categoryMap[category]) {
        categoryMap[category] = {
          totalValue: 0,
          itemCount: 0,
          avgValue: 0
        }
      }
      categoryMap[category].totalValue += item.totalValue || 0
      categoryMap[category].itemCount += 1
    })

    // Calculate average values and convert to array
    return Object.entries(categoryMap).map(([category, data]) => ({
      category,
      totalValue: data.totalValue,
      itemCount: data.itemCount,
      avgValue: data.totalValue / data.itemCount
    })).sort((a, b) => b.totalValue - a.totalValue) // Sort by total value descending
  }, [valuationData])

  // Calculate summary statistics
  const totalValue = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.totalValue, 0)
  }, [chartData])

  const totalItems = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.itemCount, 0)
  }, [chartData])

  const topCategory = useMemo(() => {
    return chartData.length > 0 ? chartData[0] : null
  }, [chartData])

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Value Distribution Chart</h3>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="text-right">
            <p className="text-gray-500">Total Value</p>
            <p className="font-semibold text-green-600">BDT {totalValue.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500">Total Items</p>
            <p className="font-semibold text-gray-900">{totalItems.toLocaleString()}</p>
          </div>
          {topCategory && (
            <div className="text-right">
              <p className="text-gray-500">Top Category</p>
              <p className="font-semibold text-blue-600">{topCategory.category}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-gradient-to-b from-slate-50/50 to-white rounded-lg border border-gray-200 p-4">
        <BarChart
          data={chartData}
          bars={[
            { 
              dataKey: 'totalValue', 
              fill: '#10b981', 
              name: 'Total Value (BDT)' 
            }
          ]}
          xAxisKey="category"
          height={320}
          showGrid={true}
          showLegend={false}
        />
      </div>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Categories</p>
          <p className="font-semibold text-gray-900">{chartData.length}</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Avg Value per Item</p>
          <p className="font-semibold text-green-600">
            BDT {totalItems > 0 ? (totalValue / totalItems).toFixed(0) : 0}
          </p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Highest Value Category</p>
          <p className="font-semibold text-blue-600">
            {topCategory ? `${topCategory.category} (BDT ${topCategory.totalValue.toLocaleString()})` : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ValueDistributionChart
