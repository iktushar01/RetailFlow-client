import React from 'react'
import { X, Plus } from 'lucide-react'
import Button from '../../../Components/UI/Button'
import { validateItem } from '../utils/poHelpers'

const POItemsTable = ({ items, products, onAddItem, onRemoveItem, onItemChange, hasAttemptedSubmit }) => {
  const handleProductSelect = (itemId, productId) => {
    const selectedProduct = products.find(p => p._id === productId)
    if (selectedProduct) {
      onItemChange(itemId, 'product', productId)
      onItemChange(itemId, 'productName', selectedProduct.productName || selectedProduct.name)
      onItemChange(itemId, 'unitPrice', selectedProduct.price || selectedProduct.unitPrice || 0)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <label className="block text-sm font-semibold text-gray-700">
          Items <span className="text-red-500">*</span>
        </label>
              <Button
                variant="primary"
                size="sm"
                onClick={onAddItem}
                type="button"
                className="flex items-center"
              >
                <div className="flex items-center">
                <Plus className="w-4 h-4 mr-1.5" />
                <span>Add Item</span>
                </div>
              </Button>
      </div>

      <div className="border border-gray-200 rounded-lg">
        <div className="overflow-x-auto overflow-visible">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Unit Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Subtotal
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-20">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium">No items added yet</p>
                        <p className="text-gray-400 text-sm mt-1">Click "Add Item" to start building your purchase order</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const validation = validateItem(item)
                  return (
                      <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-4 py-3">
                            <select
                              value={item.product || ''}
                              onChange={(e) => handleProductSelect(item.id, e.target.value)}
                              className={`w-full min-w-[250px] px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                                hasAttemptedSubmit && !validation.isValid && !item.product ? 'border-red-500' : 'border-gray-300'
                              }`}
                            >
                              <option value="">
                                {products.length === 0 ? 'No products available for this supplier' : 'Select Product...'}
                              </option>
                              {products.map(product => (
                                <option key={product._id} value={product._id}>
                                  {product.productName || product.name}
                                </option>
                              ))}
                            </select>
                            {hasAttemptedSubmit && !validation.isValid && validation.errors.product && (
                              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                                {validation.errors.product}
                              </p>
                            )}
                          </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity || ''}
                          onChange={(e) => onItemChange(item.id, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                          className={`w-24 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            !validation.isValid && validation.errors.quantity ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="1"
                        />
                        {!validation.isValid && validation.errors.quantity && (
                          <p className="text-xs text-red-600 mt-1">{validation.errors.quantity}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-1">BDT</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice || ''}
                            onChange={(e) => onItemChange(item.id, 'unitPrice', Math.max(0, parseFloat(e.target.value) || 0))}
                            className={`w-28 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              !validation.isValid && validation.errors.unitPrice ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="0.00"
                          />
                        </div>
                        {!validation.isValid && validation.errors.unitPrice && (
                          <p className="text-xs text-red-600 mt-1">{validation.errors.unitPrice}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-900">
                          BDT {(item.subtotal || 0).toFixed(2)}
                        </div>
                      </td>
                          <td className="px-4 py-3 text-center">
                            <Button
                              variant="delete"
                              size="sm"
                              type="button"
                              onClick={() => onRemoveItem(item.id)}
                              title="Remove item"
                              className="flex items-center mx-auto"
                            >
                              <div className="flex items-center">
                              <X className="w-4 h-4 mr-1" />
                              <span>Remove</span>
                              </div>
                            </Button>
                          </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {items.length > 0 && (
        <div className="mt-2 text-sm text-gray-600">
          <span className="font-medium">{items.length}</span> item{items.length !== 1 ? 's' : ''} added
        </div>
      )}
    </div>
  )
}

export default POItemsTable

