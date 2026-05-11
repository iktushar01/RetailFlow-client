import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { QrCode, Barcode, Plus, RefreshCw, Download, AlertCircle, Package, CheckCircle2, XCircle, Info } from 'lucide-react'
import Swal from 'sweetalert2'
import Button from '../../Components/UI/Button'
import StatsCard from '../../Shared/StatsCard/StatsCard'
import BarcodeFilter from './components/BarcodeFilter'
import BarcodeList from './components/BarcodeList'
import SharedModal from '../../Shared/SharedModal/SharedModal'
import { inventoryAPI } from './services/barcodeService'
import { productsAPI } from '../ProductPages/services/productService'
import { 
  applyBarcodeFilters, 
  calculateBarcodeStats, 
  generateCode
} from './utils/barcodeHelpers'

const WarehouseBarcode = () => {
  const [inventory, setInventory] = useState([])
  const [products, setProducts] = useState([])
  const [filteredInventory, setFilteredInventory] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  
  const [formData, setFormData] = useState({
    barcode: '',
    qrCode: '',
    autoGenerate: true
  })

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    warehouse: '',
    barcodeStatus: ''
  })

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    setLoading(true)
    try {
      const [inventoryData, productsData] = await Promise.all([
        inventoryAPI.getAll(),
        productsAPI.getAll()
      ])
      
      // Normalize field names
      const normalizedInventory = (inventoryData || []).map(item => ({
        ...item,
        batch: item.batch || item.batchNumber || '',
        expiry: item.expiry || item.expiryDate || '',
        qrCode: item.qrCode || ''
      }))
      
      setInventory(normalizedInventory)
      setProducts(productsData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch inventory data',
        confirmButtonColor: '#3B82F6'
      })
      setInventory([])
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  // Apply filters
  const applyFilters = useCallback(() => {
    const filtered = applyBarcodeFilters(inventory, filters)
    setFilteredInventory(filtered)
  }, [inventory, filters])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({ search: '', warehouse: '', barcodeStatus: '' })
  }



  const handleAutoGenerate = () => {
    if (formData.autoGenerate) {
      setFormData({
        ...formData,
        barcode: generateCode('BAR'),
        qrCode: generateCode('QR')
      })
    }
  }

  useEffect(() => {
    if (modalOpen && formData.autoGenerate && !formData.barcode && !formData.qrCode) {
      handleAutoGenerate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen, formData.autoGenerate])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.barcode && !formData.qrCode) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please enter at least a barcode or QR code',
        confirmButtonColor: '#3B82F6'
      })
      return
    }

    try {
      // Update inventory item
      await inventoryAPI.update(selectedItem._id, {
        barcode: formData.barcode || null,
        qrCode: formData.qrCode || null
      })

      // Also update the product with barcode/QR if needed
      const product = products.find(p => p._id === selectedItem.productId)
      if (product && formData.qrCode) {
        try {
          await productsAPI.update(product._id, {
            ...product,
            qrCode: formData.qrCode,
            barcode: formData.barcode || product.barcode
          })
        } catch (productError) {
          console.warn('Could not update product QR code:', productError)
        }
      }

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Barcode/QR code assigned successfully',
        confirmButtonColor: '#3B82F6',
        timer: 2000
      })

      setModalOpen(false)
      fetchInventory()
    } catch (error) {
      console.error('Error assigning barcode:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to assign barcode/QR code',
        confirmButtonColor: '#3B82F6'
      })
    }
  }




  // Handle edit barcode
  const handleEditBarcode = (item) => {
    setSelectedItem(item)
    
    // Get product QR code if available
    const product = products.find(p => p._id === item.productId)
    
    setFormData({
      barcode: item.barcode || product?.barcode || '',
      qrCode: item.qrCode || product?.qrCode || '',
      autoGenerate: !(item.barcode || item.qrCode || product?.barcode || product?.qrCode)
    })
    setModalOpen(true)
  }

  // Calculate stats
  const stats = useMemo(() => {
    return calculateBarcodeStats(inventory)
  }, [inventory])

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <QrCode className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-cyan-600" />
              Barcode / QR Code Assignment
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Assign unique barcodes and QR codes to stock items
            </p>
          </div>

          <Button 
            variant="secondary" 
            size="sm"
            onClick={fetchInventory}
            loading={loading}
            className="w-full sm:w-auto flex items-center justify-center"
          >
            <div className="flex items-center">
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="text-sm sm:text-base">Refresh</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-blue-900">Barcode & QR Code Management</p>
          <p className="text-sm text-blue-700 mt-1">
            Assign unique barcodes and QR codes to your inventory items for efficient tracking and management.
            System can automatically generate unique codes or you can manually enter custom codes.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <StatsCard
          label="Total Products"
          value={stats.totalProducts}
          icon={Package}
          color="blue"
        />
        <StatsCard
          label="Assigned Codes"
          value={stats.assignedCount}
          icon={CheckCircle2}
          color="green"
        />
        <StatsCard
          label="Unassigned"
          value={stats.unassignedCount}
          icon={XCircle}
          color="red"
        />
      </div>

      {/* Filters */}
      <BarcodeFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        inventory={inventory}
        filteredInventory={filteredInventory}
        resultsCount={filteredInventory.length}
        totalCount={inventory.length}
      />

      {/* Product Table */}
      <BarcodeList
        inventory={filteredInventory}
        products={products}
        loading={loading}
        onEditBarcode={handleEditBarcode}
      />

      {/* Assign/Regenerate Modal */}
      <SharedModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedItem?.barcode || selectedItem?.qrCode ? 'Regenerate Barcode/QR Code' : 'Assign Barcode/QR Code'}
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
                <span className="font-medium">SKU:</span> {(() => {
                  const product = products.find(p => p._id === selectedItem.productId)
                  return product?.sku || selectedItem.productId
                })()}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Location:</span> {selectedItem.location}
              </p>
            </div>

            {/* Auto-generate toggle */}
            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
              <div>
                <p className="text-sm font-medium text-blue-900">Auto-generate codes</p>
                <p className="text-xs text-blue-700">Let system create unique codes automatically</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.autoGenerate}
                  onChange={(e) => {
                    const isChecked = e.target.checked
                    if (isChecked) {
                      setFormData({
                        barcode: generateCode('BAR'),
                        qrCode: generateCode('QR'),
                        autoGenerate: true
                      })
                    } else {
                      setFormData({
                        ...formData,
                        autoGenerate: false
                      })
                    }
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Barcode Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Barcode
              </label>
              <div className="relative">
                <Barcode className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value, autoGenerate: false })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 font-mono"
                  placeholder="Enter or auto-generate barcode"
                  readOnly={formData.autoGenerate}
                />
              </div>
            </div>

            {/* QR Code Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                QR Code
              </label>
              <div className="relative">
                <QrCode className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.qrCode}
                  onChange={(e) => setFormData({ ...formData, qrCode: e.target.value, autoGenerate: false })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 font-mono"
                  placeholder="Enter or auto-generate QR code"
                  readOnly={formData.autoGenerate}
                />
              </div>
            </div>

            {/* Preview */}
            {(formData.barcode || formData.qrCode) && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Preview
                </h4>
                {formData.barcode && (
                  <p className="text-sm text-green-800">
                    <span className="font-medium">Barcode:</span> <span className="font-mono">{formData.barcode}</span>
                  </p>
                )}
                {formData.qrCode && (
                  <p className="text-sm text-green-800">
                    <span className="font-medium">QR Code:</span> <span className="font-mono">{formData.qrCode}</span>
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
                {selectedItem.barcode || selectedItem.qrCode ? 'Update' : 'Assign'} Code
              </Button>
            </div>
          </form>
        )}
      </SharedModal>
    </div>
  )
}

export default WarehouseBarcode
