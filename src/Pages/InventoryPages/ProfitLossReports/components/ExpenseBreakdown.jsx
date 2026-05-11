import React from 'react'
import { PieChart } from 'lucide-react'

const ExpenseBreakdown = ({ expenseBreakdown, formatCurrency }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <PieChart className="w-5 h-5 mr-2 text-yellow-600" />
        Expense Breakdown
      </h3>
      <div className="space-y-4">
        {expenseBreakdown.map((expense, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full ${expense.color} mr-3`}></div>
              <span className="font-medium text-gray-900">{expense.category}</span>
            </div>
            <span className="font-semibold text-gray-900">{formatCurrency(expense.amount)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExpenseBreakdown
