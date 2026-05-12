import React from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getPaymentMethodColor, formatCurrency, formatDateTime } from '../utils/paymentsHelpers'

const PaymentsList = ({ payments, loading }) => {
  // Loading State with Skeletons
  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    )
  }

  return (
    <Card className="border-none shadow-none">
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[150px] font-bold text-foreground">Invoice No</TableHead>
              <TableHead className="font-bold text-foreground">Customer</TableHead>
              <TableHead className="font-bold text-foreground">Payment Method</TableHead>
              <TableHead className="font-bold text-foreground">Amount</TableHead>
              <TableHead className="font-bold text-foreground">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments && payments.length > 0 ? (
              payments.map((payment, index) => (
                <TableRow key={payment._id || index} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-semibold text-primary">
                    {payment.invoiceNo}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {payment.customerName || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`font-semibold ${getPaymentMethodColor(payment.paymentMethod)}`}
                    >
                      {payment.paymentMethod}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold text-foreground">
                    {formatCurrency(payment.amount)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDateTime(payment.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No payment records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}

export default PaymentsList