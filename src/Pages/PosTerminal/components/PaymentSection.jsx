import React, { useState, useEffect } from 'react'
import { User, CreditCard, CheckCircle, Clock, Plus, History, Receipt } from 'lucide-react'
import CustomerHistory from './CustomerHistory'
import Swal from 'sweetalert2'

// Shadcn UI Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/Components/UI/dialog"
import { Button } from "@/Components/UI/button"
import { Input } from "@/Components/UI/input"
import { Label } from "@/Components/UI/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/UI/select"
import { Card, CardContent } from "@/Components/UI/card"
import { Separator } from "@/Components/UI/separator"
import { Badge } from "@/Components/UI/badge"

const PaymentSection = ({ 
  customers, 
  selectedCustomer, 
  onSelectCustomer, 
  onCreateCustomer,
  cartItems,
  totals,
  onCompleteSale,
  onHoldSale
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [showCustomerHistory, setShowCustomerHistory] = useState(false)
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '' })

  const paymentMethods = ['Cash', 'Card', 'bKash', 'Nagad', 'Rocket', 'Bank Transfer']

  useEffect(() => {
    const handleOpenModal = () => {
      if (cartItems.length > 0) {
        setIsOpen(true)
      } else {
        Swal.fire({
          title: 'Empty Cart',
          text: 'Please add items to cart before checkout',
          icon: 'warning',
          confirmButtonColor: 'hsl(var(--primary))'
        })
      }
    }

    window.addEventListener('openPaymentModal', handleOpenModal)
    return () => window.removeEventListener('openPaymentModal', handleOpenModal)
  }, [cartItems])

  const handleCreateCustomer = async () => {
    if (!newCustomer.name.trim()) {
      Swal.fire('Error', 'Customer name is required', 'error')
      return
    }

    try {
      await onCreateCustomer(newCustomer)
      setShowCustomerModal(false)
      setNewCustomer({ name: '', phone: '', email: '' })
    } catch {
      Swal.fire('Error', 'Failed to create customer', 'error')
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent size="md" className="p-0 gap-0">
          <DialogHeader className="shrink-0 p-4 sm:p-6 pb-0">
            <div className="flex items-center gap-2 text-primary mb-1 pr-8">
              <Receipt className="w-5 h-5" />
              <DialogTitle className="text-xl sm:text-2xl font-bold">Checkout</DialogTitle>
            </div>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Order Summary Card */}
            <Card className="bg-primary/[0.03] border-primary/10 shadow-none">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Items</span>
                  <span className="font-medium">{cartItems.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">BDT {totals.subtotal.toFixed(2)}</span>
                </div>
                {totals.totalDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <Badge variant="success" className="font-bold">
                      -BDT {totals.totalDiscount.toFixed(2)}
                    </Badge>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold">Grand Total</span>
                  <span className="text-2xl font-black text-primary">
                    BDT {totals.grandTotal.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Customer Selection */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <User className="w-4 h-4" /> Customer Information
              </Label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="min-w-0 flex-1">
                  <Select 
                    value={selectedCustomer?._id || ""} 
                    onValueChange={(val) => {
                      const customer = customers.find(c => c._id === val)
                      onSelectCustomer(customer)
                    }}
                  >
                    <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map(customer => (
                        <SelectItem key={customer._id} value={customer._id}>
                          {customer.name} {customer.phone ? `(${customer.phone})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-10 w-10"
                    onClick={() => setShowCustomerModal(true)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  {selectedCustomer && (
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-10"
                      onClick={() => setShowCustomerHistory(true)}
                    >
                      <History className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method Grid */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Payment Method
              </Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {paymentMethods.map(method => (
                  <Button
                    key={method}
                    variant={paymentMethod === method ? "default" : "outline"}
                    onClick={() => setPaymentMethod(method)}
                    className={`h-auto min-h-11 py-2.5 px-2 text-xs font-medium sm:text-sm touch-manipulation ${
                      paymentMethod === method ? "" : ""
                    }`}
                  >
                    {method}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="shrink-0 p-4 sm:p-6 pt-0 border-t bg-muted/20 flex-col sm:flex-col gap-3">
            <Button
              size="lg"
              className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/20"
              onClick={async () => {
                await onCompleteSale(paymentMethod)
                setIsOpen(false)
              }}
              disabled={cartItems.length === 0 || !selectedCustomer}
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Complete Payment
            </Button>

            <div className="grid grid-cols-2 gap-3 w-full">
              <Button
                variant="secondary"
                className="w-full"
                onClick={async () => {
                  await onHoldSale()
                  setIsOpen(false)
                }}
                disabled={cartItems.length === 0}
              >
                <Clock className="w-4 h-4 mr-2" /> Hold Sale
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Customer Dialog */}
      <Dialog open={showCustomerModal} onOpenChange={setShowCustomerModal}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input 
                id="name" 
                value={newCustomer.name} 
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                type="tel"
                value={newCustomer.phone} 
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                placeholder="017XXXXXXXX"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email"
                value={newCustomer.email} 
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                placeholder="customer@example.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowCustomerModal(false)}>Cancel</Button>
            <Button onClick={handleCreateCustomer}>Save Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CustomerHistory
        customer={selectedCustomer}
        isOpen={showCustomerHistory}
        onClose={() => setShowCustomerHistory(false)}
      />
    </>
  )
}

export default PaymentSection

