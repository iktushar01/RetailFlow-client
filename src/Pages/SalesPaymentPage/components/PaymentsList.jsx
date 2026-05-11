import React from 'react'
import { SharedTable } from '../../../Shared/SharedTable/SharedTable'
import { getPaymentMethodColor, formatCurrency, formatDateTime } from '../utils/paymentsHelpers'

const PaymentsList = ({ payments, loading }) => {
  const columns = [
    {
      accessorKey: 'invoiceNo',
      header: 'Invoice No',
      cell: ({ row }) => (
        <span className="font-semibold text-blue-600">{row.original.invoiceNo}</span>
      )
    },
    {
      accessorKey: 'customerName',
      header: 'Customer',
      cell: ({ row }) => row.original.customerName || 'N/A'
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Payment Method',
      cell: ({ row }) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentMethodColor(row.original.paymentMethod)}`}>
          {row.original.paymentMethod}
        </span>
      )
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => (
        <span className="font-semibold text-green-600">{formatCurrency(row.original.amount)}</span>
      )
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => formatDateTime(row.original.createdAt)
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <SharedTable columns={columns} data={payments} loading={loading} pageSize={10} />
    </div>
  )
}

export default PaymentsList

