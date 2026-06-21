import React from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/Components/UI/table"
import { Badge } from "@/Components/UI/badge"
import { Skeleton } from "@/Components/UI/skeleton"
import { getPaymentMethodColor, formatCurrency, formatDateTime } from '../utils/paymentsHelpers'

const PaymentsList = ({ payments, loading }) => {
  if (loading) {
    return (
      <div className="space-y-3 p-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    )
  }

  return (
    <Table>
      <TableHeader className="bg-muted/50">
        <TableRow>
          <TableHead className="w-[150px]">Invoice No</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Payment Method</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments && payments.length > 0 ? (
          payments.map((payment, index) => (
            <TableRow key={payment._id || index}>
              <TableCell className="font-medium text-primary">
                {payment.invoiceNo}
              </TableCell>
              <TableCell className="text-foreground">
                {payment.customerName || 'N/A'}
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={getPaymentMethodColor(payment.paymentMethod)}
                >
                  {payment.paymentMethod}
                </Badge>
              </TableCell>
              <TableCell className="font-medium">
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
  )
}

export default PaymentsList
