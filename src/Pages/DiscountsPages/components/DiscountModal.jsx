import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import Button from '../../../Components/UI/Button'
import SharedModal from '../../../Shared/SharedModal/SharedModal'
import { validateDiscountForm, formatDateForInput } from '../utils/discountsHelpers'

const DiscountModal = ({ isOpen, onClose, discount, onSave, products }) => {
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
    <SharedModal isOpen={isOpen} onClose={onClose} title={discount ? 'Edit Discount' : 'Add New Discount'}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Offer Name *</label>
          <input
            type="text"
            value={formData.offerName}
            onChange={(e) => handleChange('offerName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.offerName ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="e.g., Summer Sale"
          />
          {errors.offerName && <p className="text-red-500 text-xs mt-1">{errors.offerName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Discount Code</label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => handleChange('code', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., SUMMER20"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
            <select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Percentage">Percentage</option>
              <option value="Flat">Flat Amount</option>
              <option value="BOGO">Buy 1 Get 1</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Value *</label>
            <input
              type="number"
              value={formData.value}
              onChange={(e) => handleChange('value', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.value ? 'border-red-500' : 'border-gray-300'}`}
              placeholder={formData.type === 'Percentage' ? '10' : '5.00'}
              min="0"
              step="0.01"
            />
            {errors.value && <p className="text-red-500 text-xs mt-1">{errors.value}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valid From *</label>
            <input
              type="date"
              value={formData.validFrom}
              onChange={(e) => handleChange('validFrom', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.validFrom ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.validFrom && <p className="text-red-500 text-xs mt-1">{errors.validFrom}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valid To *</label>
            <input
              type="date"
              value={formData.validTo}
              onChange={(e) => handleChange('validTo', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.validTo ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.validTo && <p className="text-red-500 text-xs mt-1">{errors.validTo}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Button variant="secondary" size="md" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button variant="primary" size="md" onClick={handleSubmit} className="flex-1">
          {discount ? 'Update Discount' : 'Create Discount'}
        </Button>
      </div>
    </SharedModal>
  )
}

export default DiscountModal

