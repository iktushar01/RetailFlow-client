import React, { useState, useEffect, useMemo } from 'react'
import { RefreshCw, Package, CheckCircle, Info, TrendingUp, ClipboardCheck } from 'lucide-react'
import Swal from 'sweetalert2'
import Button from '../../Components/UI/Button'
import StatsCard from '../../Shared/StatsCard/StatsCard'
import { SharedTable } from '../../Shared/SharedTable/SharedTable'
import StockInFilter from './components/StockInFilter'
import { showStockInDetails } from './components/StockInDetails'
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
  
  // Filter state
  const [filters, setFilters] = useState({
    status: '',
    supplier: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  })

  useEffect(() => {
    fetchAllData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchAllData = async () => {
    await Promise.all([
      fetchGRNs(),
      fetchSuppliers()
    ])
  }

  const fetchGRNs = async () => {
    try {
      setFetchLoading(true)
      const data = await grnAPI.getAll()
      setGrns(data || [])
    } catch (error) {
      console.error('Error fetching GRNs:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch GRN data. Please try again.',
        confirmButtonColor: '#3B82F6'
      })
    } finally {
      setFetchLoading(false)
    }
  }

  const fetchSuppliers = async () => {
    try {
      const data = await suppliersAPI.getAll()
      setSuppliers(data || [])
    } catch (error) {
      console.error('Error fetching suppliers:', error)
    }
  }

  // Filter handler
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  // Show only approved GRNs (stock already added to inventory automatically)
  const stockInItems = useMemo(() => {
    const approved = getApprovedGRNs(grns)
    return sortGRNsByDate(approved)
  }, [grns])

  // Filtered stock items
  const filteredStockInItems = useMemo(() => {
    return applyStockInFilters(stockInItems, filters)
  }, [stockInItems, filters])

  // Calculate summary stats
  const stats = useMemo(() => {
    return calculateStockInStats(stockInItems)
  }, [stockInItems])

  const columns = React.useMemo(() => [
    {
      header: 'GRN Number',
      accessorKey: 'grnNumber',
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
          <span className="font-semibold text-gray-900 font-mono">
            {row.original.grnNumber}
          </span>
        </div>
      )
    },
    {
      header: 'PO Number',
      accessorKey: 'poNumber',
      cell: ({ row }) => (
        <span className="font-mono text-blue-600 font-semibold">
          {row.original.poNumber || 'N/A'}
        </span>
      )
    },
    {
      header: 'Supplier Name',
      accessorKey: 'supplierId',
      cell: ({ row }) => {
        const supplier = suppliers.find(s => s._id === row.original.supplierId)
        return (
          <div>
            <p className="font-medium text-gray-900">{supplier?.supplierName || 'N/A'}</p>
            <p className="text-xs text-gray-500">{supplier?.email || ''}</p>
          </div>
        )
      }
    },
    {
      header: 'Products',
      accessorKey: 'items',
      cell: ({ row }) => (
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold text-sm">
          {row.original.items?.length || 0} items
        </span>
      )
    },
    {
      header: 'Ordered Qty',
      accessorKey: 'orderedQty',
      cell: ({ row }) => {
        const totalOrdered = getTotalOrderedQty(row.original)
        return <span className="font-semibold text-gray-700">{totalOrdered}</span>
      }
    },
    {
      header: 'Received Qty',
      accessorKey: 'receivedQty',
      cell: ({ row }) => {
        const totalReceived = getTotalReceivedQty(row.original)
        return <span className="font-semibold text-green-600">{totalReceived}</span>
      }
    },
    {
      header: 'Received Date',
      accessorKey: 'receivedDate',
      cell: ({ row }) => (
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDate(row.original.receivedDate)}
        </div>
      )
    },
    {
      header: 'Stock Status',
      accessorKey: 'status',
      cell: ({ row }) => {
        const status = row.original.status
        const color = getStockStatusColor(status)
        const displayText = getStockStatusDisplay(status)
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${color}`}>
            {displayText}
          </span>
        )
      }
    }
  ], [suppliers])

  const handleView = (grn) => {
    showStockInDetails(grn, suppliers)
  }

  const renderRowActions = (grn) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleView(grn)}
      title="View Details"
    >
      <div className="flex items-center">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span>View</span>
      </div>
    </Button>
  )

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Package className="w-8 h-8 mr-3 text-green-600" />
              Stock In (from GRN)
            </h1>
            <p className="text-gray-600 mt-2">
              Review GRN-approved stock entries that have been added to warehouse
            </p>
            
            
          </div>

          <Button 
            variant="secondary" 
            size="md"
            onClick={fetchAllData}
            disabled={fetchLoading}
            loading={fetchLoading}
            className="flex items-center"
          >
            <div className="flex items-center">
              <RefreshCw className="w-5 h-5 mr-2" />
              <span>Refresh</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Info Alert */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-900">Automatic Stock Update</p>
            <p className="text-sm text-blue-700 mt-1">
              Stock is automatically added to your warehouse inventory when GRNs are created. 
              This page shows the history of all stock entries from approved GRNs.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <StatsCard
          label="Total GRNs"
          value={stats.totalGRNs}
          icon={ClipboardCheck}
          color="gray"
        />
        <StatsCard
          label="Items Received"
          value={stats.totalItems}
          icon={TrendingUp}
          color="blue"
        />
        <StatsCard
          label="Approved GRNs"
          value={stats.approvedGRNs}
          icon={CheckCircle}
          color="green"
        />
      </div>

      {/* Filter Section */}
      <StockInFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        suppliers={suppliers}
        stockInItems={stockInItems}
        filteredStockInItems={filteredStockInItems}
        resultsCount={filteredStockInItems.length}
        totalCount={stockInItems.length}
      />

      {/* Stock In Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <SharedTable
          columns={columns}
          data={filteredStockInItems}
          pageSize={10}
          loading={fetchLoading}
          renderRowActions={renderRowActions}
          actionsHeader="Actions"
        />
      </div>
    </div>
  )
}

export default StockInPages
