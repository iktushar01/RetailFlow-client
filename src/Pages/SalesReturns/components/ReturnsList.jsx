import React from 'react'
import { CheckCircle, XCircle, Trash2, Eye } from 'lucide-react'
import { Button } from "@/Components/ui/button"
import { Badge } from "@/Components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table"
import { Card } from "@/Components/ui/card"
import { Skeleton } from "@/Components/ui/skeleton"
import { getStatusColor, formatDateTime } from '../utils/returnsHelpers'

const ReturnsList = ({ returns, onApprove, onReject, onDelete, onView, loading }) => {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </Card>
    )
  }

  return (
    <Card className="border-none shadow-none">
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold text-foreground">Return ID</TableHead>
              <TableHead className="font-bold text-foreground">Invoice No</TableHead>
              <TableHead className="font-bold text-foreground">Customer</TableHead>
              <TableHead className="font-bold text-foreground">Reason</TableHead>
              <TableHead className="font-bold text-foreground">Date</TableHead>
              <TableHead className="font-bold text-foreground">Status</TableHead>
              <TableHead className="text-right font-bold text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {returns.length > 0 ? (
              returns.map((returnItem) => {
                const rawId = returnItem.returnId || returnItem._id?.toString().substring(0, 8) || 'N/A'
                const displayId = rawId.startsWith('RET-') ? rawId : `RET-${rawId}`

                return (
                  <TableRow key={returnItem._id || returnItem.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-semibold text-primary">
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
                        className={`font-semibold capitalize ${getStatusColor(returnItem.status)}`}
                      >
                        {returnItem.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {/* View Action */}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => onView(returnItem)}
                          className="h-8 px-2"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          <span className="hidden lg:inline">View</span>
                        </Button>

                        {/* Status-specific actions */}
                        {returnItem.status === 'Pending' && (
                          <>
                            <Button 
                              variant="default" 
                              size="sm" 
                              onClick={() => onApprove(returnItem)}
                              className="h-8 px-2 bg-primary hover:bg-primary/90"
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

                        {/* Delete Action */}
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
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground font-medium">
                  No sales returns found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}

export default ReturnsList
