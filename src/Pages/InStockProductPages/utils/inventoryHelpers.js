// Format date
export const formatDate = (date) => {
  if (!date || date === 'N/A' || date === 'Invalid Date') return 'N/A'
  
  try {
    const dateObj = new Date(date)
    if (isNaN(dateObj.getTime())) {
      return 'N/A'
    }
    
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    console.error('Error formatting date:', date, error)
    return 'N/A'
  }
}

// Get stock status color
export const getStockStatusColor = (stockQty, lowStockThreshold = 10) => {
  if (stockQty === 0) {
    return 'bg-red-100 text-red-800 border-red-200'
  } else if (stockQty <= lowStockThreshold) {
    return 'bg-yellow-100 text-yellow-800 border-yellow-200'
  } else {
    return 'bg-green-100 text-green-800 border-green-200'
  }
}

// Get stock status text
export const getStockStatusText = (stockQty, lowStockThreshold = 10) => {
  if (stockQty === 0) {
    return 'Out of Stock'
  } else if (stockQty <= lowStockThreshold) {
    return 'Low Stock'
  } else {
    return 'In Stock'
  }
}

// Check if product is expired
export const isExpired = (expiryDate) => {
  if (!expiryDate) return false
  const today = new Date()
  const expiry = new Date(expiryDate)
  return expiry < today
}

// Get expiry status
export const getExpiryStatus = (expiryDate) => {
  if (!expiryDate || expiryDate === 'N/A' || expiryDate === 'Invalid Date') return null
  
  try {
    const today = new Date()
    const expiry = new Date(expiryDate)
    
    if (isNaN(expiry.getTime())) {
      return null
    }
    
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
    
    if (daysUntilExpiry < 0) {
      return { status: 'Expired', color: 'text-red-600', days: Math.abs(daysUntilExpiry) }
    } else if (daysUntilExpiry <= 30) {
      return { status: 'Expiring Soon', color: 'text-orange-600', days: daysUntilExpiry }
    } else {
      return { status: 'Valid', color: 'text-green-600', days: daysUntilExpiry }
    }
  } catch (error) {
    console.error('Error checking expiry status:', expiryDate, error)
    return null
  }
}

