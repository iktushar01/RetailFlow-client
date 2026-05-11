import React, { useState, useEffect } from 'react'
import { History, Receipt, Calendar, DollarSign } from 'lucide-react'
import { salesAPI } from '../services/posService'
import { formatDateTime, formatCurrency } from '../utils/posHelpers'

const CustomerHistory = ({ customer, isOpen, onClose }) => {
  const [salesHistory, setSalesHistory] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (customer && isOpen) {
      fetchCustomerHistory()
    }
  }, [customer, isOpen])

  const fetchCustomerHistory = async () => {
    if (!customer) return

    setLoading(true)
    try {
      const allSales = await salesAPI.getAll()
      const customerSales = allSales.filter(sale => 
        sale.customerId === customer._id || sale.customerName === customer.name
      )
      setSalesHistory(customerSales.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
    } catch (error) {
      console.error('Error fetching customer history:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !customer) return null

  const totalSpent = salesHistory.reduce((sum, sale) => sum + (sale.grandTotal || 0), 0)
  const totalOrders = salesHistory.length

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <History className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {customer.name}'s Purchase History
              </h3>
              <p className="text-sm text-gray-600">
                {customer.phone && `Phone: ${customer.phone}`}
                {customer.email && ` • Email: ${customer.email}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Total Orders</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{totalOrders}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">Total Spent</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{formatCurrency(totalSpent)}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Last Order</span>
            </div>
            <p className="text-sm font-bold text-purple-900">
              {salesHistory.length > 0 ? formatDateTime(salesHistory[0].createdAt) : 'No orders'}
            </p>
          </div>
        </div>

        {/* Sales History */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : salesHistory.length === 0 ? (
            <div className="text-center py-8">
              <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No purchase history found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {salesHistory.map((sale) => (
                <div
                  key={sale._id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 rounded-lg p-2">
                        <Receipt className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{sale.invoiceNo}</h4>
                        <p className="text-sm text-gray-600">
                          {formatDateTime(sale.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(sale.grandTotal)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {sale.paymentMethod} • {sale.paymentStatus}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Items:</span>
                      <span className="ml-2 font-medium">{sale.items?.length || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Discount:</span>
                      <span className="ml-2 font-medium text-green-600">
                        -{formatCurrency(sale.totalDiscount || 0)}
                      </span>
                    </div>
                  </div>

                  {sale.items && sale.items.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-600 mb-2">Items purchased:</p>
                      <div className="space-y-1">
                        {sale.items.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-700">
                              {item.productName} × {item.quantity}
                            </span>
                            <span className="text-gray-600">
                              {formatCurrency(item.unitPrice * item.quantity)}
                            </span>
                          </div>
                        ))}
                        {sale.items.length > 3 && (
                          <p className="text-xs text-gray-500">
                            +{sale.items.length - 3} more items
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CustomerHistory
