import React from 'react'
import SharedModal from '../../../Shared/SharedModal/SharedModal'
import { MapPin, User, Phone, Mail, Package, Layers } from 'lucide-react'

/**
 * Warehouse View/Details Modal Component
 */
const WarehouseViewModal = ({ isOpen, onClose, warehouse }) => {
  if (!warehouse) return null

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value || 'N/A'}</p>
      </div>
    </div>
  )

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Warehouse Details"
      size="medium"
    >
      <div className="space-y-6">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{warehouse.name}</h3>
          <p className="text-sm text-gray-600">{warehouse.location}</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="font-semibold text-gray-900 mb-4">Contact Information</h4>
            <div className="space-y-2">
              <InfoRow 
                icon={User}
                label="Contact Person"
                value={warehouse.contactPerson}
              />
              <InfoRow 
                icon={Phone}
                label="Phone"
                value={warehouse.phone}
              />
              <InfoRow 
                icon={Mail}
                label="Email"
                value={warehouse.email}
              />
            </div>
          </div>

          {/* Stock Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="font-semibold text-gray-900 mb-4">Stock Information</h4>
            <div className="space-y-2">
              <InfoRow 
                icon={Package}
                label="Total Products"
                value={warehouse.totalProducts || 0}
              />
              <InfoRow 
                icon={Layers}
                label="Total Stock"
                value={warehouse.totalStock || 0}
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-gray-600" />
            Address
          </h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            {warehouse.address || 'No address provided'}
          </p>
        </div>
      </div>
    </SharedModal>
  )
}

export default WarehouseViewModal

