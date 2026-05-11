import React from 'react'
import { formatCurrency } from '../utils/poHelpers'

const POSummary = ({ subtotal, taxAmount, total, taxRate, onTaxRateChange }) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-lg border-2 border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        Order Summary
      </h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center py-2 border-b border-gray-200">
          <span className="text-gray-700 font-medium">Subtotal:</span>
          <span className="font-semibold text-gray-900 text-lg">{formatCurrency(subtotal)}</span>
        </div>
        
        <div className="flex justify-between items-center py-2 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-gray-700 font-medium">Tax Rate:</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={taxRate}
                onChange={(e) => onTaxRateChange(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                className="w-20 px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center font-semibold"
              />
              <span className="text-gray-600 font-medium">%</span>
            </div>
          </div>
          <span className="font-semibold text-gray-900 text-lg">{formatCurrency(taxAmount)}</span>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t-2 border-gray-300">
          <span className="text-xl font-bold text-gray-900 flex items-center">
            <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Total:
          </span>
          <span className="text-2xl font-bold text-blue-600 bg-blue-100 px-4 py-2 rounded-lg">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-xs text-blue-800">
          <span className="font-semibold">Note:</span> Tax rate can be adjusted. Final amount will be charged to supplier.
        </p>
      </div>
    </div>
  )
}

export default POSummary

