import React, { useState, useEffect, useCallback } from 'react'
import { RefreshCw } from 'lucide-react'
import { toast } from "sonner"
import { Button } from "@/Components/UI/button"
import { Card } from "@/Components/UI/card"
import { cn } from "@/lib/utils"

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

  const fetchPayments = useCallback(async () => {
    setLoading(true)
    try {
      const data = await salesPaymentsAPI.getAll()
      setPayments(data)
    } catch (error) {
      console.error('Error fetching payments:', error)
      toast.error("Error", {
        description: "Failed to load payments records."
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  const applyFilters = useCallback(() => {
    const filtered = applyPaymentFilters(payments, filters)
    setFilteredPayments(filtered)
  }, [payments, filters])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({ search: '', paymentMethod: '', dateFrom: '', dateTo: '' })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Sales Payments</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            {payments.length} records — {filteredPayments.length} showing
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={fetchPayments} disabled={loading}>
          <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <PaymentFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        resultsCount={filteredPayments.length}
        totalCount={payments.length}
      />

      <Card className="overflow-hidden border shadow-none">
        <PaymentsList payments={filteredPayments} loading={loading} />
      </Card>
    </div>
  )
}

export default SalesPaymentPage
