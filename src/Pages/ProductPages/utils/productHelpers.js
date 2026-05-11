// Product Helper Functions

/**
 * Generate a unique QR code for a product
 * @returns {string} Unique QR code
 */
export const generateQRCode = () => {
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 10).toUpperCase()
  return `PRD-${randomStr}-${timestamp}`
}

/**
 * Validate image file
 * @param {File} file - Image file to validate
 * @returns {Object} Validation result with isValid and error message
 */
export const validateImageFile = (file) => {
  if (!file) {
    return { isValid: false, error: 'No file selected' }
  }
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'Please select an image file' }
  }
  
  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB in bytes
  if (file.size > maxSize) {
    return { isValid: false, error: 'Image size should be less than 5MB' }
  }
  
  return { isValid: true, error: null }
}

/**
 * Validate product form data
 * @param {Object} formData - Product form data
 * @param {Array} allProducts - All existing products (for QR code validation)
 * @returns {Object} Validation result with isValid and errors object
 */
export const validateProductForm = (formData, allProducts = []) => {
  const errors = {}
  
  // Product name is required
  if (!formData.productName || !formData.productName.trim()) {
    errors.productName = 'Product name is required'
  }
  
  // Category is required
  if (!formData.category) {
    errors.category = 'Category is required'
  }
  
  // Brand is required
  if (!formData.brand || !formData.brand.trim()) {
    errors.brand = 'Brand is required'
  }
  
  // SKU is required
  if (!formData.sku || !formData.sku.trim()) {
    errors.sku = 'SKU is required'
  } else {
    // Check for duplicate SKU
    const duplicateSKU = allProducts.find(p => p.sku === formData.sku.trim())
    if (duplicateSKU && duplicateSKU._id !== formData._id) {
      errors.sku = 'This SKU already exists. Please use a different SKU.'
    }
  }
  
  // Supplier is required
  if (!formData.supplier) {
    errors.supplier = 'Supplier is required'
  }
  
  // QR Code is required
  if (!formData.qrCode || !formData.qrCode.trim()) {
    errors.qrCode = 'QR Code is required'
  } else {
    // Check for duplicate QR code
    const duplicateQR = allProducts.find(p => p.qrCode === formData.qrCode)
    if (duplicateQR && duplicateQR._id !== formData._id) {
      errors.qrCode = 'This QR Code already exists. Please generate a new one.'
    }
  }
  
  // Product Image is required
  if (!formData.productImage || !formData.productImage.trim()) {
    errors.productImage = 'Product Image is required'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Format product data for export to CSV
 * @param {Array} products - Array of products
 * @returns {string} CSV string
 */
export const exportProductsToCSV = (products) => {
  const csv = [
    ['Product Name', 'Category', 'Brand', 'SKU', 'Supplier', 'QR Code', 'Created At'],
    ...products.map(p => [
      p.productName || '',
      p.category || '',
      p.brand || '',
      p.sku || '',
      p.supplier || '',
      p.qrCode || '',
      p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ''
    ])
  ].map(row => row.join(',')).join('\n')
  
  return csv
}

/**
 * Download CSV file
 * @param {string} csvContent - CSV content string
 * @param {string} filename - Name of the file to download
 */
export const downloadCSV = (csvContent, filename = 'products-export.csv') => {
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

/**
 * Apply filters to products array
 * @param {Array} products - Array of products
 * @param {Object} filters - Filter object with search, category, supplier
 * @returns {Array} Filtered products
 */
export const applyProductFilters = (products, filters) => {
  let filtered = [...products]
  
  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(product => 
      product.productName?.toLowerCase().includes(searchLower) ||
      product.sku?.toLowerCase().includes(searchLower) ||
      product.brand?.toLowerCase().includes(searchLower) ||
      product.qrCode?.toLowerCase().includes(searchLower)
    )
  }
  
  // Category filter
  if (filters.category) {
    filtered = filtered.filter(product => product.category === filters.category)
  }
  
  // Supplier filter
  if (filters.supplier) {
    filtered = filtered.filter(product => product.supplier === filters.supplier)
  }
  
  return filtered
}

/**
 * Get unique categories from products
 * @param {Array} products - Array of products
 * @returns {Array} Unique categories
 */
export const getUniqueCategories = (products) => {
  return [...new Set(products.map(p => p.category).filter(Boolean))]
}

/**
 * Get unique suppliers from products
 * @param {Array} products - Array of products
 * @returns {Array} Unique suppliers
 */
export const getUniqueSuppliers = (products) => {
  return [...new Set(products.map(p => p.supplier).filter(Boolean))]
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
 * Prepare product data for submission
 * @param {Object} formData - Form data
 * @param {string} imageUrl - Uploaded image URL
 * @returns {Object} Product data ready for API submission
 */
export const prepareProductData = (formData, imageUrl = '', suppliers = []) => {
  // Find supplier ID if supplier name is provided
  const selectedSupplier = suppliers.find(s => 
    s.supplierName === formData.supplier || s.name === formData.supplier
  )
  
  return {
    productName: formData.productName.trim(),
    category: formData.category,
    brand: formData.brand?.trim() || '',
    sku: formData.sku?.trim() || '',
    description: formData.description?.trim() || '',
    qrCode: formData.qrCode,
    supplier: formData.supplier || '', // Keep supplier name for backward compatibility
    supplierId: selectedSupplier?._id || null, // Add supplier ID for better data integrity
    productImage: imageUrl || formData.productImage || '',
    createdAt: formData.createdAt || new Date().toISOString()
  }
}

/**
 * Default categories list
 */
export const DEFAULT_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Food & Beverage',
  'Home & Garden',
  'Sports & Outdoors',
  'Books & Media',
  'Health & Beauty',
  'Toys & Games'
]

/**
 * Image validation constants
 */
export const IMAGE_CONSTRAINTS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
}

