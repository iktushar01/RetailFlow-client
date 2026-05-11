import React from 'react'
import { Eye, Edit, Trash2, CheckCircle } from 'lucide-react'
import Button from '../../../Components/UI/Button'
import { SharedTable } from '../../../Shared/SharedTable/SharedTable'
import { formatDate, getStatusColor } from '../utils/grnHelpers'

const GRNList = ({ 
  grns = [], 
  suppliers = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
  onApprove
}) => {
  
  const columns = React.useMemo(() => [
    {
      header: 'GRN Number',
      accessorKey: 'grnNumber',
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
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
        <span className="font-mono text-gray-700">
          {row.original.poNumber || 'N/A'}
        </span>
      )
    },
    {
      header: 'Supplier',
      accessorKey: 'supplier',
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
      header: 'Items',
      accessorKey: 'items',
      cell: ({ row }) => (
        <div className="text-center">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold text-sm">
            {row.original.items?.length || 0}
          </span>
        </div>
      )
    },
    {
      header: 'Total Received',
      accessorKey: 'totalReceived',
      cell: ({ row }) => {
        const totalReceived = row.original.items?.reduce((sum, item) => sum + (item.receivedQty || 0), 0) || 0
        return (
          <span className="font-semibold text-green-600">
            {totalReceived}
          </span>
        )
      }
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(row.original.status)}`}>
          {row.original.status}
        </span>
      )
    }
  ], [suppliers])

  const renderRowActions = (grn) => (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onView(grn)}
        title="View Details"
      >
        <div className="flex items-center">
          <Eye className="w-4 h-4 mr-1" />
          <span>View</span>
        </div>
      </Button>
      
      {/* Only allow edit for Partially Received GRNs */}
      {grn.status === 'Partially Received' && (
        <Button
          variant="edit"
          size="sm"
          onClick={() => onEdit(grn)}
          title="Edit GRN"
        >
          <div className="flex items-center">
            <Edit className="w-4 h-4 mr-1" />
            <span>Edit</span>
          </div>
        </Button>
      )}
      
      {/* Show Approve button for both Partially and Fully Received GRNs */}
      {(grn.status === 'Partially Received' || grn.status === 'Fully Received') && (
        <Button
          variant="primary"
          size="sm"
          onClick={() => onApprove(grn)}
          title={grn.status === 'Fully Received' ? "Approve GRN - All items received" : "Approve GRN - Partial receipt"}
        >
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span>Approve</span>
          </div>
        </Button>
      )}
      
      {/* Allow delete only if not approved */}
      {grn.status !== 'Approved' && (
        <Button
          variant="delete"
          size="sm"
          onClick={() => onDelete(grn)}
          title="Delete GRN"
        >
          <div className="flex items-center">
            <Trash2 className="w-4 h-4 mr-1" />
            <span>Delete</span>
          </div>
        </Button>
      )}
    </div>
  )

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <SharedTable
        columns={columns}
        data={grns}
        pageSize={10}
        loading={loading}
        renderRowActions={renderRowActions}
        actionsHeader="Actions"
      />
    </div>
  )
}

export default GRNList

