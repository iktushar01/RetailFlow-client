// Barcode Helper Functions

/**
 * Generate unique barcode/QR code
 * @param {string} prefix - Prefix for the code (default: 'QR')
 * @returns {string} Generated code
 */
export const generateCode = (prefix = 'QR') => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `${prefix}-${timestamp}-${random}`
}

/**
 * Apply filters to inventory items
 * @param {Array} items - Array of inventory items
 * @param {Object} filters - Filter object
 * @returns {Array} Filtered items
 */
export const applyBarcodeFilters = (items, filters) => {
  let filtered = [...items]

  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(item => 
      item.productName?.toLowerCase().includes(searchLower) ||
      item.productId?.toLowerCase().includes(searchLower) ||
      item.sku?.toLowerCase().includes(searchLower) ||
      item.barcode?.toLowerCase().includes(searchLower) ||
      item.qrCode?.toLowerCase().includes(searchLower)
    )
  }

  // Warehouse filter
  if (filters.warehouse) {
    filtered = filtered.filter(item => item.location === filters.warehouse)
  }

  // Barcode Status filter
  if (filters.barcodeStatus === 'assigned') {
    filtered = filtered.filter(item => item.barcode || item.qrCode)
  } else if (filters.barcodeStatus === 'unassigned') {
    filtered = filtered.filter(item => !item.barcode && !item.qrCode)
  }

  return filtered
}

/**
 * Calculate barcode statistics
 * @param {Array} items - Array of inventory items
 * @returns {Object} Statistics object
 */
export const calculateBarcodeStats = (items) => {
  const totalProducts = items.length
  const assignedCount = items.filter(item => item.barcode || item.qrCode).length
  const unassignedCount = totalProducts - assignedCount

  return { totalProducts, assignedCount, unassignedCount }
}

/**
 * Get barcode status color
 * @param {boolean} hasBarcode - Whether item has barcode/QR code
 * @returns {string} Tailwind CSS classes
 */
export const getBarcodeStatusColor = (hasBarcode) => {
  return hasBarcode 
    ? 'bg-green-100 text-green-800 border-green-200'
    : 'bg-red-100 text-red-800 border-red-200'
}

/**
 * Get barcode status display text
 * @param {boolean} hasBarcode - Whether item has barcode/QR code
 * @returns {string} Display text
 */
export const getBarcodeStatusDisplay = (hasBarcode) => {
  return hasBarcode ? 'Assigned' : 'Unassigned'
}

/**
 * Export barcode data to CSV
 * @param {Array} items - Array of inventory items
 * @returns {string} CSV string
 */
export const exportBarcodeToCSV = (items) => {
  const csv = [
    ['Product Name', 'Product ID', 'SKU', 'Barcode', 'QR Code', 'Location', 'Status'],
    ...items.map(item => [
      item.productName || '',
      item.productId || '',
      item.sku || '',
      item.barcode || '',
      item.qrCode || '',
      item.location || '',
      (item.barcode || item.qrCode) ? 'Assigned' : 'Unassigned'
    ])
  ].map(row => row.join(',')).join('\n')
  
  return csv
}

/**
 * Download CSV file
 * @param {string} csvContent - CSV content string
 * @param {string} filename - Name of the file to download
 */
export const downloadCSV = (csvContent, filename = 'barcode-export.csv') => {
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
 * Validate barcode format
 * @param {string} barcode - Barcode string
 * @returns {boolean} Whether barcode is valid
 */
export const validateBarcode = (barcode) => {
  if (!barcode || barcode.trim().length === 0) return false
  // Basic validation - can be enhanced based on requirements
  return barcode.trim().length >= 3
}

/**
 * Generate QR code image URL
 * @param {string} data - Data to encode
 * @param {number} size - Size of QR code (default: 200)
 * @returns {string} QR code image URL
 */
export const generateQRCodeURL = (data, size = 200) => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`
}

