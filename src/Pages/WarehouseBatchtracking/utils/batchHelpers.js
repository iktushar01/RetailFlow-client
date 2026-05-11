// Batch Tracking Helper Functions

/**
 * Calculate expiry status
 * @param {string|Date} expiryDate - Expiry date
 * @returns {string} Expiry status
 */
export const getExpiryStatus = (expiryDate) => {
  if (!expiryDate) return 'unknown'
  
  const today = new Date()
  const expiry = new Date(expiryDate)
  const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
  
  if (daysUntilExpiry < 0) return 'expired'
  if (daysUntilExpiry <= 30) return 'near-expiry'
  return 'valid'
}

/**
 * Get expiry status color
 * @param {string} status - Expiry status
 * @returns {string} Tailwind CSS classes
 */
export const getExpiryStatusColor = (status) => {
  const colors = {
    'valid': 'bg-green-100 text-green-800 border-green-200',
    'near-expiry': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'expired': 'bg-red-100 text-red-800 border-red-200',
    'unknown': 'bg-gray-100 text-gray-800 border-gray-200'
  }
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
}

/**
 * Get expiry status display text
 * @param {string} status - Expiry status
 * @returns {string} Display text
 */
export const getExpiryStatusDisplay = (status) => {
  const displays = {
    'valid': 'Valid',
    'near-expiry': 'Near Expiry',
    'expired': 'Expired',
    'unknown': 'Unknown'
  }
  return displays[status] || 'Unknown'
}

/**
 * Calculate days until expiry
 * @param {string|Date} expiryDate - Expiry date
 * @returns {number} Days until expiry
 */
export const getDaysUntilExpiry = (expiryDate) => {
  if (!expiryDate) return null
  
  const today = new Date()
  const expiry = new Date(expiryDate)
  const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
  
  return daysUntilExpiry
}

/**
 * Apply filters to inventory items
 * @param {Array} items - Array of inventory items
 * @param {Object} filters - Filter object
 * @returns {Array} Filtered items
 */
export const applyBatchFilters = (items, filters) => {
  let filtered = [...items]

  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(item => 
      item.productName?.toLowerCase().includes(searchLower) ||
      item.productId?.toLowerCase().includes(searchLower) ||
      item.batch?.toLowerCase().includes(searchLower)
    )
  }

  // Warehouse filter
  if (filters.warehouse) {
    filtered = filtered.filter(item => item.location === filters.warehouse)
  }

  // Expiry Status filter
  if (filters.expiryStatus) {
    filtered = filtered.filter(item => getExpiryStatus(item.expiry) === filters.expiryStatus)
  }

  return filtered
}

/**
 * Calculate batch statistics
 * @param {Array} items - Array of inventory items
 * @returns {Object} Statistics object
 */
export const calculateBatchStats = (items) => {
  const totalProducts = items.length
  const validCount = items.filter(item => getExpiryStatus(item.expiry) === 'valid').length
  const nearExpiryCount = items.filter(item => getExpiryStatus(item.expiry) === 'near-expiry').length
  const expiredCount = items.filter(item => getExpiryStatus(item.expiry) === 'expired').length
  const unknownCount = items.filter(item => getExpiryStatus(item.expiry) === 'unknown').length

  return { totalProducts, validCount, nearExpiryCount, expiredCount, unknownCount }
}

/**
 * Export batch data to CSV
 * @param {Array} items - Array of inventory items
 * @returns {string} CSV string
 */
export const exportBatchToCSV = (items) => {
  const csv = [
    ['Product Name', 'Product ID', 'Batch Number', 'Expiry Date', 'Location', 'Stock Qty', 'Status'],
    ...items.map(item => [
      item.productName || '',
      item.productId || '',
      item.batch || '',
      item.expiry ? new Date(item.expiry).toLocaleDateString() : '',
      item.location || '',
      item.stockQty || 0,
      getExpiryStatusDisplay(getExpiryStatus(item.expiry))
    ])
  ].map(row => row.join(',')).join('\n')
  
  return csv
}

/**
 * Download CSV file
 * @param {string} csvContent - CSV content string
 * @param {string} filename - Name of the file to download
 */
export const downloadCSV = (csvContent, filename = 'batch-export.csv') => {
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

/**
 * Get unique warehouses from inventory
 * @param {Array} items - Array of inventory items
 * @returns {Array} Unique warehouses
 */
export const getUniqueWarehouses = (items) => {
  return [...new Set(items.map(item => item.location).filter(Boolean))]
}

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Format date for input
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string for input
 */
export const formatDateForInput = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

/**
 * Validate batch data
 * @param {Object} batchData - Batch data object
 * @returns {Object} Validation result
 */
export const validateBatchData = (batchData) => {
  const errors = {}
  
  if (!batchData.batch || !batchData.batch.trim()) {
    errors.batch = 'Batch number is required'
  }
  
  if (!batchData.expiry) {
    errors.expiry = 'Expiry date is required'
  } else {
    const expiryDate = new Date(batchData.expiry)
    const today = new Date()
    if (expiryDate <= today) {
      errors.expiry = 'Expiry date must be in the future'
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Generate batch number
 * @param {string} productId - Product ID
 * @returns {string} Generated batch number
 */
export const generateBatchNumber = (productId) => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `BATCH-${productId}-${timestamp}-${random}`
}
