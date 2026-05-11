import React from 'react'
import SharedModal from '../../../Shared/SharedModal/SharedModal'
import Button from '../../../Components/UI/Button'
import InfoCard from '../../../Shared/InfoCard/InfoCard'
import { ArrowRightLeft, Package, MapPin, Layers, AlertCircle } from 'lucide-react'
import { validateTransferForm } from '../utils/stockTransferHelpers'
import { notify } from '../../../utils/notifications'

/**
 * Stock Transfer Modal Component
 */
const TransferModal = ({
  isOpen,
  onClose,
  selectedItem,
  warehouses,
  transferData,
  setTransferData,
  onSubmit,
  warehousesLoading
}) => {
  if (!selectedItem) return null

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate form
    const validation = validateTransferForm(transferData, selectedItem.stockQty)
    if (!validation.isValid) {
      notify.warning('Validation Error', validation.errors.join('\n'))
      return
    }

    onSubmit()
  }

  const remainingStock = selectedItem.stockQty - transferData.quantity

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Transfer Stock Between Warehouses"
      size="large"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Info Card */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-blue-200">
          <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2 text-blue-600" />
            Product Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Product Name</p>
              <p className="font-semibold text-gray-900">{selectedItem.productName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Product ID</p>
              <p className="font-mono text-sm text-gray-700">{selectedItem.productId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Current Location</p>
              <p className="font-semibold text-blue-700">{selectedItem.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Available Stock</p>
              <p className="font-bold text-2xl text-green-600">{selectedItem.stockQty} units</p>
            </div>
            {selectedItem.batch && (
              <div className="col-span-2">
                <p className="text-sm text-gray-600 mb-1">Batch Number</p>
                <p className="font-mono text-sm text-gray-700">{selectedItem.batch}</p>
              </div>
            )}
          </div>
        </div>

        {/* Transfer Form */}
        <div className="grid grid-cols-1 gap-6">
          {/* Source Warehouse (Read-only) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              From Warehouse
            </label>
            <input
              type="text"
              value={transferData.sourceWarehouse}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-semibold text-lg"
              disabled
              readOnly
            />
          </div>

          {/* Destination Warehouse */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              To Warehouse <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              value={transferData.destinationWarehouse}
              onChange={(e) => setTransferData({ ...transferData, destinationWarehouse: e.target.value })}
              disabled={warehousesLoading}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed font-medium text-lg"
              required
            >
              <option value="">
                {warehousesLoading ? 'Loading warehouses...' : 'Select destination warehouse'}
              </option>
              {warehouses.length > 0 ? (
                warehouses
                  .filter(wh => wh.name !== selectedItem.location)
                  .map(wh => (
                    <option key={wh._id} value={wh.name}>
                      {wh.name} {wh.location ? `- ${wh.location}` : ''}
                    </option>
                  ))
              ) : (
                !warehousesLoading && (
                  <option value="" disabled>
                    No warehouses available
                  </option>
                )
              )}
            </select>
            <p className="text-xs text-gray-500 mt-2">
              {warehousesLoading 
                ? 'Loading available warehouses...' 
                : warehouses.length > 0 
                  ? `${warehouses.filter(wh => wh.name !== selectedItem.location).length} destination(s) available`
                  : 'No warehouses available - please add warehouses first'
              }
            </p>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <Layers className="w-4 h-4 mr-2" />
              Transfer Quantity <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max={selectedItem.stockQty}
                value={transferData.quantity}
                onChange={(e) => setTransferData({ ...transferData, quantity: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-bold text-lg"
                placeholder={`Enter quantity (max: ${selectedItem.stockQty})`}
                required
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                units
              </span>
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-xs text-gray-600">
                Available: <strong className="text-green-600">{selectedItem.stockQty} units</strong>
              </p>
              {transferData.quantity > 0 && (
                <p className="text-xs text-gray-600">
                  Remaining: <strong className={remainingStock >= 10 ? 'text-green-600' : 'text-red-600'}>
                    {remainingStock} units
                  </strong>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Transfer Preview */}
        {transferData.destinationWarehouse && transferData.quantity > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border-2 border-green-200">
            <h4 className="font-bold text-green-900 mb-4 flex items-center text-lg">
              <AlertCircle className="w-5 h-5 mr-2" />
              Transfer Preview
            </h4>
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <p className="text-gray-700 font-semibold mb-2">{transferData.sourceWarehouse}</p>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600 mb-1">Current Stock</p>
                  <p className="font-bold text-2xl text-gray-900">{selectedItem.stockQty}</p>
                  <p className="text-sm text-red-600 font-semibold mt-2">
                    After: {remainingStock} units
                  </p>
                </div>
              </div>
              
              <div className="mx-6 flex flex-col items-center">
                <ArrowRightLeft className="w-10 h-10 text-green-600 animate-pulse" />
                <p className="text-sm font-bold text-green-700 mt-2">
                  {transferData.quantity} units
                </p>
              </div>
              
              <div className="text-center flex-1">
                <p className="text-gray-700 font-semibold mb-2">{transferData.destinationWarehouse}</p>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600 mb-1">Will Receive</p>
                  <p className="font-bold text-2xl text-green-600">+{transferData.quantity}</p>
                  <p className="text-sm text-green-600 font-semibold mt-2">
                    New stock added
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Alert */}
        <InfoCard
          type="info"
          icon={AlertCircle}
          title="Transfer Information"
          message="The transfer will move the specified quantity from the source warehouse to the destination warehouse. This action is tracked in the transfer history."
        />

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={!transferData.destinationWarehouse || !transferData.quantity || transferData.quantity <= 0}
          >
            <div className="flex items-center">
              <ArrowRightLeft className="w-5 h-5 mr-2" />
              Confirm Transfer
            </div>
          </Button>
        </div>
      </form>
    </SharedModal>
  )
}

export default TransferModal

