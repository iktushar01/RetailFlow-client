import React, { useState, useEffect } from 'react'
import { Tag, X, Check, AlertCircle } from 'lucide-react'
import Button from '../../../Components/UI/Button'
import { discountsAPI } from '../services/posService'
import { getApplicableDiscounts, isDiscountApplicable } from '../utils/posHelpers'
import Swal from 'sweetalert2'

const DiscountSelector = ({ cartItems, appliedDiscounts, onApplyDiscount, onRemoveDiscount }) => {
  const [availableDiscounts, setAvailableDiscounts] = useState([])
  const [loading, setLoading] = useState(false)
  const [showSelector, setShowSelector] = useState(false)

  useEffect(() => {
    fetchDiscounts()
  }, [])

  const fetchDiscounts = async () => {
    setLoading(true)
    try {
      const discounts = await discountsAPI.getActive()
      setAvailableDiscounts(discounts)
    } catch (error) {
      console.error('Error fetching discounts:', error)
      Swal.fire('Error', 'Failed to load discounts', 'error')
    } finally {
      setLoading(false)
    }
  }

  const applicableDiscounts = getApplicableDiscounts(availableDiscounts, cartItems)

  const handleApplyDiscount = (discount) => {
    // Check if discount is already applied
    if (appliedDiscounts.some(applied => applied._id === discount._id)) {
      Swal.fire('Already Applied', 'This discount is already applied to the cart', 'info')
      return
    }

    // Check if discount is still applicable
    if (!isDiscountApplicable(discount, cartItems)) {
      Swal.fire('Not Applicable', 'This discount is not applicable to current cart items', 'warning')
      return
    }

    onApplyDiscount(discount)
    setShowSelector(false)
    Swal.fire('Applied!', `Discount "${discount.offerName}" has been applied`, 'success')
  }

  const handleRemoveDiscount = (discount) => {
    onRemoveDiscount(discount._id)
    Swal.fire('Removed', `Discount "${discount.offerName}" has been removed`, 'info')
  }

  const getDiscountValue = (discount) => {
    if (discount.type === 'Percentage') {
      return `${discount.value}%`
    } else {
      return `$${discount.value}`
    }
  }

  const getDiscountDescription = (discount) => {
    if (discount.applicableProducts && discount.applicableProducts.length > 0) {
      return 'Specific products'
    } else if (discount.applicableCategories && discount.applicableCategories.length > 0) {
      return 'Specific categories'
    } else {
      return 'All items'
    }
  }

  return (
    <div className="space-y-3">
      {/* Applied Discounts */}
      {appliedDiscounts.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center">
            <Tag className="w-4 h-4 mr-2 text-green-600" />
            Applied Discounts
          </h4>
          {appliedDiscounts.map((discount) => (
            <div
              key={discount._id}
              className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-green-800">{discount.offerName}</span>
                  <span className="text-sm text-green-600">-{getDiscountValue(discount)}</span>
                </div>
                <p className="text-xs text-green-600">{getDiscountDescription(discount)}</p>
              </div>
              <button
                onClick={() => handleRemoveDiscount(discount)}
                className="text-red-500 hover:text-red-700 p-1"
                title="Remove discount"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Discount Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center">
            <Tag className="w-4 h-4 mr-2 text-blue-600" />
            Available Discounts
          </h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSelector(!showSelector)}
            disabled={loading || applicableDiscounts.length === 0}
          >
            <div className="flex items-center">
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2" />
              ) : (
                <Tag className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Loading...' : 'Select Discount'}
            </div>
          </Button>
        </div>

        {showSelector && (
          <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 max-h-60 overflow-y-auto">
            {applicableDiscounts.length === 0 ? (
              <div className="text-center py-4">
                <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No applicable discounts</p>
                <p className="text-xs text-gray-400">Add more items to see available discounts</p>
              </div>
            ) : (
              <div className="space-y-2">
                {applicableDiscounts.map((discount) => (
                  <div
                    key={discount._id}
                    className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{discount.offerName}</span>
                        <span className="text-sm text-blue-600 font-semibold">
                          -{getDiscountValue(discount)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{getDiscountDescription(discount)}</p>
                      {discount.code && (
                        <p className="text-xs text-gray-400">Code: {discount.code}</p>
                      )}
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApplyDiscount(discount)}
                      disabled={appliedDiscounts.some(applied => applied._id === discount._id)}
                    >
                      <div className="flex items-center">
                        <Check className="w-4 h-4 mr-1" />
                        Apply
                      </div>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DiscountSelector
