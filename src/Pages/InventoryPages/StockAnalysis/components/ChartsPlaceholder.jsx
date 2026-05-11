import React, { useMemo } from 'react'
import { BarChart3, PieChart as PieChartIcon, TrendingUp } from 'lucide-react'
import { BarChart, PieChart } from '../../../../Shared/Charts'

const ChartsPlaceholder = ({ analysisData = [] }) => {
  // Top 10 Products by Sales Volume
  const top10Products = useMemo(() => {
    return analysisData
      .slice()
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 10)
      .map(item => ({
        name: item.productName?.slice(0, 15) || 'Unknown',
        value: item.totalSold,
        fullName: item.productName
      }))
  }, [analysisData])

  // Stock Movement Distribution
  const movementDistribution = useMemo(() => {
    const fastMoving = analysisData.filter(item => item.movementCategory === 'fast-moving').length
    const slowMoving = analysisData.filter(item => item.movementCategory === 'slow-moving').length
    const deadStock = analysisData.filter(item => item.movementCategory === 'dead-stock').length
    
    return [
      { name: 'Fast Moving', value: fastMoving },
      { name: 'Slow Moving', value: slowMoving },
      { name: 'Dead Stock', value: deadStock }
    ].filter(item => item.value > 0)
  }, [analysisData])

  // Category Performance
  const categoryPerformance = useMemo(() => {
    const categoryMap = {}
    
    analysisData.forEach(item => {
      const category = item.category || 'Uncategorized'
      if (!categoryMap[category]) {
        categoryMap[category] = { total: 0, products: 0 }
      }
      categoryMap[category].total += item.totalSold
      categoryMap[category].products += 1
    })
    
    return Object.entries(categoryMap)
      .map(([name, data]) => ({
        name,
        sales: data.total,
        products: data.products
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 8)
  }, [analysisData])

  // Velocity Analysis
  const velocityData = useMemo(() => {
    return analysisData
      .slice()
      .sort((a, b) => b.velocity - a.velocity)
      .slice(0, 10)
      .map(item => ({
        name: item.productName?.slice(0, 15) || 'Unknown',
        velocity: parseFloat(item.velocity.toFixed(2))
      }))
  }, [analysisData])

  if (!analysisData || analysisData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-gray-600" />
          Product Analysis Charts
        </h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No data available</p>
            <p className="text-sm text-gray-400">Charts will appear when data is loaded</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top 10 Products by Sales */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
          Top 10 Products by Sales Volume
        </h3>
        <div className="h-80">
          {top10Products.length > 0 ? (
            <BarChart
              data={top10Products}
              bars={[{ dataKey: 'value', fill: '#6366f1', name: 'Units Sold' }]}
              xAxisKey="name"
              height={300}
              showGrid={true}
              showLegend={false}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              No sales data available
            </div>
          )}
        </div>
      </div>

      {/* Two Column Layout for Smaller Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Movement Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <PieChartIcon className="w-5 h-5 mr-2 text-emerald-600" />
            Stock Movement Distribution
          </h3>
          <div className="h-72">
            {movementDistribution.length > 0 ? (
              <PieChart
                data={movementDistribution}
                colors={['#10b981', '#f59e0b', '#ef4444']}
                height={250}
                showLegend={true}
                dataKey="value"
                nameKey="name"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No movement data available
              </div>
            )}
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
            Category Performance
          </h3>
          <div className="h-72">
            {categoryPerformance.length > 0 ? (
              <BarChart
                data={categoryPerformance}
                bars={[{ dataKey: 'sales', fill: '#3b82f6', name: 'Total Sales' }]}
                xAxisKey="name"
                height={250}
                showGrid={true}
                showLegend={false}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No category data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Velocity Analysis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
          Sales Velocity (Units per Day)
        </h3>
        <div className="h-80">
          {velocityData.length > 0 ? (
            <BarChart
              data={velocityData}
              bars={[{ dataKey: 'velocity', fill: '#8b5cf6', name: 'Units/Day' }]}
              xAxisKey="name"
              height={300}
              showGrid={true}
              showLegend={false}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              No velocity data available
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChartsPlaceholder
