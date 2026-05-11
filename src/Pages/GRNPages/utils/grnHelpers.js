// Format currency
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return 'BDT 0.00'
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 2
  }).format(amount)
}

// Format date
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'N/A'
    
    // Use toLocaleDateString as a more compatible alternative
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (error) {
    console.error('Date formatting error:', error)
    return 'N/A'
  }
}

// Get status color
export const getStatusColor = (status) => {
  const colors = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Partially Received': 'bg-blue-100 text-blue-800',
    'Fully Received': 'bg-purple-100 text-purple-800',
    'Approved': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800',
    'Cancelled': 'bg-gray-100 text-gray-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

// Validate GRN form
export const validateGRNForm = (formData) => {
  const errors = []

  // Check if PO is selected
  if (!formData.poId) {
    errors.push('Please select a Purchase Order')
  }

  // Check if received date is provided
  if (!formData.receivedDate) {
    errors.push('Please enter a received date')
  }

  // Check if destination warehouse is selected
  if (!formData.destinationWarehouse) {
    errors.push('Please select a destination warehouse')
  }

  // Check if items exist
  if (!formData.items || formData.items.length === 0) {
    errors.push('Please add at least one item')
  }

  // Validate each item
  formData.items?.forEach((item, index) => {
    if (!item.productId) {
      errors.push(`Item ${index + 1}: Product is required`)
    }
    
    if (!item.receivedQty && item.receivedQty !== 0) {
      errors.push(`Item ${index + 1}: Received quantity is required`)
    }
    
    if (item.receivedQty < 0) {
      errors.push(`Item ${index + 1}: Received quantity cannot be negative`)
    }
    
    // Check against remaining quantity if available
    const remainingQty = item.remainingQty !== undefined ? item.remainingQty : item.orderedQty
    if (item.receivedQty > remainingQty) {
      const alreadyReceived = item.alreadyReceived || 0
      errors.push(`Item ${index + 1} (${item.productName}): Cannot receive ${item.receivedQty}. Only ${remainingQty} remaining (Ordered: ${item.orderedQty}, Already received: ${alreadyReceived})`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Calculate received percentage
export const calculateReceivedPercentage = (items) => {
  if (!items || items.length === 0) return 0
  
  const totalOrdered = items.reduce((sum, item) => sum + (item.orderedQty || 0), 0)
  const totalReceived = items.reduce((sum, item) => sum + (item.receivedQty || 0), 0)
  
  if (totalOrdered === 0) return 0
  
  return Math.round((totalReceived / totalOrdered) * 100)
}

// Determine GRN status based on received quantities
// This now considers cumulative quantities across all GRNs for the PO
export const determineGRNStatus = (items) => {
  if (!items || items.length === 0) return 'Pending'
  
  // Check if ALL items are fully received (considering cumulative)
  const allFullyReceived = items.every(item => {
    const orderedQty = item.orderedQty || 0
    const alreadyReceived = item.alreadyReceived || 0
    const receivedQty = item.receivedQty || 0
    const totalReceived = alreadyReceived + receivedQty
    
    return totalReceived >= orderedQty
  })
  
  const someReceived = items.some(item => item.receivedQty > 0)
  
  if (allFullyReceived && someReceived) {
    return 'Fully Received'
  } else if (someReceived) {
    return 'Partially Received'
  }
  
  return 'Pending'
}

// Generate GRN Number
export const generateGRNNumber = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const timestamp = Date.now().toString().slice(-6)
  return `GRN-${year}${month}${day}-${timestamp}`
}

// Calculate total received value
export const calculateTotalReceivedValue = (items) => {
  if (!items || items.length === 0) return 0
  
  return items.reduce((sum, item) => {
    const receivedQty = item.receivedQty || 0
    const unitPrice = item.unitPrice || 0
    return sum + (receivedQty * unitPrice)
  }, 0)
}

// Max notes length
export const MAX_NOTES_LENGTH = 500

// Validate expiry date
export const isExpiryDateValid = (expiryDate) => {
  if (!expiryDate) return true // Optional field
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(expiryDate)
  return expiry > today
}

// Format batch number
export const formatBatchNumber = (batch) => {
  if (!batch) return 'N/A'
  return batch.toUpperCase()
}

// Check if item is fully received
export const isItemFullyReceived = (item) => {
  return item.receivedQty === item.orderedQty
}

// Check if item is partially received
export const isItemPartiallyReceived = (item) => {
  return item.receivedQty > 0 && item.receivedQty < item.orderedQty
}

// Get item status
export const getItemStatus = (item) => {
  if (isItemFullyReceived(item)) {
    return { status: 'Fully Received', color: 'text-green-600' }
  } else if (isItemPartiallyReceived(item)) {
    return { status: 'Partially Received', color: 'text-blue-600' }
  }
  return { status: 'Not Received', color: 'text-gray-500' }
}

