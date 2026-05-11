import { useState, useEffect, useMemo } from 'react'
import { inventoryAPI, productsAPI, warehousesAPI } from '../../services/inventoryService'

export const useStockDashboard = () => {
  const [inventory, setInventory] = useState([])
  const [products, setProducts] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    warehouse: '',
    status: '',
    category: ''
  })

  // Stats data
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    fastMoving: 0,
    lowStock: 0
  })

  const calculateStats = (inventoryData, productsData) => {
    console.log('StockDashboard - Calculating stats with data:', {
      inventoryData: inventoryData,
      productsData: productsData,
      inventoryLength: inventoryData.length,
      productsLength: productsData.length
    })
    
    const totalProducts = inventoryData.length
    
    // Calculate total value using the product-centric structure
    let totalValue = 0
    let lowStockCount = 0
    let fastMovingCount = 0
    
    inventoryData.forEach(product => {
      // Sum up quantities across all locations
      const totalQty = product.locations?.reduce((sum, loc) => sum + (loc.quantity || 0), 0) || 0
      
      // Use the costPrice from the product (now includes avg PO cost)
      const costPrice = product.costPrice || 0
      totalValue += totalQty * costPrice
      
      // Check if any location has low stock or is fast moving
      if (product.locations?.some(loc => loc.quantity > 0 && loc.quantity < 10)) {
        lowStockCount++
      }
      if (product.locations?.some(loc => loc.quantity > 100)) {
        fastMovingCount++
      }
      
      console.log(`Product: ${product.productName}, Total Qty: ${totalQty}, Cost: ${costPrice}, Value: ${totalQty * costPrice}`)
    })
    
    console.log('StockDashboard - Calculated stats:', {
      totalProducts,
      totalValue,
      lowStock: lowStockCount,
      fastMoving: fastMovingCount
    })
    
    setStats({
      totalProducts,
      totalValue: totalValue.toFixed(2),
      fastMoving: fastMovingCount,
      lowStock: lowStockCount
    })
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const [inventoryData, productsData, warehousesData] = await Promise.all([
        inventoryAPI.getProducts(), // Use product-centric inventory endpoint
        productsAPI.getAll(),
        warehousesAPI.getAll()
      ])
      
      console.log('Fetched inventory data:', inventoryData)
      
      setInventory(inventoryData)
      setProducts(productsData)
      setWarehouses(warehousesData)
      
      // Calculate stats
      calculateStats(inventoryData, productsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { status: 'Out of Stock', color: 'text-red-600 bg-red-100' }
    if (quantity < 10) return { status: 'Low Stock', color: 'text-yellow-600 bg-yellow-100' }
    return { status: 'In Stock', color: 'text-green-600 bg-green-100' }
  }

  const getStatusIcon = (quantity) => {
    if (quantity === 0) return '🔴'
    if (quantity < 10) return '🟡'
    return '🟢'
  }

  // Flatten product-centric data into location rows and apply filters
  const filteredInventory = useMemo(() => {
    const flattenedData = []
    
    inventory.forEach(product => {
      // Apply product-level filters first
      const matchesSearch = !filters.search || 
        product.productName?.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.sku?.toLowerCase().includes(filters.search.toLowerCase())
      
      const matchesCategory = !filters.category || product.category === filters.category
      
      if (!matchesSearch || !matchesCategory) return
      
      // Flatten locations
      product.locations?.forEach(location => {
        const matchesWarehouse = !filters.warehouse || location.location === filters.warehouse
        
        const matchesStatus = !filters.status || 
          (filters.status === 'in-stock' && location.quantity >= 10) ||
          (filters.status === 'low-stock' && location.quantity < 10 && location.quantity > 0) ||
          (filters.status === 'out-of-stock' && location.quantity === 0)
        
        if (matchesWarehouse && matchesStatus) {
          flattenedData.push({
            ...location,
            productName: product.productName,
            sku: product.sku,
            category: product.category,
            costPrice: product.costPrice,
            sellingPrice: product.sellingPrice,
            stockQty: location.quantity
          })
        }
      })
    })
    
    return flattenedData
  }, [inventory, filters])

  const filterConfig = [
    {
      key: 'search',
      label: 'Search Products',
      type: 'search',
      placeholder: 'Search by name or SKU...'
    },
    {
      key: 'warehouse',
      label: 'Warehouse',
      type: 'select',
      options: [
        { label: 'All Warehouses', value: '' },
        ...warehouses.map(w => ({ label: w.name, value: w.name }))
      ]
    },
    {
      key: 'status',
      label: 'Stock Status',
      type: 'select',
      options: [
        { label: 'All Status', value: '' },
        { label: 'In Stock', value: 'in-stock' },
        { label: 'Low Stock', value: 'low-stock' },
        { label: 'Out of Stock', value: 'out-of-stock' }
      ]
    },
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      options: [
        { label: 'All Categories', value: '' },
        ...Array.from(new Set(products.map(p => p.category))).map(cat => ({ label: cat, value: cat }))
      ]
    }
  ]

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({
      search: '',
      warehouse: '',
      status: '',
      category: ''
    })
  }

  const handleExport = () => {
    // Export functionality
    console.log('Exporting stock data...')
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    fetchData()
  }, [filters])

  return {
    // State
    inventory,
    products,
    warehouses,
    loading,
    filters,
    stats,
    filteredInventory,
    filterConfig,
    
    // Actions
    fetchData,
    handleFilterChange,
    handleClearFilters,
    handleExport,
    
    // Utilities
    getStockStatus,
    getStatusIcon
  }
}
