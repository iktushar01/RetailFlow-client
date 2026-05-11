import React from 'react'
import { Eye, Printer } from 'lucide-react'
import Button from '../../../Components/UI/Button'
import { SharedTable } from '../../../Shared/SharedTable/SharedTable'
import { getPaymentStatusColor, formatCurrency, formatDateTime } from '../utils/invoiceHelpers'

const InvoiceList = ({ invoices, onView, onPrint, loading }) => {
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
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-gray-900">{row.original.customerName}</div>
          {row.original.customerPhone && (
            <div className="text-xs text-gray-500">{row.original.customerPhone}</div>
          )}
        </div>
      )
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => formatDateTime(row.original.createdAt)
    },
    {
      accessorKey: 'grandTotal',
      header: 'Total',
      cell: ({ row }) => (
        <span className="font-semibold text-green-600">{formatCurrency(row.original.grandTotal)}</span>
      )
    },
    {
      accessorKey: 'paymentStatus',
      header: 'Payment Status',
      cell: ({ row }) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(row.original.paymentStatus)}`}>
          {row.original.paymentStatus}
        </span>
      )
    }
  ]

  const renderRowActions = (invoice) => (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={() => onView(invoice)}>
        <div className="flex items-center">
          <Eye className="w-4 h-4 mr-2" />
          View
        </div>
      </Button>
      <Button variant="primary" size="sm" onClick={() => onPrint(invoice)}>
        <div className="flex items-center">
          <Printer className="w-4 h-4 mr-2" />
          Print
        </div>
      </Button>
    </div>
  )

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <SharedTable columns={columns} data={invoices} loading={loading} renderRowActions={renderRowActions} pageSize={10} />
    </div>
  )
}

export default InvoiceList

