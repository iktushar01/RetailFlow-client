import React from 'react'
import SharedModal from '../../../Shared/SharedModal/SharedModal'
import EmptyState from '../../../Shared/EmptyState/EmptyState'
import { History, ArrowRightLeft, Package, Clock, MapPin, CheckCircle } from 'lucide-react'
import { formatTransferDate } from '../utils/stockTransferHelpers'

/**
 * Transfer History Modal Component
 */
const TransferHistoryModal = ({ isOpen, onClose, transfers }) => {
  return (
    <SharedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Transfer History"
      size="large"
    >
      <div className="space-y-4">
        {transfers.length === 0 ? (
          <EmptyState
            icon={History}
            title="No transfer history"
            message="Stock transfers will appear here once you create them"
          />
        ) : (
          <div className="max-h-[600px] overflow-y-auto space-y-4">
            {transfers.map((transfer, index) => (
              <div
                key={transfer._id || index}
                className="bg-gradient-to-r from-white to-gray-50 p-6 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <ArrowRightLeft className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900 mb-1">
                        {transfer.productName}
                      </h4>
                      <p className="text-sm text-gray-600 font-mono">
                        ID: {transfer.productId}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      transfer.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transfer.status || 'Completed'}
                    </span>
                    <p className="text-xs text-gray-500 mt-2 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTransferDate(transfer.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Transfer Details */}
                <div className="grid grid-cols-3 gap-4">
                  {/* From */}
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <p className="text-xs text-red-600 font-semibold mb-2 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      FROM
                    </p>
                    <p className="font-bold text-gray-900">{transfer.sourceWarehouse}</p>
                  </div>

                  {/* Quantity */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-600 font-semibold mb-2 flex items-center">
                      <Package className="w-3 h-3 mr-1" />
                      QUANTITY
                    </p>
                    <p className="font-bold text-2xl text-blue-700">
                      {transfer.quantity}
                      <span className="text-sm font-normal ml-1">units</span>
                    </p>
                  </div>

                  {/* To */}
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-xs text-green-600 font-semibold mb-2 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      TO
                    </p>
                    <p className="font-bold text-gray-900">{transfer.destinationWarehouse}</p>
                  </div>
                </div>

                {/* Success Indicator */}
                {transfer.status === 'Completed' && (
                  <div className="mt-4 flex items-center text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span className="font-medium">Transfer completed successfully</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </SharedModal>
  )
}

export default TransferHistoryModal

