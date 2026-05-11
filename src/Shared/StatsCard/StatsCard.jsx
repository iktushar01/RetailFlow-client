import React from 'react'

/**
 * Reusable Statistics Card Component
 * @param {string} label - Stat label
 * @param {string|number} value - Stat value
 * @param {JSX.Element} icon - Icon component
 * @param {string} color - Color theme: 'blue', 'green', 'purple', 'yellow', 'red'
 * @param {string} trend - Optional trend indicator
 */
const StatsCard = ({ label, value, icon: Icon, color = 'blue', trend }) => {
  const colorStyles = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    purple: 'text-purple-600 bg-purple-100',
    yellow: 'text-yellow-600 bg-yellow-100',
    red: 'text-red-600 bg-red-100',
    gray: 'text-gray-600 bg-gray-100'
  }

  const iconStyle = colorStyles[color]

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs text-gray-600 font-medium mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className="text-xs text-gray-500 mt-1">{trend}</p>
          )}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-lg ${iconStyle} flex items-center justify-center`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  )
}

export default StatsCard

