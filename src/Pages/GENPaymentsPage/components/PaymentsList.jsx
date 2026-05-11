import React from 'react'
import { DollarSign, History, Eye } from 'lucide-react'
import Button from '../../../Components/UI/Button'
import { SharedTable } from '../../../Shared/SharedTable/SharedTable'
import { formatCurrency, formatDate, getPaymentStatusColor, calculateDueAmount } from '../utils/paymentsHelpers'

const PaymentsList = ({ 
  payments = [], 
  suppliers = [],
  loading = false,
  onAddPayment,
  onViewHistory,
  onView
}) => {
  
  const columns = React.useMemo(() => [
    {
      header: 'Supplier Name',
      accessorKey: 'supplierName',
      cell: ({ row }) => {
        const supplier = suppliers.find(s => s._id === row.original.supplierId)
        const supplierName = row.original.supplierName || supplier?.supplierName || supplier?.name || 'N/A'
        return (
          <div>
            <p className="font-medium text-gray-900">{supplierName}</p>
            <p className="text-xs text-gray-500">{supplier?.email || ''}</p>
          </div>
        )
      }
    },
    {
      header: 'PO Number',
      accessorKey: 'poNumber',
      cell: ({ row }) => (
        <span className="font-mono text-gray-700 font-semibold">
          {row.original.poNumber || 'N/A'}
        </span>
      )
    },
    {
      header: 'GRN Number',
      accessorKey: 'grnNumber',
      cell: ({ row }) => (
        <span className="font-mono text-blue-600 font-semibold">
          {row.original.grnNumber || 'N/A'}
        </span>
      )
    },
    {
      header: 'Total Amount',
      accessorKey: 'totalAmount',
      cell: ({ row }) => (
        <span className="font-bold text-gray-900">
          {formatCurrency(row.original.totalAmount || row.original.amountDue || 0)}
        </span>
      )
    },
    {
      header: 'Paid Amount',
      accessorKey: 'amountPaid',
      cell: ({ row }) => (
        <span className="font-semibold text-green-600">
          {formatCurrency(row.original.amountPaid || 0)}
        </span>
      )
    },
    {
      header: 'Due Amount',
      accessorKey: 'dueAmount',
      cell: ({ row }) => {
        const totalAmount = row.original.totalAmount || row.original.amountDue || 0
        const dueAmount = row.original.dueAmount || calculateDueAmount(totalAmount, row.original.amountPaid)
        return (
          <span className="font-semibold text-red-600">
            {formatCurrency(dueAmount)}
          </span>
        )
      }
    },
    {
      header: 'Due Date',
      accessorKey: 'dueDate',
      cell: ({ row }) => (
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDate(row.original.dueDate)}
        </div>
      )
    },
    {
      header: 'Payment Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPaymentStatusColor(row.original.status)}`}>
          {row.original.status}
        </span>
      )
    }
  ], [suppliers])

  const renderRowActions = (payment) => (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onView(payment)}
        title="View Details"
      >
        <div className="flex items-center">
          <Eye className="w-4 h-4 mr-1" />
          <span>View</span>
        </div>
      </Button>
      
      {payment.status !== 'Paid' && (
        <Button
          variant="primary"
          size="sm"
          onClick={() => onAddPayment(payment)}
          title="Add Payment"
        >
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-1" />
            <span>Add Payment</span>
          </div>
        </Button>
      )}
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewHistory(payment)}
        title="Payment History"
        className="text-purple-600 hover:bg-purple-50"
      >
        <div className="flex items-center">
          <History className="w-4 h-4 mr-1" />
          <span>History</span>
        </div>
      </Button>
    </div>
  )

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <SharedTable
        columns={columns}
        data={payments}
        pageSize={10}
        loading={loading}
        renderRowActions={renderRowActions}
        actionsHeader="Actions"
      />
    </div>
  )
}

export default PaymentsList

