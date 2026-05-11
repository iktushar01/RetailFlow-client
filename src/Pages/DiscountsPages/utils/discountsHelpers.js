// Discount Helper Functions

/**
 * Apply filters to discounts
 */
export const applyDiscountFilters = (discounts, filters) => {
  let filtered = [...discounts]

  if (filters.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(d =>
      d.offerName?.toLowerCase().includes(search) ||
      d.code?.toLowerCase().includes(search)
    )
  }

  if (filters.status && filters.status !== 'All') {
    filtered = filtered.filter(d => d.status === filters.status)
  }

  if (filters.type && filters.type !== 'All') {
    filtered = filtered.filter(d => d.type === filters.type)
  }

  return filtered
}

/**
 * Check if discount is expired
 */
export const isDiscountExpired = (discount) => {
  const now = new Date()
  const endDate = new Date(discount.validTo)
  return now > endDate
}

/**
 * Check if discount is active
 */
export const isDiscountActive = (discount) => {
  const now = new Date()
  const startDate = new Date(discount.validFrom)
  const endDate = new Date(discount.validTo)
  
  return discount.status === 'Active' && now >= startDate && now <= endDate
}

/**
 * Get discount status badge color
 */
export const getStatusColor = (discount) => {
  if (isDiscountExpired(discount)) {
    return 'bg-red-100 text-red-800'
  }
  
  if (discount.status === 'Active') {
    return 'bg-green-100 text-green-800'
  }
  
  return 'bg-gray-100 text-gray-800'
}

/**
 * Get discount status label
 */
export const getStatusLabel = (discount) => {
  if (isDiscountExpired(discount)) return 'Expired'
  if (discount.status === 'Active') return 'Active'
  return 'Inactive'
}

/**
 * Validate discount form
 */
export const validateDiscountForm = (formData) => {
  const errors = {}

  if (!formData.offerName || !formData.offerName.trim()) {
    errors.offerName = 'Offer name is required'
  }

  if (!formData.type) {
    errors.type = 'Discount type is required'
  }

  if (!formData.value || formData.value <= 0) {
    errors.value = 'Discount value must be greater than 0'
  }

  if (formData.type === 'Percentage' && formData.value > 100) {
    errors.value = 'Percentage cannot exceed 100%'
  }

  if (!formData.validFrom) {
    errors.validFrom = 'Start date is required'
  }

  if (!formData.validTo) {
    errors.validTo = 'End date is required'
  }

  if (formData.validFrom && formData.validTo) {
    const start = new Date(formData.validFrom)
    const end = new Date(formData.validTo)
    
    if (end <= start) {
      errors.validTo = 'End date must be after start date'
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Format date for input
 */
export const formatDateForInput = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

/**
 * Get unique categories from products
 */
export const getUniqueCategories = (products) => {
  return [...new Set(products.map(p => p.category).filter(Boolean))]
}

/**
 * Export discounts to CSV
 */
export const exportDiscountsToCSV = (discounts) => {
  const csv = [
    ['Offer Name', 'Type', 'Value', 'Valid From', 'Valid To', 'Status'],
    ...discounts.map(d => [
      d.offerName || '',
      d.type || '',
      d.value || '',
      d.validFrom ? new Date(d.validFrom).toLocaleDateString() : '',
      d.validTo ? new Date(d.validTo).toLocaleDateString() : '',
      getStatusLabel(d)
    ])
  ].map(row => row.join(',')).join('\n')
  
  return csv
}

/**
 * Download CSV file
 */
export const downloadCSV = (csvContent, filename = 'discounts-export.csv') => {
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

