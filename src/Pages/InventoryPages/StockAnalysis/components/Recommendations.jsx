import React from 'react'
import { AlertTriangle } from 'lucide-react'

const Recommendations = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <AlertTriangle className="w-5 h-5 mr-2 text-gray-600" />
        Recommendations
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">Fast Moving Products</h4>
          <p className="text-sm text-green-700">
            Consider increasing stock levels and promoting these products to maximize sales.
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-medium text-yellow-900 mb-2">Slow Moving Products</h4>
          <p className="text-sm text-yellow-700">
            Review pricing, marketing strategies, or consider bundling with popular items.
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="font-medium text-red-900 mb-2">Dead Stock</h4>
          <p className="text-sm text-red-700">
            Consider clearance sales, donations, or disposal to free up warehouse space.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Recommendations
