import React, { useState, useEffect } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
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
import { validateDiscountForm, formatDateForInput } from '../utils/discountsHelpers'

const DiscountModal = ({ isOpen, onClose, discount, onSave }) => {
  const [formData, setFormData] = useState({
    offerName: '',
    code: '',
    type: 'Percentage',
    value: '',
    validFrom: '',
    validTo: '',
    status: 'Active',
    applicableProducts: [],
    applicableCategories: []
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (discount) {
      setFormData({
        ...discount,
        validFrom: formatDateForInput(discount.validFrom),
        validTo: formatDateForInput(discount.validTo)
      })
    } else {
      setFormData({
        offerName: '',
        code: '',
        type: 'Percentage',
        value: '',
        validFrom: '',
        validTo: '',
        status: 'Active',
        applicableProducts: [],
        applicableCategories: []
      })
    }
    setErrors({})
  }, [discount, isOpen])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = () => {
    const validation = validateDiscountForm(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }
    onSave(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] border-border bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">
            {discount ? 'Edit Discount' : 'Add New Discount'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Offer Name */}
          <div className="grid gap-2">
            <Label htmlFor="offerName" className={errors.offerName ? "text-destructive" : ""}>
              Offer Name *
            </Label>
            <Input
              id="offerName"
              value={formData.offerName}
              onChange={(e) => handleChange('offerName', e.target.value)}
              placeholder="e.g., Summer Sale"
              className={errors.offerName ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.offerName && <p className="text-destructive text-xs">{errors.offerName}</p>}
          </div>

          {/* Discount Code */}
          <div className="grid gap-2">
            <Label htmlFor="code">Discount Code</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => handleChange('code', e.target.value)}
              placeholder="e.g., SUMMER20"
            />
          </div>

          {/* Type & Value Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Type *</Label>
              <Select 
                value={formData.type} 
                onValueChange={(val) => handleChange('type', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Percentage">Percentage</SelectItem>
                  <SelectItem value="Flat">Flat Amount</SelectItem>
                  <SelectItem value="BOGO">Buy 1 Get 1</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="value" className={errors.value ? "text-destructive" : ""}>
                Value *
              </Label>
              <Input
                id="value"
                type="number"
                value={formData.value}
                onChange={(e) => handleChange('value', e.target.value)}
                placeholder={formData.type === 'Percentage' ? '10' : '5.00'}
                className={errors.value ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.value && <p className="text-destructive text-xs">{errors.value}</p>}
            </div>
          </div>

          {/* Dates Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="validFrom" className={errors.validFrom ? "text-destructive" : ""}>
                Valid From *
              </Label>
              <Input
                id="validFrom"
                type="date"
                value={formData.validFrom}
                onChange={(e) => handleChange('validFrom', e.target.value)}
                className={errors.validFrom ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.validFrom && <p className="text-destructive text-xs">{errors.validFrom}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="validTo" className={errors.validTo ? "text-destructive" : ""}>
                Valid To *
              </Label>
              <Input
                id="validTo"
                type="date"
                value={formData.validTo}
                onChange={(e) => handleChange('validTo', e.target.value)}
                className={errors.validTo ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.validTo && <p className="text-destructive text-xs">{errors.validTo}</p>}
            </div>
          </div>

          {/* Status */}
          <div className="grid gap-2">
            <Label>Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(val) => handleChange('status', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="default" onClick={handleSubmit} className="flex-1">
            {discount ? 'Update Discount' : 'Create Discount'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DiscountModal

