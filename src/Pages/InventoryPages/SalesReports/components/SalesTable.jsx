import React from 'react'
import { FileText } from 'lucide-react'
import { SharedTable } from '../../../../Shared/SharedTable/SharedTable'

const SalesTable = ({ 
  salesData, 
  loading, 
  products, 
  formatCurrency, 
  formatDate, 
  formatDateTime 
}) => {
  const tableColumns = [
    {
      id: 'date',
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-gray-900">{formatDate(row.original.createdAt)}</div>
          <div className="text-sm text-gray-500">{formatDateTime(row.original.createdAt).split(',')[1]}</div>
        </div>
      )
    },
    {
      id: 'invoiceNo',
      accessorKey: 'invoiceNo',
      header: 'Invoice No',
      cell: ({ row }) => (
        <div className="font-mono text-sm font-medium text-blue-600">
          {row.original.invoiceNo}
        </div>
      )
    },
    {
      id: 'customer',
      accessorKey: 'customerName',
      header: 'Customer',
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-gray-900">{row.original.customerName || 'Walk-in'}</div>
          {row.original.customerPhone && (
            <div className="text-sm text-gray-500">{row.original.customerPhone}</div>
          )}
        </div>
      )
    },
    {
      id: 'totalAmount',
      accessorKey: 'grandTotal',
      header: 'Total Amount',
      cell: ({ row }) => (
        <div className="text-right">
          <div className="text-lg font-semibold text-gray-900">{formatCurrency(row.original.grandTotal)}</div>
          <div className="text-xs text-gray-500">{row.original.items.length} items</div>
        </div>
      )
    },
    {
      id: 'paymentMethod',
      accessorKey: 'paymentMethod',
      header: 'Payment Method',
      cell: ({ row }) => (
        <div className="text-center">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {row.original.paymentMethod}
          </span>
        </div>
      )
    },
    {
      id: 'profit',
      accessorKey: 'profit',
      header: 'Profit',
      cell: ({ row }) => {
        const sale = row.original
        const profit = sale.items.reduce((sum, item) => {
          const product = products.find(p => p._id === item.productId)
          if (!product) return sum
          return sum + ((item.unitPrice - (product.costPrice || 0)) * item.quantity)
        }, 0)
        
        return (
          <div className="text-right">
            <div className={`font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(profit)}
            </div>
            <div className="text-xs text-gray-500">
              {sale.grandTotal > 0 ? `${((profit / sale.grandTotal) * 100).toFixed(1)}%` : '0%'}
            </div>
          </div>
        )
      }
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-blue-600" />
          Sales Transactions
        </h3>
      </div>
      <SharedTable
        data={salesData}
        columns={tableColumns}
        loading={loading}
        emptyMessage="No sales data available"
      />
    </div>
  )
}

export default SalesTable
