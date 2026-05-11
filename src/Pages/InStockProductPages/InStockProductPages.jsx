import React, { useState, useEffect, useMemo } from 'react'
import { RefreshCw, Package, AlertTriangle, TrendingUp, XCircle, Clock, Info } from 'lucide-react'
import Swal from 'sweetalert2'
import Button from '../../Components/UI/Button'
import StatsCard from '../../Shared/StatsCard/StatsCard'
import ProductInventoryList from './components/ProductInventoryList'
import InventoryFilter from './components/InventoryFilter'
import { inventoryAPI, productsAPI } from './services/inventoryService'
import { formatDate, getExpiryStatus } from './utils/inventoryHelpers'

export const InStockProductPages = () => {
  const [inventory, setInventory] = useState([])
  const [products, setProducts] = useState([])
  const [fetchLoading, setFetchLoading] = useState(false)

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    stockStatus: '',
    expiryStatus: '',
    location: ''
  })

  // Fetch data on mount
  useEffect(() => {
    fetchAllData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchAllData = async () => {
    await Promise.all([
      fetchInventory(),
      fetchProducts()
    ])
  }

  const fetchInventory = async () => {
    try {
      setFetchLoading(true)
      const data = await inventoryAPI.getProducts()
      console.log("=== FETCHED PRODUCT-CENTRIC INVENTORY ===");
      console.log("Total products found:", data.length);
      if (data.length > 0) {
        console.log("Sample product data:", data[0]);
        console.log("Locations for first product:", data[0].locations);
      }
      setInventory(data || [])
    } catch (error) {
      console.error('Error fetching inventory:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch inventory. Please try again.',
        confirmButtonColor: '#3B82F6'
      })
    } finally {
      setFetchLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const data = await productsAPI.getAll()
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  // Filter handler
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  // Get unique categories from products
  const categories = useMemo(() => {
    const cats = products.map(p => p.category).filter(Boolean)
    return [...new Set(cats)]
  }, [products])

  // Filtered and sorted inventory (now product-centric)
  const filteredInventory = useMemo(() => {
    const filtered = inventory.filter(product => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        if (!product.productName?.toLowerCase().includes(searchLower) && 
            !product.sku?.toLowerCase().includes(searchLower)) {
          return false
        }
      }

      // Category filter
      if (filters.category) {
        if (product.category !== filters.category) {
          return false
        }
      }

      // Stock status filter - check if any location matches
      if (filters.stockStatus) {
        const hasMatchingLocation = product.locations.some(location => {
          const stockQty = location.quantity || 0
          const lowStockThreshold = 10 // Default threshold

          if (filters.stockStatus === 'out-of-stock' && stockQty === 0) return true
          if (filters.stockStatus === 'low-stock' && stockQty > 0 && stockQty <= lowStockThreshold) return true
          if (filters.stockStatus === 'in-stock' && stockQty > lowStockThreshold) return true
          return false
        })
        
        if (!hasMatchingLocation) return false
      }

      // Expiry status filter - check if any location matches
      if (filters.expiryStatus) {
        const hasMatchingLocation = product.locations.some(location => {
          const expiryStatus = getExpiryStatus(location.expiry)
          if (!expiryStatus) return false

          if (filters.expiryStatus === 'expired' && expiryStatus.status === 'Expired') return true
          if (filters.expiryStatus === 'expiring-soon' && expiryStatus.status === 'Expiring Soon') return true
          if (filters.expiryStatus === 'valid' && expiryStatus.status === 'Valid') return true
          return false
        })
        
        if (!hasMatchingLocation) return false
      }

      // Location filter - check if any location matches
      if (filters.location) {
        const locationLower = filters.location.toLowerCase()
        const hasMatchingLocation = product.locations.some(location => 
          location.location?.toLowerCase().includes(locationLower)
        )
        
        if (!hasMatchingLocation) return false
      }

      return true
    })

    // Sort by product name
    return filtered.sort((a, b) => a.productName.localeCompare(b.productName))
  }, [inventory, filters])

  // Calculate summary stats (now product-centric)
  const stats = useMemo(() => {
    const totalProducts = inventory.length
    
    // Calculate total stock across all locations
    const totalStock = inventory.reduce((sum, product) => {
      return sum + product.locations.reduce((locationSum, location) => {
        return locationSum + (location.quantity || 0)
      }, 0)
    }, 0)
    
    // Count products with low stock in any location
    const lowStock = inventory.filter(product => {
      return product.locations.some(location => {
        const stockQty = location.quantity || 0
        const lowStockThreshold = 10 // Default threshold
        return stockQty > 0 && stockQty <= lowStockThreshold
      })
    }).length

    // Count products that are out of stock in all locations
    const outOfStock = inventory.filter(product => {
      return product.locations.every(location => (location.quantity || 0) === 0)
    }).length
    
    // Count products with expiring items in any location
    const expiring = inventory.filter(product => {
      return product.locations.some(location => {
        const expiryStatus = getExpiryStatus(location.expiry)
        return expiryStatus && (expiryStatus.status === 'Expired' || expiryStatus.status === 'Expiring Soon')
      })
    }).length

    return { totalProducts, totalStock, lowStock, outOfStock, expiring }
  }, [inventory])

  const handleView = (locationItem) => {
    // Find the product this location belongs to
    const product = inventory.find(p => p.productId === locationItem.productId)
    const expiryStatus = getExpiryStatus(locationItem.expiry)

    // Safely get product name
    const productName = locationItem.productName || product?.productName || 'Unknown Product'
    
    // Safely get product details
    const productSku = locationItem.sku || product?.sku || 'N/A'
    const productCategory = locationItem.category || product?.category || 'Uncategorized'
    const productBatch = locationItem.batch || 'N/A'
    const productExpiry = locationItem.expiry || 'N/A'
    const productLocation = locationItem.location || 'Unknown Location'
    const productQuantity = locationItem.quantity || 0
    const productStatus = locationItem.status || 'Unknown'
    const lastUpdated = locationItem.lastUpdated || product?.updatedAt || product?.createdAt

    Swal.fire({
      title: `<div class="flex items-center justify-center"><svg class="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>${productName}</div>`,
      html: `
        <div class="text-left space-y-4 max-h-96 overflow-y-auto">
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p class="text-gray-600 font-semibold">Product ID</p>
              <p class="text-gray-900 font-mono text-xs">${locationItem.productId || 'N/A'}</p>
            </div>
            <div>
              <p class="text-gray-600 font-semibold">SKU</p>
              <p class="text-gray-900 font-mono">${productSku}</p>
            </div>
            <div>
              <p class="text-gray-600 font-semibold">Category</p>
              <p class="text-gray-900">${productCategory}</p>
            </div>
            <div>
              <p class="text-gray-600 font-semibold">Batch Number</p>
              <p class="text-gray-900 font-mono">${productBatch}</p>
            </div>
            <div>
              <p class="text-gray-600 font-semibold">Expiry Date</p>
              <p class="text-gray-900">${productExpiry !== 'N/A' ? formatDate(productExpiry).split(',')[0] : 'N/A'}</p>
              ${expiryStatus ? `<p class="${expiryStatus.color} text-xs font-semibold">${expiryStatus.status}</p>` : ''}
            </div>
            <div>
              <p class="text-gray-600 font-semibold">Location</p>
              <p class="text-gray-900">${productLocation}</p>
            </div>
          </div>
          
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div class="text-center">
              <p class="text-sm text-gray-600">Current Stock Quantity</p>
              <p class="text-4xl font-bold text-blue-600 mt-2">${productQuantity}</p>
              <p class="text-xs text-gray-500 mt-1">units available</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p class="text-gray-600 font-semibold">Last Updated</p>
              <p class="text-gray-900 text-xs">${formatDate(lastUpdated)}</p>
            </div>
            <div>
              <p class="text-gray-600 font-semibold">Status</p>
              <p class="text-gray-900">${productStatus}</p>
            </div>
          </div>

          ${product ? `
            <div class="bg-gray-50 p-3 rounded-lg">
              <p class="text-xs text-gray-600 font-semibold mb-2">Product Details</p>
              <p class="text-sm text-gray-700">Price: <strong>BDT ${product.sellingPrice ? parseFloat(product.sellingPrice).toFixed(2) : 'N/A'}</strong></p>
              <p class="text-sm text-gray-700">Cost Price (Avg PO): <strong>BDT ${product.costPrice ? parseFloat(product.costPrice).toFixed(2) : 'N/A'}</strong></p>
              ${product.description ? `<p class="text-sm text-gray-700 mt-2">${product.description}</p>` : ''}
            </div>
          ` : ''}

          ${product && product.locations && product.locations.length > 1 ? `
            <div class="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <p class="text-xs text-gray-600 font-semibold mb-2">All Locations for this Product:</p>
              <div class="space-y-1">
                ${product.locations.map(loc => `
                  <div class="flex justify-between text-xs">
                    <span class="text-gray-600">${loc.location || 'Unknown Location'}</span>
                    <span class="font-medium ${(loc.quantity || 0) > 0 ? 'text-green-600' : 'text-red-600'}">${loc.quantity || 0} units</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `,
      width: '700px',
      confirmButtonColor: '#3B82F6',
      confirmButtonText: 'Close'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Package className="w-8 h-8 mr-3 text-blue-600" />
              Inhouse Products / Warehouse Stock
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and monitor warehouse inventory
            </p>
            
            
          </div>

          <Button 
            variant="secondary" 
            size="md"
            onClick={fetchAllData}
            disabled={fetchLoading}
            loading={fetchLoading}
            className="flex items-center"
          >
            <div className="flex items-center">
              <RefreshCw className="w-5 h-5 mr-2" />
              <span>Refresh</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-blue-900">Warehouse Inventory Management</p>
          <p className="text-sm text-blue-700 mt-1">
            Monitor all products in your warehouse with real-time stock levels, batch tracking, expiry dates, 
            and location information. Stock is automatically updated through GRN entries.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        <StatsCard
          label="Total Products"
          value={stats.totalProducts}
          icon={Package}
          color="gray"
        />
        <StatsCard
          label="Total Stock"
          value={stats.totalStock}
          icon={TrendingUp}
          color="blue"
        />
        <StatsCard
          label="Low Stock"
          value={stats.lowStock}
          icon={AlertTriangle}
          color="yellow"
        />
        <StatsCard
          label="Out of Stock"
          value={stats.outOfStock}
          icon={XCircle}
          color="red"
        />
        <StatsCard
          label="Expiring Soon"
          value={stats.expiring}
          icon={Clock}
          color="purple"
        />
      </div>

      {/* Filter Section */}
      <InventoryFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        categories={categories}
        resultsCount={filteredInventory.length}
        totalCount={inventory.length}
      />

      {/* Product Inventory List */}
      <ProductInventoryList
        inventory={filteredInventory}
        loading={fetchLoading}
        onView={handleView}
      />
    </div>
  )
}

export default InStockProductPages
