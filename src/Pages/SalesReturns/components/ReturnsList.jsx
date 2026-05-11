import React from 'react'
import { CheckCircle, XCircle, Trash2, Eye } from 'lucide-react'
import Button from '../../../Components/UI/Button'
import { SharedTable } from '../../../Shared/SharedTable/SharedTable'
import { getStatusColor, formatDateTime } from '../utils/returnsHelpers'

const ReturnsList = ({ returns, onApprove, onReject, onDelete, onView, loading }) => {
  const columns = [
    {
      accessorKey: 'returnId',
      header: 'Return ID',
      cell: ({ row }) => {
        const returnId = row.original.returnId || row.original._id?.toString().substring(0, 8) || 'N/A'
        return (
          <span className="font-semibold text-blue-600">
            {returnId.startsWith('RET-') ? returnId : `RET-${returnId}`}
          </span>
        )
      }
    },
    {
      accessorKey: 'invoiceNo',
      header: 'Invoice No',
      cell: ({ row }) => row.original.invoiceNo
    },
    {
      accessorKey: 'customerName',
      header: 'Customer',
      cell: ({ row }) => row.original.customerName
    },
    {
      accessorKey: 'reason',
      header: 'Reason',
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">{row.original.reason || 'No reason'}</span>
      )
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => formatDateTime(row.original.createdAt)
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(row.original.status)}`}>
          {row.original.status}
        </span>
      )
    }
  ]

  const renderRowActions = (returnItem) => (
    <div className="flex items-center gap-2">
      {/* View button - always available */}
      <Button variant="secondary" size="sm" onClick={() => onView(returnItem)}>
        <div className="flex items-center">
          <Eye className="w-4 h-4 mr-1" />
          View
        </div>
      </Button>
      
      {/* Status-specific actions */}
      {returnItem.status === 'Pending' && (
        <>
          <Button variant="primary" size="sm" onClick={() => onApprove(returnItem)}>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              Approve
            </div>
          </Button>
          <Button variant="delete" size="sm" onClick={() => onReject(returnItem)}>
            <div className="flex items-center">
              <XCircle className="w-4 h-4 mr-1" />
              Reject
            </div>
          </Button>
        </>
      )}
      {returnItem.status !== 'Approved' && (
        <Button variant="delete" size="sm" onClick={() => onDelete(returnItem)}>
          <div className="flex items-center">
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </div>
        </Button>
      )}
    </div>
  )

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <SharedTable 
        columns={columns} 
        data={returns} 
        loading={loading} 
        renderRowActions={renderRowActions} 
        actionsHeader="Actions"
        pageSize={10} 
      />
    </div>
  )
}

export default ReturnsList

