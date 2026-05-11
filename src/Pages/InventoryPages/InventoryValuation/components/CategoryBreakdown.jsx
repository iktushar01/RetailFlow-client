import React from 'react'
import { PieChart } from 'lucide-react'

const CategoryBreakdown = ({ categoryBreakdown, getMarginColor }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <PieChart className="w-5 h-5 mr-2 text-green-600" />
        Category-wise Breakdown
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoryBreakdown.map((category, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{category.category}</h4>
              <span className="text-sm text-gray-500">{category.count} items</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Value:</span>
                <span className="font-medium">BDT {category.value.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Margin:</span>
                <span className={`font-medium ${getMarginColor(category.marginPercentage).split(' ')[0]}`}>
                  {category.marginPercentage.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryBreakdown
