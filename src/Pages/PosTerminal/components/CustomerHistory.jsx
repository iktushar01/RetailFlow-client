import React, { useState, useEffect } from 'react'
import { History, Receipt, Calendar, DollarSign, X } from 'lucide-react'
import { salesAPI } from '../services/posService'
import { formatDateTime, formatCurrency } from '../utils/posHelpers'

// Shadcn UI Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/Components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { ScrollArea } from "@/Components/ui/scroll-area"
import { Separator } from "@/Components/ui/separator"
import { Badge } from "@/Components/ui/badge"
import { Skeleton } from "@/Components/ui/skeleton"
import { Button } from "@/Components/ui/button"

const CustomerHistory = ({ customer, isOpen, onClose }) => {
  const [salesHistory, setSalesHistory] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (customer && isOpen) {
      fetchCustomerHistory()
    }
  }, [customer, isOpen])

  const fetchCustomerHistory = async () => {
    if (!customer) return
    setLoading(true)
    try {
      const allSales = await salesAPI.getAll()
      const customerSales = allSales.filter(sale => 
        sale.customerId === customer._id || sale.customerName === customer.name
      )
      setSalesHistory(customerSales.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
    } catch (error) {
      console.error('Error fetching customer history:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!customer) return null

  const totalSpent = salesHistory.reduce((sum, sale) => sum + (sale.grandTotal || 0), 0)
  const totalOrders = salesHistory.length

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        {/* Header Section */}
        <div className="p-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <History className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold tracking-tight">
                {customer.name}'s Purchase History
              </DialogTitle>
              <DialogDescription className="text-sm mt-0.5">
                {customer.phone && `Phone: ${customer.phone}`}
                {customer.email && ` • Email: ${customer.email}`}
              </DialogDescription>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900">
              <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-medium text-blue-800 dark:text-blue-300 uppercase tracking-wider">Total Orders</CardTitle>
                <Receipt className="w-4 h-4 text-blue-600" />
              </CardHeader>
              <CardContent className="p-4 pt-1">
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalOrders}</div>
              </CardContent>
            </Card>

            <Card className="bg-green-50/50 dark:bg-green-950/20 border-green-100 dark:border-green-900">
              <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-medium text-green-800 dark:text-green-300 uppercase tracking-wider">Total Spent</CardTitle>
                <DollarSign className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent className="p-4 pt-1">
                <div className="text-2xl font-bold text-green-900 dark:text-green-100">{formatCurrency(totalSpent)}</div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50/50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900">
              <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-medium text-purple-800 dark:text-purple-300 uppercase tracking-wider">Last Order</CardTitle>
                <Calendar className="w-4 h-4 text-purple-600" />
              </CardHeader>
              <CardContent className="p-4 pt-1">
                <div className="text-sm font-bold text-purple-900 dark:text-purple-100 truncate">
                  {salesHistory.length > 0 ? formatDateTime(salesHistory[0].createdAt) : 'No orders'}
                </div>
              </CardContent>
            </Card>
          </div>

          <h4 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-widest">Recent Invoices</h4>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full rounded-xl" />
              ))}
            </div>
          ) : salesHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
              <Receipt className="w-12 h-12 mb-3" />
              <p>No purchase history found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {salesHistory.map((sale) => (
                <Card key={sale._id} className="overflow-hidden transition-all hover:border-primary/50">
                  <CardContent className="p-0">
                    <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-muted p-2.5 rounded-lg">
                          <Receipt className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold">{sale.invoiceNo}</h4>
                            <Badge variant={sale.paymentStatus === 'Paid' ? 'success' : 'outline'} className="text-[10px] h-5">
                              {sale.paymentStatus}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {formatDateTime(sale.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center">
                        <div className="text-lg font-bold text-primary">
                          {formatCurrency(sale.grandTotal)}
                        </div>
                        <div className="text-[11px] font-medium text-muted-foreground uppercase">
                          {sale.paymentMethod}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="p-4 bg-muted/30">
                      <div className="flex justify-between text-xs mb-3">
                        <span className="text-muted-foreground">Purchased Items ({sale.items?.length || 0})</span>
                        {sale.totalDiscount > 0 && (
                          <span className="text-green-600 font-medium">
                            Discount: -{formatCurrency(sale.totalDiscount)}
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        {sale.items?.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-foreground font-medium">
                              {item.productName} <span className="text-muted-foreground text-xs ml-1">x{item.quantity}</span>
                            </span>
                            <span className="text-muted-foreground">
                              {formatCurrency(item.unitPrice * item.quantity)}
                            </span>
                          </div>
                        ))}
                        {sale.items?.length > 3 && (
                          <p className="text-[10px] text-muted-foreground italic pt-1">
                            + {sale.items.length - 3} more items in this invoice
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default CustomerHistory
