import React, { useState, useEffect } from 'react'
import { User, CreditCard, CheckCircle, Clock, XCircle, History } from 'lucide-react'
import Button from '../../../Components/UI/Button'
import CustomerHistory from './CustomerHistory'
import Swal from 'sweetalert2'

const PaymentSection = ({ 
  customers, 
  selectedCustomer, 
  onSelectCustomer, 
  onCreateCustomer,
  cartItems,
  totals,
  onCompleteSale,
  onHoldSale
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [showCustomerHistory, setShowCustomerHistory] = useState(false)
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '' })

  const paymentMethods = ['Cash', 'Card', 'bKash', 'Nagad', 'Rocket', 'Bank Transfer']

  // Listen for open modal event
  useEffect(() => {
    const handleOpenModal = () => {
      if (cartItems.length > 0) {
        setIsOpen(true)
      } else {
        Swal.fire('Empty Cart', 'Please add items to cart before checkout', 'warning')
      }
    }

    window.addEventListener('openPaymentModal', handleOpenModal)
    return () => window.removeEventListener('openPaymentModal', handleOpenModal)
  }, [cartItems])

  const handleCreateCustomer = async () => {
    if (!newCustomer.name.trim()) {
      Swal.fire('Error', 'Customer name is required', 'error')
      return
    }

    try {
      await onCreateCustomer(newCustomer)
      setShowCustomerModal(false)
      setNewCustomer({ name: '', phone: '', email: '' })
    } catch {
      Swal.fire('Error', 'Failed to create customer', 'error')
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        {/* Modal Content */}
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Checkout</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 space-y-4">
            {/* Order Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-2">Order Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-medium">{cartItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">BDT {totals.subtotal.toFixed(2)}</span>
                </div>
                {totals.totalDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-medium text-green-600">-BDT {totals.totalDiscount.toFixed(2)}</span>
                  </div>
                )}
                {totals.tax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium">BDT {totals.tax.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-blue-300 mt-2">
                  <span>Grand Total:</span>
                  <span className="text-blue-600">BDT {totals.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

      {/* Customer Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <User className="w-4 h-4 inline mr-1" />
          Customer
        </label>
        <div className="flex gap-2">
          <select
            value={selectedCustomer?._id || ''}
            onChange={(e) => {
              const customer = customers.find(c => c._id === e.target.value)
              onSelectCustomer(customer)
            }}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Customer</option>
            {customers.map(customer => (
              <option key={customer._id} value={customer._id}>
                {customer.name} {customer.phone ? `- ${customer.phone}` : ''}
              </option>
            ))}
          </select>
          <Button
            variant="secondary"
            size="md"
            onClick={() => setShowCustomerModal(true)}
          >
            <div className="flex items-center">
              + New
            </div>
          </Button>
          {selectedCustomer && (
            <Button
              variant="ghost"
              size="md"
              onClick={() => setShowCustomerHistory(true)}
              title="View Customer History"
            >
              <div className="flex items-center">
                <History className="w-4 h-4" />
              </div>
            </Button>
          )}
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <CreditCard className="w-4 h-4 inline mr-1" />
          Payment Method
        </label>
        <div className="grid grid-cols-3 gap-2">
          {paymentMethods.map(method => (
            <button
              key={method}
              onClick={() => setPaymentMethod(method)}
              className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                paymentMethod === method
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
        <Button
          variant="primary"
          size="lg"
          onClick={async () => {
            await onCompleteSale(paymentMethod)
            setIsOpen(false)
          }}
          disabled={cartItems.length === 0 || !selectedCustomer}
          className="w-full"
        >
          <div className="flex items-center justify-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span className="text-lg">Complete Payment</span>
          </div>
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            size="md"
            onClick={async () => {
              await onHoldSale()
              setIsOpen(false)
            }}
            disabled={cartItems.length === 0}
            className="w-full"
          >
            <div className="flex items-center justify-center">
              <Clock className="w-4 h-4 mr-2" />
              Hold
            </div>
          </Button>

          <Button
            variant="ghost"
            size="md"
            onClick={() => setIsOpen(false)}
            className="w-full"
          >
            <div className="flex items-center justify-center">
              Cancel
            </div>
          </Button>
        </div>
      </div>

      {/* New Customer Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Customer</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Customer name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  setShowCustomerModal(false)
                  setNewCustomer({ name: '', phone: '', email: '' })
                }}
                className="flex-1"
              >
                <div className="flex items-center">
                  Cancel
                </div>
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleCreateCustomer}
                className="flex-1"
              >
                <div className="flex items-center">
                  Save Customer
                </div>
              </Button>
            </div>
          </div>
        </div>
      )}

          </div>
        </div>
      </div>

      {/* Customer History Modal */}
      <CustomerHistory
        customer={selectedCustomer}
        isOpen={showCustomerHistory}
        onClose={() => setShowCustomerHistory(false)}
      />
    </>
  )
}

export default PaymentSection

