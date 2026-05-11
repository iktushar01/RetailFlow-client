import React, { useState } from 'react'
import { ArrowRightLeft, Plus, Package, History, MapPin, Layers, AlertCircle } from 'lucide-react'
import Button from '../../Components/UI/Button'
import PageHeader from '../../Shared/PageHeader/PageHeader'
import StatsCard from '../../Shared/StatsCard/StatsCard'
import InfoCard from '../../Shared/InfoCard/InfoCard'
import EmptyState from '../../Shared/EmptyState/EmptyState'
import { SharedTable } from '../../Shared/SharedTable/SharedTable'
import { ReusableFilter } from '../../Shared/ReusableFilter/ReusableFilter'
import TransferModal from './components/TransferModal'
import TransferHistoryModal from './components/TransferHistoryModal'
import { useStockTransferData } from './hooks/useStockTransferData'
import { useFilters } from '../../hooks/useFilters'
import { 
  filterInventory, 
  getStockStatusColor, 
  getStockStatusBadge,
  getExportConfig 
} from './utils/stockTransferHelpers'
import { exportToCSV } from '../../utils/export'
import { notify } from '../../utils/notifications'

const StockTransferImproved = () => {
  // Data management
  const {
    inventory,
    warehouses,
    transfers,
    loading,
    createTransfer
  } = useStockTransferData()

  // Filtering
  const {
    filters,
    filteredData: filteredInventory,
    handleFilterChange,
    clearFilters
  } = useFilters(inventory, filterInventory, { search: '', warehouse: '' })

  // Modal states
  const [transferModalOpen, setTransferModalOpen] = useState(false)
  const [historyModalOpen, setHistoryModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [transferData, setTransferData] = useState({
    sourceWarehouse: '',
    destinationWarehouse: '',
    quantity: 0
  })

  // Handlers
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
    const confirmed = await notify.custom({
      title: 'Confirm Transfer?',
      html: `
        <div class="text-left space-y-3">
          <p class="text-gray-700">You are about to transfer:</p>
          <div class="bg-blue-50 p-3 rounded">
            <p class="font-semibold text-gray-900">${selectedItem.productName}</p>
            <p class="text-sm text-gray-600">Quantity: <strong>${transferData.quantity} units</strong></p>
          </div>
          <div class="flex items-center justify-center gap-3 my-3">
            <span class="px-3 py-1 bg-red-100 text-red-700 rounded font-medium">${transferData.sourceWarehouse}</span>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
            <span class="px-3 py-1 bg-green-100 text-green-700 rounded font-medium">${transferData.destinationWarehouse}</span>
          </div>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Transfer',
      cancelButtonText: 'Cancel'
    })

    if (!confirmed.isConfirmed) return

    const success = await createTransfer({
      productId: selectedItem.productId,
      productName: selectedItem.productName,
      sourceWarehouse: transferData.sourceWarehouse,
      destinationWarehouse: transferData.destinationWarehouse,
      quantity: transferData.quantity
    })

    if (success) {
      setTransferModalOpen(false)
      setSelectedItem(null)
    }
  }

  const handleExport = () => {
    const { headers, keys, filename } = getExportConfig()
    exportToCSV(filteredInventory, headers, keys, filename)
  }

  // Get unique warehouses from inventory
  const warehouseOptions = [...new Set(inventory.map(item => item.location).filter(Boolean))]

  // Filter configuration
  const filterConfig = [
    {
      key: 'search',
      label: 'Search',
      type: 'search',
      placeholder: 'Search by product name or ID...',
      span: 2
    },
    {
      key: 'warehouse',
      label: 'Current Warehouse',
      type: 'select',
      options: [
        { value: '', label: 'All Warehouses' },
        ...warehouseOptions.map(wh => ({ value: wh, label: wh }))
      ]
    }
  ]

  // Table columns
  const columns = [
    {
      accessorKey: 'productName',
      header: 'Product',
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-3">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-bold text-gray-900">{row.original.productName}</div>
            <div className="text-xs text-gray-500 font-mono">{row.original.productId}</div>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'location',
      header: 'Current Warehouse',
      cell: ({ row }) => (
        <div className="flex items-center">
          <MapPin className="w-4 h-4 text-blue-600 mr-2" />
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold text-sm">
            {row.original.location || 'Not assigned'}
          </span>
        </div>
      )
    },
    {
      accessorKey: 'stockQty',
      header: 'Stock Quantity',
      cell: ({ row }) => {
        const qty = row.original.stockQty || 0
        const status = getStockStatusBadge(qty)
        return (
          <div>
            <div className="flex items-center mb-1">
              <Layers className="w-4 h-4 text-gray-400 mr-2" />
              <span className={`font-bold text-2xl ${getStockStatusColor(qty)}`}>
                {qty}
              </span>
              <span className="text-gray-500 ml-2">units</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>
              {status.text}
            </span>
          </div>
        )
      }
    },
    {
      accessorKey: 'batch',
      header: 'Batch',
      cell: ({ row }) => (
        <span className="text-sm text-gray-600 font-mono">
          {row.original.batch || '-'}
        </span>
      )
    }
  ]

  // Render row actions
  const renderRowActions = (item) => (
    <Button
      variant="primary"
      size="md"
      onClick={() => handleOpenTransferModal(item)}
      disabled={!item.stockQty || item.stockQty <= 0 || !item.location}
      title="Transfer to Another Warehouse"
    >
      <div className="flex items-center">
        <ArrowRightLeft className="w-4 h-4 mr-2" />
        Transfer
      </div>
    </Button>
  )

  // Calculate stats
  const totalProducts = filteredInventory.length
  const totalStock = filteredInventory.reduce((sum, item) => sum + (item.stockQty || 0), 0)
  const totalWarehouses = warehouseOptions.length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Stock Transfer Management"
        subtitle="Transfer inventory between warehouse locations efficiently"
        icon={ArrowRightLeft}
        actions={[
          {
            label: 'View History',
            icon: History,
            onClick: () => setHistoryModalOpen(true),
            variant: 'secondary'
          }
        ]}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatsCard
          label="Total Products"
          value={totalProducts}
          icon={Package}
          color="blue"
        />
        <StatsCard
          label="Total Stock"
          value={totalStock}
          icon={Layers}
          color="green"
        />
        <StatsCard
          label="Warehouses"
          value={totalWarehouses}
          icon={MapPin}
          color="purple"
        />
        <StatsCard
          label="Transfers Made"
          value={transfers.length}
          icon={ArrowRightLeft}
          color="yellow"
        />
      </div>

      {/* Info Card */}
      <InfoCard
        type="info"
        icon={AlertCircle}
        title="How Stock Transfer Works"
      >
        <div className="text-sm text-blue-700 mt-2 space-y-1">
          <p>• Select a product from the list below</p>
          <p>• Specify the quantity you want to transfer (partial transfers are supported)</p>
          <p>• Choose the destination warehouse</p>
          <p>• The remaining stock stays in the source warehouse</p>
          <p>• All transfers are tracked in the transfer history</p>
        </div>
      </InfoCard>

      {/* Filters */}
      <ReusableFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        filterConfig={filterConfig}
        title="Search & Filter Stock"
        resultsCount={filteredInventory.length}
        totalCount={inventory.filter(item => item.stockQty > 0).length}
        onExport={handleExport}
      />

      {/* Table or Empty State */}
      {filteredInventory.length === 0 && !loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <EmptyState
            icon={Package}
            title="No products available for transfer"
            message="Products with stock will appear here. Make sure products are assigned to warehouses."
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <SharedTable
            columns={columns}
            data={filteredInventory}
            pageSize={10}
            loading={loading}
            renderRowActions={renderRowActions}
            actionsHeader="Actions"
          />
        </div>
      )}

      {/* Transfer Modal */}
      <TransferModal
        isOpen={transferModalOpen}
        onClose={() => {
          setTransferModalOpen(false)
          setSelectedItem(null)
        }}
        selectedItem={selectedItem}
        warehouses={warehouses}
        transferData={transferData}
        setTransferData={setTransferData}
        onSubmit={handleTransferSubmit}
        warehousesLoading={loading}
      />

      {/* History Modal */}
      <TransferHistoryModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        transfers={transfers}
      />
    </div>
  )
}

export default StockTransferImproved

