import React from 'react'
import { Eye, Edit, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/Components/UI/button'
import { Badge } from '@/Components/UI/badge'
import { Card } from '@/Components/UI/card'
import { SharedTable } from '@/Shared/SharedTable/SharedTable'
import { formatDate, getStatusColor } from '../utils/grnHelpers'
import { cn } from '@/lib/utils'

const statusBadgeStyles = {
  Pending: 'bg-amber-100 text-amber-800 border-amber-200',
  Approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Rejected: 'bg-red-100 text-red-800 border-red-200',
}

const GRNList = ({
  grns = [],
  suppliers = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
}) => {
  const columns = React.useMemo(() => [
    {
      header: 'GRN Number',
      accessorKey: 'grnNumber',
      cell: ({ getValue }) => <span className="font-mono">{getValue()}</span>,
    },
    {
      header: 'PO Number',
      accessorKey: 'poNumber',
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{getValue() || 'N/A'}</span>
      ),
    },
    {
      header: 'Supplier',
      accessorKey: 'supplierId',
      cell: ({ row }) => {
        const supplier = suppliers.find(s => s._id === row.original.supplierId)
        return <span>{supplier?.supplierName || 'N/A'}</span>
      },
    },
    {
      header: 'Received Date',
      accessorKey: 'receivedDate',
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">{formatDate(getValue())}</span>
      ),
    },
    {
      header: 'Items',
      accessorKey: 'items',
      cell: ({ row }) => {
        const itemCount = row.original.items?.length || 0
        const totalQty = row.original.items?.reduce((sum, item) => sum + (item.receivedQty || 0), 0) || 0
        return (
          <span className="text-sm text-muted-foreground">
            {itemCount} items · {totalQty} qty
          </span>
        )
      },
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ getValue }) => {
        const status = getValue() || 'Pending'
        return (
          <Badge
            variant="outline"
            className={cn('font-normal', statusBadgeStyles[status] || getStatusColor(status))}
          >
            {status}
          </Badge>
        )
      },
    },
  ], [suppliers])

  const renderRowActions = (grn) => {
    const isPending = grn.status === 'Pending'
    const isApproved = grn.status === 'Approved'

    return (
      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-muted-foreground hover:text-primary hover:bg-primary/10"
          onClick={() => onView(grn)}
        >
          <Eye className="w-4 h-4 mr-1" />
          View
        </Button>

        {isPending && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
              onClick={() => onEdit(grn)}
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
              onClick={() => onApprove(grn)}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Approve
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-destructive hover:bg-destructive/10"
              onClick={() => onReject(grn)}
            >
              <XCircle className="w-4 h-4 mr-1" />
              Reject
            </Button>
          </>
        )}
      </div>
    )
  }

  return (
    <Card className="overflow-hidden border shadow-none">
      <SharedTable
        embedded
        columns={columns}
        data={grns}
        pageSize={10}
        loading={loading}
        renderRowActions={renderRowActions}
        actionsHeader="Actions"
      />
    </Card>
  )
}

export default GRNList
