// Stock In Helper Functions

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
 * Apply filters to stock in items
 * @param {Array} items - Array of GRN items
 * @param {Object} filters - Filter object
 * @returns {Array} Filtered items
 */
export const applyStockInFilters = (items, filters) => {
  return items.filter(grn => {
    // Status filter
    if (filters.status && grn.status !== filters.status) {
      return false
    }

    // Supplier filter
    if (filters.supplier && grn.supplierId !== filters.supplier) {
      return false
    }

    // Date from filter
    if (filters.dateFrom) {
      const grnDate = new Date(grn.receivedDate)
      const fromDate = new Date(filters.dateFrom)
      if (grnDate < fromDate) {
        return false
      }
    }

    // Date to filter
    if (filters.dateTo) {
      const grnDate = new Date(grn.receivedDate)
      const toDate = new Date(filters.dateTo)
      if (grnDate > toDate) {
        return false
      }
    }

    // Search filter (GRN or PO Number)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const grnMatch = grn.grnNumber?.toLowerCase().includes(searchLower)
      const poMatch = grn.poNumber?.toLowerCase().includes(searchLower)
      if (!grnMatch && !poMatch) {
        return false
      }
    }

    return true
  })
}

/**
 * Calculate stock in statistics
 * @param {Array} items - Array of GRN items
 * @returns {Object} Statistics object
 */
export const calculateStockInStats = (items) => {
  const totalGRNs = items.length
  const totalItems = items.reduce((sum, grn) => 
    sum + (grn.items?.reduce((s, item) => s + (item.receivedQty || 0), 0) || 0), 0
  )
  const approvedGRNs = items.filter(grn => grn.status === 'Approved').length

  return { totalGRNs, totalItems, approvedGRNs }
}

/**
 * Get stock status badge color
 * @param {string} status - Status string
 * @returns {string} Tailwind CSS classes
 */
export const getStockStatusColor = (status) => {
  const colors = {
    'Approved': 'bg-green-100 text-green-800 border-green-200',
    'Fully Received': 'bg-blue-100 text-blue-800 border-blue-200',
    'Partially Received': 'bg-yellow-100 text-yellow-800 border-yellow-200'
  }
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
}

/**
 * Get display status text
 * @param {string} status - Status string
 * @returns {string} Display text
 */
export const getStockStatusDisplay = (status) => {
  return status === 'Approved' ? '✅ In Warehouse' : status
}

/**
 * Calculate total ordered quantity for a GRN
 * @param {Object} grn - GRN object
 * @returns {number} Total ordered quantity
 */
export const getTotalOrderedQty = (grn) => {
  return grn.items?.reduce((sum, item) => sum + (item.orderedQty || 0), 0) || 0
}

/**
 * Calculate total received quantity for a GRN
 * @param {Object} grn - GRN object
 * @returns {number} Total received quantity
 */
export const getTotalReceivedQty = (grn) => {
  return grn.items?.reduce((sum, item) => sum + (item.receivedQty || 0), 0) || 0
}

/**
 * Sort GRNs by date (newest first)
 * @param {Array} items - Array of GRN items
 * @returns {Array} Sorted items
 */
export const sortGRNsByDate = (items) => {
  return [...items].sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return new Date(b.createdAt) - new Date(a.createdAt)
    }
    return 0
  })
}

/**
 * Export stock in data to CSV
 * @param {Array} items - Array of GRN items
 * @param {Array} suppliers - Array of suppliers
 * @returns {string} CSV string
 */
export const exportStockInToCSV = (items, suppliers) => {
  const csv = [
    ['GRN Number', 'PO Number', 'Supplier', 'Items Count', 'Ordered Qty', 'Received Qty', 'Received Date', 'Status'],
    ...items.map(grn => {
      const supplier = suppliers.find(s => s._id === grn.supplierId)
      const totalOrdered = getTotalOrderedQty(grn)
      const totalReceived = getTotalReceivedQty(grn)
      
      return [
        grn.grnNumber || '',
        grn.poNumber || '',
        supplier?.supplierName || 'N/A',
        grn.items?.length || 0,
        totalOrdered,
        totalReceived,
        formatDate(grn.receivedDate),
        grn.status || ''
      ]
    })
  ].map(row => row.join(',')).join('\n')
  
  return csv
}

/**
 * Download CSV file
 * @param {string} csvContent - CSV content string
 * @param {string} filename - Name of the file to download
 */
export const downloadCSV = (csvContent, filename = 'stock-in-export.csv') => {
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

/**
 * Get approved GRNs from all GRNs
 * @param {Array} grns - All GRNs
 * @returns {Array} Approved GRNs
 */
export const getApprovedGRNs = (grns) => {
  return grns.filter(grn => 
    grn.status === 'Approved' || 
    grn.status === 'Partially Received' || 
    grn.status === 'Fully Received'
  )
}

