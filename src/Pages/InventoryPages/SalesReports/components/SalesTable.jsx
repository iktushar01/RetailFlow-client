import React from 'react'
import { FileText, ReceiptText } from 'lucide-react'
import { SharedTable } from '../../../../Shared/SharedTable/SharedTable'

// shadcn/ui or custom badge component
import { Badge } from "@/Components/UI/badge"

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
        <div className="py-1">
          <div className="font-semibold text-foreground">{formatDate(row.original.createdAt)}</div>
          <div className="text-xs text-muted-foreground tabular-nums">
            {formatDateTime(row.original.createdAt).split(',')[1]}
          </div>
        </div>
      )
    },
    {
      id: 'invoiceNo',
      accessorKey: 'invoiceNo',
      header: 'Invoice',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 rounded-md">
            <ReceiptText className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="font-mono text-sm font-bold text-primary tracking-tighter">
            {row.original.invoiceNo}
          </span>
        </div>
      )
    },
    {
      id: 'customer',
      accessorKey: 'customerName',
      header: 'Customer',
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-foreground">{row.original.customerName || 'Walk-in Customer'}</div>
          {row.original.customerPhone && (
            <div className="text-xs text-muted-foreground">{row.original.customerPhone}</div>
          )}
        </div>
      )
    },
    {
      id: 'totalAmount',
      accessorKey: 'grandTotal',
      header: () => <div className="text-right">Total Amount</div>,
      cell: ({ row }) => (
        <div className="text-right tabular-nums">
          <div className="text-base font-bold text-foreground">{formatCurrency(row.original.grandTotal)}</div>
          <div className="text-[10px] uppercase font-bold text-muted-foreground/70">
            {row.original.items.length} {row.original.items.length === 1 ? 'Item' : 'Items'}
          </div>
        </div>
      )
    },
    {
      id: 'paymentMethod',
      accessorKey: 'paymentMethod',
      header: () => <div className="text-center">Payment</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Badge variant="secondary" className="px-2.5 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider bg-primary/5 text-primary border-primary/10">
            {row.original.paymentMethod}
          </Badge>
        </div>
      )
    },
    {
      id: 'profit',
      accessorKey: 'profit',
      header: () => <div className="text-right">Estimated Profit</div>,
      cell: ({ row }) => {
        const sale = row.original
        const profit = sale.items.reduce((sum, item) => {
          const product = products.find(p => p._id === item.productId)
          if (!product) return sum
          return sum + ((item.unitPrice - (product.costPrice || 0)) * item.quantity)
        }, 0)
        
        const isPositive = profit >= 0
        
        return (
          <div className="text-right tabular-nums">
            <div className={`font-bold ${isPositive ? 'text-emerald-600' : 'text-destructive'}`}>
              {isPositive ? '+' : ''}{formatCurrency(profit)}
            </div>
            <div className={`text-[11px] font-medium ${isPositive ? 'text-emerald-600/70' : 'text-destructive/70'}`}>
              {sale.grandTotal > 0 ? `${((profit / sale.grandTotal) * 100).toFixed(1)}% margin` : '0%'}
            </div>
          </div>
        )
      }
    }
  ]

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="p-6 border-b border-border bg-muted/30">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Transaction Ledger
        </h3>
        <p className="text-xs text-muted-foreground mt-1">Detailed history of all sales and associated profit margins</p>
      </div>
      
      <div className="p-0">
        <SharedTable
          data={salesData}
          columns={tableColumns}
          loading={loading}
          emptyMessage="No transactions found for this period"
        />
      </div>
    </div>
  )
}

export default SalesTable

