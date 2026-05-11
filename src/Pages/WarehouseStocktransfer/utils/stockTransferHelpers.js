/**
 * Stock Transfer utility functions
 */

// Filter inventory based on search and warehouse
export const filterInventory = (inventory, filters) => {
  let filtered = [...inventory]

  // Only show items with stock > 0
  filtered = filtered.filter(item => (item.stockQty || 0) > 0 && item.location)

  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(item => 
      item.productName?.toLowerCase().includes(searchLower) ||
      item.productId?.toLowerCase().includes(searchLower)
    )
  }

  // Warehouse filter
  if (filters.warehouse) {
    filtered = filtered.filter(item => item.location === filters.warehouse)
  }

  return filtered
}

// Validate transfer form data
export const validateTransferForm = (formData, maxQty) => {
  const errors = []

  if (!formData.destinationWarehouse) {
    errors.push('Please select a destination warehouse')
  }

  if (!formData.quantity || formData.quantity <= 0) {
    errors.push('Please enter a valid quantity')
  }

  if (formData.quantity > maxQty) {
    errors.push(`Cannot transfer ${formData.quantity} units. Available: ${maxQty} units`)
  }

  if (formData.sourceWarehouse === formData.destinationWarehouse) {
    errors.push('Source and destination warehouses must be different')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Get stock status color
export const getStockStatusColor = (quantity) => {
  if (quantity > 50) return 'text-green-600'
  if (quantity > 10) return 'text-yellow-600'
  return 'text-red-600'
}

// Get stock status badge
export const getStockStatusBadge = (quantity) => {
  if (quantity > 50) return { text: 'High Stock', color: 'bg-green-100 text-green-800' }
  if (quantity > 10) return { text: 'Medium Stock', color: 'bg-yellow-100 text-yellow-800' }
  return { text: 'Low Stock', color: 'bg-red-100 text-red-800' }
}

// Export configuration
export const getExportConfig = () => ({
  headers: ['Product Name', 'Product ID', 'From Warehouse', 'To Warehouse', 'Quantity', 'Date', 'Status'],
  keys: ['productName', 'productId', 'sourceWarehouse', 'destinationWarehouse', 'quantity', 'createdAt', 'status'],
  filename: `stock-transfers_${new Date().toISOString().split('T')[0]}.csv`
})

// Format date for display
export const formatTransferDate = (date) => {
  if (!date) return 'N/A'
  try {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return 'N/A'
  }
}

export default {
  filterInventory,
  validateTransferForm,
  getStockStatusColor,
  getStockStatusBadge,
  getExportConfig,
  formatTransferDate
}

