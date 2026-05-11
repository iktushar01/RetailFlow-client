// Sales Payment Helper Functions

/**
 * Apply filters to payments
 */
export const applyPaymentFilters = (payments, filters) => {
  let filtered = [...payments]

  if (filters.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(p =>
      p.invoiceNo?.toLowerCase().includes(search) ||
      p.customerName?.toLowerCase().includes(search)
    )
  }

  if (filters.paymentMethod && filters.paymentMethod !== 'All') {
    filtered = filtered.filter(p => p.paymentMethod === filters.paymentMethod)
  }

  if (filters.dateFrom) {
    const fromDate = new Date(filters.dateFrom)
    filtered = filtered.filter(p => new Date(p.createdAt) >= fromDate)
  }

  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo)
    toDate.setHours(23, 59, 59)
    filtered = filtered.filter(p => new Date(p.createdAt) <= toDate)
  }

  return filtered
}

/**
 * Get payment method badge color
 */
export const getPaymentMethodColor = (method) => {
  const colors = {
    'Cash': 'bg-green-100 text-green-800',
    'Card': 'bg-blue-100 text-blue-800',
    'bKash': 'bg-pink-100 text-pink-800',
    'Nagad': 'bg-orange-100 text-orange-800',
    'Rocket': 'bg-purple-100 text-purple-800',
    'Bank Transfer': 'bg-indigo-100 text-indigo-800'
  }
  
  return colors[method] || 'bg-gray-100 text-gray-800'
}

/**
 * Calculate payment summary
 */
export const calculatePaymentSummary = (payments) => {
  const summary = {
    totalPayments: payments.length,
    totalAmount: 0,
    byMethod: {}
  }

  payments.forEach(payment => {
    summary.totalAmount += payment.amount || 0
    
    if (!summary.byMethod[payment.paymentMethod]) {
      summary.byMethod[payment.paymentMethod] = {
        count: 0,
        amount: 0
      }
    }
    
    summary.byMethod[payment.paymentMethod].count++
    summary.byMethod[payment.paymentMethod].amount += payment.amount || 0
  })

  return summary
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
 * Validate payment form
 */
export const validatePaymentForm = (formData) => {
  const errors = {}

  if (!formData.invoiceNo) {
    errors.invoiceNo = 'Invoice number is required'
  }

  if (!formData.amount || formData.amount <= 0) {
    errors.amount = 'Amount must be greater than 0'
  }

  if (!formData.paymentMethod) {
    errors.paymentMethod = 'Payment method is required'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Export payments to CSV
 */
export const exportPaymentsToCSV = (payments) => {
  const csv = [
    ['Invoice No', 'Customer', 'Payment Method', 'Amount', 'Date'],
    ...payments.map(p => [
      p.invoiceNo || '',
      p.customerName || '',
      p.paymentMethod || '',
      p.amount || '',
      formatDate(p.createdAt)
    ])
  ].map(row => row.join(',')).join('\n')
  
  return csv
}

/**
 * Download CSV
 */
export const downloadCSV = (csvContent, filename = 'payments-export.csv') => {
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

