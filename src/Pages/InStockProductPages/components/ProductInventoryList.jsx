import React from 'react'
import { Eye, AlertTriangle, MapPin, Package, Calendar, Hash } from 'lucide-react'
import Button from '../../../Components/UI/Button'
import { SharedTable } from '../../../Shared/SharedTable/SharedTable'
import { formatDate, getStockStatusColor, getStockStatusText, getExpiryStatus } from '../utils/inventoryHelpers'

const ProductInventoryList = ({ 
  inventory = [], 
  loading = false,
  onView
}) => {
  
  // Flatten the product-centric data into individual location rows
  const flattenedData = React.useMemo(() => {
    const flattened = []
    
    inventory.forEach(product => {
      // Handle both old and new data structures
      const locations = product.locations || []
      
      locations.forEach(location => {
        flattened.push({
          ...product,
          ...location,
          // Ensure product info is available for each location row
          productName: product.productName || 'Unknown Product',
          sku: product.sku || 'N/A',
          category: product.category || 'Uncategorized',
          costPrice: product.costPrice || 0,
          sellingPrice: product.sellingPrice || 0,
          // Ensure location-specific data is properly mapped
          quantity: location.quantity || 0,
          location: location.location || 'Unknown Location',
          batch: location.batch || 'N/A',
          expiry: location.expiry || 'N/A',
          status: location.status || 'Unknown',
          lastUpdated: location.lastUpdated || product.updatedAt || product.createdAt,
          barcode: location.barcode || product.barcode || '',
          qrCode: location.qrCode || product.qrCode || ''
        })
      })
    })
    
    return flattened
  }, [inventory])

  const columns = React.useMemo(() => [
    {
      id: 'product',
      header: 'Product Name',
      accessorKey: 'productName',
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-gray-900">{row.original.productName}</p>
          <p className="text-xs text-gray-500">{row.original.category || 'N/A'}</p>
        </div>
      )
    },
    {
      id: 'sku',
      header: 'SKU / Product ID',
      accessorKey: 'sku',
      cell: ({ row }) => (
        <div>
          <p className="font-mono text-sm text-gray-700">{row.original.sku || 'N/A'}</p>
          <p className="text-xs text-gray-500">{row.original.productId?.slice(-8) || 'N/A'}</p>
        </div>
      )
    },
    {
      id: 'batch',
      header: 'Batch No',
      accessorKey: 'batch',
      cell: ({ row }) => (
        <div className="flex items-center">
          <Hash className="w-4 h-4 text-gray-400 mr-1" />
          <span className="font-mono text-sm text-gray-700">
            {row.original.batch || 'N/A'}
          </span>
        </div>
      )
    },
    {
      id: 'expiry',
      header: 'Expiry Date',
      accessorKey: 'expiry',
      cell: ({ row }) => {
        const expiryStatus = getExpiryStatus(row.original.expiry)
        return (
          <div className="flex items-center">
            <Calendar className="w-4 h-4 text-gray-400 mr-1" />
            <div>
              <p className="text-sm text-gray-700">
                {row.original.expiry || 'N/A'}
              </p>
              {expiryStatus && (
                <span className={`text-xs px-1 py-0.5 rounded ${expiryStatus.color}`}>
                  {expiryStatus.status}
                </span>
              )}
            </div>
          </div>
        )
      }
    },
    {
      id: 'quantity',
      header: 'Quantity',
      accessorKey: 'quantity',
      cell: ({ row }) => {
        const quantity = row.original.quantity || 0
        const colorClass = quantity === 0 ? 'text-red-600' : quantity <= 10 ? 'text-yellow-600' : 'text-green-600'
        
        return (
          <div className="flex items-center">
            <Package className="w-4 h-4 text-gray-400 mr-1" />
            <span className={`font-semibold ${colorClass}`}>
              {quantity}
            </span>
          </div>
        )
      }
    },
    {
      id: 'location',
      header: 'Location',
      accessorKey: 'location',
      cell: ({ row }) => (
        <div className="flex items-center">
          <MapPin className="w-4 h-4 text-gray-400 mr-1" />
          <span className="text-sm text-gray-700">
            {row.original.location || 'Unknown Location'}
          </span>
        </div>
      )
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => {
        const status = row.original.status || 'Unknown'
        const colorClass = getStockStatusColor(status)
        const statusText = getStockStatusText(status)
        
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
            {statusText}
          </span>
        )
      }
    },
    {
      id: 'lastUpdated',
      header: 'Last Updated',
      accessorKey: 'lastUpdated',
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">
          {formatDate(row.original.lastUpdated)}
        </div>
      )
    },
    {
      id: 'actions',
      header: 'ACTIONS',
      accessorKey: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onView(row.original)}
          >
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              View
            </div>
          </Button>
        </div>
      )
    }
  ], [onView])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading inventory...</span>
      </div>
    )
  }

  if (flattenedData.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No inventory found</h3>
        <p className="text-gray-500">No products with inventory data available.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <SharedTable
        data={flattenedData}
        columns={columns}
        loading={loading}
        emptyMessage="No inventory data available"
      />
    </div>
  )
}

export default ProductInventoryList
