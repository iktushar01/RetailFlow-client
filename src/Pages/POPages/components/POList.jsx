import React from 'react'
import { SharedTable } from '../../../Shared/SharedTable/SharedTable'
import Button from '../../../Components/UI/Button'
import { Edit, Trash2, Eye, Send } from 'lucide-react'
import { getStatusColor, formatCurrency, formatDate } from '../utils/poHelpers'

const POList = ({
  purchaseOrders,
  suppliers,
  loading,
  onView,
  onEdit,
  onDelete,
  onSend
}) => {
  const columns = [
    {
      header: 'PO Number',
      accessorKey: 'poNumber',
      cell: ({ getValue }) => (
        <div className="font-mono font-semibold text-blue-600">
          {getValue()}
        </div>
      )
    },
    {
      header: 'Supplier',
      accessorKey: 'supplier',
      cell: ({ row }) => {
        const supplier = suppliers.find(s => s._id === row.original.supplier)
        return (
          <div>
            <div className="font-medium text-gray-900">{supplier?.supplierName || 'N/A'}</div>
            {supplier?.contactPerson && (
              <div className="text-xs text-gray-500">{supplier.contactPerson}</div>
            )}
          </div>
        )
      }
    },
    {
      header: 'PO Date',
      accessorKey: 'poDate',
      cell: ({ getValue }) => (
        <div className="text-gray-700">{formatDate(getValue())}</div>
      )
    },
    {
      header: 'Delivery Date',
      accessorKey: 'expectedDeliveryDate',
      cell: ({ getValue }) => (
        <div className="text-gray-700">{formatDate(getValue())}</div>
      )
    },
    {
      header: 'Total Amount',
      accessorKey: 'total',
      cell: ({ getValue }) => (
        <div className="font-bold text-gray-900">
          {formatCurrency(getValue())}
        </div>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ getValue }) => {
        const status = getValue()
        return (
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(status)}`}>
            <span className="w-2 h-2 rounded-full mr-2 animate-pulse" 
              style={{
                backgroundColor: 
                  status === 'Pending' ? '#F59E0B' :
                  status === 'Sent' ? '#3B82F6' :
                  status === 'Completed' ? '#10B981' : '#EF4444'
              }}
            />
            {status}
          </span>
        )
      }
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <SharedTable
        columns={columns}
        data={purchaseOrders}
        loading={loading}
        pageSize={10}
        actionsHeader="Actions"
        renderRowActions={(po) => (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(po)}
              title="View Details"
              className="flex items-center shadow-sm"
            >
              <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1.5" />
              <span>View</span>
              </div>
            </Button>
            
            {/* Only show Edit for Draft and Pending statuses */}
            {po.status !== 'Fully Received' && po.status !== 'Partially Received' && po.status !== 'Sent' && (
              <Button
                variant="edit"
                size="sm"
                onClick={() => onEdit(po)}
                title="Edit Purchase Order"
                className="flex items-center"
              >
                <div className="flex items-center">
                <Edit className="w-4 h-4 mr-1.5" />
                <span>Edit</span>
                </div>
              </Button>
            )}
            
            {/* Only show Send button for Draft/Pending POs */}
            {po.status !== 'Sent' && po.status !== 'Partially Received' && po.status !== 'Fully Received' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSend(po)}
                title="Send to Supplier"
                className="flex items-center shadow-sm text-purple-600 hover:text-white hover:bg-purple-600"
              >
                <div className="flex items-center ">
                <Send className="w-4 h-4 mr-1.5" />
                <span>Send</span>
                </div>
              </Button>
            )}
            
            {/* Don't allow delete for Fully Received or Partially Received POs */}
            {po.status !== 'Fully Received' && po.status !== 'Partially Received' && (
              <Button
                variant="delete"
                size="sm"
                onClick={() => onDelete(po)}
                title="Delete Purchase Order"
                className="flex items-center"
              >
                <div className="flex items-center">
                <Trash2 className="w-4 h-4 mr-1.5" />
                <span>Delete</span>
                </div>
              </Button>
            )}
          </div>
        )}
      />
    </div>
  )
}

export default POList

