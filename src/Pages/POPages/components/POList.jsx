import React from 'react'
import { Eye, Edit, Trash2, Send, MoreHorizontal } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { SharedTable } from '../../../Shared/SharedTable/SharedTable'
import { getStatusColor, formatCurrency, formatDate } from '../utils/poHelpers'
import { cn } from "@/lib/utils"

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
        <div className="font-mono font-bold text-primary hover:underline cursor-pointer">
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
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">
              {supplier?.supplierName || 'N/A'}
            </span>
            {supplier?.contactPerson && (
              <span className="text-[11px] text-muted-foreground leading-tight">
                {supplier.contactPerson}
              </span>
            )}
          </div>
        )
      }
    },
    {
      header: 'PO Date',
      accessorKey: 'poDate',
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground font-medium">
          {formatDate(getValue())}
        </span>
      )
    },
    {
      header: 'Delivery Date',
      accessorKey: 'expectedDeliveryDate',
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground font-medium">
          {formatDate(getValue())}
        </span>
      )
    },
    {
      header: 'Total Amount',
      accessorKey: 'total',
      cell: ({ getValue }) => (
        <div className="font-bold text-foreground">
          {formatCurrency(getValue())}
        </div>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ getValue }) => {
        const status = getValue()
        
        // Mapping status to Shadcn Badge variants or custom logic
        const statusConfig = {
          'Pending': 'bg-amber-100 text-amber-700 border-amber-200',
          'Sent': 'bg-blue-100 text-blue-700 border-blue-200',
          'Completed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
          'Draft': 'bg-slate-100 text-slate-700 border-slate-200',
          'Cancelled': 'bg-destructive/10 text-destructive border-destructive/20'
        }

        return (
          <Badge 
            variant="outline" 
            className={cn(
              "px-2.5 py-0.5 font-bold uppercase tracking-wider text-[10px] gap-1.5",
              statusConfig[status] || "bg-muted text-muted-foreground"
            )}
          >
            <span className={cn(
              "h-1.5 w-1.5 rounded-full",
              status === 'Pending' && "bg-amber-500 animate-pulse",
              status === 'Sent' && "bg-blue-500",
              status === 'Completed' && "bg-emerald-500",
              status === 'Cancelled' && "bg-destructive"
            )} />
            {status}
          </Badge>
        )
      }
    }
  ]

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardContent className="p-0">
        <SharedTable
          columns={columns}
          data={purchaseOrders}
          loading={loading}
          pageSize={10}
          actionsHeader="Actions"
          renderRowActions={(po) => (
            <div className="flex items-center gap-1.5">
              {/* View Action */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(po)}
                className="h-8 px-2 text-muted-foreground hover:text-primary hover:bg-primary/10"
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              
              {/* Edit Action */}
              {['Draft', 'Pending'].includes(po.status) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(po)}
                  className="h-8 px-2 text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              )}
              
              {/* Send Action */}
              {!['Sent', 'Partially Received', 'Fully Received'].includes(po.status) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSend(po)}
                  className="h-8 px-2 text-purple-600 hover:bg-purple-50"
                >
                  <Send className="w-4 h-4 mr-1" />
                  Send
                </Button>
              )}
              
              {/* Delete Action */}
              {!['Fully Received', 'Partially Received'].includes(po.status) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(po)}
                  className="h-8 px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              )}
            </div>
          )}
        />
      </CardContent>
    </Card>
  )
}

export default POList