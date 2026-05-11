import React from 'react'
import { PieChart, TrendingDown, BarChart3 } from 'lucide-react'

const KeyMetrics = ({ summary, filters, formatCurrency, formatPercentage, getProfitColor }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Profit Margin</p>
            <p className={`text-2xl font-bold ${getProfitColor(summary.profitMargin)}`}>
              {formatPercentage(summary.profitMargin)}
            </p>
          </div>
          <PieChart className="w-8 h-8 text-yellow-600" />
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Expenses</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalExpenses)}</p>
          </div>
          <TrendingDown className="w-8 h-8 text-red-600" />
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Period</p>
            <p className="text-2xl font-bold text-gray-900">
              {new Date(filters.year, filters.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          <BarChart3 className="w-8 h-8 text-blue-600" />
        </div>
      </div>
    </div>
  )
}

export default KeyMetrics
