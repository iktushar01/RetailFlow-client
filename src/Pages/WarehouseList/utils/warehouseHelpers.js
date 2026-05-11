/**
 * Warehouse utility functions
 */

// Filter warehouses based on search and location
export const filterWarehouses = (warehouses, filters) => {
  let filtered = [...warehouses]

  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(warehouse => 
      warehouse.name?.toLowerCase().includes(searchLower) ||
      warehouse.location?.toLowerCase().includes(searchLower) ||
      warehouse.contactPerson?.toLowerCase().includes(searchLower)
    )
  }

  // Location filter
  if (filters.location) {
    filtered = filtered.filter(warehouse => 
      warehouse.location?.toLowerCase().includes(filters.location.toLowerCase())
    )
  }

  return filtered
}

// Validate warehouse form data
export const validateWarehouseForm = (formData) => {
  const errors = []

  if (!formData.name || formData.name.trim() === '') {
    errors.push('Warehouse name is required')
  }

  if (!formData.location || formData.location.trim() === '') {
    errors.push('Location is required')
  }

  if (!formData.address || formData.address.trim() === '') {
    errors.push('Address is required')
  }

  if (!formData.contactPerson || formData.contactPerson.trim() === '') {
    errors.push('Contact person is required')
  }

  if (!formData.phone || formData.phone.trim() === '') {
    errors.push('Phone number is required')
  }

  if (!formData.email || formData.email.trim() === '') {
    errors.push('Email address is required')
  }

  if (formData.email && !isValidEmail(formData.email)) {
    errors.push('Invalid email format')
  }

  if (formData.phone && !isValidPhone(formData.phone)) {
    errors.push('Invalid phone format')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Email validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Phone validation
const isValidPhone = (phone) => {
  const phoneRegex = /^[\d\s\-+()]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
}

// Get unique locations from warehouses
export const getUniqueLocations = (warehouses) => {
  const locations = warehouses
    .map(w => w.location)
    .filter(Boolean)
  return [...new Set(locations)]
}

// Export configuration
export const getExportConfig = () => ({
  headers: ['Warehouse Name', 'Location', 'Address', 'Contact Person', 'Phone', 'Email', 'Total Products', 'Total Stock'],
  keys: ['name', 'location', 'address', 'contactPerson', 'phone', 'email', 'totalProducts', 'totalStock'],
  filename: `warehouses_${new Date().toISOString().split('T')[0]}.csv`
})

export default {
  filterWarehouses,
  validateWarehouseForm,
  getUniqueLocations,
  getExportConfig
}

