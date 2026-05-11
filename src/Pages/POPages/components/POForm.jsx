import React, { useEffect, useState } from 'react'
import { X, Plus, Edit } from 'lucide-react'
import Button from '../../../Components/UI/Button'
import SharedModal from '../../../Shared/SharedModal/SharedModal'
import POItemsTable from './POItemsTable'
import POSummary from './POSummary'
import { validatePOForm, MAX_NOTES_LENGTH } from '../utils/poHelpers'
import { getSupplierProducts } from '../../SuppliersPages/utils/supplierHelpers'
import Swal from 'sweetalert2'

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
  // Generate PO Number when modal opens for new PO
  useEffect(() => {
    if (isOpen && !isEditing && !formData.poNumber) {
      const poNumber = `PO-${Date.now()}`
      setFormData(prev => ({ ...prev, poNumber }))
    }
  }, [isOpen, isEditing, formData.poNumber, setFormData])

  // Filter products based on selected supplier
  const getFilteredProducts = () => {
    if (!formData.supplier) {
      return products // Show all products if no supplier selected
    }
    return getSupplierProducts(products, formData.supplier, suppliers)
  }

  const filteredProducts = getFilteredProducts()
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)

  // Clear items when supplier changes (since products will be different)
  const handleSupplierChange = (supplierId) => {
    setFormData(prev => ({
      ...prev,
      supplier: supplierId,
      items: [] // Clear items when supplier changes
    }))
  }

  const handleAddItem = () => {
    const newItem = {
      id: Date.now(),
      product: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      subtotal: 0
    }
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }))
  }

  const handleRemoveItem = (itemId) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }))
  }

  const handleItemChange = (itemId, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value }
          
          // If product is selected, auto-fill price
          if (field === 'product') {
            const selectedProduct = products.find(p => p._id === value)
            if (selectedProduct) {
              updatedItem.productName = selectedProduct.productName || selectedProduct.name
              updatedItem.unitPrice = selectedProduct.price || selectedProduct.unitPrice || 0
            }
          }
          
          // Calculate subtotal
          const quantity = field === 'quantity' ? parseFloat(value) || 0 : item.quantity
          const unitPrice = field === 'unitPrice' ? parseFloat(value) || 0 : item.unitPrice
          updatedItem.subtotal = quantity * unitPrice
          
          return updatedItem
        }
        return item
      })
    }))
  }

  // Calculate totals
  const subtotal = formData.items.reduce((sum, item) => sum + (item.subtotal || 0), 0)
  const taxAmount = (subtotal * formData.tax) / 100
  const total = subtotal + taxAmount

  const handleFormSubmit = () => {
    setHasAttemptedSubmit(true)
    
    // Check if no items first
    if (!formData.items || formData.items.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Items Added',
        text: 'Please add at least one product to create a purchase order.',
        confirmButtonColor: '#3B82F6'
      })
      return
    }

    // Validate form
    const validation = validatePOForm(formData)
    
    if (!validation.isValid) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        html: validation.errors.map(err => `• ${err}`).join('<br>'),
        confirmButtonColor: '#3B82F6'
      })
      return
    }

    // Call parent submit handler
    onSubmit({ subtotal, taxAmount, total })
  }

  const remainingChars = MAX_NOTES_LENGTH - (formData.notes?.length || 0)

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center">
          <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {isEditing ? 'Edit Purchase Order' : 'Create New Purchase Order'}
        </div>
      }
      size="full"
      closeOnOverlayClick={false}
      showCloseButton={!loading}
    >
      <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
        {/* Basic Information */}
        <div className="bg-white p-5 rounded-lg border border-gray-200">
          <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Supplier Dropdown - Normal Select */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Supplier <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.supplier}
                onChange={(e) => handleSupplierChange(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Supplier</option>
                {suppliers.map(supplier => (
                  <option key={supplier._id} value={supplier._id}>
                    {supplier.supplierName}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Select from {suppliers.length} supplier{suppliers.length !== 1 ? 's' : ''}
                {formData.supplier && (
                  <span className="ml-2 text-blue-600 font-medium">
                    • {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} available
                  </span>
                )}
              </p>
            </div>

            {/* PO Number (read-only) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                PO Number
              </label>
              <input
                type="text"
                value={formData.poNumber}
                readOnly
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed font-mono text-gray-700"
              />
              <p className="text-xs text-gray-500 mt-1">
                Auto-generated unique identifier
              </p>
            </div>

            {/* PO Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                PO Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.poDate}
                onChange={(e) => setFormData({ ...formData, poDate: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Expected Delivery Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Expected Delivery Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.expectedDeliveryDate}
                min={formData.poDate}
                onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Must be after PO date
              </p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-white p-5 rounded-lg border border-gray-200">
          <POItemsTable
            items={formData.items}
            products={filteredProducts}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            onItemChange={handleItemChange}
            hasAttemptedSubmit={hasAttemptedSubmit}
          />
          {formData.supplier && filteredProducts.length === 0 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-yellow-800">No Products Available</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    The selected supplier doesn't have any products in their categories. 
                    Please select a different supplier or add products to this supplier's categories.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Summary Section */}
        <POSummary
          subtotal={subtotal}
          taxAmount={taxAmount}
          total={total}
          taxRate={formData.tax}
          onTaxRateChange={(newTax) => setFormData({ ...formData, tax: newTax })}
        />

        {/* Notes */}
        <div className="bg-white p-5 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Notes (Optional)
            </label>
            <span className={`text-xs ${remainingChars < 50 ? 'text-red-600' : 'text-gray-500'}`}>
              {remainingChars} characters remaining
            </span>
          </div>
          <textarea
            value={formData.notes}
            onChange={(e) => {
              if (e.target.value.length <= MAX_NOTES_LENGTH) {
                setFormData({ ...formData, notes: e.target.value })
              }
            }}
            rows="4"
            maxLength={MAX_NOTES_LENGTH}
            placeholder="Add any additional notes, special instructions, or terms..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t-2 border-gray-200 sticky bottom-0 bg-white pb-2">
            <Button
              variant="secondary"
              size="md"
              onClick={onClose}
              disabled={loading}
              type="button"
              className="flex items-center"
            >
              <div className="flex items-center">
              <X className="w-5 h-5 mr-2" />
              <span>Cancel</span>
              </div>
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleFormSubmit}
              loading={loading}
              disabled={loading}
              type="button"
              className="flex items-center"
            >
              {isEditing ? (
                <>
                  <div className="flex items-center">
                  <Edit className="w-5 h-5 mr-2" />
                  <span>Update Purchase Order</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  <span>Create Purchase Order</span>
                  </div>
                </>
              )}
            </Button>
          </div>
      </div>
    </SharedModal>
  )
}

export default POForm

