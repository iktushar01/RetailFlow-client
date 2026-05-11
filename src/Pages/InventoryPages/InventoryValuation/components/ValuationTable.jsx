import React from 'react'
import { Package } from 'lucide-react'
import { SharedTable } from '../../../../Shared/SharedTable/SharedTable'

const ValuationTable = ({ 
  valuationData, 
  loading, 
  getMarginColor, 
  getValueRange 
}) => {
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
      id: 'quantity',
      accessorKey: 'quantity',
      header: 'Qty',
      cell: ({ row }) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{row.original.quantity}</div>
          <div className="text-xs text-gray-500">units</div>
        </div>
      )
    },
    {
      id: 'costPrice',
      accessorKey: 'costPrice',
      header: 'Cost Price',
      cell: ({ row }) => (
        <div className="text-right">
          <div className="font-medium text-gray-900">BDT {row.original.costPrice.toFixed(2)}</div>
          <div className="text-xs text-gray-500">Avg PO Cost</div>
        </div>
      )
    },
    {
      id: 'totalValue',
      accessorKey: 'totalValue',
      header: 'Total Value (BDT)',
      cell: ({ row }) => (
        <div className="text-right">
          <div className="text-lg font-semibold text-blue-600">BDT {row.original.totalValue.toFixed(2)}</div>
          <div className="text-xs text-gray-500">{getValueRange(row.original.totalValue)} Value</div>
        </div>
      )
    },
    {
      id: 'margin',
      accessorKey: 'marginPercentage',
      header: 'Margin %',
      cell: ({ row }) => (
        <div className="text-center">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMarginColor(row.original.marginPercentage)}`}>
            {row.original.marginPercentage.toFixed(1)}%
          </span>
          <div className="text-xs text-gray-500 mt-1">BDT {row.original.margin.toFixed(2)}</div>
        </div>
      )
    },
    {
      id: 'potentialValue',
      accessorKey: 'potentialValue',
      header: 'Potential Value',
      cell: ({ row }) => (
        <div className="text-right">
          <div className="font-medium text-green-600">BDT {row.original.potentialValue.toFixed(2)}</div>
          <div className="text-xs text-gray-500">if sold</div>
        </div>
      )
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Package className="w-5 h-5 mr-2 text-green-600" />
          Inventory Valuation Details
        </h3>
      </div>
      <SharedTable
        data={valuationData}
        columns={tableColumns}
        loading={loading}
        emptyMessage="No valuation data available"
      />
    </div>
  )
}

export default ValuationTable
