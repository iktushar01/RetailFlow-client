import React from 'react'
import { Eye, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import Button from '../../../Components/UI/Button'
import { SharedTable } from '../../../Shared/SharedTable/SharedTable'
import { getStatusColor, getStatusLabel, formatDateForInput } from '../utils/discountsHelpers'

const DiscountsList = ({ discounts, onEdit, onDelete, onToggleStatus, loading }) => {
  const columns = [
    {
      accessorKey: 'offerName',
      header: 'Offer Name',
      cell: ({ row }) => (
        <div>
          <div className="font-semibold text-gray-900">{row.original.offerName}</div>
          {row.original.code && (
            <div className="text-xs text-gray-500">Code: {row.original.code}</div>
          )}
        </div>
      )
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          {row.original.type}
        </span>
      )
    },
    {
      accessorKey: 'value',
      header: 'Discount',
      cell: ({ row }) => (
        <span className="font-semibold text-green-600">
          {row.original.type === 'Percentage' ? `${row.original.value}%` : `$${row.original.value}`}
        </span>
      )
    },
    {
      accessorKey: 'validFrom',
      header: 'Valid From',
      cell: ({ row }) => new Date(row.original.validFrom).toLocaleDateString()
    },
    {
      accessorKey: 'validTo',
      header: 'Valid To',
      cell: ({ row }) => new Date(row.original.validTo).toLocaleDateString()
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(row.original)}`}>
          {getStatusLabel(row.original)}
        </span>
      )
    }
  ]

  const renderRowActions = (discount) => (
    <div className="flex items-center gap-2">
      <Button
        variant={discount.status === 'Active' ? 'delete' : 'primary'}
        size="sm"
        onClick={() => onToggleStatus(discount)}
      >
        <div className="flex items-center">
          {discount.status === 'Active' ? (
            <ToggleRight className="w-4 h-4 mr-2" />
          ) : (
            <ToggleLeft className="w-4 h-4 mr-2" />
          )}
          {discount.status === 'Active' ? 'Deactivate' : 'Activate'}
        </div>
      </Button>
      
      <Button
        variant="edit"
        size="sm"
        onClick={() => onEdit(discount)}
      >
        <div className="flex items-center">
          <Pencil className="w-4 h-4 mr-2" />
          Edit
        </div>
      </Button>
      
      <Button
        variant="delete"
        size="sm"
        onClick={() => onDelete(discount)}
      >
        <div className="flex items-center">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </div>
      </Button>
    </div>
  )

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <SharedTable
        columns={columns}
        data={discounts}
        loading={loading}
        renderRowActions={renderRowActions}
        pageSize={10}
      />
    </div>
  )
}

export default DiscountsList

