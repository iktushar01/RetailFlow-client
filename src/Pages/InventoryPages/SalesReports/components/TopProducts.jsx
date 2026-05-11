import React from 'react'
import { BarChart3 } from 'lucide-react'

const TopProducts = ({ topProducts, formatCurrency }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
        Top 5 Selling Products
      </h3>
      <div className="space-y-3">
        {topProducts.map((product, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                {index + 1}
              </div>
              <div>
                <div className="font-medium text-gray-900">{product.name}</div>
                <div className="text-sm text-gray-500">{product.quantity} units sold</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium text-gray-900">{formatCurrency(product.revenue)}</div>
              <div className="text-sm text-gray-500">revenue</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopProducts
