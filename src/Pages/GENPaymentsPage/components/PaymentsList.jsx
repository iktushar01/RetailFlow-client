import React from 'react'
import { DollarSign, History, Eye, Calendar } from 'lucide-react'
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/Components/ui/tooltip"
import { formatCurrency, formatDate, getPaymentStatusColor, calculateDueAmount } from '../utils/paymentsHelpers'

const PaymentsList = ({ 
  payments = [], 
  suppliers = [],
  loading = false,
  onAddPayment,
  onViewHistory,
  onView
}) => {

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </Card>
    )
  }

  return (
    <Card className="border-border shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="font-bold">Supplier</TableHead>
            <TableHead className="font-bold">PO / GRN</TableHead>
            <TableHead className="font-bold text-right">Total</TableHead>
            <TableHead className="font-bold text-right">Paid</TableHead>
            <TableHead className="font-bold text-right text-destructive">Due</TableHead>
            <TableHead className="font-bold">Due Date</TableHead>
            <TableHead className="font-bold text-center">Status</TableHead>
            <TableHead className="font-bold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.length > 0 ? (
            payments.map((payment) => {
              const supplier = suppliers.find(s => s._id === payment.supplierId)
              const supplierName = payment.supplierName || supplier?.supplierName || supplier?.name || 'N/A'
              const totalAmount = payment.totalAmount || payment.amountDue || 0
              const dueAmount = payment.dueAmount || calculateDueAmount(totalAmount, payment.amountPaid)

              return (
                <TableRow key={payment._id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div>
                      <p className="font-semibold text-foreground leading-none">{supplierName}</p>
                      <p className="text-xs text-muted-foreground mt-1">{supplier?.email || ''}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-xs font-medium text-muted-foreground">PO: {payment.poNumber || 'N/A'}</span>
                      <span className="font-mono text-xs font-bold text-primary">GRN: {payment.grnNumber || 'N/A'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(totalAmount)}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-emerald-600">
                    {formatCurrency(payment.amountPaid || 0)}
                  </TableCell>
                  <TableCell className="text-right font-bold text-destructive">
                    {formatCurrency(dueAmount)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                      {formatDate(payment.dueDate)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={`capitalize ${getPaymentStatusColor(payment.status)}`}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <div className="flex justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onView(payment)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View Details</TooltipContent>
                        </Tooltip>

                        {payment.status !== 'Paid' && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="default" size="icon" className="h-8 w-8 bg-primary" onClick={() => onAddPayment(payment)}>
                                <DollarSign className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Add Payment</TooltipContent>
                          </Tooltip>
                        )}

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20" 
                              onClick={() => onViewHistory(payment)}
                            >
                              <History className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Payment History</TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                No supplier payments found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  )
}

export default PaymentsList
