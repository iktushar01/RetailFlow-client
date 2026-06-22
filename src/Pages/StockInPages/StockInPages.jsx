import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
  RefreshCw,
  Package,
  Info,
  Boxes,
  ClipboardList,
  Eye,
  Warehouse,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/Components/UI/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/UI/card'
import { Alert, AlertDescription, AlertTitle } from '@/Components/UI/alert'
import { Badge } from '@/Components/UI/badge'
import { Separator } from '@/Components/UI/separator'
import { SharedTable } from '../../Shared/SharedTable/SharedTable'
import StatsCard from '../../Shared/StatsCard/StatsCard'
import StockInFilter from './components/StockInFilter'
import { StockInDetailsDialog } from './components/StockInDetailsDialog'
import { grnAPI, suppliersAPI } from './services/stockInService'
import {
  formatDate,
  applyStockInFilters,
  calculateStockInStats,
  getStockStatusColor,
  getTotalOrderedQty,
  getTotalReceivedQty,
  sortGRNsByDate,
  getApprovedGRNs,
} from './utils/stockInHelpers'
import { cn } from '@/lib/utils'

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
    search: '',
  })

  const fetchAllData = useCallback(async () => {
    try {
      setFetchLoading(true)
      const [grnData, supplierData] = await Promise.all([
        grnAPI.getAll(),
        suppliersAPI.getAll(),
      ])
      setGrns(grnData || [])
      setSuppliers(supplierData || [])
    } catch {
      toast.error('Connection error', {
        description: 'Failed to fetch stock-in records.',
      })
    } finally {
      setFetchLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  const stockInItems = useMemo(() => sortGRNsByDate(getApprovedGRNs(grns)), [grns])

  const filteredStockInItems = useMemo(
    () => applyStockInFilters(stockInItems, filters),
    [stockInItems, filters]
  )

  const stats = useMemo(() => calculateStockInStats(stockInItems), [stockInItems])

  const handleView = (grn) => {
    setSelectedGrn(grn)
    setIsDetailsOpen(true)
  }

  const columns = useMemo(() => [
    {
      header: 'GRN Number',
      accessorKey: 'grnNumber',
      cell: ({ getValue }) => <span className="font-mono font-medium">{getValue()}</span>,
    },
    {
      header: 'PO Number',
      accessorKey: 'poNumber',
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{getValue() || 'N/A'}</span>
      ),
    },
    {
      header: 'Supplier',
      accessorKey: 'supplierId',
      cell: ({ row }) => {
        const supplier = suppliers.find((s) => s._id === row.original.supplierId)
        return (
          <div className="min-w-[140px]">
            <p className="text-sm">{supplier?.supplierName || 'N/A'}</p>
            {supplier?.email && (
              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                {supplier.email}
              </p>
            )}
          </div>
        )
      },
    },
    {
      header: 'Warehouse',
      accessorKey: 'destinationWarehouse',
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">{getValue() || 'Main Warehouse'}</span>
      ),
    },
    {
      header: 'Received',
      cell: ({ row }) => {
        const ordered = getTotalOrderedQty(row.original)
        const received = getTotalReceivedQty(row.original)
        return (
          <span className="text-sm">
            <span className="font-medium text-foreground">{received}</span>
            <span className="text-muted-foreground"> / {ordered}</span>
          </span>
        )
      },
    },
    {
      header: 'Date',
      accessorKey: 'receivedDate',
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">{formatDate(getValue())}</span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ getValue }) => {
        const status = getValue() || 'Approved'
        return (
          <Badge
            variant="outline"
            className={cn('font-normal', getStockStatusColor(status))}
          >
            {status === 'Approved' ? 'In Warehouse' : status}
          </Badge>
        )
      },
    },
  ], [suppliers])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Stock In</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Approved goods receipts and warehouse stock entries.
          </p>
        </div>
        <Button variant="outline" onClick={fetchAllData} disabled={fetchLoading}>
          <RefreshCw className={cn('w-4 h-4 mr-2', fetchLoading && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      <Alert className="bg-primary/5 border-primary/20">
        <Info className="h-4 w-4 text-primary" />
        <AlertTitle>Stock-in history</AlertTitle>
        <AlertDescription>
          Only approved GRNs appear here. Approve receipts on the GRN page to move stock into the warehouse.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard label="Approved GRNs" value={stats.totalGRNs} icon={ClipboardList} variant="blue" />
        <StatsCard label="Units Received" value={stats.totalItems} icon={Boxes} variant="green" />
        <StatsCard label="Active Suppliers" value={suppliers.length} icon={Package} variant="purple" />
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

      <Card className="overflow-hidden border shadow-none">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Warehouse className="w-5 h-5 text-primary" />
            <div>
              <CardTitle className="text-lg">Stock-in records</CardTitle>
              <CardDescription>
                {filteredStockInItems.length} of {stockInItems.length} approved receipts
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-0 sm:p-0">
          <SharedTable
            embedded
            columns={columns}
            data={filteredStockInItems}
            pageSize={10}
            loading={fetchLoading}
            actionsHeader="Actions"
            renderRowActions={(grn) => (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-muted-foreground hover:text-primary hover:bg-primary/10"
                onClick={() => handleView(grn)}
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
            )}
          />
        </CardContent>
      </Card>

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
