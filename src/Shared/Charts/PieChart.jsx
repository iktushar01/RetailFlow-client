import React from 'react'
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

/**
 * Reusable Pie Chart Component
 * @param {Array} data - Array of data objects [{name, value}]
 * @param {Array} colors - Array of color hex codes
 * @param {Number} height - Chart height (default: 300)
 * @param {Boolean} showLegend - Show legend (default: true)
 * @param {String} dataKey - Key for data values (default: 'value')
 * @param {String} nameKey - Key for names (default: 'name')
 */
const PieChart = ({
  data = [],
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'],
  height = 300,
  showLegend = true,
  dataKey = 'value',
  nameKey = 'name',
  innerRadius = 0,
  outerRadius = 80
}) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-slate-200">
          <p className="text-sm font-semibold text-slate-700 mb-1">{data.name}</p>
          <div className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: data.payload.fill }}
            />
            <span className="text-slate-600">Value:</span>
            <span className="font-semibold text-slate-900">{data.value.toLocaleString()}</span>
          </div>
          {data.payload.percentage && (
            <p className="text-xs text-slate-500 mt-1">
              {data.payload.percentage}%
            </p>
          )}
        </div>
      )
    }
    return null
  }

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div 
        style={{ height }} 
        className="flex items-center justify-center text-slate-400 text-sm"
      >
        No data available
      </div>
    )
  }

  // Calculate percentages
  const total = data.reduce((sum, item) => sum + item[dataKey], 0)
  const dataWithPercentage = data.map(item => ({
    ...item,
    percentage: ((item[dataKey] / total) * 100).toFixed(1)
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={dataWithPercentage}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={outerRadius}
          innerRadius={innerRadius}
          fill="#8884d8"
          dataKey={dataKey}
          nameKey={nameKey}
        >
          {dataWithPercentage.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        {showLegend && (
          <Legend 
            verticalAlign="bottom" 
            height={36}
            wrapperStyle={{ fontSize: '12px' }}
          />
        )}
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}

export default PieChart

