import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Package, Plus, Pencil, AlertTriangle, Calendar, Clock, Info, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import Swal from 'sweetalert2'
import Button from '../../Components/UI/Button'
import StatsCard from '../../Shared/StatsCard/StatsCard'
import BatchFilter from './components/BatchFilter'
import BatchList from './components/BatchList'
import SharedModal from '../../Shared/SharedModal/SharedModal'
import { inventoryAPI } from './services/batchService'
import { 
  applyBatchFilters, 
  calculateBatchStats, 
  getExpiryStatus,
  generateBatchNumber,
  validateBatchData,
  formatDateForInput
} from './utils/batchHelpers'

const WarehouseBatchtracking = () => {
  const [inventory, setInventory] = useState([])
  const [filteredInventory, setFilteredInventory] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  
  const [formData, setFormData] = useState({
    batch: '',
    expiry: ''
  })

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    warehouse: '',
    expiryStatus: ''
  })

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      const inventoryData = await inventoryAPI.getAll()
      
      // Normalize field names (handle both batch/batchNumber and expiry/expiryDate)
      const normalizedInventory = (inventoryData || []).map(item => ({
        ...item,
        batch: item.batch || item.batchNumber || '',
        expiry: item.expiry || item.expiryDate || ''
      }))
      
      setInventory(normalizedInventory)
    } catch (error) {
      console.error('Error fetching data:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch data',
        confirmButtonColor: '#3B82F6'
      })
      setInventory([])
    } finally {
      setLoading(false)
    }
  }

  // Apply filters
  const applyFilters = useCallback(() => {
    const filtered = applyBatchFilters(inventory, filters)
    setFilteredInventory(filtered)
  }, [inventory, filters])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({ search: '', warehouse: '', expiryStatus: '' })
  }


  const handleEditBatch = (item) => {
    setSelectedItem(item)
    setFormData({
      batch: item.batch || '',
      expiry: item.expiry ? formatDateForInput(item.expiry) : ''
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    const validation = validateBatchData(formData)
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0]
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: firstError,
        confirmButtonColor: '#3B82F6'
      })
      return
    }

    try {
      // Update inventory record directly
      await inventoryAPI.update(selectedItem._id, {
        ...selectedItem,
        batch: formData.batch || null,
        expiry: formData.expiry || null
      })

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Batch information updated successfully',
        confirmButtonColor: '#3B82F6',
        timer: 2000
      })
      
      setModalOpen(false)
      fetchAllData()
    } catch (error) {
      console.error('Error updating batch:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to update batch information',
        confirmButtonColor: '#3B82F6'
      })
    }
  }



  // Calculate stats
  const stats = useMemo(() => {
    return calculateBatchStats(inventory)
  }, [inventory])

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Package className="w-8 h-8 mr-3 text-green-600" />
              Batch & Expiry Tracking
            </h1>
            <p className="text-gray-600 mt-2">
              Track batch numbers and expiry dates for inventory items
            </p>
          </div>
          
          <Button 
            variant="secondary" 
            size="md"
            onClick={fetchAllData}
            loading={loading}
          >
            <div className="flex items-center">
              <RefreshCw className="w-5 h-5 mr-2" />
              Refresh
            </div>
          </Button>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-blue-900">How Batch Tracking Works</p>
          <p className="text-sm text-blue-700 mt-1">
            Each inventory item stores batch number and expiry date. Click "Edit Batch" on any item to update its batch information.
            Batch data comes from GRN entries but can be updated here anytime.
          </p>
        </div>
      </div>

      {/* Alert for expired/near-expiry items */}
      {(stats.expiredCount > 0 || stats.nearExpiryCount > 0) && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-yellow-900">Attention Required</p>
            <p className="text-sm text-yellow-700 mt-1">
              {stats.expiredCount > 0 && `${stats.expiredCount} item${stats.expiredCount > 1 ? 's' : ''} expired. `}
              {stats.nearExpiryCount > 0 && `${stats.nearExpiryCount} item${stats.nearExpiryCount > 1 ? 's' : ''} expiring within 30 days.`}
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatsCard
          label="Total Items"
          value={stats.totalProducts}
          icon={Package}
          color="blue"
        />
        <StatsCard
          label="Valid"
          value={stats.validCount}
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          label="Near Expiry"
          value={stats.nearExpiryCount}
          icon={Clock}
          color="yellow"
        />
        <StatsCard
          label="Expired"
          value={stats.expiredCount}
          icon={XCircle}
          color="red"
        />
        <StatsCard
          label="Unknown"
          value={stats.unknownCount}
          icon={AlertTriangle}
          color="gray"
        />
      </div>

      {/* Filters */}
      <BatchFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        inventory={inventory}
        filteredInventory={filteredInventory}
        resultsCount={filteredInventory.length}
        totalCount={inventory.length}
      />

      {/* Inventory Table */}
      <BatchList
        inventory={filteredInventory}
        loading={loading}
        onEditBatch={handleEditBatch}
      />

      {/* Edit Batch Modal */}
      <SharedModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Edit Batch Information"
        size="medium"
      >
        {selectedItem && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Product Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Product Details</h3>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Name:</span> {selectedItem.productName}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Current Stock:</span> {selectedItem.stockQty} units
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Location:</span> {selectedItem.location || 'Not assigned'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Batch Number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.batch}
                  onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., BATCH-2024-001"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setFormData({ ...formData, batch: generateBatchNumber(selectedItem.productId) })}
                >
                  Generate
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to remove batch number
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <input
                type="date"
                value={formData.expiry}
                onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to remove expiry date
              </p>
            </div>

            {/* Preview */}
            {(formData.batch || formData.expiry) && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Preview
                </h4>
                {formData.batch && (
                  <p className="text-sm text-green-800">
                    <span className="font-medium">Batch:</span> {formData.batch}
                  </p>
                )}
                {formData.expiry && (
                  <p className="text-sm text-green-800">
                    <span className="font-medium">Expiry:</span> {new Date(formData.expiry).toLocaleDateString()}
                    <span className={`ml-2 font-semibold ${
                      getExpiryStatus(formData.expiry) === 'expired' ? 'text-red-600' :
                      getExpiryStatus(formData.expiry) === 'near-expiry' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      ({getExpiryStatus(formData.expiry) === 'expired' ? 'Expired' :
                        getExpiryStatus(formData.expiry) === 'near-expiry' ? 'Expiring Soon' :
                        'Valid'})
                    </span>
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Update Batch Info
              </Button>
            </div>
          </form>
        )}
      </SharedModal>
    </div>
  )
}

export default WarehouseBatchtracking
