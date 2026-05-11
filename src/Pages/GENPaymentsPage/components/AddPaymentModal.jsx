import React, { useState, useEffect } from 'react'
import { X, DollarSign } from 'lucide-react'
import Button from '../../../Components/UI/Button'
import { formatCurrency, calculateDueAmount } from '../utils/paymentsHelpers'

const AddPaymentModal = ({ 
  isOpen, 
  onClose, 
  payment, 
  suppliers = [],
  onSubmit, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    paymentAmount: '',
    paymentMethod: 'Cash',
    paymentDate: new Date().toISOString().split('T')[0],
    transactionId: ''
  })

  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen && payment) {
      const totalAmount = payment.totalAmount || payment.amountDue || 0
      const dueAmount = payment.dueAmount || calculateDueAmount(totalAmount, payment.amountPaid)
      setFormData({
        paymentAmount: dueAmount.toFixed(2),
        paymentMethod: 'Cash',
        paymentDate: new Date().toISOString().split('T')[0],
        transactionId: ''
      })
      setError('')
    }
  }, [isOpen, payment])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const paymentAmount = parseFloat(formData.paymentAmount)
    const totalAmount = payment.totalAmount || payment.amountDue || 0
    const dueAmount = payment.dueAmount || calculateDueAmount(totalAmount, payment.amountPaid)

    if (!paymentAmount || paymentAmount <= 0) {
      setError('Please enter a valid payment amount')
      return
    }

    if (paymentAmount > dueAmount) {
      setError(`Payment amount cannot exceed due amount (${formatCurrency(dueAmount)})`)
      return
    }

    onSubmit({
      ...formData,
      paymentAmount
    })
  }

  if (!isOpen) return null

  const supplier = suppliers.find(s => s._id === payment?.supplierId)
  const supplierName = payment?.supplierName || supplier?.supplierName || supplier?.name || 'N/A'
  const totalAmount = payment?.totalAmount || payment?.amountDue || 0
  const dueAmount = payment?.dueAmount || calculateDueAmount(totalAmount, payment?.amountPaid)

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="relative inline-block w-full max-w-2xl overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Add Payment</h3>
                <p className="text-sm text-gray-600">Record payment for GRN: {payment?.grnNumber}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Payment Summary */}
          <div className="p-6 bg-blue-50 border-b border-blue-100">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Supplier</p>
                <p className="font-semibold text-gray-900">{supplierName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">PO Number</p>
                <p className="font-mono font-semibold text-gray-900">{payment?.poNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Already Paid</p>
                <p className="text-lg font-bold text-green-600">{formatCurrency(payment?.amountPaid || 0)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600 mb-1">Amount Due</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(dueAmount)}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {/* Payment Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={dueAmount}
                  value={formData.paymentAmount}
                  onChange={(e) => handleChange('paymentAmount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => handleChange('paymentMethod', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Mobile Payment">Mobile Payment</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Credit Card">Credit Card</option>
                </select>
              </div>

              {/* Payment Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.paymentDate}
                  onChange={(e) => handleChange('paymentDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Transaction/Reference ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction / Reference ID
                </label>
                <input
                  type="text"
                  value={formData.transactionId}
                  onChange={(e) => handleChange('transactionId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Optional"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                disabled={loading}
              >
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span>Record Payment</span>
                </div>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddPaymentModal

