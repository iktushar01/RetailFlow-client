// Returns Helper Functions

/**
 * Apply filters to returns
 */
export const applyReturnFilters = (returns, filters) => {
  let filtered = [...returns]

  if (filters.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(r =>
      r.returnId?.toLowerCase().includes(search) ||
      r.invoiceNo?.toLowerCase().includes(search) ||
      r.customerName?.toLowerCase().includes(search)
    )
  }

  if (filters.status && filters.status !== 'All') {
    filtered = filtered.filter(r => r.status === filters.status)
  }

  if (filters.dateFrom) {
    const fromDate = new Date(filters.dateFrom)
    filtered = filtered.filter(r => new Date(r.createdAt) >= fromDate)
  }

  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo)
    toDate.setHours(23, 59, 59)
    filtered = filtered.filter(r => new Date(r.createdAt) <= toDate)
  }

  return filtered
}

/**
 * Get return status badge color
 */
export const getStatusColor = (status) => {
  const colors = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Approved': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800'
  }
  
  return colors[status] || 'bg-gray-100 text-gray-800'
}

/**
 * Format currency
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT'
  }).format(amount || 0)
}

/**
 * Format date
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
 * Format date and time
 */
export const formatDateTime = (date) => {
  if (!date) return 'N/A'
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

/**
 * Validate return form
 */
export const validateReturnForm = (formData) => {
  const errors = {}

  if (!formData.invoiceNo) {
    errors.invoiceNo = 'Invoice number is required'
  }

  if (!formData.items || formData.items.length === 0) {
    errors.items = 'Please select at least one item to return'
  }

  if (formData.items) {
    formData.items.forEach((item, index) => {
      if (!item.quantity || item.quantity <= 0) {
        errors[`quantity_${index}`] = 'Quantity must be greater than 0'
      }
      if (item.quantity > item.maxQuantity) {
        errors[`quantity_${index}`] = `Cannot return more than ${item.maxQuantity}`
      }
    })
  }

  if (!formData.reason || !formData.reason.trim()) {
    errors.reason = 'Return reason is required'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Calculate return total
 */
export const calculateReturnTotal = (items) => {
  return items.reduce((total, item) => {
    return total + (item.unitPrice * item.quantity)
  }, 0)
}

/**
 * Export returns to CSV
 */
export const exportReturnsToCSV = (returns) => {
  const csv = [
    ['Return ID', 'Invoice No', 'Customer', 'Reason', 'Status', 'Date'],
    ...returns.map(r => [
      r.returnId || '',
      r.invoiceNo || '',
      r.customerName || '',
      r.reason || '',
      r.status || '',
      formatDate(r.createdAt)
    ])
  ].map(row => row.join(',')).join('\n')
  
  return csv
}

/**
 * Download CSV
 */
export const downloadCSV = (csvContent, filename = 'returns-export.csv') => {
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

/**
 * Get return reasons
 */
export const RETURN_REASONS = [
  'Damaged Product',
  'Wrong Product Delivered',
  'Quality Issues',
  'Customer Changed Mind',
  'Product Not as Described',
  'Expired Product',
  'Other'
]

