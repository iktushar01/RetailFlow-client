import React, { useState, useEffect } from 'react'
import Button from '../../../Components/UI/Button'
import SharedModal from '../../../Shared/SharedModal/SharedModal'
import { RETURN_REASONS } from '../utils/returnsHelpers'
import Swal from 'sweetalert2'

const ReturnModal = ({ isOpen, onClose, onSave, invoices }) => {
  const [formData, setFormData] = useState({
    invoiceNo: '',
    items: [],
    reason: '',
    notes: ''
  })
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  useEffect(() => {
    if (!isOpen) {
      setFormData({ invoiceNo: '', items: [], reason: '', notes: '' })
      setSelectedInvoice(null)
    }
  }, [isOpen])

  const handleInvoiceSelect = (invoiceNo) => {
    const invoice = invoices.find(inv => inv.invoiceNo === invoiceNo)
    setSelectedInvoice(invoice)
    setFormData(prev => ({
      ...prev,
      invoiceNo,
      items: invoice ? invoice.items.map(item => ({
        ...item,
        returnQuantity: 0,
        maxQuantity: item.availableForReturn || (item.quantity - (item.returnedQuantity || 0)),
        originalQuantity: item.quantity,
        alreadyReturned: item.returnedQuantity || 0
      })) : []
    }))
  }

  const handleItemQuantityChange = (index, quantity) => {
    const newItems = [...formData.items]
    newItems[index].returnQuantity = Math.min(parseInt(quantity) || 0, newItems[index].maxQuantity)
    setFormData(prev => ({ ...prev, items: newItems }))
  }

  const handleSubmit = () => {
    if (!formData.invoiceNo) {
      Swal.fire('Error', 'Please select an invoice', 'error')
      return
    }

    const returningItems = formData.items.filter(item => item.returnQuantity > 0)
    
    if (returningItems.length === 0) {
      Swal.fire('Error', 'Please select at least one item to return', 'error')
      return
    }
    
    // Check if any items are available for return
    const availableItems = formData.items.filter(item => item.maxQuantity > 0)
    if (availableItems.length === 0) {
      Swal.fire('Error', 'No items are available for return from this invoice', 'error')
      return
    }

    if (!formData.reason) {
      Swal.fire('Error', 'Please provide a return reason', 'error')
      return
    }

    const returnData = {
      invoiceNo: formData.invoiceNo,
      customerName: selectedInvoice.customerName,
      customerPhone: selectedInvoice.customerPhone,
      items: returningItems.map(item => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.returnQuantity,
        unitPrice: item.unitPrice
      })),
      reason: formData.reason,
      notes: formData.notes
    }

    onSave(returnData)
  }

  return (
    <SharedModal isOpen={isOpen} onClose={onClose} title="Create Return" size="large">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Invoice *</label>
          <select
            value={formData.invoiceNo}
            onChange={(e) => handleInvoiceSelect(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose an invoice...</option>
            {invoices.map(invoice => {
              const availableItems = invoice.items?.filter(item => 
                (item.availableForReturn || (item.quantity - (item.returnedQuantity || 0))) > 0
              ).length || 0;
              const totalItems = invoice.items?.length || 0;
              
              return (
                <option key={invoice._id} value={invoice.invoiceNo}>
                  {invoice.invoiceNo} - {invoice.customerName} - ${invoice.grandTotal} ({availableItems}/{totalItems} items available)
                </option>
              );
            })}
          </select>
        </div>

        {selectedInvoice && (
          <>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm"><strong>Customer:</strong> {selectedInvoice.customerName}</p>
              <p className="text-sm"><strong>Date:</strong> {new Date(selectedInvoice.createdAt).toLocaleDateString()}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Return Items</label>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm">Product</th>
                      <th className="px-4 py-2 text-right text-sm">Original Qty</th>
                      <th className="px-4 py-2 text-right text-sm">Already Returned</th>
                      <th className="px-4 py-2 text-right text-sm">Available</th>
                      <th className="px-4 py-2 text-right text-sm">Return Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2 text-sm">{item.productName}</td>
                        <td className="px-4 py-2 text-sm text-right">{item.originalQuantity}</td>
                        <td className="px-4 py-2 text-sm text-right text-orange-600">{item.alreadyReturned}</td>
                        <td className="px-4 py-2 text-sm text-right text-green-600 font-medium">{item.maxQuantity}</td>
                        <td className="px-4 py-2 text-right">
                          <input
                            type="number"
                            min="0"
                            max={item.maxQuantity}
                            value={item.returnQuantity}
                            onChange={(e) => handleItemQuantityChange(index, e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                            disabled={item.maxQuantity === 0}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {formData.items.some(item => item.maxQuantity === 0) && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                  ⚠️ Some items cannot be returned as they have already been fully returned.
                </div>
              )}
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Return Reason *</label>
          <select
            value={formData.reason}
            onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select reason...</option>
            {RETURN_REASONS.map(reason => (
              <option key={reason} value={reason}>{reason}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Any additional information..."
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Button variant="secondary" size="md" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button variant="primary" size="md" onClick={handleSubmit} className="flex-1">
          Create Return
        </Button>
      </div>
    </SharedModal>
  )
}

export default ReturnModal

