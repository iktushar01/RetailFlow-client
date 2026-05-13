import React, { useState, useMemo } from 'react'
import { 
  ArrowRightLeft, 
  Package, 
  History, 
  MapPin, 
  Layers, 
  AlertCircle,
  Search,
  ArrowRight
} from 'lucide-react'
import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert"
import { toast } from "sonner"

// Shared components refactored to Shadcn
import { SharedTable } from '../../Shared/SharedTable/SharedTable'
import { ReusableFilter } from '../../Shared/ReusableFilter/ReusableFilter'
import TransferModal from './components/TransferModal'
import TransferHistoryModal from './components/TransferHistoryModal'

// Hooks and Utils
import { useStockTransferData } from './hooks/useStockTransferData'
import { useFilters } from '../../hooks/useFilters'
import { 
  filterInventory, 
  getStockStatusColor, 
  getStockStatusBadge,
  getExportConfig 
} from './utils/stockTransferHelpers'
import { exportToCSV } from '../../utils/export'

const StockTransferImproved = () => {
  const {
    inventory,
    warehouses,
    transfers,
    loading,
    createTransfer
  } = useStockTransferData()

  const {
    filters,
    filteredData: filteredInventory,
    handleFilterChange,
    clearFilters
  } = useFilters(inventory, filterInventory, { search: '', warehouse: '' })

  const [transferModalOpen, setTransferModalOpen] = useState(false)
  const [historyModalOpen, setHistoryModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [transferData, setTransferData] = useState({
    sourceWarehouse: '',
    destinationWarehouse: '',
    quantity: 0
  })

  const handleOpenTransferModal = (item) => {
    setSelectedItem(item)
    setTransferData({
      sourceWarehouse: item.location || '',
      destinationWarehouse: '',
      quantity: item.stockQty || 0
    })
    setTransferModalOpen(true)
  }

  const handleTransferSubmit = async () => {
    // Note: Replaced custom HTML notify with a standard clean confirmation flow
    const success = await createTransfer({
      productId: selectedItem.productId,
      productName: selectedItem.productName,
      sourceWarehouse: transferData.sourceWarehouse,
      destinationWarehouse: transferData.destinationWarehouse,
      quantity: transferData.quantity
    })

    if (success) {
      toast.success("Transfer Successful", {
        description: `${transferData.quantity} units moved to ${transferData.destinationWarehouse}`
      })
      setTransferModalOpen(false)
      setSelectedItem(null)
    }
  }

  const warehouseOptions = useMemo(() => 
    [...new Set(inventory.map(item => item.location).filter(Boolean))],
    [inventory]
  )

  const columns = useMemo(() => [
    {
      accessorKey: 'productName',
      header: 'Product Details',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-muted">
            <Package className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold leading-none">{row.original.productName}</span>
            <span className="mt-1 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
              ID: {row.original.productId}
            </span>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'location',
      header: 'Warehouse',
      cell: ({ row }) => (
        <div className="flex items-center">
          <Badge variant="secondary" className="font-semibold px-2 py-0.5">
            <MapPin className="mr-1 h-3 w-3 text-blue-500" />
            {row.original.location || 'Unassigned'}
          </Badge>
        </div>
      )
    },
    {
      accessorKey: 'stockQty',
      header: 'Available Stock',
      cell: ({ row }) => {
        const qty = row.original.stockQty || 0
        const status = getStockStatusBadge(qty)
        return (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline gap-1">
              <span className={`text-xl font-black tracking-tight ${getStockStatusColor(qty)}`}>
                {qty}
              </span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Units</span>
            </div>
            <div className={`text-[10px] font-bold uppercase ${status.color}`}>
              {status.text}
            </div>
          </div>
        )
      }
    },
    {
      accessorKey: 'batch',
      header: 'Batch Info',
      cell: ({ row }) => (
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-semibold text-muted-foreground">
          {row.original.batch || '-'}
        </code>
      )
    }
  ], [])

  return (
    <div className=" mx-auto py-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <ArrowRightLeft className="h-8 w-8 text-primary" />
            Stock Transfer
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Relocate inventory items between physical warehouse zones.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setHistoryModalOpen(true)}>
            <History className="mr-2 h-4 w-4" />
            Transfer Logs
          </Button>
          <Button size="sm" onClick={() => exportToCSV(filteredInventory, ...getExportConfig())}>
            Download CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Active Products", val: filteredInventory.length, icon: Package, color: "text-blue-600" },
          { label: "Total Unit Count", val: inventory.reduce((a, b) => a + (b.stockQty || 0), 0), icon: Layers, color: "text-emerald-600" },
          { label: "Active Zones", val: warehouseOptions.length, icon: MapPin, color: "text-purple-600" },
          { label: "Total Movements", val: transfers.length, icon: ArrowRightLeft, color: "text-orange-600" },
        ].map((stat, i) => (
          <Card key={i} className="shadow-none border-muted">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black mt-0.5">{stat.val}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color} opacity-20`} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Transfer Guide */}
      <Alert className="bg-blue-50/50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-900 font-bold">Transfer Protocol</AlertTitle>
        <AlertDescription className="text-blue-800 text-xs mt-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
          <span className="flex items-center gap-2"><ArrowRight className="h-3 w-3" /> Select a source product from the inventory table.</span>
          <span className="flex items-center gap-2"><ArrowRight className="h-3 w-3" /> Partial quantity transfers are automatically logged.</span>
          <span className="flex items-center gap-2"><ArrowRight className="h-3 w-3" /> Real-time stock adjustment occurs upon confirmation.</span>
          <span className="flex items-center gap-2"><ArrowRight className="h-3 w-3" /> Destination warehouse must be different from source.</span>
        </AlertDescription>
      </Alert>

      {/* Filters & Table */}
      <Card className="border-none shadow-none">
        <div className="space-y-4">
          <ReusableFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            filterConfig={[
              { key: 'search', label: 'Search Product', type: 'search', placeholder: 'Name or ID...' },
              { key: 'warehouse', label: 'Filter by Zone', type: 'select', options: [{ value: '', label: 'All Zones' }, ...warehouseOptions.map(wh => ({ value: wh, label: wh }))] }
            ]}
            resultsCount={filteredInventory.length}
          />

          <Card className="overflow-hidden border-muted shadow-sm">
            <SharedTable
              columns={columns}
              data={filteredInventory}
              pageSize={10}
              loading={loading}
              renderRowActions={(item) => (
                <Button
                  size="sm"
                  className="font-bold shadow-sm"
                  onClick={() => handleOpenTransferModal(item)}
                  disabled={!item.stockQty || item.stockQty <= 0 || !item.location}
                >
                  <ArrowRightLeft className="mr-2 h-3.5 w-3.5" />
                  Initiate
                </Button>
              )}
              actionsHeader="Transfer"
            />
          </Card>
        </div>
      </Card>

      {/* Modals */}
      <TransferModal
        isOpen={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        selectedItem={selectedItem}
        warehouses={warehouses}
        transferData={transferData}
        setTransferData={setTransferData}
        onSubmit={handleTransferSubmit}
        warehousesLoading={loading}
      />

      <TransferHistoryModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        transfers={transfers}
      />
    </div>
  )
}

export default StockTransferImproved
