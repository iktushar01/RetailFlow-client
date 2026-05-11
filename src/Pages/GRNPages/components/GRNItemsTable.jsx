import React from 'react'
import { Plus, Trash2 } from 'lucide-react'
import Button from '../../../Components/UI/Button'
import { getItemStatus } from '../utils/grnHelpers'

const GRNItemsTable = ({ 
  items = [], 
  products = [], 
  readOnly = false,
  onItemChange
}) => {
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-md font-semibold text-gray-900 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Product Items
          <span className="ml-2 text-sm text-gray-500">({items.length} items)</span>
        </h3>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Ordered Qty
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Already Received
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Remaining
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Received Qty
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Batch Number
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Expiry Date
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">No items selected</p>
                      <p className="text-gray-400 text-sm">Select a Purchase Order to see items</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((item, index) => {
                const itemStatus = getItemStatus(item)
                const remainingQty = item.remainingQty !== undefined ? item.remainingQty : item.orderedQty
                const alreadyReceived = item.alreadyReceived || 0
                return (
                  <tr key={item.id || index} className="hover:bg-blue-50/30 transition-colors duration-200">
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                        {item.productName || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full font-semibold">
                        {item.orderedQty || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-semibold">
                        {alreadyReceived}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <span className={`px-3 py-1 rounded-full font-semibold ${
                        remainingQty === 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {remainingQty}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      {readOnly ? (
                        <span className={`px-3 py-1 rounded-full font-semibold ${
                          item.receivedQty === item.orderedQty 
                            ? 'bg-green-100 text-green-800' 
                            : item.receivedQty > 0 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.receivedQty || 0}
                        </span>
                      ) : (
                        <input
                          type="number"
                          min="0"
                          max={remainingQty}
                          value={item.receivedQty || 0}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0
                            const maxValue = Math.min(value, remainingQty)
                            onItemChange(item.id || index, 'receivedQty', maxValue)
                          }}
                          disabled={remainingQty === 0}
                          className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center font-semibold disabled:bg-gray-100 disabled:cursor-not-allowed"
                          placeholder={remainingQty === 0 ? 'Full' : '0'}
                        />
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {readOnly ? (
                        <span className="text-gray-700">{item.batch || 'N/A'}</span>
                      ) : (
                        <input
                          type="text"
                          value={item.batch || ''}
                          onChange={(e) => onItemChange(item.id || index, 'batch', e.target.value)}
                          placeholder="Optional"
                          className="w-32 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {readOnly ? (
                        <span className="text-gray-700">
                          {item.expiry ? new Date(item.expiry).toLocaleDateString() : 'N/A'}
                        </span>
                      ) : (
                        <input
                          type="date"
                          value={item.expiry || ''}
                          onChange={(e) => onItemChange(item.id || index, 'expiry', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-40 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <span className={`text-xs font-semibold ${itemStatus.color}`}>
                        {itemStatus.status}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {items.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div>
                <span className="text-gray-600">Total Items:</span>
                <span className="ml-2 font-bold text-gray-900">{items.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Total Ordered:</span>
                <span className="ml-2 font-bold text-gray-900">
                  {items.reduce((sum, item) => sum + (item.orderedQty || 0), 0)}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Total Received:</span>
                <span className="ml-2 font-bold text-blue-600">
                  {items.reduce((sum, item) => sum + (item.receivedQty || 0), 0)}
                </span>
              </div>
            </div>
            <div>
              <span className="text-gray-600">Completion:</span>
              <span className="ml-2 font-bold text-green-600">
                {items.reduce((sum, item) => sum + (item.orderedQty || 0), 0) > 0
                  ? Math.round(
                      (items.reduce((sum, item) => sum + (item.receivedQty || 0), 0) /
                        items.reduce((sum, item) => sum + (item.orderedQty || 0), 0)) *
                        100
                    )
                  : 0}
                %
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GRNItemsTable

