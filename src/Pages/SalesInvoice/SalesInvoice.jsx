import React, { useState, useEffect, useCallback } from 'react'
import { FileText, RefreshCw, Info } from 'lucide-react'
import { Button } from "@/Components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert"
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
      <Card className="border-none shadow-md bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="space-y-1">
            <CardTitle className="text-2xl sm:text-3xl font-bold flex items-center tracking-tight">
              <FileText className="w-8 h-8 mr-3 text-primary" />
              Sales Invoices
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              View, print, and manage sales invoices
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="default" 
            onClick={fetchInvoices} 
            className="w-full sm:w-auto bg-background hover:bg-accent transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </CardHeader>
      </Card>

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
