import React, { useState, useEffect, useCallback } from 'react'
import { CreditCard, RefreshCw, Info } from 'lucide-react'
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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
    <div className="container mx-auto py-6 space-y-6">
      {/* Header Section */}
      <Card className="border-none shadow-md bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="space-y-1">
            <CardTitle className="text-2xl sm:text-3xl font-bold flex items-center tracking-tight">
              <CreditCard className="w-8 h-8 mr-3 text-primary" />
              Sales Payments
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              Track and manage customer payment records
            </CardDescription>
          </div>

          <Button 
            variant="outline" 
            size="default" 
            onClick={fetchPayments}
            className="w-full sm:w-auto bg-background hover:bg-accent transition-all"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </CardHeader>
      </Card>

      {/* Info Notification Area */}
      <Alert className="bg-muted/50 border-border">
        <Info className="h-5 w-5 text-primary" />
        <AlertTitle className="font-semibold">Sales Payment Management</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          Monitor payment methods, amounts, and status to maintain accurate financial records 
          and customer relationships.
        </AlertDescription>
      </Alert>

      {/* Filter Section */}
      <PaymentFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        resultsCount={filteredPayments.length}
        totalCount={payments.length}
      />

      {/* Content Section */}
      <Card className="border-border">
        <CardContent className="p-0">
          <PaymentsList 
            payments={filteredPayments} 
            loading={loading} 
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default SalesPaymentPage