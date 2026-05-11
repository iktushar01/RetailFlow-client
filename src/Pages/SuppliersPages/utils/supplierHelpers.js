// Supplier Helper Functions

/**
 * Validate supplier form data
 * @param {Object} formData - Supplier form data
 * @returns {Object} Validation result with isValid and errors object
 */
export const validateSupplierForm = (formData) => {
  const errors = {}
  
  // Supplier name is required
  if (!formData.supplierName || !formData.supplierName.trim()) {
    errors.supplierName = 'Supplier name is required'
  }
  
  // Contact person is required
  if (!formData.contactPerson || !formData.contactPerson.trim()) {
    errors.contactPerson = 'Contact person is required'
  }
  
  // Phone is required
  if (!formData.phone || !formData.phone.trim()) {
    errors.phone = 'Phone number is required'
  } else {
    // Phone validation
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
    if (!phoneRegex.test(formData.phone.replace(/[\s\-()]/g, ''))) {
      errors.phone = 'Please enter a valid phone number'
    }
  }
  
  // Email is required
  if (!formData.email || !formData.email.trim()) {
    errors.email = 'Email address is required'
  } else {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }
  }
  
  // Address is required
  if (!formData.address || !formData.address.trim()) {
    errors.address = 'Address is required'
  }
  
  // City is required
  if (!formData.city || !formData.city.trim()) {
    errors.city = 'City is required'
  }
  
  // State is required
  if (!formData.state || !formData.state.trim()) {
    errors.state = 'State is required'
  }
  
  // ZIP Code is required
  if (!formData.zipCode || !formData.zipCode.trim()) {
    errors.zipCode = 'ZIP code is required'
  }
  
  // Country is required
  if (!formData.country || !formData.country.trim()) {
    errors.country = 'Country is required'
  }
  
  // Payment terms is required
  if (!formData.paymentTerms) {
    errors.paymentTerms = 'Payment terms is required'
  }
  
  // Status is required
  if (!formData.status) {
    errors.status = 'Status is required'
  }
  
  // Categories is required
  if (!formData.categories) {
    errors.categories = 'At least one product category is required'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Format supplier data for API submission
 * @param {Object} formData - Form data
 * @returns {Object} Supplier data ready for API submission
 */
export const prepareSupplierData = (formData) => {
  return {
    supplierName: formData.supplierName.trim(),
    contactPerson: formData.contactPerson?.trim() || '',
    email: formData.email?.trim() || '',
    phone: formData.phone?.trim() || '',
    address: formData.address?.trim() || '',
    city: formData.city?.trim() || '',
    state: formData.state?.trim() || '',
    zipCode: formData.zipCode?.trim() || '',
    country: formData.country?.trim() || '',
    paymentTerms: formData.paymentTerms || 'Net 30',
    status: formData.status || 'Active',
    notes: formData.notes?.trim() || '',
    categories: formData.categories || [], // Add categories they specialize in
    createdAt: formData.createdAt || new Date().toISOString()
  }
}

/**
 * Get status badge color
 * @param {string} status - Status string
 * @returns {string} Tailwind CSS classes
 */
export const getSupplierStatusColor = (status) => {
  const colors = {
    'Active': 'bg-green-100 text-green-800 border-green-200',
    'Inactive': 'bg-gray-100 text-gray-800 border-gray-200',
    'Suspended': 'bg-red-100 text-red-800 border-red-200'
  }
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
}

/**
 * Get payment terms display text
 * @param {string} terms - Payment terms
 * @returns {string} Display text
 */
export const getPaymentTermsDisplay = (terms) => {
  const termsMap = {
    'Net 15': 'Net 15 days',
    'Net 30': 'Net 30 days',
    'COD': 'Cash on Delivery',
    'Prepaid': 'Prepaid'
  }
  return termsMap[terms] || terms
}

/**
 * Export suppliers to CSV
 * @param {Array} suppliers - Array of suppliers
 * @returns {string} CSV string
 */
export const exportSuppliersToCSV = (suppliers) => {
  const csv = [
    ['Supplier Name', 'Contact Person', 'Email', 'Phone', 'Address', 'City', 'State', 'Payment Terms', 'Status', 'Created At'],
    ...suppliers.map(supplier => [
      supplier.supplierName || '',
      supplier.contactPerson || '',
      supplier.email || '',
      supplier.phone || '',
      supplier.address || '',
      supplier.city || '',
      supplier.state || '',
      supplier.paymentTerms || '',
      supplier.status || '',
      supplier.createdAt ? new Date(supplier.createdAt).toLocaleDateString() : ''
    ])
  ].map(row => row.join(',')).join('\n')
  
  return csv
}

/**
 * Download CSV file
 * @param {string} csvContent - CSV content string
 * @param {string} filename - Name of the file to download
 */
export const downloadCSV = (csvContent, filename = 'suppliers-export.csv') => {
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

/**
 * Apply filters to suppliers
 * @param {Array} suppliers - Array of suppliers
 * @param {Object} filters - Filter object
 * @returns {Array} Filtered suppliers
 */
export const applySupplierFilters = (suppliers, filters) => {
  let filtered = [...suppliers]
  
  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(supplier => 
      supplier.supplierName?.toLowerCase().includes(searchLower) ||
      supplier.contactPerson?.toLowerCase().includes(searchLower) ||
      supplier.email?.toLowerCase().includes(searchLower) ||
      supplier.phone?.toLowerCase().includes(searchLower)
    )
  }
  
  // Status filter
  if (filters.status) {
    filtered = filtered.filter(supplier => supplier.status === filters.status)
  }
  
  // Payment terms filter
  if (filters.paymentTerms) {
    filtered = filtered.filter(supplier => supplier.paymentTerms === filters.paymentTerms)
  }
  
  return filtered
}

/**
 * Get unique payment terms from suppliers
 * @param {Array} suppliers - Array of suppliers
 * @returns {Array} Unique payment terms
 */
export const getUniquePaymentTerms = (suppliers) => {
  return [...new Set(suppliers.map(s => s.paymentTerms).filter(Boolean))]
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
 * Default payment terms options - Simple and common options
 */
export const PAYMENT_TERMS_OPTIONS = [
  'COD',
  'Prepaid'
]

/**
 * Filter products by supplier categories
 * @param {Array} products - Array of products
 * @param {Object} supplier - Supplier object with categories
 * @returns {Array} Filtered products that match supplier categories
 */
export const filterProductsBySupplier = (products, supplier) => {
  if (!supplier) {
    return [] // Return empty array if no supplier selected
  }
  
  // If supplier has no categories, filter by products that have this supplier
  if (!supplier.categories || supplier.categories.length === 0) {
    return products.filter(product => 
      product.supplier === supplier.supplierName || 
      product.supplierId === supplier._id
    )
  }
  
  // If supplier has categories, filter by categories
  return products.filter(product => 
    supplier.categories.includes(product.category)
  )
}

/**
 * Get products that can be supplied by a specific supplier
 * @param {Array} products - Array of all products
 * @param {string} supplierId - Supplier ID
 * @param {Array} suppliers - Array of suppliers
 * @returns {Array} Products that the supplier can provide
 */
export const getSupplierProducts = (products, supplierId, suppliers) => {
  const supplier = suppliers.find(s => s._id === supplierId)
  if (!supplier) return []
  
  return filterProductsBySupplier(products, supplier)
}

/**
 * Check if a product can be supplied by a supplier
 * @param {Object} product - Product object
 * @param {Object} supplier - Supplier object
 * @returns {boolean} True if supplier can provide this product
 */
export const canSupplierProvideProduct = (product, supplier) => {
  if (!supplier) {
    return false
  }
  
  // If supplier has no categories, check if product is assigned to this supplier
  if (!supplier.categories || supplier.categories.length === 0) {
    return product.supplier === supplier.supplierName || 
           product.supplierId === supplier._id
  }
  
  // If supplier has categories, check if product category matches
  return supplier.categories.includes(product.category)
}

/**
 * Default status options
 */
export const STATUS_OPTIONS = [
  'Active',
  'Inactive',
  'Suspended'
]

/**
 * Default categories list for suppliers
 */
export const SUPPLIER_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Food & Beverage',
  'Home & Garden',
  'Sports & Outdoors',
  'Books & Media',
  'Health & Beauty',
  'Toys & Games'
]

