import React, { useEffect, useState } from 'react'
import { X, Save } from 'lucide-react'
import Button from '../../../Components/UI/Button'
import SharedModal from '../../../Shared/SharedModal/SharedModal'
import GRNItemsTable from './GRNItemsTable'
import { validateGRNForm, generateGRNNumber, MAX_NOTES_LENGTH } from '../utils/grnHelpers'
import { grnAPI } from '../services/grnService'
import Swal from 'sweetalert2'
import axios from 'axios'

const API_URL = 'https://pos-system-management-server-20.vercel.app'

const GRNForm = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  purchaseOrders = [],
  loading,
  onSubmit,
  isEditing
}) => {
  const [warehouses, setWarehouses] = useState([])
  const [warehousesLoading, setWarehousesLoading] = useState(false)

  // Fetch warehouses from API
  useEffect(() => {
    const fetchWarehouses = async () => {
      if (isOpen) {
        setWarehousesLoading(true)
        try {
          const response = await axios.get(`${API_URL}/warehouses`)
          setWarehouses(response.data)
        } catch (error) {
          console.error('Error fetching warehouses:', error)
          // Fallback to default warehouses if API fails
          setWarehouses([
            { _id: '1', name: 'Main Warehouse', location: 'Building A' },
            { _id: '2', name: 'Secondary Warehouse', location: 'Building B' },
            { _id: '3', name: 'Cold Storage', location: 'Building C' },
            { _id: '4', name: 'Dry Storage', location: 'Building D' },
            { _id: '5', name: 'Returns Warehouse', location: 'Building E' }
          ])
        } finally {
          setWarehousesLoading(false)
        }
      }
    }

    fetchWarehouses()
  }, [isOpen])

  // Generate GRN Number when modal opens for new GRN
  useEffect(() => {
    if (isOpen && !isEditing && !formData.grnNumber) {
      const grnNumber = generateGRNNumber()
      setFormData(prev => ({ ...prev, grnNumber }))
    }
  }, [isOpen, isEditing, formData.grnNumber, setFormData])

  // Load PO items when PO is selected
  const handlePOChange = async (poId) => {
    const selectedPO = purchaseOrders.find(po => po._id === poId)
    
    if (selectedPO) {
      try {
        // Fetch cumulative received quantities for this PO
        const cumulativeReceived = await grnAPI.getCumulativeReceivedByPO(poId)
        
        // Create a map for quick lookup
        const receivedMap = {}
        cumulativeReceived.forEach(item => {
          receivedMap[item.productId] = item.totalReceived
        })

        // Map PO items to GRN items with receivedQty = 0 initially
        const grnItems = selectedPO.items?.map(item => {
          const productId = item.product || item.productId
          const orderedQty = item.quantity || item.orderedQty
          const alreadyReceived = receivedMap[productId] || 0
          const remainingQty = orderedQty - alreadyReceived

          return {
            id: item.id || Date.now() + Math.random(),
            productId: productId,
            productName: item.productName,
            orderedQty: orderedQty,
            alreadyReceived: alreadyReceived,
            remainingQty: remainingQty,
            receivedQty: 0,
            batch: '',
            expiry: '',
            unitPrice: item.unitPrice || 0
          }
        }) || []

        setFormData(prev => ({
          ...prev,
          poId: poId,
          poNumber: selectedPO.poNumber,
          supplierId: selectedPO.supplier,
          items: grnItems
        }))
      } catch (error) {
        console.error('Error fetching cumulative received:', error)
        // Fallback to basic mapping if API call fails
        const grnItems = selectedPO.items?.map(item => ({
          id: item.id || Date.now() + Math.random(),
          productId: item.product || item.productId,
          productName: item.productName,
          orderedQty: item.quantity || item.orderedQty,
          alreadyReceived: 0,
          remainingQty: item.quantity || item.orderedQty,
          receivedQty: 0,
          batch: '',
          expiry: '',
          unitPrice: item.unitPrice || 0
        })) || []

        setFormData(prev => ({
          ...prev,
          poId: poId,
          poNumber: selectedPO.poNumber,
          supplierId: selectedPO.supplier,
          items: grnItems
        }))
      }
    } else {
      setFormData(prev => ({
        ...prev,
        poId: '',
        poNumber: '',
        supplierId: '',
        items: []
      }))
    }
  }

  const handleItemChange = (itemId, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          return { ...item, [field]: value }
        }
        return item
      })
    }))
  }

  const handleFormSubmit = () => {
    // Validate form
    const validation = validateGRNForm(formData)
    
    if (!validation.isValid) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        html: validation.errors.map(err => `• ${err}`).join('<br>'),
        confirmButtonColor: '#3B82F6'
      })
      return
    }

    // Check if at least some quantity is received
    const totalReceived = formData.items.reduce((sum, item) => sum + (item.receivedQty || 0), 0)
    if (totalReceived === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Items Received',
        text: 'Please enter received quantity for at least one item.',
        confirmButtonColor: '#3B82F6'
      })
      return
    }

    // Call parent submit handler
    onSubmit(formData)
  }

  const remainingChars = MAX_NOTES_LENGTH - (formData.notes?.length || 0)

  // Calculate summary
  const totalOrdered = formData.items?.reduce((sum, item) => sum + (item.orderedQty || 0), 0) || 0
  const totalReceived = formData.items?.reduce((sum, item) => sum + (item.receivedQty || 0), 0) || 0
  const completionPercentage = totalOrdered > 0 ? Math.round((totalReceived / totalOrdered) * 100) : 0

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center">
          <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {isEditing ? 'Edit Goods Receive Note' : 'Create New GRN'}
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* GRN Number (read-only) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                GRN Number
              </label>
              <input
                type="text"
                value={formData.grnNumber || ''}
                readOnly
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed font-mono text-gray-700"
              />
              <p className="text-xs text-gray-500 mt-1">
                Auto-generated unique identifier
              </p>
            </div>

            {/* Select Purchase Order */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Purchase Order <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.poId || ''}
                onChange={(e) => handlePOChange(e.target.value)}
                disabled={isEditing}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select PO</option>
                {purchaseOrders.map(po => (
                  <option key={po._id} value={po._id}>
                    {po.poNumber} - {po.items?.length || 0} items
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {isEditing ? 'Cannot change PO after creation' : `${purchaseOrders.length} sent orders available`}
              </p>
            </div>

            {/* Received Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Received Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.receivedDate || ''}
                onChange={(e) => setFormData({ ...formData, receivedDate: e.target.value })}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Date when goods were received
              </p>
            </div>
          </div>

          {/* Warehouse Selection */}
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Destination Warehouse <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.destinationWarehouse || ''}
              onChange={(e) => setFormData({ ...formData, destinationWarehouse: e.target.value })}
              disabled={warehousesLoading}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {warehousesLoading ? 'Loading warehouses...' : 'Select warehouse'}
              </option>
              {warehouses.length > 0 ? (
                warehouses.map(warehouse => (
                  <option key={warehouse._id} value={warehouse.name}>
                    {warehouse.name} {warehouse.location ? `- ${warehouse.location}` : ''}
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
            <p className="text-xs text-gray-500 mt-1">
              {warehousesLoading 
                ? 'Loading available warehouses...' 
                : warehouses.length > 0 
                  ? `Where the received goods will be stored (${warehouses.length} warehouses available)`
                  : 'No warehouses available - please add warehouses first'
              }
            </p>
          </div>
        </div>

        {/* Summary Card */}
        {formData.items && formData.items.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-5 rounded-lg border border-blue-200">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{formData.items.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Ordered</p>
                <p className="text-2xl font-bold text-gray-900">{totalOrdered}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Received</p>
                <p className="text-2xl font-bold text-blue-600">{totalReceived}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Completion</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold text-green-600">{completionPercentage}%</p>
                  <div className="flex-1">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Items Table */}
        <div className="bg-white p-5 rounded-lg border border-gray-200">
          <GRNItemsTable
            items={formData.items || []}
            onItemChange={handleItemChange}
            readOnly={false}
          />
        </div>

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
            value={formData.notes || ''}
            onChange={(e) => {
              if (e.target.value.length <= MAX_NOTES_LENGTH) {
                setFormData({ ...formData, notes: e.target.value })
              }
            }}
            rows="4"
            maxLength={MAX_NOTES_LENGTH}
            placeholder="Add any additional notes, discrepancies, or observations..."
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
            disabled={loading || !formData.poId || formData.items?.length === 0}
            type="button"
            className="flex items-center"
          >
            <div className="flex items-center">
              <Save className="w-5 h-5 mr-2" />
              <span>{isEditing ? 'Update GRN' : 'Create GRN'}</span>
            </div>
          </Button>
        </div>
      </div>
    </SharedModal>
  )
}

export default GRNForm

