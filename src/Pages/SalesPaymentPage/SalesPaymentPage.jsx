import React, { useState, useEffect, useCallback } from 'react'
import { CreditCard, RefreshCw, Info } from 'lucide-react'
import Swal from 'sweetalert2'
import Button from '../../Components/UI/Button'
import InfoCard from '../../Shared/InfoCard/InfoCard'
import PaymentsList from './components/PaymentsList'
import PaymentFilter from './components/PaymentFilter'
import { salesPaymentsAPI } from './services/salesPaymentsService'
import { applyPaymentFilters } from './utils/paymentsHelpers'

const SalesPaymentPage = () => {
  const [payments, setPayments] = useState([])
  const [filteredPayments, setFilteredPayments] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [filters, setFilters] = useState({
    search: '',
    paymentMethod: '',
    dateFrom: '',
    dateTo: ''
  })

  useEffect(() => {
    fetchPayments()
  }, [])

  const applyFilters = useCallback(() => {
    const filtered = applyPaymentFilters(payments, filters)
    setFilteredPayments(filtered)
  }, [payments, filters])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const fetchPayments = async () => {
    setLoading(true)
    try {
      const data = await salesPaymentsAPI.getAll()
      setPayments(data)
    } catch (error) {
      console.error('Error fetching payments:', error)
      Swal.fire('Error', 'Failed to load payments', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({ search: '', paymentMethod: '', dateFrom: '', dateTo: '' })
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <CreditCard className="w-8 h-8 mr-3 text-green-600" />
              Sales Payments
            </h1>
            <p className="text-gray-600 mt-2">Track and manage customer payment records</p>
          </div>

          <Button variant="secondary" size="md" onClick={fetchPayments}>
            <div className="flex items-center">
              <RefreshCw className="w-5 h-5 mr-2" />
              Refresh
            </div>
          </Button>
        </div>
      </div>

      {/* Info Card */}
      <InfoCard
        type="info"
        title="Sales Payment Management"
        message="Track and manage all customer payment records. Monitor payment methods, amounts, and status to maintain accurate financial records and customer relationships."
        icon={Info}
      />

      <PaymentFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        resultsCount={filteredPayments.length}
        totalCount={payments.length}
      />

      <PaymentsList payments={filteredPayments} loading={loading} />
    </div>
  )
}

export default SalesPaymentPage