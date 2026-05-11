/**
 * Helper functions for Low Stock Alerts
 */

/**
 * Calculate statistics from low stock data
 * @param {Array} lowStockData - Array of low stock items
 * @param {Array} productsData - Array of all products
 * @returns {Object} Statistics object
 */
export const calculateLowStockStats = (lowStockData, productsData) => {
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
  
  return {
    totalAlerts,
    criticalAlerts,
    warningAlerts,
    totalValue: totalValue.toFixed(2)
  }
}

/**
 * Get severity level and color for an item
 * @param {Object} item - Inventory item
 * @param {Array} products - Array of products
 * @returns {Object} Severity information
 */
export const getSeverityLevel = (item, products) => {
  const product = products.find(p => p._id === item.productId)
  const criticalLevel = product?.criticalStockLevel || 5
  const minLevel = product?.minStockLevel || 10
  
  if (item.stockQty <= criticalLevel) {
    return { level: 'Critical', color: 'text-red-600 bg-red-100' }
  }
  if (item.stockQty <= minLevel) {
    return { level: 'Warning', color: 'text-yellow-600 bg-yellow-100' }
  }
  return { level: 'Low', color: 'text-orange-600 bg-orange-100' }
}

/**
 * Get severity icon for an item
 * @param {Object} item - Inventory item
 * @param {Array} products - Array of products
 * @returns {String} Emoji icon
 */
export const getSeverityIcon = (item, products) => {
  const product = products.find(p => p._id === item.productId)
  const criticalLevel = product?.criticalStockLevel || 5
  const minLevel = product?.minStockLevel || 10
  
  if (item.stockQty <= criticalLevel) return '🔴'
  if (item.stockQty <= minLevel) return '🟡'
  return '🟠'
}

/**
 * Filter low stock items based on criteria
 * @param {Array} lowStockItems - Array of low stock items
 * @param {Array} products - Array of products
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered items
 */
export const filterLowStockItems = (lowStockItems, products, filters) => {
  return lowStockItems.filter(item => {
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
}

/**
 * Calculate suggested reorder quantity
 * @param {Object} product - Product object
 * @returns {Number} Suggested quantity
 */
export const calculateSuggestedQuantity = (product) => {
  return Math.max(50, (product?.minStockLevel || 10) * 3)
}

/**
 * Find supplier for a product
 * @param {Object} product - Product object
 * @param {Array} suppliers - Array of suppliers
 * @returns {Object|null} Supplier object or null
 */
export const findProductSupplier = (product, suppliers) => {
  let supplier = null
  
  // Try to find supplier by ID first
  if (product.supplierId) {
    supplier = suppliers.find(s => s._id === product.supplierId)
  }
  
  // If not found by ID, try to find by name
  if (!supplier && product.supplier) {
    supplier = suppliers.find(s => 
      s.supplierName === product.supplier || 
      s.name === product.supplier
    )
  }
  
  return supplier
}

/**
 * Group items by supplier for bulk operations
 * @param {Array} items - Array of inventory items
 * @param {Array} products - Array of products
 * @param {Array} suppliers - Array of suppliers
 * @returns {Object} Items grouped by supplier
 */
export const groupItemsBySupplier = (items, products, suppliers) => {
  const itemsBySupplier = {}
  
  items.forEach(item => {
    const product = products.find(p => p._id === item.productId)
    if (!product) return
    
    const supplier = findProductSupplier(product, suppliers)
    
    if (supplier) {
      const supplierKey = supplier._id
      if (!itemsBySupplier[supplierKey]) {
        itemsBySupplier[supplierKey] = {
          supplier: supplier,
          items: []
        }
      }
      
      const suggestedQty = calculateSuggestedQuantity(product)
      itemsBySupplier[supplierKey].items.push({
        productId: product._id,
        productName: product.productName,
        quantity: suggestedQty,
        unitPrice: product.costPrice || 0,
        totalPrice: suggestedQty * (product.costPrice || 0)
      })
    }
  })
  
  return itemsBySupplier
}

/**
 * Create filter configuration for the filter component
 * @param {Array} products - Array of products
 * @param {Array} suppliers - Array of suppliers
 * @returns {Array} Filter configuration
 */
export const createFilterConfig = (products, suppliers) => {
  return [
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
        ...Array.from(new Set(products.map(p => p.category))).map(cat => ({ 
          label: cat, 
          value: cat 
        }))
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
}

