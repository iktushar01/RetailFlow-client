import React, { useState, useEffect, useCallback } from 'react'
import { FileText, RefreshCw, Info } from 'lucide-react'
import Swal from 'sweetalert2'
import Button from '../../Components/UI/Button'
import InfoCard from '../../Shared/InfoCard/InfoCard'
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

  useEffect(() => {
    fetchInvoices()
  }, [])

  const applyFilters = useCallback(() => {
    const filtered = applyInvoiceFilters(invoices, filters)
    setFilteredInvoices(filtered)
  }, [invoices, filters])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const fetchInvoices = async () => {
    setLoading(true)
    try {
      const data = await invoiceAPI.getAll()
      setInvoices(data)
    } catch (error) {
      console.error('Error fetching invoices:', error)
      Swal.fire('Error', 'Failed to load invoices', 'error')
    } finally {
      setLoading(false)
    }
  }

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
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-indigo-600" />
              Sales Invoices
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">View, print, and manage sales invoices</p>
          </div>

          <Button variant="secondary" size="sm" onClick={fetchInvoices} className="w-full sm:w-auto flex items-center justify-center">
            <div className="flex items-center">
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="text-sm sm:text-base">Refresh</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Info Card */}
      <InfoCard
        type="info"
        title="Sales Invoice Management"
        message="View, print, and manage all sales invoices. Track payment status, generate reports, and maintain complete sales records for accounting and customer service purposes."
        icon={Info}
      />

      <InvoiceFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        resultsCount={filteredInvoices.length}
        totalCount={invoices.length}
      />

      <InvoiceList
        invoices={filteredInvoices}
        onView={handleView}
        onPrint={handlePrint}
        loading={loading}
      />

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