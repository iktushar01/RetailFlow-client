// Inventory Tracking Helper Functions - Combined from Batch & Barcode helpers

/**
 * Calculate expiry status
 */
export const getExpiryStatus = (expiryDate) => {
  if (!expiryDate) return 'unknown'
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(expiryDate)
  expiry.setHours(0, 0, 0, 0)
  const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
  
  if (daysUntilExpiry < 0) return 'expired'
  if (daysUntilExpiry <= 30) return 'near-expiry'
  return 'valid'
}

/**
 * Get expiry status color
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
 */
export const getExpiryStatusDisplay = (status) => {
  const displays = {
    'valid': 'Valid',
    'near-expiry': 'Near Expiry',
    'expired': 'Expired',
    'unknown': 'No Expiry'
  }
  return displays[status] || 'Unknown'
}

/**
 * Calculate days until expiry
 */
export const getDaysUntilExpiry = (expiryDate) => {
  if (!expiryDate) return null
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(expiryDate)
  expiry.setHours(0, 0, 0, 0)
  const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
  
  return daysUntilExpiry
}

/**
 * Format date for display
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
 * Generate unique code (Barcode or QR)
 */
export const generateCode = (prefix = 'CODE') => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `${prefix}-${timestamp}-${random}`
}

/**
 * Generate batch number
 */
export const generateBatchNumber = (productId) => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `BATCH-${productId?.substring(0, 8) || 'PROD'}-${timestamp}-${random}`
}

/**
 * Validate inventory tracking data
 */
export const validateInventoryTracking = (data) => {
  const errors = []
  
  // At least one field should be provided
  if (!data.barcode && !data.qrCode && !data.batch && !data.expiry) {
    errors.push('Please provide at least one tracking information (Barcode, QR Code, Batch, or Expiry)')
  }
  
  // Validate expiry date if provided
  if (data.expiry) {
    const expiryDate = new Date(data.expiry)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (expiryDate < today) {
      errors.push('Expiry date cannot be in the past')
    }
  }
  
  // Validate batch length if provided
  if (data.batch && data.batch.trim().length > 100) {
    errors.push('Batch number is too long (max 100 characters)')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Apply filters to inventory items
 */
export const applyInventoryFilters = (items, filters, products = []) => {
  let filtered = [...items]

  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(item => {
      const product = products.find(p => p._id === item.productId)
      const barcode = item.barcode || product?.barcode || ''
      const qrCode = item.qrCode || product?.qrCode || ''
      
      return (
        item.productName?.toLowerCase().includes(searchLower) ||
        item.productId?.toLowerCase().includes(searchLower) ||
        barcode.toLowerCase().includes(searchLower) ||
        qrCode.toLowerCase().includes(searchLower) ||
        item.batch?.toLowerCase().includes(searchLower)
      )
    })
  }

  // Warehouse filter
  if (filters.warehouse) {
    filtered = filtered.filter(item => item.location === filters.warehouse)
  }

  // Status filter (expiry status)
  if (filters.status) {
    filtered = filtered.filter(item => getExpiryStatus(item.expiry) === filters.status)
  }

  return filtered
}

/**
 * Calculate inventory statistics
 */
export const calculateInventoryStats = (items, products = []) => {
  const totalItems = items.length
  
  // Count items with codes (barcode or QR)
  const withCodesCount = items.filter(item => {
    const product = products.find(p => p._id === item.productId)
    return item.barcode || item.qrCode || product?.barcode || product?.qrCode
  }).length
  
  // Count items with batch numbers
  const withBatchCount = items.filter(item => item.batch).length
  
  // Count expiry statuses
  const validCount = items.filter(item => getExpiryStatus(item.expiry) === 'valid').length
  const nearExpiryCount = items.filter(item => getExpiryStatus(item.expiry) === 'near-expiry').length
  const expiredCount = items.filter(item => getExpiryStatus(item.expiry) === 'expired').length
  const unknownCount = items.filter(item => getExpiryStatus(item.expiry) === 'unknown').length

  return { 
    totalItems, 
    withCodesCount, 
    withBatchCount,
    validCount, 
    nearExpiryCount, 
    expiredCount, 
    unknownCount 
  }
}

/**
 * Export to CSV
 */
export const exportToCSV = (items, products = []) => {
  const csv = [
    ['Product Name', 'SKU', 'Location', 'Stock Qty', 'Barcode', 'QR Code', 'Batch', 'Expiry Date', 'Status'],
    ...items.map(item => {
      const product = products.find(p => p._id === item.productId)
      const barcode = item.barcode || product?.barcode || ''
      const qrCode = item.qrCode || product?.qrCode || ''
      
      return [
        item.productName || '',
        product?.sku || '',
        item.location || '',
        item.stockQty || 0,
        barcode,
        qrCode,
        item.batch || '',
        item.expiry ? new Date(item.expiry).toLocaleDateString() : '',
        getExpiryStatusDisplay(getExpiryStatus(item.expiry))
      ]
    })
  ].map(row => row.join(',')).join('\n')
  
  return csv
}

/**
 * Download CSV file
 */
export const downloadCSV = (csvContent, filename = 'inventory-tracking-export.csv') => {
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

