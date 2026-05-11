import React, { useState, useEffect } from 'react'
import { AlertTriangle, Package, RotateCcw, RefreshCw, Plus, Filter, Download } from 'lucide-react'
import Button from '../../../Components/UI/Button'
import StatsCard from '../../../Shared/StatsCard/StatsCard'
import InfoCard from '../../../Shared/InfoCard/InfoCard'
import { ReusableFilter } from '../../../Shared/ReusableFilter/ReusableFilter'
import { SharedTable } from '../../../Shared/SharedTable/SharedTable'
import SharedModal from '../../../Shared/SharedModal/SharedModal'
import { inventoryAPI, productsAPI, suppliersAPI, purchaseOrdersAPI } from '../services/inventoryService'
import Swal from 'sweetalert2'
import { InventoryLoading } from '../../../Components/UI/LoadingAnimation'

const LowStockAlerts = () => {
  const [lowStockItems, setLowStockItems] = useState([])
  const [products, setProducts] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showReorderModal, setShowReorderModal] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    supplier: '',
    severity: ''
  })

  // Stats data
  const [stats, setStats] = useState({
    totalAlerts: 0,
    criticalAlerts: 0,
    warningAlerts: 0,
    totalValue: 0
  })

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    fetchData()
  }, [filters])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [inventoryData, productsData, suppliersData] = await Promise.all([
        inventoryAPI.getAll(),
        productsAPI.getAll(),
        suppliersAPI.getAll()
      ])
      
      setProducts(productsData)
      setSuppliers(suppliersData)
      
      // Filter low stock items
      const lowStock = inventoryData.filter(item => {
        const product = productsData.find(p => p._id === item.productId)
        return product && item.stockQty <= (product.minStockLevel || 10)
      })
      
      setLowStockItems(lowStock)
      calculateStats(lowStock, productsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (lowStockData, productsData) => {
    const totalAlerts = lowStockData.length
    const criticalAlerts = lowStockData.filter(item => {
      const product = productsData.find(p => p._id === item.productId)
      return item.stockQty <= (product?.criticalStockLevel || 5)
    }).length
    const warningAlerts = totalAlerts - criticalAlerts
    
    const totalValue = lowStockData.reduce((sum, item) => {
      const product = productsData.find(p => p._id === item.productId)
      return sum + (item.stockQty * (product?.costPrice || 0))
    }, 0)
    
    setStats({
      totalAlerts,
      criticalAlerts,
      warningAlerts,
      totalValue: totalValue.toFixed(2)
    })
  }

  const getSeverityLevel = (item) => {
    const product = products.find(p => p._id === item.productId)
    const criticalLevel = product?.criticalStockLevel || 5
    const minLevel = product?.minStockLevel || 10
    
    if (item.stockQty <= criticalLevel) return { level: 'Critical', color: 'text-red-600 bg-red-100' }
    if (item.stockQty <= minLevel) return { level: 'Warning', color: 'text-yellow-600 bg-yellow-100' }
    return { level: 'Low', color: 'text-orange-600 bg-orange-100' }
  }

  const getSeverityIcon = (item) => {
    const product = products.find(p => p._id === item.productId)
    const criticalLevel = product?.criticalStockLevel || 5
    const minLevel = product?.minStockLevel || 10
    
    if (item.stockQty <= criticalLevel) return '🔴'
    if (item.stockQty <= minLevel) return '🟡'
    return '🟠'
  }

  const filteredItems = lowStockItems.filter(item => {
    const product = products.find(p => p._id === item.productId)
    if (!product) return false

    const matchesSearch = !filters.search || 
      product.productName?.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.sku?.toLowerCase().includes(filters.search.toLowerCase())
    
    const matchesCategory = !filters.category || product.category === filters.category
    const matchesSupplier = !filters.supplier || product.supplierId === filters.supplier
    
    const matchesSeverity = !filters.severity || 
      (filters.severity === 'critical' && item.stockQty <= (product.criticalStockLevel || 5)) ||
      (filters.severity === 'warning' && item.stockQty > (product.criticalStockLevel || 5) && item.stockQty <= (product.minStockLevel || 10))

    return matchesSearch && matchesCategory && matchesSupplier && matchesSeverity
  })

  const filterConfig = [
    {
      key: 'search',
      label: 'Search Products',
      type: 'search',
      placeholder: 'Search by name or SKU...'
    },
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      options: [
        { label: 'All Categories', value: '' },
        ...Array.from(new Set(products.map(p => p.category))).map(cat => ({ label: cat, value: cat }))
      ]
    },
    {
      key: 'supplier',
      label: 'Supplier',
      type: 'select',
      options: [
        { label: 'All Suppliers', value: '' },
        ...suppliers.map(s => ({ label: s.name, value: s._id }))
      ]
    },
    {
      key: 'severity',
      label: 'Severity',
      type: 'select',
      options: [
        { label: 'All Severity', value: '' },
        { label: 'Critical', value: 'critical' },
        { label: 'Warning', value: 'warning' }
      ]
    }
  ]

  const tableColumns = [
    {
      id: 'product',
      accessorKey: 'product',
      header: 'Product',
      cell: ({ row }) => {
        const item = row.original
        const product = products.find(p => p._id === item.productId)
        return (
          <div>
            <div className="font-medium text-gray-900">{product?.productName || 'Unknown'}</div>
            <div className="text-sm text-gray-500">SKU: {product?.sku || 'N/A'}</div>
          </div>
        )
      }
    },
    {
      id: 'sku',
      accessorKey: 'sku',
      header: 'SKU',
      cell: ({ row }) => {
        const item = row.original
        const product = products.find(p => p._id === item.productId)
        return <div className="font-mono text-sm">{product?.sku || 'N/A'}</div>
      }
    },
    {
      id: 'currentQty',
      accessorKey: 'stockQty',
      header: 'Current Qty',
      cell: ({ row }) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{row.original.stockQty}</div>
          <div className="text-xs text-gray-500">units</div>
        </div>
      )
    },
    {
      id: 'minLevel',
      accessorKey: 'minLevel',
      header: 'Min Level',
      cell: ({ row }) => {
        const item = row.original
        const product = products.find(p => p._id === item.productId)
        return (
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">{product?.minStockLevel || 10}</div>
            <div className="text-xs text-gray-500">units</div>
          </div>
        )
      }
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const item = row.original
        const severityInfo = getSeverityLevel(item)
        return (
          <div className="flex items-center justify-center">
            <span className="text-lg mr-2">{getSeverityIcon(item)}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${severityInfo.color}`}>
              {severityInfo.level}
            </span>
          </div>
        )
      }
    },
    {
      id: 'actions',
      accessorKey: 'actions',
      header: 'Action',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleReorderNow(row.original)}
          >
            <div className="flex items-center">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reorder Now
            </div>
          </Button>
        </div>
      )
    }
  ]

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      supplier: '',
      severity: ''
    })
  }

  const handleExport = () => {
    console.log('Exporting low stock alerts...')
  }

  const handleReorderNow = async (item) => {
    const product = products.find(p => p._id === item.productId)
    
    if (!product) {
      Swal.fire('Error', 'Product not found', 'error')
      return
    }
    
    // Try to find supplier by ID first, then by name
    let supplier = null
    if (product.supplierId) {
      supplier = suppliers.find(s => s._id === product.supplierId)
    }
    
    // If not found by ID, try to find by name
    if (!supplier && product.supplier) {
      supplier = suppliers.find(s => s.supplierName === product.supplier || s.name === product.supplier)
    }
    
    if (!supplier) {
      Swal.fire('Error', 'No supplier found for this product. Please assign a supplier to this product first.', 'error')
      return
    }

    const suggestedQty = Math.max(50, (product?.minStockLevel || 10) * 3)
    
    try {
      const poData = {
        supplierId: supplier._id,
        supplierName: supplier.name,
        items: [{
          productId: product._id,
          productName: product.productName,
          quantity: suggestedQty,
          unitPrice: product.costPrice || 0,
          totalPrice: suggestedQty * (product.costPrice || 0)
        }],
        status: 'Draft',
        notes: `Auto-generated PO for low stock alert - ${product.productName}`
      }

      await purchaseOrdersAPI.create(poData)
      
      Swal.fire({
        title: 'Success!',
        text: `Purchase order created for ${product.productName}`,
        icon: 'success'
      })
      
      fetchData() // Refresh data
    } catch (error) {
      console.error('Error creating PO:', error)
      Swal.fire('Error', 'Failed to create purchase order', 'error')
    }
  }

  const handleBulkReorder = () => {
    setSelectedItems(filteredItems)
    setShowReorderModal(true)
  }

  const handleBulkReorderConfirm = async () => {
    try {
      // Group items by supplier to create separate POs
      const itemsBySupplier = {}
      
      selectedItems.forEach(item => {
        const product = products.find(p => p._id === item.productId)
        if (!product) return
        
        // Find supplier for this product
        let supplier = null
        if (product.supplierId) {
          supplier = suppliers.find(s => s._id === product.supplierId)
        }
        if (!supplier && product.supplier) {
          supplier = suppliers.find(s => s.supplierName === product.supplier || s.name === product.supplier)
        }
        
        if (supplier) {
          const supplierKey = supplier._id
          if (!itemsBySupplier[supplierKey]) {
            itemsBySupplier[supplierKey] = {
              supplier: supplier,
              items: []
            }
          }
          
          const suggestedQty = Math.max(50, (product?.minStockLevel || 10) * 3)
          itemsBySupplier[supplierKey].items.push({
            productId: product._id,
            productName: product.productName,
            quantity: suggestedQty,
            unitPrice: product.costPrice || 0,
            totalPrice: suggestedQty * (product.costPrice || 0)
          })
        }
      })
      
      // Create POs for each supplier
      const poPromises = Object.values(itemsBySupplier).map(supplierData => {
        const poData = {
          supplierId: supplierData.supplier._id,
          supplierName: supplierData.supplier.supplierName || supplierData.supplier.name,
          items: supplierData.items,
          status: 'Draft',
          notes: `Bulk reorder for low stock items - ${supplierData.items.length} items`
        }
        return purchaseOrdersAPI.create(poData)
      })
      
      await Promise.all(poPromises)
      
      Swal.fire({
        title: 'Success!',
        text: `Purchase orders created for ${Object.keys(itemsBySupplier).length} suppliers with ${selectedItems.length} total items`,
        icon: 'success'
      })
      
      setShowReorderModal(false)
      setSelectedItems([])
      fetchData()
    } catch (error) {
      console.error('Error creating bulk PO:', error)
      Swal.fire('Error', 'Failed to create bulk purchase order', 'error')
    }
  }

  if (loading) {
    return <InventoryLoading message="Loading low stock alerts..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-red-600" />
              Low Stock Alerts
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Monitor products below minimum threshold and take action</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={handleBulkReorder}
              disabled={filteredItems.length === 0}
              className="w-full sm:w-auto flex items-center justify-center"
            >
              <div className="flex items-center">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="text-sm sm:text-base">Bulk Reorder</span>
              </div>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={fetchData}
              className="w-full sm:w-auto flex items-center justify-center"
            >
              <div className="flex items-center">
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="text-sm sm:text-base">Refresh</span>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          label="Total Alerts"
          value={stats.totalAlerts}
          icon={AlertTriangle}
          color="red"
        />
        <StatsCard
          label="Critical Alerts"
          value={stats.criticalAlerts}
          icon={AlertTriangle}
          color="red"
        />
        <StatsCard
          label="Warning Alerts"
          value={stats.warningAlerts}
          icon={AlertTriangle}
          color="yellow"
        />
        <StatsCard
          label="Total Value at Risk"
          value={`BDT ${stats.totalValue}`}
          icon={Package}
          color="purple"
        />
      </div>

      {/* Info Card */}
      <InfoCard
        type="warning"
        title="Low Stock Alert System"
        message="Products shown below are at or below their minimum stock levels. Critical alerts indicate items below critical threshold. Use 'Reorder Now' to quickly create purchase orders or 'Bulk Reorder' to handle multiple items at once."
        icon={AlertTriangle}
      />

      {/* Filters */}
      <ReusableFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onExport={handleExport}
        filterConfig={filterConfig}
        title="Alert Filters"
        resultsCount={filteredItems.length}
        totalCount={lowStockItems.length}
      />

      {/* Low Stock Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Package className="w-5 h-5 mr-2 text-red-600" />
            Low Stock Items
          </h3>
        </div>
        <SharedTable
          data={filteredItems}
          columns={tableColumns}
          loading={loading}
          emptyMessage="No low stock alerts found"
        />
      </div>

      {/* Bulk Reorder Modal */}
      <SharedModal
        isOpen={showReorderModal}
        onClose={() => setShowReorderModal(false)}
        title="Bulk Reorder Confirmation"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            You are about to create a purchase order for {selectedItems.length} low stock items.
          </p>
          <div className="max-h-64 overflow-y-auto">
            {selectedItems.map((item, index) => {
              const product = products.find(p => p._id === item.productId)
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{product?.productName}</div>
                    <div className="text-sm text-gray-500">Current: {item.stockQty} units</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Suggested: {Math.max(50, (product?.minStockLevel || 10) * 3)} units</div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setShowReorderModal(false)}
            >
              <div className="flex items-center">
                Cancel
              </div>
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleBulkReorderConfirm}
            >
              <div className="flex items-center">
                <RotateCcw className="w-4 h-4 mr-2" />
                Create Purchase Order
              </div>
            </Button>
          </div>
        </div>
      </SharedModal>
    </div>
  )
}

export default LowStockAlerts
