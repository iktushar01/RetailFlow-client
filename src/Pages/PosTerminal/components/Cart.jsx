import React, { useState } from 'react'
import { ShoppingCart, Plus, Minus, Trash2, X, Edit3, RotateCcw } from 'lucide-react'
import Button from '../../../Components/UI/Button'
import DiscountSelector from './DiscountSelector'
import Swal from 'sweetalert2'

const Cart = ({ 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart, 
  onUpdatePrice, 
  onResetPrice, 
  totals,
  appliedDiscounts,
  onApplyDiscount,
  onRemoveDiscount
}) => {
  const [editingPrice, setEditingPrice] = useState(null)
  const [tempPrice, setTempPrice] = useState('')

  const handlePriceEdit = (index, currentPrice) => {
    setEditingPrice(index)
    setTempPrice(currentPrice.toString())
  }

  const handlePriceSave = (index) => {
    const newPrice = parseFloat(tempPrice)
    
    if (isNaN(newPrice) || newPrice < 0) {
      Swal.fire('Invalid Price', 'Please enter a valid price', 'error')
      return
    }

    onUpdatePrice(index, newPrice)
    setEditingPrice(null)
    setTempPrice('')
  }

  const handlePriceCancel = () => {
    setEditingPrice(null)
    setTempPrice('')
  }

  const handleResetPrice = (index) => {
    if (onResetPrice) {
      onResetPrice(index)
    }
  }
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Cart ({cartItems.length})</h3>
        </div>
        {cartItems.length > 0 && (
          <button
            onClick={onClearCart}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Cart Items - Fixed Height with Scroll */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        {cartItems.length > 0 ? (
          <div className="space-y-4">
            {/* Discount Selector */}
            <DiscountSelector
              cartItems={cartItems}
              appliedDiscounts={appliedDiscounts || []}
              onApplyDiscount={onApplyDiscount}
              onRemoveDiscount={onRemoveDiscount}
            />
            
            {/* Cart Items */}
            <div className="space-y-3">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0 mr-2">
                    <h4 className="font-medium text-gray-900 text-sm truncate">
                      {item.productName}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      {editingPrice === index ? (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500">BDT</span>
                          <input
                            type="number"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(e.target.value)}
                            className="w-16 px-1 py-0.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                            step="0.01"
                            min="0"
                            autoFocus
                          />
                          <button
                            onClick={() => handlePriceSave(index)}
                            className="text-green-600 hover:text-green-700 text-xs"
                            title="Save"
                          >
                            ✓
                          </button>
                          <button
                            onClick={handlePriceCancel}
                            className="text-red-600 hover:text-red-700 text-xs"
                            title="Cancel"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <div className="flex items-center gap-1">
                            <p className="text-xs text-gray-500">
                              BDT {item.unitPrice.toFixed(2)} × {item.quantity}
                            </p>
                            {item.isCustomPrice && (
                              <span className="text-xs bg-orange-100 text-orange-600 px-1 py-0.5 rounded" title="Custom Price">
                                Custom
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handlePriceEdit(index, item.unitPrice)}
                              className="text-blue-500 hover:text-blue-700 text-xs"
                              title="Edit Price"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            {item.isCustomPrice && item.originalPrice && (
                              <button
                                onClick={() => handleResetPrice(index)}
                                className="text-gray-500 hover:text-gray-700 text-xs"
                                title="Reset to Original Price"
                              >
                                <RotateCcw className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveItem(index)}
                    className="text-red-500 hover:text-red-700 flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    
                    <span className="w-10 text-center font-semibold">{item.quantity}</span>
                    
                    <button
                      onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                      disabled={item.quantity >= item.availableStock}
                      className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-blue-600">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <ShoppingCart className="w-16 h-16 mb-3" />
            <p className="text-sm">Cart is empty</p>
            <p className="text-xs mt-1">Add products to start</p>
          </div>
        )}
      </div>

      {/* Totals Summary - Fixed at Bottom */}
      {cartItems.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">BDT {totals.subtotal.toFixed(2)}</span>
              </div>
              
              {totals.totalDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-medium text-green-600">-BDT {totals.totalDiscount.toFixed(2)}</span>
                </div>
              )}
              
              {totals.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">BDT {totals.tax.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-300">
                <span>Grand Total:</span>
                <span className="text-blue-600">BDT {totals.grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                // Trigger payment modal
                const event = new CustomEvent('openPaymentModal')
                window.dispatchEvent(event)
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Proceed to Checkout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart

