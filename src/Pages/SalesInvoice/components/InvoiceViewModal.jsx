import React from 'react'
import { Printer, Download, User, Calendar, CreditCard } from 'lucide-react'
import { Button } from "@/Components/UI/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/Components/UI/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/UI/table"
import { Badge } from "@/Components/UI/badge"
import { Separator } from "@/Components/UI/separator"
import { ScrollArea } from "@/Components/UI/scroll-area"
import { formatCurrency, formatDateTime } from '../utils/invoiceHelpers'

const InvoiceViewModal = ({ isOpen, onClose, invoice, onPrint }) => {
  if (!invoice) return null

  const isPaid = invoice.paymentStatus === 'Paid'
  const balanceDue = invoice.grandTotal - (invoice.amountPaid || 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex justify-between items-center pr-6">
            <DialogTitle className="text-xl font-bold tracking-tight">
              Invoice <span className="text-primary">{invoice.invoiceNo}</span>
            </DialogTitle>
            <Badge variant={isPaid ? "default" : "destructive"} className="uppercase">
              {invoice.paymentStatus}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-6">
            {/* Quick Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  Issue Date
                </div>
                <p className="font-semibold">{formatDateTime(invoice.createdAt)}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center text-sm text-muted-foreground">
                  <User className="w-4 h-4 mr-2" />
                  Customer Details
                </div>
                <p className="font-semibold">{invoice.customerName}</p>
                {invoice.customerPhone && (
                  <p className="text-sm text-muted-foreground">{invoice.customerPhone}</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Items Table */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Line Items
              </h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(item.subtotal)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Totals Section */}
            <div className="flex justify-end">
              <div className="w-full sm:w-72 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(invoice.subtotal)}</span>
                </div>
                
                {invoice.totalDiscount > 0 && (
                  <div className="flex justify-between text-sm text-destructive">
                    <span>Discount</span>
                    <span>-{formatCurrency(invoice.totalDiscount)}</span>
                  </div>
                )}
                
                {invoice.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatCurrency(invoice.tax)}</span>
                  </div>
                )}
                
                <Separator className="my-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold">Grand Total</span>
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(invoice.grandTotal)}
                  </span>
                </div>

                {invoice.amountPaid > 0 && (
                  <div className="space-y-1 pt-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Amount Paid</span>
                      <span className="text-foreground font-medium">
                        {formatCurrency(invoice.amountPaid)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-bold">Balance Due</span>
                      <span className="font-bold text-destructive">
                        {formatCurrency(balanceDue)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method Footer Card */}
            <div className="rounded-lg bg-muted/40 p-4 border border-dashed">
              <div className="flex items-center text-sm font-medium">
                <CreditCard className="w-4 h-4 mr-2 text-muted-foreground" />
                Payment via {invoice.paymentMethod || 'N/A'}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t bg-muted/20 gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} className="sm:flex-1">
            Close
          </Button>
          <Button onClick={() => onPrint(invoice)} className="sm:flex-1">
            <Printer className="w-4 h-4 mr-2" />
            Print Invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default InvoiceViewModal

