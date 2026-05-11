import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Package, Pencil, AlertTriangle, Calendar, RefreshCw, Info, CheckCircle, XCircle, QrCode, Barcode } from 'lucide-react'
import Swal from 'sweetalert2'
import Button from '../../Components/UI/Button'
import StatsCard from '../../Shared/StatsCard/StatsCard'
import { SharedTable } from '../../Shared/SharedTable/SharedTable'
import SharedModal from '../../Shared/SharedModal/SharedModal'
import { inventoryAPI } from './services/barcodeService'
import { productsAPI } from '../ProductPages/services/productService'
import { 
  getExpiryStatus,
  getExpiryStatusColor, 
  getExpiryStatusDisplay,
  getDaysUntilExpiry,
  formatDate,
  generateCode,
  generateBatchNumber,
  validateInventoryTracking,
  applyInventoryFilters,
  calculateInventoryStats
} from './utils/inventoryTrackingHelpers'

const InventoryTracking = () => {
  const [inventory, setInventory] = useState([])
  const [products, setProducts] = useState([])
  const [filteredInventory, setFilteredInventory] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  
  const [formData, setFormData] = useState({
    barcode: '',
    qrCode: '',
    batch: '',
    expiry: '',
    autoGenerate: true
  })

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    warehouse: '',
    status: ''
  })

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      const [inventoryData, productsData] = await Promise.all([
        inventoryAPI.getAll(),
        productsAPI.getAll()
      ])
      
      // Normalize field names (handle both batch/batchNumber and expiry/expiryDate)
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
        title: 'Error Loading Data',
        text: error.response?.data?.message || 'Failed to fetch inventory data',
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
    const filtered = applyInventoryFilters(inventory, filters, products)
    setFilteredInventory(filtered)
  }, [inventory, filters, products])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({ search: '', warehouse: '', status: '' })
  }

  const handleAutoGenerate = () => {
    if (formData.autoGenerate) {
      setFormData(prev => ({
        ...prev,
        barcode: generateCode('BAR'),
        qrCode: generateCode('QR'),
        batch: generateBatchNumber(selectedItem?.productId || 'PROD')
      }))
    }
  }

  useEffect(() => {
    if (modalOpen && formData.autoGenerate && !formData.barcode && !formData.qrCode && !formData.batch) {
      handleAutoGenerate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen, formData.autoGenerate])

  const handleEdit = (item) => {
    setSelectedItem(item)
    
    // Get product data
    const product = products.find(p => p._id === item.productId)
    
    setFormData({
      barcode: item.barcode || product?.barcode || '',
      qrCode: item.qrCode || product?.qrCode || '',
      batch: item.batch || '',
      expiry: item.expiry ? new Date(item.expiry).toISOString().split('T')[0] : '',
      autoGenerate: !(item.barcode || item.qrCode || item.batch || product?.barcode || product?.qrCode)
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    const validation = validateInventoryTracking(formData)
    if (!validation.isValid) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: validation.errors[0],
        confirmButtonColor: '#3B82F6'
      })
      return
    }

    try {
      // Update inventory item
      await inventoryAPI.update(selectedItem._id, {
        barcode: formData.barcode || null,
        qrCode: formData.qrCode || null,
        batch: formData.batch || null,
        expiry: formData.expiry || null
      })

      // Also update the product with codes if needed
      const product = products.find(p => p._id === selectedItem.productId)
      if (product && (formData.qrCode || formData.barcode)) {
        try {
          await productsAPI.update(product._id, {
            ...product,
            qrCode: formData.qrCode || product.qrCode,
            barcode: formData.barcode || product.barcode
          })
        } catch (productError) {
          console.warn('Could not update product:', productError)
        }
      }

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Inventory tracking information updated successfully',
        confirmButtonColor: '#3B82F6',
        timer: 2000
      })

      setModalOpen(false)
      fetchAllData()
    } catch (error) {
      console.error('Error updating inventory:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to update inventory tracking',
        confirmButtonColor: '#3B82F6'
      })
    }
  }

  // Calculate stats
  const stats = useMemo(() => {
    return calculateInventoryStats(inventory, products)
  }, [inventory, products])

  // Table columns
  const columns = [
    { 
      header: "Product Name", 
      accessorKey: "productName",
      cell: ({ getValue }) => (
        <div className="font-medium text-gray-900">{getValue() || 'N/A'}</div>
      )
    },
    { 
      header: "SKU", 
      accessorKey: "sku",
      cell: ({ row }) => {
        const product = products.find(p => p._id === row.original.productId)
        return (
          <div className="text-gray-700 font-mono text-xs">{product?.sku || 'N/A'}</div>
        )
      }
    },
    { 
      header: "Location", 
      accessorKey: "location",
      cell: ({ getValue }) => (
        <div className="text-gray-600 text-sm">{getValue() || 'N/A'}</div>
      )
    },
    { 
      header: "Stock Qty", 
      accessorKey: "stockQty",
      cell: ({ getValue }) => (
        <div className="font-semibold text-gray-900">{getValue() || 0}</div>
      )
    },
    { 
      header: "Barcode", 
      accessorKey: "barcode",
      cell: ({ getValue, row }) => {
        const inventoryBarcode = getValue()
        const product = products.find(p => p._id === row.original.productId)
        const barcode = inventoryBarcode || product?.barcode
        
        return barcode ? (
          <div className="flex items-center gap-1">
            <Barcode className="w-3.5 h-3.5 text-blue-600" />
            <div className="font-mono text-xs text-blue-600">{barcode}</div>
          </div>
        ) : (
          <span className="text-gray-400 text-xs italic">Not set</span>
        )
      }
    },
    { 
      header: "QR Code", 
      accessorKey: "qrCode",
      cell: ({ row }) => {
        const inventoryQR = row.original.qrCode
        const product = products.find(p => p._id === row.original.productId)
        const qrCode = inventoryQR || product?.qrCode
        
        return qrCode ? (
          <div className="flex items-center gap-1">
            <QrCode className="w-3.5 h-3.5 text-green-600" />
            <div className="font-mono text-xs text-green-600 truncate max-w-[120px]" title={qrCode}>
              {qrCode}
            </div>
          </div>
        ) : (
          <span className="text-gray-400 text-xs italic">Not set</span>
        )
      }
    },
    { 
      header: "Batch", 
      accessorKey: "batch",
      cell: ({ getValue }) => {
        const value = getValue()
        return value ? (
          <div className="font-mono text-xs text-purple-600">{value}</div>
        ) : (
          <span className="text-gray-400 text-xs italic">Not set</span>
        )
      }
    },
    { 
      id: "expiryDate",
      header: "Expiry Date", 
      accessorKey: "expiry",
      cell: ({ getValue }) => {
        const value = getValue()
        return value ? (
          <div className="text-gray-700 text-sm">{formatDate(value)}</div>
        ) : (
          <span className="text-gray-400 text-xs italic">Not set</span>
        )
      }
    },
    { 
      id: "expiryStatus",
      header: "Status", 
      accessorKey: "expiry",
      cell: ({ getValue }) => {
        const expiryDate = getValue()
        const statusKey = getExpiryStatus(expiryDate)
        const statusDisplay = getExpiryStatusDisplay(statusKey)
        const colorClasses = getExpiryStatusColor(statusKey)
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colorClasses}`}>
            {statusDisplay}
          </span>
        )
      }
    }
  ]

  const renderRowActions = (item) => (
    <div className="flex items-center gap-2">
      <Button
        variant="primary"
        size="sm"
        onClick={() => handleEdit(item)}
        title="Edit Tracking Info"
      >
        <div className="flex items-center">
          <Pencil className="w-4 h-4 mr-1" />
          <span>Edit</span>
        </div>
      </Button>
    </div>
  )

  // Get unique warehouses
  const warehouses = useMemo(() => {
    return [...new Set(inventory.map(item => item.location).filter(Boolean))]
  }, [inventory])

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Package className="w-8 h-8 mr-3 text-blue-600" />
              Inventory Tracking
            </h1>
            <p className="text-gray-600 mt-2">
              Manage barcodes, QR codes, batch numbers, and expiry dates in one place
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
          <p className="text-sm font-semibold text-blue-900">Inventory Tracking Management</p>
          <p className="text-sm text-blue-700 mt-1">
            Assign barcodes, QR codes, batch numbers, and expiry dates to inventory items. 
            Batch and expiry fields are <strong>optional</strong> - use them for perishable items (food, medicine) 
            and skip for electronics. All data can be auto-generated or manually entered.
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatsCard
          label="Total Items"
          value={stats.totalItems}
          icon={Package}
          color="blue"
        />
        <StatsCard
          label="With Codes"
          value={stats.withCodesCount}
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          label="With Batch"
          value={stats.withBatchCount}
          icon={CheckCircle}
          color="purple"
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
          icon={Calendar}
          color="yellow"
        />
        <StatsCard
          label="Expired"
          value={stats.expiredCount}
          icon={XCircle}
          color="red"
        />
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-gray-600" />
          <h2 className="font-semibold text-gray-900">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search by name, ID, barcode, QR, or batch..."
            />
          </div>

          {/* Warehouse */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Warehouse</label>
            <select
              value={filters.warehouse}
              onChange={(e) => handleFilterChange('warehouse', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Warehouses</option>
              {warehouses.map(w => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="valid">Valid</option>
              <option value="near-expiry">Near Expiry</option>
              <option value="expired">Expired</option>
              <option value="unknown">No Expiry Set</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredInventory.length}</span> of <span className="font-semibold">{inventory.length}</span> items
          </p>
          {(filters.search || filters.warehouse || filters.status) && (
            <Button variant="ghost" size="sm" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {!loading && inventory.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex flex-col items-center">
              <Package className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Inventory Items</h3>
              <p className="text-gray-500">
                No inventory items available. Add products via:
                <br />
                <span className="font-medium">GRN (Goods Receive Note)</span> or <span className="font-medium">Stock In</span>
              </p>
            </div>
          </div>
        ) : (
          <SharedTable
            columns={columns}
            data={filteredInventory}
            pageSize={10}
            loading={loading}
            renderRowActions={renderRowActions}
            actionsHeader="Actions"
          />
        )}
      </div>

      {/* Edit Modal */}
      <SharedModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Edit Inventory Tracking"
        size="large"
      >
        {selectedItem && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Product Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Product Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Name:</span> {selectedItem.productName}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Stock:</span> {selectedItem.stockQty} units
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Location:</span> {selectedItem.location || 'Not assigned'}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">SKU:</span> {(() => {
                    const product = products.find(p => p._id === selectedItem.productId)
                    return product?.sku || selectedItem.productId
                  })()}
                </p>
              </div>
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
                        batch: generateBatchNumber(selectedItem.productId),
                        expiry: formData.expiry,
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

            {/* Form Fields in Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Barcode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Barcode <span className="text-gray-400 font-normal text-xs">(Optional)</span>
                </label>
                <div className="relative">
                  <Barcode className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value, autoGenerate: false })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    placeholder="Enter barcode..."
                    readOnly={formData.autoGenerate}
                  />
                </div>
              </div>

              {/* QR Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  QR Code <span className="text-gray-400 font-normal text-xs">(Optional)</span>
                </label>
                <div className="relative">
                  <QrCode className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.qrCode}
                    onChange={(e) => setFormData({ ...formData, qrCode: e.target.value, autoGenerate: false })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    placeholder="Enter QR code..."
                    readOnly={formData.autoGenerate}
                  />
                </div>
              </div>

              {/* Batch Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batch Number <span className="text-gray-400 font-normal text-xs">(Optional)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value, autoGenerate: false })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
                    placeholder="e.g., BATCH-2024-001"
                    maxLength={100}
                    readOnly={formData.autoGenerate}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setFormData({ ...formData, batch: generateBatchNumber(selectedItem.productId), autoGenerate: false })}
                    disabled={formData.autoGenerate}
                  >
                    Generate
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty for non-perishable items
                </p>
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date <span className="text-gray-400 font-normal text-xs">(Optional)</span>
                </label>
                <input
                  type="date"
                  value={formData.expiry}
                  onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  min={new Date().toISOString().split('T')[0]}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Only for perishable items
                </p>
              </div>
            </div>

            {/* Preview */}
            {(formData.barcode || formData.qrCode || formData.batch || formData.expiry) && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Preview Changes
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {formData.barcode && (
                    <p className="text-sm text-green-800">
                      <span className="font-medium">Barcode:</span> <span className="font-mono">{formData.barcode}</span>
                    </p>
                  )}
                  {formData.qrCode && (
                    <p className="text-sm text-green-800">
                      <span className="font-medium">QR Code:</span> <span className="font-mono text-xs">{formData.qrCode}</span>
                    </p>
                  )}
                  {formData.batch && (
                    <p className="text-sm text-green-800">
                      <span className="font-medium">Batch:</span> <span className="font-mono">{formData.batch}</span>
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
                Update Tracking Info
              </Button>
            </div>
          </form>
        )}
      </SharedModal>
    </div>
  )
}

export default InventoryTracking

