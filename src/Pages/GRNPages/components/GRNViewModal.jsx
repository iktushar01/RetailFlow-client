import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table"
import { Badge } from "../../../Components/UI/badge"
import { formatDate, getStatusColor } from '../utils/grnHelpers'

const GRNViewModal = ({ isOpen, onClose, grn, suppliers }) => {
  if (!grn) return null

  const supplier = suppliers.find(s => s._id === grn.supplierId)
  
  const totalOrdered = grn.items?.reduce((sum, item) => sum + (item.orderedQty || 0), 0) || 0
  const totalReceived = grn.items?.reduce((sum, item) => sum + (item.receivedQty || 0), 0) || 0
  const completionPercentage = totalOrdered > 0 ? Math.round((totalReceived / totalOrdered) * 100) : 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            GRN Details: <span className="font-mono text-primary">{grn.grnNumber}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-muted/30 p-4 rounded-lg border">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">PO Number</p>
              <p className="text-sm font-mono">{grn.poNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">Supplier</p>
              <p className="text-sm">{supplier?.supplierName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">Date</p>
              <p className="text-sm">{formatDate(grn.receivedDate)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">Status</p>
              <Badge variant="outline" className={getStatusColor(grn.status)}>
                {grn.status}
              </Badge>
            </div>
          </div>

          {/* Progress Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="border-r">
              <p className="text-2xl font-bold">{totalOrdered}</p>
              <p className="text-xs text-muted-foreground">Ordered</p>
            </div>
            <div className="border-r">
              <p className="text-2xl font-bold text-green-600">{totalReceived}</p>
              <p className="text-xs text-muted-foreground">Received</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{completionPercentage}%</p>
              <p className="text-xs text-muted-foreground">Fulfilled</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-center">Ordered</TableHead>
                  <TableHead className="text-center">Received</TableHead>
                  <TableHead>Batch / Expiry</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grn.items?.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell className="text-center">{item.orderedQty}</TableCell>
                    <TableCell className="text-center font-bold text-green-600">{item.receivedQty}</TableCell>
                    <TableCell>
                      <div className="text-xs">
                        <p>B: {item.batch || '-'}</p>
                        <p className="text-muted-foreground">
                          E: {item.expiry ? new Date(item.expiry).toLocaleDateString() : '-'}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Notes */}
          {grn.notes && (
            <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded border border-yellow-200 dark:border-yellow-900">
              <p className="text-xs font-bold text-yellow-800 dark:text-yellow-500 uppercase mb-1">Notes</p>
              <p className="text-sm italic">"{grn.notes}"</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default GRNViewModal
