import React from 'react'
import { Eye, Printer } from 'lucide-react'
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
import { getPaymentStatusColor, formatCurrency, formatDateTime } from '../utils/invoiceHelpers'

const InvoiceList = ({ invoices, onView, onPrint, loading }) => {
  if (loading) {
    return <TableSkeleton rows={6} columns={6} showActions />
  }

  return (
    <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[120px] font-bold text-foreground">Invoice No</TableHead>
              <TableHead className="font-bold text-foreground">Customer</TableHead>
              <TableHead className="font-bold text-foreground">Date</TableHead>
              <TableHead className="font-bold text-foreground">Total</TableHead>
              <TableHead className="font-bold text-foreground">Payment Status</TableHead>
              <TableHead className="text-right font-bold text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium text-primary">
                    {invoice.invoiceNo}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{invoice.customerName}</span>
                      {invoice.customerPhone && (
                        <span className="text-xs text-muted-foreground">{invoice.customerPhone}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDateTime(invoice.createdAt)}
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">
                    {formatCurrency(invoice.grandTotal)}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`capitalize font-semibold ${getPaymentStatusColor(invoice.paymentStatus)}`}
                    >
                      {invoice.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onView(invoice)}
                        className="h-8 px-2 lg:px-3"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={() => onPrint(invoice)}
                        className="h-8 px-2 lg:px-3"
                      >
                        <Printer className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Print</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No invoices found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
  )
}

export default InvoiceList

