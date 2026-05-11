import React from 'react'
import { Eye, AlertTriangle } from 'lucide-react'
import Button from '../../../Components/UI/Button'
import { SharedTable } from '../../../Shared/SharedTable/SharedTable'
import { formatDate, getStockStatusColor, getStockStatusText, getExpiryStatus } from '../utils/inventoryHelpers'

const InventoryList = ({ 
  inventory = [], 
  products = [],
  loading = false,
  onView
}) => {
  
  const columns = React.useMemo(() => [
    {
      header: 'Product Name',
      accessorKey: 'productName',
      cell: ({ row }) => {
        const product = products.find(p => p._id === row.original.productId)
        return (
          <div>
            <p className="font-medium text-gray-900">{row.original.productName}</p>
            <p className="text-xs text-gray-500">{product?.category || 'N/A'}</p>
          </div>
        )
      }
    },
    {
      header: 'SKU / Product ID',
      accessorKey: 'productId',
      cell: ({ row }) => {
        const product = products.find(p => p._id === row.original.productId)
        return (
          <div>
            <p className="font-mono text-sm text-gray-700">{product?.sku || 'N/A'}</p>
            <p className="text-xs text-gray-500">{row.original.productId.slice(-8)}</p>
          </div>
        )
      }
    },
    {
      header: 'Batch No',
      accessorKey: 'batch',
      cell: ({ row }) => (
        <span className="font-mono text-sm text-gray-700">
          {row.original.batch || 'N/A'}
        </span>
      )
    },
    {
      header: 'Expiry Date',
      accessorKey: 'expiry',
      cell: ({ row }) => {
        const expiryStatus = getExpiryStatus(row.original.expiry)
        return (
          <div className="flex flex-col">
            <span className="text-sm text-gray-700">
              {row.original.expiry ? formatDate(row.original.expiry).split(',')[0] : 'N/A'}
            </span>
            {expiryStatus && (
              <span className={`text-xs ${expiryStatus.color}`}>
                {expiryStatus.status === 'Expired' ? 'Expired!' : 
                 expiryStatus.status === 'Expiring Soon' ? `${expiryStatus.days}d left` : ''}
              </span>
            )}
          </div>
        )
      }
    },
    {
      header: 'Quantity',
      accessorKey: 'stockQty',
      cell: ({ row }) => {
        const stockQty = row.original.stockQty || 0
        const product = products.find(p => p._id === row.original.productId)
        const lowStockThreshold = product?.lowStockThreshold || 10
        
        return (
          <div className="text-center">
            <span className={`px-3 py-1 rounded-full font-bold text-lg ${
              stockQty === 0 ? 'text-red-600' : 
              stockQty <= lowStockThreshold ? 'text-yellow-600' : 
              'text-green-600'
            }`}>
              {stockQty}
            </span>
          </div>
        )
      }
    },
    {
      header: 'Location',
      accessorKey: 'location',
      cell: ({ row }) => (
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {row.original.location || 'Main Warehouse'}
        </div>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => {
        const stockQty = row.original.stockQty || 0
        const product = products.find(p => p._id === row.original.productId)
        const lowStockThreshold = product?.lowStockThreshold || 10
        const statusText = getStockStatusText(stockQty, lowStockThreshold)
        const statusColor = getStockStatusColor(stockQty, lowStockThreshold)
        
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor}`}>
            {statusText}
          </span>
        )
      }
    },
    {
      header: 'Last Updated',
      accessorKey: 'updatedAt',
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">
          {formatDate(row.original.updatedAt)}
        </span>
      )
    }
  ], [products])

  const renderRowActions = (item) => {
    const expiryStatus = getExpiryStatus(item.expiry)
    const isExpiring = expiryStatus && (expiryStatus.status === 'Expired' || expiryStatus.status === 'Expiring Soon')
    
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onView(item)}
          title="View Details"
        >
          <div className="flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            <span>View</span>
          </div>
        </Button>
        
        {isExpiring && (
          <div className="flex items-center text-red-600" title={`${expiryStatus.status}`}>
            <AlertTriangle className="w-4 h-4" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <SharedTable
        columns={columns}
        data={inventory}
        pageSize={10}
        loading={loading}
        renderRowActions={renderRowActions}
        actionsHeader="Actions"
      />
    </div>
  )
}

export default InventoryList

