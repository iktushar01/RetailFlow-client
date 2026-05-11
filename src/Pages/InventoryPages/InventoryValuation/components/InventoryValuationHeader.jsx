import React from 'react'
import { Calculator, RefreshCw } from 'lucide-react'
import Button from '../../../../Components/UI/Button'

const InventoryValuationHeader = ({ onRefresh }) => {
  return (
    <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
            <Calculator className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-green-600" />
            Inventory Valuation
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Track total stock value and cost-based valuation
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={onRefresh}
            className="w-full sm:w-auto flex items-center justify-center"
          >
            <div className="flex items-center">
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="text-sm sm:text-base">Refresh</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default InventoryValuationHeader
