import React from 'react'
import { CheckCircle } from 'lucide-react'
import Button from '../../../../Components/UI/Button'
import SharedModal from '../../../../Shared/SharedModal/SharedModal'

const GenerateAllModal = ({ 
  isOpen, 
  onClose, 
  selectedItems, 
  suppliers, 
  onConfirm 
}) => {
  return (
    <SharedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate All Purchase Orders"
      size="lg"
    >
      <div className="space-y-4">
        <p className="text-gray-600">
          You are about to generate purchase orders for {selectedItems.length} suggested items.
          Items will be grouped by supplier for efficient ordering.
        </p>
        <div className="max-h-64 overflow-y-auto">
          {selectedItems.map((item, index) => {
            const supplier = suppliers.find(s => s._id === item.supplierId)
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{item.productName}</div>
                  <div className="text-sm text-gray-500">Supplier: {supplier?.name || 'Unknown'}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Qty: {item.suggestedQty} units</div>
                  <div className="text-sm text-gray-600">Value: BDT {item.totalValue.toFixed(2)}</div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
          >
            <div className="flex items-center">
              Cancel
            </div>
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={onConfirm}
          >
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Generate POs
            </div>
          </Button>
        </div>
      </div>
    </SharedModal>
  )
}

export default GenerateAllModal
