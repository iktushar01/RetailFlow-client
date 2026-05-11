import React, { useMemo } from 'react'
import { BarChart3 } from 'lucide-react'
import TimeFilter from './TimeFilter'
import { AreaChart } from '../../../Shared/Charts'

const SalesTrendChart = ({ data, timeFilter, setTimeFilter }) => {
  // Transform data for the chart
  const chartData = useMemo(() => {
    console.log('SalesTrendChart - data.salesData:', data.salesData)
    
    if (!data.salesData || !data.salesData.labels || data.salesData.labels.length === 0) {
      console.log('No sales data available - returning empty array')
      return []
    }

    console.log('Processing sales data:', {
      labels: data.salesData.labels,
      hasDatasets: !!data.salesData.datasets,
      datasets: data.salesData.datasets
    })

    // Use real data from API
    return data.salesData.labels.map((label, index) => ({
      name: label,
      sales: data.salesData.datasets?.[0]?.data[index] || 0,
      revenue: data.salesData.datasets?.[1]?.data[index] || 0
    }))
  }, [data.salesData])

  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur ring-1 ring-slate-200/70 p-5 shadow-sm xl:col-span-2">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="text-indigo-600" />
        <h2 className="font-semibold">Sales Trend</h2>
        <div className="ml-auto">
          <TimeFilter 
            timeFilter={timeFilter} 
            setTimeFilter={setTimeFilter} 
            size="sm"
          />
        </div>
      </div>
      <div className="h-64 rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50/50 to-white p-4">
        {chartData.length > 0 ? (
          <AreaChart
            data={chartData}
            areas={[
              { 
                dataKey: 'sales', 
                stroke: '#6366f1', 
                name: 'Sales Count' 
              },
              { 
                dataKey: 'revenue', 
                stroke: '#10b981', 
                name: 'Revenue (BDT)' 
              }
            ]}
            xAxisKey="name"
            height={220}
            showGrid={true}
            showLegend={true}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p>No sales data available</p>
              <p className="text-sm text-slate-400">Sales data will appear here when available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SalesTrendChart
