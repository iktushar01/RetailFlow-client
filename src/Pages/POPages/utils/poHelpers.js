// PO Helper Functions

export const getStatusColor = (status) => {
  const colors = {
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Sent: 'bg-blue-100 text-blue-800 border-blue-200',
    'Partially Received': 'bg-purple-100 text-purple-800 border-purple-200',
    'Fully Received': 'bg-green-100 text-green-800 border-green-200',
    Completed: 'bg-green-100 text-green-800 border-green-200',
    Cancelled: 'bg-red-100 text-red-800 border-red-200'
  }
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
}

export const getStatusBadgeColor = (status) => {
  const colors = {
    Pending: '🟡',
    Sent: '🔵',
    'Partially Received': '🟣',
    'Fully Received': '🟢',
    Completed: '🟢',
    Cancelled: '🔴'
  }
  return colors[status] || '⚪'
}

export const calculateItemSubtotal = (quantity, unitPrice) => {
  const qty = parseFloat(quantity) || 0
  const price = parseFloat(unitPrice) || 0
  return qty * price
}

export const calculateTotals = (items, taxRate = 0) => {
  const subtotal = items.reduce((sum, item) => {
    return sum + calculateItemSubtotal(item.quantity, item.unitPrice)
  }, 0)
  
  const taxAmount = (subtotal * taxRate) / 100
  const total = subtotal + taxAmount
  
  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    taxAmount: parseFloat(taxAmount.toFixed(2)),
    total: parseFloat(total.toFixed(2))
  }
}

export const validatePOForm = (formData) => {
  const errors = []
  
  if (!formData.supplier) {
    errors.push('Please select a supplier')
  }
  
  if (!formData.expectedDeliveryDate) {
    errors.push('Please select expected delivery date')
  }
  
  if (!formData.items || formData.items.length === 0) {
    errors.push('Please add at least one item')
  }
  
  // Validate items
  formData.items?.forEach((item, index) => {
    if (!item.product) {
      errors.push(`Item ${index + 1}: Please select a product`)
    }
    if (!item.quantity || item.quantity < 1) {
      errors.push(`Item ${index + 1}: Quantity must be at least 1`)
    }
    if (item.unitPrice < 0) {
      errors.push(`Item ${index + 1}: Price cannot be negative`)
    }
  })
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT'
  }).format(amount || 0)
}

export const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const generatePONumber = () => {
  // Frontend fallback - backend should handle this
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return `PO-${timestamp}-${random}`
}

export const MAX_NOTES_LENGTH = 500

export const validateItem = (item) => {
  const errors = {}
  
  if (!item.product) {
    errors.product = 'Product is required'
  }
  
  if (!item.quantity || item.quantity < 1) {
    errors.quantity = 'Quantity must be at least 1'
  }
  
  if (item.unitPrice < 0) {
    errors.unitPrice = 'Price cannot be negative'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

