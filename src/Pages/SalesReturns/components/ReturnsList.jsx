import React from 'react'
import { CheckCircle, XCircle, Trash2, Eye } from 'lucide-react'
import { Button } from "@/Components/UI/button"
import { Badge } from "@/Components/UI/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/UI/table"
import { TableSkeleton } from "@/Components/UI/PageSkeleton"
import { getStatusColor, formatDateTime } from '../utils/returnsHelpers'

const ReturnsList = ({ returns, onApprove, onReject, onDelete, onView, loading }) => {
  if (loading) {
    return <TableSkeleton rows={6} columns={6} showActions />
  }

  return (
    <Table>
      <TableHeader className="bg-muted/50">
        <TableRow>
          <TableHead>Return ID</TableHead>
          <TableHead>Invoice No</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Reason</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {returns.length > 0 ? (
          returns.map((returnItem) => {
            const rawId = returnItem.returnId || returnItem._id?.toString().substring(0, 8) || 'N/A'
            const displayId = rawId.startsWith('RET-') ? rawId : `RET-${rawId}`

            return (
              <TableRow key={returnItem._id || returnItem.id}>
                <TableCell className="font-medium text-primary">
                  {displayId}
                </TableCell>
                <TableCell className="font-medium">
                  {returnItem.invoiceNo}
                </TableCell>
                <TableCell>
                  {returnItem.customerName}
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground line-clamp-1 max-w-[200px]">
                    {returnItem.reason || 'No reason'}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDateTime(returnItem.createdAt)}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={`capitalize ${getStatusColor(returnItem.status)}`}
                  >
                    {returnItem.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onView(returnItem)}
                      className="h-8 px-2"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      <span className="hidden lg:inline">View</span>
                    </Button>

                    {returnItem.status === 'Pending' && (
                      <>
                        <Button 
                          variant="default" 
                          size="sm" 
                          onClick={() => onApprove(returnItem)}
                          className="h-8 px-2"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          <span className="hidden lg:inline">Approve</span>
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => onReject(returnItem)}
                          className="h-8 px-2"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          <span className="hidden lg:inline">Reject</span>
                        </Button>
                      </>
                    )}

                    {returnItem.status !== 'Approved' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onDelete(returnItem)}
                        className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        <span className="hidden lg:inline">Delete</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )
          })
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
              No sales returns found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export default ReturnsList
