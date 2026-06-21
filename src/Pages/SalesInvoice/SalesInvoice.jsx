import React, { useState, useEffect, useCallback } from 'react'
import { FileText, RefreshCw, Info } from 'lucide-react'
import { Button } from "@/Components/UI/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/UI/card"
import { Alert, AlertDescription, AlertTitle } from "@/Components/UI/alert"
import { toast } from "sonner" // Shadcn recommended toast

import InvoiceList from './components/InvoiceList'
import InvoiceFilter from './components/InvoiceFilter'
import InvoiceViewModal from './components/InvoiceViewModal'
import { invoiceAPI } from './services/invoiceService'
import { applyInvoiceFilters, printInvoice } from './utils/invoiceHelpers'

const SalesInvoice = () => {
  const [invoices, setInvoices] = useState([])
  const [filteredInvoices, setFilteredInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  
  const [filters, setFilters] = useState({
    search: '',
    paymentStatus: '',
    dateFrom: '',
    dateTo: ''
  })

  const fetchInvoices = useCallback(async () => {
    setLoading(true)
    try {
      const data = await invoiceAPI.getAll()
      setInvoices(data)
    } catch (error) {
      console.error('Error fetching invoices:', error)
      toast.error("Failed to load invoices", {
        description: "Please check your connection and try again."
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  const applyFilters = useCallback(() => {
    const filtered = applyInvoiceFilters(invoices, filters)
    setFilteredInvoices(filtered)
  }, [invoices, filters])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({ search: '', paymentStatus: '', dateFrom: '', dateTo: '' })
  }

  const handleView = (invoice) => {
    setSelectedInvoice(invoice)
    setViewModalOpen(true)
  }

  const handlePrint = (invoice) => {
    printInvoice(invoice)
  }

  return (
    <div className=" mx-auto py-6 space-y-6">
      {/* Header Section using Shadcn Card */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Sales Invoices</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            View, print, and manage sales invoices
          </p>
        </div>
        <Button variant="outline" onClick={fetchInvoices}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Info Section using Shadcn Alert */}
      <Alert className="bg-muted/50 border-border">
        <Info className="h-5 w-5" />
        <AlertTitle className="font-semibold">Invoice Management</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          Track payment status, generate reports, and maintain complete sales records for accounting and customer service purposes.
        </AlertDescription>
      </Alert>

      {/* Filter Section */}
      <InvoiceFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        resultsCount={filteredInvoices.length}
        totalCount={invoices.length}
      />

      {/* Main List Section */}
      <Card className="border-border">
        <CardContent className="p-0">
          <InvoiceList
            invoices={filteredInvoices}
            onView={handleView}
            onPrint={handlePrint}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <InvoiceViewModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        invoice={selectedInvoice}
        onPrint={handlePrint}
      />
    </div>
  )
}

export default SalesInvoice

