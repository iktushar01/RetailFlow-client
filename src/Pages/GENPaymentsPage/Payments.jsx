import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { RefreshCw, Receipt, DollarSign, CheckCircle, AlertCircle, Info, History, Eye, ExternalLink } from 'lucide-react'
import { toast } from "sonner"
import { Button } from "@/Components/UI/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/UI/card"
import { Alert, AlertDescription, AlertTitle } from "@/Components/UI/alert"
import { Badge } from "@/Components/UI/badge"
import { Separator } from "@/Components/UI/separator"
import { ScrollArea } from "@/Components/UI/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/Components/UI/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/UI/table"

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
  
  // Modal states for Shadcn Dialogs
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)

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
      toast.error("Failed to fetch payments records")
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
    await Promise.all([fetchPayments(), fetchSuppliers()])
  }, [fetchPayments, fetchSuppliers])

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  const handleFilterChange = (newFilters) => setFilters(newFilters)

  const filteredPayments = useMemo(() => {
    const filtered = payments.filter(payment => {
      if (filters.status && payment.status !== filters.status) return false
      if (filters.supplier && payment.supplierId !== filters.supplier) return false
      
      const paymentDate = new Date(payment.createdAt || payment.dueDate)
      if (filters.dateFrom && paymentDate < new Date(filters.dateFrom)) return false
      if (filters.dateTo && paymentDate > new Date(filters.dateTo)) return false

      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        return payment.grnNumber?.toLowerCase().includes(searchLower) || 
               payment.poNumber?.toLowerCase().includes(searchLower)
      }
      return true
    })

    return filtered.sort((a, b) => new Date(b.createdAt || b.dueDate) - new Date(a.createdAt || a.dueDate))
  }, [payments, filters])

  const stats = useMemo(() => {
    const totalDue = payments.reduce((sum, p) => sum + (p.dueAmount || calculateDueAmount(p.totalAmount || p.amountDue || 0, p.amountPaid)), 0)
    const totalPaid = payments.reduce((sum, p) => sum + (p.amountPaid || 0), 0)
    const totalAmount = payments.reduce((sum, p) => sum + (p.totalAmount || p.amountDue || 0), 0)
    const overdue = payments.filter(p => p.status !== 'Paid' && new Date(p.dueDate) < new Date()).length

    return { totalDue, totalPaid, totalAmount, overdue }
  }, [payments])

  const handleAddPayment = (payment) => {
    setSelectedPayment(payment)
    setIsPaymentModalOpen(true)
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
      toast.success("Payment Recorded", {
        description: `New status: ${newStatus}. Balance: ${formatCurrency(newDueAmount)}`
      })

      await fetchPayments()
      setIsPaymentModalOpen(false)
    } catch (error) {
      toast.error("Failed to record payment")
    } finally {
      setLoading(false)
    }
  }

  const handleView = (payment) => {
    setSelectedPayment(payment)
    setViewDetailsOpen(true)
  }

  const handleViewHistory = (payment) => {
    setSelectedPayment(payment)
    setHistoryOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Supplier Payments
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Track and manage supplier payments from GRNs
          </p>
        </div>
        <Button variant="outline" onClick={fetchAllData} disabled={fetchLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${fetchLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Info Alert */}
      <Alert variant="info" className="bg-blue-500/5 border-blue-500/20 text-blue-900 dark:text-blue-200">
        <Info className="h-5 w-5" />
        <AlertTitle className="font-semibold">Supplier Payment Tracking</AlertTitle>
        <AlertDescription>
          Track payments owed to suppliers. Record partial or full payments, maintain history, and monitor outstanding balances.
        </AlertDescription>
      </Alert>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Payments", val: payments.length, icon: Receipt, color: "text-slate-600" },
          { label: "Total Amount", val: formatCurrency(stats.totalAmount), icon: DollarSign, color: "text-blue-600" },
          { label: "Total Paid", val: formatCurrency(stats.totalPaid), icon: CheckCircle, color: "text-emerald-600" },
          { label: "Total Due", val: formatCurrency(stats.totalDue), icon: AlertCircle, color: "text-destructive" },
        ].map((stat, idx) => (
          <Card key={idx} className="shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.val}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color} opacity-20`} />
            </CardContent>
          </Card>
        ))}
      </div>

      <PaymentsFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        suppliers={suppliers}
        resultsCount={filteredPayments.length}
        totalCount={payments.length}
      />

      <PaymentsList
        payments={filteredPayments}
        suppliers={suppliers}
        loading={fetchLoading}
        onAddPayment={handleAddPayment}
        onViewHistory={handleViewHistory}
        onView={handleView}
      />

      {/* --- SHADCN MODALS --- */}

      {/* View Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-emerald-600" /> Payment Details
            </DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <DetailRow label="Supplier" value={selectedPayment.supplierName || 'N/A'} />
                <DetailRow label="PO Number" value={selectedPayment.poNumber} mono />
                <DetailRow label="GRN Number" value={selectedPayment.grnNumber} mono />
                <DetailRow label="Due Date" value={formatDate(selectedPayment.dueDate)} />
              </div>
              <div className="bg-muted/50 p-4 rounded-lg grid grid-cols-1 sm:grid-cols-3 gap-4 text-center border">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Total</p>
                  <p className="text-lg font-bold">{formatCurrency(selectedPayment.totalAmount || 0)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Paid</p>
                  <p className="text-lg font-bold text-emerald-600">{formatCurrency(selectedPayment.amountPaid || 0)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Due</p>
                  <p className="text-lg font-bold text-destructive">{formatCurrency(selectedPayment.dueAmount || 0)}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent size="xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-purple-600" /> Payment History: {selectedPayment?.grnNumber}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="min-h-0 max-h-[min(50dvh,400px)] border rounded-md">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedPayment?.paymentHistory?.length > 0 ? (
                  selectedPayment.paymentHistory.map((h, i) => (
                    <TableRow key={i}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{formatDate(h.date)}</TableCell>
                      <TableCell className="text-right font-semibold text-emerald-600">{formatCurrency(h.amount)}</TableCell>
                      <TableCell>{h.method}</TableCell>
                      <TableCell className="font-mono text-xs">{h.transactionId || 'N/A'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={5} className="text-center py-4">No history found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
          <div className="flex justify-between items-center bg-muted/30 p-3 rounded-md border">
            <span className="text-sm font-medium">Total Accumulated Paid</span>
            <span className="text-lg font-bold text-emerald-600">{formatCurrency(selectedPayment?.amountPaid || 0)}</span>
          </div>
        </DialogContent>
      </Dialog>

      <AddPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        payment={selectedPayment}
        suppliers={suppliers}
        onSubmit={handleSubmitPayment}
        loading={loading}
      />
    </div>
  )
}

const DetailRow = ({ label, value, mono }) => (
  <div>
    <p className="text-xs font-semibold text-muted-foreground uppercase">{label}</p>
    <p className={`text-sm ${mono ? 'font-mono' : 'font-medium'}`}>{value || 'N/A'}</p>
  </div>
)

export default Payments

