import React from 'react'
import { Activity } from 'lucide-react'
import { SharedTable } from '../../../../Shared/SharedTable/SharedTable'

const AnalysisTable = ({ analysisData, loading }) => {
  const tableColumns = [
    {
      id: 'product',
      accessorKey: 'productName',
      header: 'Product',
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-gray-900">{row.original.productName}</div>
          <div className="text-sm text-gray-500">SKU: {row.original.sku}</div>
          <div className="text-xs text-gray-400">{row.original.category}</div>
        </div>
      )
    },
    {
      id: 'totalSold',
      accessorKey: 'totalSold',
      header: 'Total Sold',
      cell: ({ row }) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{row.original.totalSold}</div>
          <div className="text-xs text-gray-500">units</div>
        </div>
      )
    },
    {
      id: 'lastSaleDate',
      accessorKey: 'lastSaleDate',
      header: 'Last Sale Date',
      cell: ({ row }) => (
        <div className="text-center">
          <div className="font-medium text-gray-900">
            {row.original.lastSaleDate ? new Date(row.original.lastSaleDate).toLocaleDateString() : 'Never'}
          </div>
          {row.original.daysSinceLastSale !== null && (
            <div className="text-xs text-gray-500">
              {row.original.daysSinceLastSale} days ago
            </div>
          )}
        </div>
      )
    },
    {
      id: 'currentStock',
      accessorKey: 'currentStock',
      header: 'Stock Qty',
      cell: ({ row }) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{row.original.currentStock}</div>
          <div className="text-xs text-gray-500">units</div>
        </div>
      )
    },
    {
      id: 'velocity',
      accessorKey: 'velocity',
      header: 'Velocity',
      cell: ({ row }) => (
        <div className="text-center">
          <div className="font-medium text-gray-900">{row.original.velocity.toFixed(2)}</div>
          <div className="text-xs text-gray-500">units/day</div>
        </div>
      )
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <span className="text-lg mr-2">{row.original.statusIcon}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.original.statusColor}`}>
            {row.original.status}
          </span>
        </div>
      )
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-gray-600" />
          Stock Movement Analysis
        </h3>
      </div>
      <SharedTable
        data={analysisData}
        columns={tableColumns}
        loading={loading}
        emptyMessage="No analysis data available"
      />
    </div>
  )
}

export default AnalysisTable
