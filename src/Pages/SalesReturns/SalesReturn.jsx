import React, { useState, useEffect, useCallback } from 'react'
import { Plus, RefreshCw, XCircle, Calendar, User, FileText, ClipboardList } from 'lucide-react'
import { Button } from "@/Components/UI/button"
import { Card } from "@/Components/UI/card"
import { Badge } from "@/Components/UI/badge"
import { Separator } from "@/Components/UI/separator"
import { ScrollArea } from "@/Components/UI/scroll-area"
import { toast } from "sonner"
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

import ReturnsList from './components/ReturnsList'
import ReturnFilter from './components/ReturnFilter'
import ReturnModal from './components/ReturnModal'
import { returnsAPI, salesAPI } from './services/returnsService'
import { applyReturnFilters, getStatusColor, formatDateTime } from './utils/returnsHelpers'

const SalesReturn = () => {
  const [returns, setReturns] = useState([])
  const [invoices, setInvoices] = useState([])
  const [filteredReturns, setFilteredReturns] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedReturn, setSelectedReturn] = useState(null)
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [returnsData, invoicesData] = await Promise.all([
        returnsAPI.getAll(),
        salesAPI.getAll()
      ])
      setReturns(returnsData)
      setInvoices(invoicesData.filter(inv => inv.status !== 'Hold'))
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error("Failed to load returns data")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const applyFilters = useCallback(() => {
    const filtered = applyReturnFilters(returns, filters)
    setFilteredReturns(filtered)
  }, [returns, filters])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({ search: '', status: '', dateFrom: '', dateTo: '' })
  }

  const handleView = (returnItem) => {
    setSelectedReturn(returnItem)
    setViewModalOpen(true)
  }

  const handleSave = async (returnData) => {
    try {
      await returnsAPI.create(returnData)
      toast.success("Return created successfully")
      setModalOpen(false)
      fetchData()
    } catch (error) {
      toast.error("Failed to create return")
    }
  }

  // Refactored Logic for Approval/Rejection/Deletion (Standard Shadcn pattern: Toast + Fetch)
  const handleApprove = async (returnItem) => {
    try {
      await returnsAPI.approve(returnItem._id)
      toast.success("Approved!", { description: "Return approved and stock adjusted" })
      fetchData()
    } catch (error) {
      toast.error("Approval failed")
    }
  }

  const handleReject = async (returnItem) => {
    try {
      await returnsAPI.reject(returnItem._id)
      toast.success("Rejected", { description: "Return has been rejected" })
      fetchData()
    } catch (error) {
      toast.error("Rejection failed")
    }
  }

  const handleDelete = async (returnItem) => {
    try {
      await returnsAPI.delete(returnItem._id)
      toast.success("Deleted", { description: "Return has been removed" })
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete return")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Sales Returns</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            {returns.length} returns — {filteredReturns.length} showing
          </p>
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <Button variant="outline" size="sm" onClick={fetchData} className="flex-1 sm:flex-none">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="default" size="sm" onClick={() => setModalOpen(true)} className="flex-1 sm:flex-none">
            <Plus className="w-4 h-4 mr-2" />
            New Return
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <ReturnFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        resultsCount={filteredReturns.length}
        totalCount={returns.length}
      />

      <Card className="overflow-hidden border shadow-none">
        <ReturnsList
          returns={filteredReturns}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
          onView={handleView}
          loading={loading}
        />
      </Card>

      {/* Create Return Modal Wrapper */}
      <ReturnModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        invoices={invoices}
      />

      {/* Refactored View Return Modal (Shadcn Dialog) */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent size="lg" className="gap-0 p-0">
          <DialogHeader className="shrink-0 px-4 py-4 sm:px-6 border-b">
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center pr-8">
              <DialogTitle className="text-xl font-bold">Return Details</DialogTitle>
              {selectedReturn && (
                <Badge className={getStatusColor(selectedReturn.status)}>
                  {selectedReturn.status}
                </Badge>
              )}
            </div>
          </DialogHeader>

          {selectedReturn && (
            <ScrollArea className="min-h-0 flex-1 px-4 sm:px-6 py-4">
              <div className="space-y-6">
                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase flex items-center">
                      <ClipboardList className="w-3 h-3 mr-1" /> Return ID
                    </p>
                    <p className="text-sm font-mono font-medium">{selectedReturn.returnId}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase flex items-center">
                      <FileText className="w-3 h-3 mr-1" /> Invoice No
                    </p>
                    <p className="text-sm font-medium">{selectedReturn.invoiceNo}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase flex items-center">
                      <User className="w-3 h-3 mr-1" /> Customer
                    </p>
                    <p className="text-sm font-medium">{selectedReturn.customerName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase flex items-center">
                      <Calendar className="w-3 h-3 mr-1" /> Date
                    </p>
                    <p className="text-sm font-medium">{formatDateTime(selectedReturn.createdAt)}</p>
                  </div>
                </div>

                <Separator />

                {/* Items Table */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-foreground">Returned Items</h4>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead className="text-xs">Product</TableHead>
                          <TableHead className="text-xs text-right">Qty</TableHead>
                          <TableHead className="text-xs">Reason</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedReturn.items?.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="text-sm font-medium">{item.productName}</TableCell>
                            <TableCell className="text-sm text-right">{item.quantity}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{item.reason || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Reason & Notes Section */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="rounded-lg bg-muted/40 p-3 space-y-1 border">
                    <p className="text-xs font-bold uppercase text-muted-foreground">General Reason</p>
                    <p className="text-sm">{selectedReturn.reason || 'No reason provided'}</p>
                  </div>
                  {selectedReturn.notes && (
                    <div className="rounded-lg bg-muted/20 p-3 space-y-1 border border-dashed">
                      <p className="text-xs font-bold uppercase text-muted-foreground">Internal Notes</p>
                      <p className="text-sm italic">{selectedReturn.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          )}

          <DialogFooter className="shrink-0 px-4 py-4 sm:px-6 border-t bg-muted/20">
            <Button variant="outline" onClick={() => setViewModalOpen(false)} className="w-full sm:w-auto">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SalesReturn

