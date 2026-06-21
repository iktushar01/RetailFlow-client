import React, { useState, useEffect } from 'react'
import { DollarSign } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/Components/UI/dialog'
import { Button } from '../../../Components/UI/button'
import { Input } from '@/Components/UI/input'
import { Label } from '@/Components/UI/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/UI/select'
import { Alert, AlertDescription } from '@/Components/UI/alert'
import { formatCurrency, calculateDueAmount } from '../utils/paymentsHelpers'

const AddPaymentModal = ({
  isOpen,
  onClose,
  payment,
  suppliers = [],
  onSubmit,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    paymentAmount: '',
    paymentMethod: 'Cash',
    paymentDate: new Date().toISOString().split('T')[0],
    transactionId: ''
  })

  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen && payment) {
      const totalAmount = payment.totalAmount || payment.amountDue || 0
      const dueAmount = payment.dueAmount || calculateDueAmount(totalAmount, payment.amountPaid)
      setFormData({
        paymentAmount: dueAmount.toFixed(2),
        paymentMethod: 'Cash',
        paymentDate: new Date().toISOString().split('T')[0],
        transactionId: ''
      })
      setError('')
    }
  }, [isOpen, payment])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const paymentAmount = parseFloat(formData.paymentAmount)
    const totalAmount = payment.totalAmount || payment.amountDue || 0
    const dueAmount = payment.dueAmount || calculateDueAmount(totalAmount, payment.amountPaid)

    if (!paymentAmount || paymentAmount <= 0) {
      setError('Please enter a valid payment amount')
      return
    }

    if (paymentAmount > dueAmount) {
      setError(`Payment amount cannot exceed due amount (${formatCurrency(dueAmount)})`)
      return
    }

    onSubmit({
      ...formData,
      paymentAmount
    })
  }

  const supplier = suppliers.find(s => s._id === payment?.supplierId)
  const supplierName = payment?.supplierName || supplier?.supplierName || supplier?.name || 'N/A'
  const totalAmount = payment?.totalAmount || payment?.amountDue || 0
  const dueAmount = payment?.dueAmount || calculateDueAmount(totalAmount, payment?.amountPaid)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="lg" className="p-0 gap-0">
        <DialogHeader className="px-4 py-4 sm:px-6 border-b bg-muted/30">
          <div className="flex items-center gap-3 pr-8">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">Add Payment</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Record payment for GRN: {payment?.grnNumber}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="px-4 py-4 sm:px-6 bg-primary/5 border-b">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Supplier</p>
                <p className="font-semibold">{supplierName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">PO Number</p>
                <p className="font-mono font-semibold">{payment?.poNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                <p className="text-lg font-bold">{formatCurrency(totalAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Already Paid</p>
                <p className="text-lg font-bold text-emerald-600">{formatCurrency(payment?.amountPaid || 0)}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-muted-foreground mb-1">Amount Due</p>
                <p className="text-2xl font-bold text-destructive">{formatCurrency(dueAmount)}</p>
              </div>
            </div>
          </div>

          <form id="add-payment-form" onSubmit={handleSubmit} className="px-4 py-4 sm:px-6 space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentAmount">
                  Payment Amount <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="paymentAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  max={dueAmount}
                  value={formData.paymentAmount}
                  onChange={(e) => handleChange('paymentAmount', e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Payment Method <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(val) => handleChange('paymentMethod', val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Mobile Payment">Mobile Payment</SelectItem>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentDate">
                  Payment Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="paymentDate"
                  type="date"
                  value={formData.paymentDate}
                  onChange={(e) => handleChange('paymentDate', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="transactionId">Transaction / Reference ID</Label>
                <Input
                  id="transactionId"
                  type="text"
                  value={formData.transactionId}
                  onChange={(e) => handleChange('transactionId', e.target.value)}
                  placeholder="Optional"
                />
              </div>
            </div>
          </form>
        </div>

        <DialogFooter className="px-4 py-4 sm:px-6 border-t bg-muted/20">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-payment-form"
            disabled={loading}
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Record Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddPaymentModal
