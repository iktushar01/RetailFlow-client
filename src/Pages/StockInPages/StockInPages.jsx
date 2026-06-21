import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { 
  RefreshCw, 
  Package, 
  CheckCircle, 
  Info, 
  TrendingUp, 
  ClipboardCheck, 
  Eye, 
  Calendar,
  FileText
} from 'lucide-react'
import { toast } from "sonner"
import { Button } from "@/Components/UI/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/UI/card"
import { Alert, AlertDescription, AlertTitle } from "@/Components/UI/alert"
import { Badge } from "@/Components/UI/badge"
import { Skeleton } from "@/Components/UI/skeleton"

// Shared components (Assuming these are also refactored to Shadcn)
import { SharedTable } from '../../Shared/SharedTable/SharedTable'
import StockInFilter from './components/StockInFilter'
import { StockInDetailsDialog } from './components/StockInDetailsDialog'

import { grnAPI, suppliersAPI } from './services/stockInService'
import { 
  formatDate, 
  applyStockInFilters, 
  calculateStockInStats,
  getStockStatusColor,
  getStockStatusDisplay,
  getTotalOrderedQty,
  getTotalReceivedQty,
  sortGRNsByDate,
  getApprovedGRNs
} from './utils/stockInHelpers'

const StockInPages = () => {
  const [grns, setGrns] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [fetchLoading, setFetchLoading] = useState(false)
  const [selectedGrn, setSelectedGrn] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  
  const [filters, setFilters] = useState({
    status: '',
    supplier: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  })

  const fetchAllData = useCallback(async () => {
    try {
      setFetchLoading(true)
      const [grnData, supplierData] = await Promise.all([
        grnAPI.getAll(),
        suppliersAPI.getAll()
      ])
      setGrns(grnData || [])
      setSuppliers(supplierData || [])
    } catch (error) {
      toast.error("Connection Error", {
        description: "Failed to fetch stock records. Please try again later."
      })
    } finally {
      setFetchLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  const stockInItems = useMemo(() => {
    const approved = getApprovedGRNs(grns)
    return sortGRNsByDate(approved)
  }, [grns])

  const filteredStockInItems = useMemo(() => {
    return applyStockInFilters(stockInItems, filters)
  }, [stockInItems, filters])

  const stats = useMemo(() => {
    return calculateStockInStats(stockInItems)
  }, [stockInItems])

  const handleView = (grn) => {
    setSelectedGrn(grn)
    setIsDetailsOpen(true)
  }

  const columns = useMemo(() => [
    {
      header: 'GRN Number',
      accessorKey: 'grnNumber',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono font-bold text-foreground">
            {row.original.grnNumber}
          </span>
        </div>
      )
    },
    {
      header: 'PO Number',
      accessorKey: 'poNumber',
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono text-blue-600 bg-blue-50/50">
          {row.original.poNumber || 'N/A'}
        </Badge>
      )
    },
    {
      header: 'Supplier',
      accessorKey: 'supplierId',
      cell: ({ row }) => {
        const supplier = suppliers.find(s => s._id === row.original.supplierId)
        return (
          <div className="flex flex-col">
            <span className="font-medium text-sm leading-none">{supplier?.supplierName || 'N/A'}</span>
            <span className="text-[10px] text-muted-foreground mt-1 lowercase">{supplier?.email || ''}</span>
          </div>
        )
      }
    },
    {
      header: 'Volumes',
      cell: ({ row }) => {
        const totalOrdered = getTotalOrderedQty(row.original)
        const totalReceived = getTotalReceivedQty(row.original)
        return (
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Rec: <b className="text-emerald-600">{totalReceived}</b></span>
            <span className="text-xs text-muted-foreground">Ord: <b>{totalOrdered}</b></span>
          </div>
        )
      }
    },
    {
      header: 'Date Received',
      accessorKey: 'receivedDate',
      cell: ({ row }) => (
        <div className="flex items-center text-muted-foreground text-sm">
          <Calendar className="w-3.5 h-3.5 mr-2" />
          {formatDate(row.original.receivedDate)}
        </div>
      )
    },
    {
      header: 'Stock Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <Badge 
          variant="outline" 
          className={`capitalize ${getStockStatusColor(row.original.status)}`}
        >
          {getStockStatusDisplay(row.original.status)}
        </Badge>
      )
    }
  ], [suppliers])

  return (
    <div className="mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Stock In History
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Review all approved Goods Received Notes (GRN) and warehouse entries.
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchAllData} 
          disabled={fetchLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${fetchLoading ? 'animate-spin' : ''}`} />
          Sync Data
        </Button>
      </div>

      {/* Logic Alert */}
      <Alert className="bg-blue-500/5 border-blue-500/20">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-900 font-semibold">Automated Inventory Management</AlertTitle>
        <AlertDescription className="text-blue-800/80 text-sm">
          Warehouse stock levels update instantly upon GRN approval. 
          History below represents verified physical arrivals.
        </AlertDescription>
      </Alert>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total GRNs", val: stats.totalGRNs, icon: ClipboardCheck, color: "text-slate-500" },
          { label: "Items Received", val: stats.totalItems, icon: TrendingUp, color: "text-blue-600" },
          { label: "Approved Records", val: stats.approvedGRNs, icon: CheckCircle, color: "text-emerald-600" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.val}</p>
              </div>
              <stat.icon className={`w-10 h-10 ${stat.color} opacity-20`} />
            </CardContent>
          </Card>
        ))}
      </div>

      <StockInFilter
        filters={filters}
        onFilterChange={setFilters}
        suppliers={suppliers}
        stockInItems={stockInItems}
        filteredStockInItems={filteredStockInItems}
        resultsCount={filteredStockInItems.length}
        totalCount={stockInItems.length}
      />

      <Card className="border-border shadow-sm">
        <div className="p-1">
          <SharedTable
            columns={columns}
            data={filteredStockInItems}
            pageSize={10}
            loading={fetchLoading}
            renderRowActions={(grn) => (
              <Button variant="ghost" size="icon" onClick={() => handleView(grn)}>
                <Eye className="w-4 h-4" />
              </Button>
            )}
            actionsHeader="View"
          />
        </div>
      </Card>

      {/* Details Modal */}
      <StockInDetailsDialog 
        isOpen={isDetailsOpen} 
        onOpenChange={setIsDetailsOpen}
        grn={selectedGrn}
        suppliers={suppliers}
      />
    </div>
  )
}

export default StockInPages

