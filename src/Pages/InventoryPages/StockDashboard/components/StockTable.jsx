import React from 'react'
import { Package } from 'lucide-react'
import { SharedTable } from '../../../../Shared/SharedTable/SharedTable'

const StockTable = ({ stockData, loading, getStockStatus, getStatusIcon }) => {
  const tableColumns = [
    {
      id: 'product',
      accessorKey: 'productName',
      header: 'Product',
      cell: ({ row }) => {
        const item = row.original
        return (
          <div>
            <div className="font-medium text-gray-900">{item.productName || 'Unknown'}</div>
            <div className="text-sm text-gray-500">SKU: {item.sku || 'N/A'}</div>
            <div className="text-xs text-gray-400">{item.category || 'N/A'}</div>
          </div>
        )
      }
    },
    {
      id: 'quantity',
      accessorKey: 'stockQty',
      header: 'Current Qty',
      cell: ({ row }) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{row.original.stockQty || 0}</div>
          <div className="text-xs text-gray-500">units</div>
        </div>
      )
    },
    {
      id: 'location',
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => (
        <div className="text-center">
          <div className="font-medium text-gray-900">{row.original.location || 'N/A'}</div>
          {row.original.batch && row.original.batch !== 'N/A' && (
            <div className="text-xs text-gray-500">Batch: {row.original.batch}</div>
          )}
        </div>
      )
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const item = row.original
        const statusInfo = getStockStatus(item.stockQty || 0)
        return (
          <div className="flex items-center justify-center">
            <span className="text-lg mr-2">{getStatusIcon(item.stockQty || 0)}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
              {statusInfo.status}
            </span>
          </div>
        )
      }
    },
    {
      id: 'value',
      accessorKey: 'value',
      header: 'Value',
      cell: ({ row }) => {
        const item = row.original
        const value = (item.stockQty || 0) * (item.costPrice || 0)
        return (
          <div className="text-right">
            <div className="font-medium text-gray-900">BDT {value.toFixed(2)}</div>
            <div className="text-xs text-gray-500">BDT {(item.costPrice || 0).toFixed(2)} each (Avg PO)</div>
          </div>
        )
      }
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Package className="w-5 h-5 mr-2 text-blue-600" />
          Live Stock Table
        </h3>
      </div>
      <SharedTable
        data={stockData}
        columns={tableColumns}
        loading={loading}
        emptyMessage="No stock data available"
      />
    </div>
  )
}

export default StockTable
