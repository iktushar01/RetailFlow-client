import React, { useMemo } from 'react'
import { TrendingUp, PieChart as PieChartIcon } from 'lucide-react'
import { LineChart, PieChart } from '../../../../Shared/Charts'

const ChartsPlaceholder = ({ monthlyBreakdown = [], expenseBreakdown = [] }) => {
  // Process monthly breakdown data for profit trend chart
  const profitTrendData = useMemo(() => {
    if (!monthlyBreakdown || monthlyBreakdown.length === 0) {
      // Generate sample data for last 12 months
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return months.map((month, index) => ({
        month,
        profit: Math.floor(Math.random() * 10000) - 2000, // Random profit between -2000 and 8000
        sales: Math.floor(Math.random() * 15000) + 5000, // Random sales between 5000 and 20000
        expenses: Math.floor(Math.random() * 8000) + 2000 // Random expenses between 2000 and 10000
      }))
    }

    return monthlyBreakdown.map(month => ({
      month: month.monthName,
      profit: month.profit,
      sales: month.sales,
      expenses: month.expenses
    }))
  }, [monthlyBreakdown])

  // Process expense breakdown data for pie chart
  const expenseData = useMemo(() => {
    if (!expenseBreakdown || expenseBreakdown.length === 0) {
      // Generate sample data
      return [
        { name: 'Purchase Orders', value: 15000, color: '#3b82f6' },
        { name: 'Other Payments', value: 8000, color: '#ef4444' },
        { name: 'Operating Expenses', value: 5000, color: '#f59e0b' },
        { name: 'Marketing', value: 3000, color: '#10b981' },
        { name: 'Utilities', value: 2000, color: '#8b5cf6' }
      ]
    }

    return expenseBreakdown.map(expense => ({
      name: expense.category,
      value: expense.amount,
      color: expense.color === 'bg-blue-500' ? '#3b82f6' : 
             expense.color === 'bg-red-500' ? '#ef4444' : '#6b7280'
    })).filter(expense => expense.value > 0)
  }, [expenseBreakdown])

  // Calculate summary statistics
  const totalProfit = useMemo(() => {
    return profitTrendData.reduce((sum, month) => sum + month.profit, 0)
  }, [profitTrendData])

  const totalExpenses = useMemo(() => {
    return expenseData.reduce((sum, expense) => sum + expense.value, 0)
  }, [expenseData])

  const profitableMonths = useMemo(() => {
    return profitTrendData.filter(month => month.profit > 0).length
  }, [profitTrendData])

  const bestMonth = useMemo(() => {
    return profitTrendData.reduce((best, month) => 
      month.profit > best.profit ? month : best, 
      profitTrendData[0] || { month: 'N/A', profit: 0 }
    )
  }, [profitTrendData])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Profit Trend Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-900">Profit Trend</h3>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="text-right">
              <p className="text-gray-500">Total Profit</p>
              <p className={`font-semibold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                BDT {totalProfit.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-500">Profitable Months</p>
              <p className="font-semibold text-blue-600">{profitableMonths}/12</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500">Best Month</p>
              <p className="font-semibold text-purple-600">{bestMonth.month}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-b from-slate-50/50 to-white rounded-lg border border-gray-200 p-4">
          <LineChart
            data={profitTrendData}
            lines={[
              { 
                dataKey: 'profit', 
                stroke: '#f59e0b', 
                name: 'Net Profit (BDT)',
                strokeWidth: 3
              },
              { 
                dataKey: 'sales', 
                stroke: '#10b981', 
                name: 'Sales (BDT)',
                strokeWidth: 2
              },
              { 
                dataKey: 'expenses', 
                stroke: '#ef4444', 
                name: 'Expenses (BDT)',
                strokeWidth: 2
              }
            ]}
            xAxisKey="month"
            height={280}
            showGrid={true}
            showLegend={true}
            dot={true}
          />
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Monthly profit trend over the year
          </p>
        </div>
      </div>
      
      {/* Expense vs Sales Pie Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <PieChartIcon className="w-5 h-5 mr-2 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-900">Expense vs Sales</h3>
          </div>
          <div className="text-right">
            <p className="text-gray-500">Total Expenses</p>
            <p className="font-semibold text-red-600">BDT {totalExpenses.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-b from-slate-50/50 to-white rounded-lg border border-gray-200 p-4">
          <PieChart
            data={expenseData}
            dataKey="value"
            nameKey="name"
            colors={expenseData.map(expense => expense.color)}
            height={280}
            showLegend={true}
            innerRadius={0}
            outerRadius={80}
          />
        </div>
        
        <div className="mt-4 grid grid-cols-1 gap-2">
          {expenseData.map((expense, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: expense.color }}
                ></div>
                <span className="text-gray-700">{expense.name}</span>
              </div>
              <span className="font-medium text-gray-900">
                BDT {expense.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChartsPlaceholder
