import React from 'react'
import { Eye, Edit, Trash2, CheckCircle, Calendar, Hash } from 'lucide-react'
import { Button } from '@/Components/UI/button'
import { Badge } from '@/Components/UI/badge'
import { SharedTable } from '@/Shared/SharedTable/SharedTable'
import { formatDate, getStatusColor } from '../utils/grnHelpers'
import { cn } from "@/lib/utils"

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
      header: 'GRN Details',
      accessorKey: 'grnNumber',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
            <span className="font-bold text-sm tracking-tight font-mono text-foreground">
              {row.original.grnNumber}
            </span>
          </div>
          <div className="flex items-center text-[10px] text-muted-foreground ml-3.5">
            <Hash className="w-3 h-3 mr-1" />
            <span>PO: {row.original.poNumber || 'N/A'}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Supplier',
      accessorKey: 'supplierId',
      cell: ({ row }) => {
        const supplier = suppliers.find(s => s._id === row.original.supplierId)
        return (
          <div className="max-w-[200px] truncate">
            <p className="font-semibold text-sm text-foreground leading-tight">
              {supplier?.supplierName || 'Unknown Supplier'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {supplier?.email || 'No email provided'}
            </p>
          </div>
        )
      }
    },
    {
      header: 'Received Date',
      accessorKey: 'receivedDate',
      cell: ({ row }) => (
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="w-3.5 h-3.5 mr-2 opacity-70" />
          {formatDate(row.original.receivedDate)}
        </div>
      )
    },
    {
      header: 'Quantity',
      accessorKey: 'items',
      cell: ({ row }) => {
        const itemCount = row.original.items?.length || 0
        const totalQty = row.original.items?.reduce((sum, item) => sum + (item.receivedQty || 0), 0) || 0
        
        return (
          <div className="flex flex-col items-center gap-1">
            <Badge variant="secondary" className="font-bold">
              {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
            </Badge>
            <span className="text-[10px] font-medium text-green-600 uppercase tracking-wider">
              Total: {totalQty}
            </span>
          </div>
        )
      }
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => {
        const status = row.original.status;
        // Map your helper colors to Shadcn-like utility classes
        const statusStyle = getStatusColor(status); 
        
        return (
          <Badge 
            variant="outline" 
            className={cn("font-bold capitalize border-2", statusStyle)}
          >
            {status}
          </Badge>
        )
      }
    }
  ], [suppliers])

  const renderRowActions = (grn) => {
    const isApproved = grn.status === 'Approved';
    const isPartial = grn.status === 'Partially Received';
    const isFull = grn.status === 'Fully Received';

    return (
      <div className="flex items-center justify-end gap-1.5">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={() => onView(grn)}
        >
          <Eye className="w-4 h-4 mr-1.5 text-muted-foreground" />
          View
        </Button>
        
        {isPartial && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 border-blue-200 hover:bg-blue-50 hover:text-blue-700 text-blue-600"
            onClick={() => onEdit(grn)}
          >
            <Edit className="w-4 h-4 mr-1.5" />
            Edit
          </Button>
        )}
        
        {(isPartial || isFull) && (
          <Button
            variant="default"
            size="sm"
            className="h-8 px-2 bg-green-600 hover:bg-green-700"
            onClick={() => onApprove(grn)}
          >
            <CheckCircle className="w-4 h-4 mr-1.5" />
            Approve
          </Button>
        )}
        
        {!isApproved && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(grn)}
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            Delete
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <SharedTable
        columns={columns}
        data={grns}
        pageSize={10}
        loading={loading}
        renderRowActions={renderRowActions}
        actionsHeader="Actions"
        // These classes are passed if your SharedTable supports container styling
        className="border-none shadow-none" 
      />
    </div>
  )
}

export default GRNList

