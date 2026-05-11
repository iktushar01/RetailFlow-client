import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { RefreshCw, Receipt, DollarSign, CheckCircle, AlertCircle, Info } from 'lucide-react'
import Swal from 'sweetalert2'
import Button from '../../Components/UI/Button'
import StatsCard from '../../Shared/StatsCard/StatsCard'
import PaymentsList from './components/PaymentsList'
import PaymentsFilter from './components/PaymentsFilter'
import AddPaymentModal from './components/AddPaymentModal'
import { paymentsAPI, suppliersAPI } from './services/paymentsService'
import { formatCurrency, formatDate, calculateDueAmount, determinePaymentStatus } from './utils/paymentsHelpers'

const Payments = () => {
  const [payments, setPayments] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)

  // Filter state
  const [filters, setFilters] = useState({
    status: '',
    supplier: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  })

  const fetchPayments = useCallback(async () => {
    try {
      setFetchLoading(true)
      const data = await paymentsAPI.getAll()
      setPayments(data || [])
    } catch (error) {
      console.error('Error fetching payments:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch payments. Please try again.',
        confirmButtonColor: '#3B82F6'
      })
    } finally {
      setFetchLoading(false)
    }
  }, [])

  const fetchSuppliers = useCallback(async () => {
    try {
      const data = await suppliersAPI.getAll()
      setSuppliers(data || [])
    } catch (error) {
      console.error('Error fetching suppliers:', error)
    }
  }, [])

  const fetchAllData = useCallback(async () => {
    await Promise.all([
      fetchPayments(),
      fetchSuppliers()
    ])
  }, [fetchPayments, fetchSuppliers])

  // Fetch data on mount
  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  // Filter handler
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  // Filtered and sorted payments
  const filteredPayments = useMemo(() => {
    const filtered = payments.filter(payment => {
      // Status filter
      if (filters.status && payment.status !== filters.status) {
        return false
      }

      // Supplier filter
      if (filters.supplier && payment.supplierId !== filters.supplier) {
        return false
      }

      // Date from filter
      if (filters.dateFrom) {
        const paymentDate = new Date(payment.createdAt || payment.dueDate)
        const fromDate = new Date(filters.dateFrom)
        if (paymentDate < fromDate) {
          return false
        }
      }

      // Date to filter
      if (filters.dateTo) {
        const paymentDate = new Date(payment.createdAt || payment.dueDate)
        const toDate = new Date(filters.dateTo)
        if (paymentDate > toDate) {
          return false
        }
      }

      // Search filter (GRN or PO Number)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const grnMatch = payment.grnNumber?.toLowerCase().includes(searchLower)
        const poMatch = payment.poNumber?.toLowerCase().includes(searchLower)
        if (!grnMatch && !poMatch) {
          return false
        }
      }

      return true
    })

    // Sort by newest first (createdAt -> _id -> dueDate)
    return filtered.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
      if (a._id && b._id && a._id !== b._id) {
        return b._id.localeCompare(a._id)
      }
      if (a.dueDate && b.dueDate) {
        return new Date(b.dueDate) - new Date(a.dueDate)
      }
      return 0
    })
  }, [payments, filters])

  // Calculate summary stats
  const stats = useMemo(() => {
    const totalDue = payments.reduce((sum, p) => {
      const total = p.totalAmount || p.amountDue || 0
      return sum + (p.dueAmount || calculateDueAmount(total, p.amountPaid))
    }, 0)
    const totalPaid = payments.reduce((sum, p) => sum + (p.amountPaid || 0), 0)
    const totalAmount = payments.reduce((sum, p) => sum + (p.totalAmount || p.amountDue || 0), 0)
    const overdue = payments.filter(p => {
      const dueDate = new Date(p.dueDate)
      const today = new Date()
      return p.status !== 'Paid' && dueDate < today
    }).length

    return { totalDue, totalPaid, totalAmount, overdue }
  }, [payments])

  const handleAddPayment = (payment) => {
    setSelectedPayment(payment)
    setIsPaymentModalOpen(true)
  }

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false)
    setSelectedPayment(null)
  }

  const handleSubmitPayment = async (paymentData) => {
    try {
      setLoading(true)
      
      const totalAmount = selectedPayment.totalAmount || selectedPayment.amountDue || 0
      const newAmountPaid = (selectedPayment.amountPaid || 0) + paymentData.paymentAmount
      const newDueAmount = totalAmount - newAmountPaid
      const newStatus = determinePaymentStatus(totalAmount, newAmountPaid)

      const updateData = {
        ...selectedPayment,
        amountPaid: newAmountPaid,
        dueAmount: newDueAmount,
        status: newStatus,
        lastPaymentDate: paymentData.paymentDate,
        lastPaymentMethod: paymentData.paymentMethod,
        lastTransactionId: paymentData.transactionId,
        paymentHistory: [
          ...(selectedPayment.paymentHistory || []),
          {
            amount: paymentData.paymentAmount,
            method: paymentData.paymentMethod,
            date: paymentData.paymentDate,
            transactionId: paymentData.transactionId,
            recordedAt: new Date().toISOString()
          }
        ]
      }

      await paymentsAPI.update(selectedPayment._id, updateData)

      await Swal.fire({
        icon: 'success',
        title: '✅ Payment Recorded!',
        html: `
          <div class="text-left space-y-2">
            <p class="text-gray-700"><strong>Payment of ${formatCurrency(paymentData.paymentAmount)}</strong> has been recorded successfully.</p>
            <div class="bg-green-50 p-3 rounded-lg border border-green-200 text-sm">
              <p class="text-gray-700">✅ New Status: <strong>${newStatus}</strong></p>
              <p class="text-gray-700">✅ Total Paid: <strong>${formatCurrency(newAmountPaid)}</strong></p>
              <p class="text-gray-700">✅ Remaining: <strong>${formatCurrency(newDueAmount)}</strong></p>
            </div>
          </div>
        `,
        confirmButtonColor: '#3B82F6',
        timer: 4000,
        timerProgressBar: true
      })

      await fetchPayments()
      handleClosePaymentModal()
    } catch (error) {
      console.error('Error recording payment:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to record payment',
        confirmButtonColor: '#3B82F6'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleView = (payment) => {
    const supplier = suppliers.find(s => s._id === payment.supplierId)
    const supplierName = payment.supplierName || supplier?.supplierName || supplier?.name || 'N/A'
    const totalAmount = payment.totalAmount || payment.amountDue || 0
    const dueAmount = payment.dueAmount || calculateDueAmount(totalAmount, payment.amountPaid)

    Swal.fire({
      title: `<div class="flex items-center justify-center"><svg class="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>Payment Details</div>`,
      html: `
        <div class="text-left space-y-4 max-h-96 overflow-y-auto">
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p class="text-gray-600 font-semibold">Supplier</p>
              <p class="text-gray-900">${supplierName}</p>
            </div>
            <div>
              <p class="text-gray-600 font-semibold">PO Number</p>
              <p class="text-gray-900 font-mono">${payment.poNumber || 'N/A'}</p>
            </div>
            <div>
              <p class="text-gray-600 font-semibold">GRN Number</p>
              <p class="text-gray-900 font-mono">${payment.grnNumber || 'N/A'}</p>
            </div>
            <div>
              <p class="text-gray-600 font-semibold">Due Date</p>
              <p class="text-gray-900">${formatDate(payment.dueDate)}</p>
            </div>
          </div>
          
          <div class="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div class="grid grid-cols-3 gap-3 text-center">
              <div>
                <p class="text-xs text-gray-600">Total Amount</p>
                <p class="text-lg font-bold text-gray-900">${formatCurrency(totalAmount)}</p>
              </div>
              <div>
                <p class="text-xs text-gray-600">Paid</p>
                <p class="text-lg font-bold text-green-600">${formatCurrency(payment.amountPaid || 0)}</p>
              </div>
              <div>
                <p class="text-xs text-gray-600">Due</p>
                <p class="text-lg font-bold text-red-600">${formatCurrency(dueAmount)}</p>
              </div>
            </div>
          </div>

          ${payment.lastPaymentDate ? `
            <div class="bg-gray-50 p-3 rounded-lg">
              <p class="text-xs text-gray-600 font-semibold mb-2">Last Payment</p>
              <p class="text-sm text-gray-700">Date: ${formatDate(payment.lastPaymentDate)}</p>
              <p class="text-sm text-gray-700">Method: ${payment.lastPaymentMethod || 'N/A'}</p>
              ${payment.lastTransactionId ? `<p class="text-sm text-gray-700">Ref: ${payment.lastTransactionId}</p>` : ''}
            </div>
          ` : ''}
        </div>
      `,
      width: '700px',
      confirmButtonColor: '#3B82F6',
      confirmButtonText: 'Close'
    })
  }

  const handleViewHistory = (payment) => {
    const history = payment.paymentHistory || []
    
    const historyTable = history.length > 0 ? history.map((h, index) => `
      <tr class="border-b">
        <td class="py-2 px-3 text-left">${index + 1}</td>
        <td class="py-2 px-3 text-left">${formatDate(h.date)}</td>
        <td class="py-2 px-3 text-right font-semibold text-green-600">${formatCurrency(h.amount)}</td>
        <td class="py-2 px-3 text-left">${h.method}</td>
        <td class="py-2 px-3 text-left text-xs">${h.transactionId || 'N/A'}</td>
      </tr>
    `).join('') : '<tr><td colspan="5" class="py-4 text-center text-gray-500">No payment history</td></tr>'

    Swal.fire({
      title: `<div class="flex items-center justify-center"><svg class="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>Payment History: ${payment.grnNumber}</div>`,
      html: `
        <div class="text-left space-y-4 max-h-96 overflow-y-auto">
          <div class="overflow-x-auto border rounded-lg">
            <table class="min-w-full text-sm">
              <thead class="bg-gray-50">
                <tr>
                  <th class="py-2 px-3 text-left">#</th>
                  <th class="py-2 px-3 text-left">Date</th>
                  <th class="py-2 px-3 text-right">Amount</th>
                  <th class="py-2 px-3 text-left">Method</th>
                  <th class="py-2 px-3 text-left">Reference</th>
                </tr>
              </thead>
              <tbody>
                ${historyTable}
              </tbody>
            </table>
          </div>
          
          <div class="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p class="text-sm font-semibold text-gray-700">Total Paid: <span class="text-green-600">${formatCurrency(payment.amountPaid || 0)}</span></p>
          </div>
        </div>
      `,
      width: '800px',
      confirmButtonColor: '#3B82F6',
      confirmButtonText: 'Close'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <svg className="w-8 h-8 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Supplier Payments
            </h1>
            <p className="text-gray-600 mt-2">
              Track and manage supplier payments from GRNs
            </p>
            
            
          </div>

          <Button 
            variant="secondary" 
            size="md"
            onClick={fetchAllData}
            disabled={fetchLoading}
            loading={fetchLoading}
            className="flex items-center"
          >
            <div className="flex items-center">
              <RefreshCw className="w-5 h-5 mr-2" />
              <span>Refresh</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-blue-900">Supplier Payment Tracking</p>
          <p className="text-sm text-blue-700 mt-1">
            Track payments owed to suppliers based on received goods. Record partial or full payments,
            maintain payment history, and monitor outstanding balances to ensure timely supplier payments.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Total Payments"
          value={payments.length}
          icon={Receipt}
          color="gray"
        />
        <StatsCard
          label="Total Amount"
          value={formatCurrency(stats.totalAmount)}
          icon={DollarSign}
          color="blue"
        />
        <StatsCard
          label="Total Paid"
          value={formatCurrency(stats.totalPaid)}
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          label="Total Due"
          value={formatCurrency(stats.totalDue)}
          icon={AlertCircle}
          color="red"
        />
      </div>

      {/* Filter Section */}
      <PaymentsFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        suppliers={suppliers}
        resultsCount={filteredPayments.length}
        totalCount={payments.length}
      />

      {/* Payments List */}
      <PaymentsList
        payments={filteredPayments}
        suppliers={suppliers}
        loading={fetchLoading}
        onAddPayment={handleAddPayment}
        onViewHistory={handleViewHistory}
        onView={handleView}
      />

      {/* Add Payment Modal */}
      <AddPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        payment={selectedPayment}
        suppliers={suppliers}
        onSubmit={handleSubmitPayment}
        loading={loading}
      />
    </div>
  )
}

export default Payments
