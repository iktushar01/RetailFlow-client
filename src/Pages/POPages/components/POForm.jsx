import React, { useEffect, useState } from 'react'
import { X, Plus, Edit, Info, AlertTriangle, FileText, Calendar as CalendarIcon } from 'lucide-react'
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Textarea } from "@/Components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert"
import SharedModal from '../../../Shared/SharedModal/SharedModal'
import POItemsTable from './POItemsTable'
import POSummary from './POSummary'
import { validatePOForm, MAX_NOTES_LENGTH } from '../utils/poHelpers'
import { getSupplierProducts } from '../../SuppliersPages/utils/supplierHelpers'
import Swal from 'sweetalert2'
import { cn } from "@/lib/utils"

const POForm = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  suppliers,
  products,
  loading,
  onSubmit,
  isEditing
}) => {
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)

  useEffect(() => {
    if (isOpen && !isEditing && !formData.poNumber) {
      const poNumber = `PO-${Date.now()}`
      setFormData(prev => ({ ...prev, poNumber }))
    }
  }, [isOpen, isEditing, formData.poNumber, setFormData])

  const filteredProducts = formData.supplier 
    ? getSupplierProducts(products, formData.supplier, suppliers) 
    : products

  const handleSupplierChange = (supplierId) => {
    setFormData(prev => ({ ...prev, supplier: supplierId, items: [] }))
  }

  const handleAddItem = () => {
    const newItem = { id: Date.now(), product: '', productName: '', quantity: 1, unitPrice: 0, subtotal: 0 }
    setFormData(prev => ({ ...prev, items: [...prev.items, newItem] }))
  }

  const handleRemoveItem = (itemId) => {
    setFormData(prev => ({ ...prev, items: prev.items.filter(item => item.id !== itemId) }))
  }

  const handleItemChange = (itemId, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value }
          if (field === 'product') {
            const selectedProduct = products.find(p => p._id === value)
            if (selectedProduct) {
              updatedItem.productName = selectedProduct.productName || selectedProduct.name
              updatedItem.unitPrice = selectedProduct.price || selectedProduct.unitPrice || 0
            }
          }
          const quantity = field === 'quantity' ? parseFloat(value) || 0 : item.quantity
          const unitPrice = field === 'unitPrice' ? parseFloat(value) || 0 : item.unitPrice
          updatedItem.subtotal = quantity * unitPrice
          return updatedItem
        }
        return item
      })
    }))
  }

  const subtotal = formData.items.reduce((sum, item) => sum + (item.subtotal || 0), 0)
  const taxAmount = (subtotal * formData.tax) / 100
  const total = subtotal + taxAmount

  const handleFormSubmit = () => {
    setHasAttemptedSubmit(true)
    if (!formData.items?.length) {
      Swal.fire({ icon: 'warning', title: 'No Items Added', text: 'Add at least one product.', confirmButtonColor: '#3B82F6' })
      return
    }
    const validation = validatePOForm(formData)
    if (!validation.isValid) {
      Swal.fire({ icon: 'warning', title: 'Validation Error', html: validation.errors.map(err => `• ${err}`).join('<br>'), confirmButtonColor: '#3B82F6' })
      return
    }
    onSubmit({ subtotal, taxAmount, total })
  }

  const remainingChars = MAX_NOTES_LENGTH - (formData.notes?.length || 0)

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Purchase Order' : 'Create New Purchase Order'}
      size="full"
      closeOnOverlayClick={false}
    >
      <div className="space-y-6 pb-20">
        {/* Basic Information Card */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-md font-semibold flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Supplier Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Supplier <span className="text-destructive">*</span></Label>
                <Select value={formData.supplier} onValueChange={handleSupplierChange}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select Supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map(s => (
                      <SelectItem key={s._id} value={s._id}>{s.supplierName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.supplier && (
                  <p className="text-[10px] text-primary font-medium uppercase tracking-tight">
                    {filteredProducts.length} products available
                  </p>
                )}
              </div>

              {/* PO Number */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">PO Number</Label>
                <Input value={formData.poNumber} readOnly className="bg-muted font-mono" />
              </div>

              {/* PO Date */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">PO Date <span className="text-destructive">*</span></Label>
                <Input 
                   type="date" 
                   value={formData.poDate} 
                   onChange={(e) => setFormData({ ...formData, poDate: e.target.value })} 
                />
              </div>

              {/* Expected Delivery */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Expected Delivery <span className="text-destructive">*</span></Label>
                <Input 
                   type="date" 
                   min={formData.poDate}
                   value={formData.expectedDeliveryDate} 
                   onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })} 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items Table Section */}
        <div className="rounded-xl border border-border bg-card p-1">
          <POItemsTable
            items={formData.items}
            products={filteredProducts}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            onItemChange={handleItemChange}
            hasAttemptedSubmit={hasAttemptedSubmit}
          />
          
          {formData.supplier && filteredProducts.length === 0 && (
            <Alert variant="destructive" className="m-4 bg-destructive/10 text-destructive border-destructive/20">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>No Products Found</AlertTitle>
              <AlertDescription>
                Selected supplier has no assigned products. Please update supplier inventory first.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notes Section */}
          <Card className="lg:col-span-2 border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Notes & Instructions
              </CardTitle>
              <span className={cn("text-[10px] font-bold", remainingChars < 50 ? "text-destructive" : "text-muted-foreground")}>
                {remainingChars} CHARS LEFT
              </span>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Add special instructions or terms..."
                value={formData.notes}
                className="min-h-[120px] resize-none bg-background"
                onChange={(e) => e.target.value.length <= MAX_NOTES_LENGTH && setFormData({ ...formData, notes: e.target.value })}
              />
            </CardContent>
          </Card>

          {/* POSummary wrapper */}
          <POSummary
            subtotal={subtotal}
            taxAmount={taxAmount}
            total={total}
            taxRate={formData.tax}
            onTaxRateChange={(newTax) => setFormData({ ...formData, tax: newTax })}
          />
        </div>
      </div>

      {/* Fixed Sticky Footer for Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border flex justify-end gap-3 z-50">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          <X className="w-4 h-4 mr-2" /> Cancel
        </Button>
        <Button onClick={handleFormSubmit} disabled={loading}>
          {loading ? "Processing..." : isEditing ? (
            <><Edit className="w-4 h-4 mr-2" /> Update Order</>
          ) : (
            <><Plus className="w-4 h-4 mr-2" /> Create Order</>
          )}
        </Button>
      </div>
    </SharedModal>
  )
}

export default POForm
