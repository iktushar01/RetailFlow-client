// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 2
  }).format(amount || 0)
}

// Format date
export const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Get status color for payment status
export const getPaymentStatusColor = (status) => {
  switch (status) {
    case 'Paid':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'Partial':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'Due':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

// Calculate due amount
export const calculateDueAmount = (amountDue, amountPaid) => {
  return Math.max(0, (amountDue || 0) - (amountPaid || 0))
}

// Determine payment status
export const determinePaymentStatus = (amountDue, amountPaid) => {
  const paid = amountPaid || 0
  const due = amountDue || 0
  
  if (paid >= due && paid > 0) {
    return 'Paid'
  } else if (paid > 0 && paid < due) {
    return 'Partial'
  } else {
    return 'Due'
  }
}

