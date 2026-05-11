import React from 'react'
import { Package, Plus } from 'lucide-react'
import Button from '../../../../Components/UI/Button'
import { SharedTable } from '../../../../Shared/SharedTable/SharedTable'

const SuggestionsTable = ({ 
  suggestions, 
  suppliers, 
  loading, 
  onAddToPO 
}) => {
  const getPriorityColor = (priority) => {
    const colors = {
      High: 'text-red-600 bg-red-100',
      Medium: 'text-yellow-600 bg-yellow-100',
      Low: 'text-green-600 bg-green-100'
    }
    return colors[priority] || colors.Low
  }

  const getPriorityIcon = (priority) => {
    const icons = {
      High: '🔴',
      Medium: '🟡',
      Low: '🟢'
    }
    return icons[priority] || '🟢'
  }

  const tableColumns = [
    {
      id: 'product',
      accessorKey: 'productName',
      header: 'Product',
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-gray-900">{row.original.productName}</div>
          <div className="text-sm text-gray-500">SKU: {row.original.sku}</div>
        </div>
      )
    },
    {
      id: 'sales',
      accessorKey: 'monthlySales',
      header: 'Avg Monthly Sale',
      cell: ({ row }) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{row.original.monthlySales}</div>
          <div className="text-xs text-gray-500">units/month</div>
        </div>
      )
    },
    {
      id: 'currentStock',
      accessorKey: 'currentStock',
      header: 'Current Stock',
      cell: ({ row }) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{row.original.currentStock}</div>
          <div className="text-xs text-gray-500">units</div>
        </div>
      )
    },
    {
      id: 'suggestedQty',
      accessorKey: 'suggestedQty',
      header: 'Suggested Qty',
      cell: ({ row }) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-600">{row.original.suggestedQty}</div>
          <div className="text-xs text-gray-500">units</div>
        </div>
      )
    },
    {
      id: 'supplier',
      accessorKey: 'supplier',
      header: 'Supplier',
      cell: ({ row }) => {
        const item = row.original
        const supplier = suppliers.find(s => s._id === item.supplierId)
        return (
          <div className="text-center">
            <div className="font-medium text-gray-900">{supplier?.name || 'Unknown'}</div>
          </div>
        )
      }
    },
    {
      id: 'priority',
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <span className="text-lg mr-2">{getPriorityIcon(row.original.priority)}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(row.original.priority)}`}>
            {row.original.priority}
          </span>
        </div>
      )
    },
    {
      id: 'actions',
      accessorKey: 'actions',
      header: 'Action',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onAddToPO(row.original)}
          >
            <div className="flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add to PO
            </div>
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Package className="w-5 h-5 mr-2 text-purple-600" />
          Reorder Suggestions
        </h3>
      </div>
      <SharedTable
        data={suggestions}
        columns={tableColumns}
        loading={loading}
        emptyMessage="No reorder suggestions available"
      />
    </div>
  )
}

export default SuggestionsTable
