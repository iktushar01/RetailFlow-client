import React from 'react'
import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

/**
 * Reusable Area Chart Component
 * @param {Array} data - Array of data objects
 * @param {Array} areas - Array of area configurations [{dataKey, stroke, fill, name}]
 * @param {String} xAxisKey - Key for X-axis data
 * @param {Number} height - Chart height (default: 300)
 * @param {Boolean} showGrid - Show grid lines (default: true)
 * @param {Boolean} showLegend - Show legend (default: true)
 */
const AreaChart = ({
  data = [],
  areas = [],
  xAxisKey = 'name',
  height = 300,
  showGrid = true,
  showLegend = true,
  stackId = null
}) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-slate-200">
          <p className="text-sm font-semibold text-slate-700 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-slate-600">{entry.name}:</span>
              <span className="font-semibold text-slate-900">{entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )
    }
    return null
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

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <defs>
          {areas.map((area, index) => (
            <linearGradient key={index} id={`color${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={area.stroke || '#3b82f6'} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={area.stroke || '#3b82f6'} stopOpacity={0.1}/>
            </linearGradient>
          ))}
        </defs>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
        <XAxis 
          dataKey={xAxisKey} 
          stroke="#64748b"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#64748b"
          style={{ fontSize: '12px' }}
        />
        <Tooltip content={<CustomTooltip />} />
        {showLegend && <Legend wrapperStyle={{ fontSize: '12px' }} />}
        {areas.map((area, index) => (
          <Area
            key={index}
            type="monotone"
            dataKey={area.dataKey}
            stroke={area.stroke || '#3b82f6'}
            fill={`url(#color${index})`}
            fillOpacity={1}
            name={area.name || area.dataKey}
            stackId={area.stackId || stackId}
          />
        ))}
      </RechartsAreaChart>
    </ResponsiveContainer>
  )
}

export default AreaChart

