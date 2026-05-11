// Invoice Helper Functions

/**
 * Apply filters to invoices
 */
export const applyInvoiceFilters = (invoices, filters) => {
  let filtered = [...invoices]

  if (filters.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(inv =>
      inv.invoiceNo?.toLowerCase().includes(search) ||
      inv.customerName?.toLowerCase().includes(search)
    )
  }

  if (filters.paymentStatus && filters.paymentStatus !== 'All') {
    filtered = filtered.filter(inv => inv.paymentStatus === filters.paymentStatus)
  }

  if (filters.dateFrom) {
    const fromDate = new Date(filters.dateFrom)
    filtered = filtered.filter(inv => new Date(inv.createdAt) >= fromDate)
  }

  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo)
    toDate.setHours(23, 59, 59)
    filtered = filtered.filter(inv => new Date(inv.createdAt) <= toDate)
  }

  return filtered
}

/**
 * Get payment status badge color
 */
export const getPaymentStatusColor = (status) => {
  const colors = {
    'Paid': 'bg-green-100 text-green-800',
    'Partial': 'bg-yellow-100 text-yellow-800',
    'Due': 'bg-red-100 text-red-800',
    'Overdue': 'bg-red-200 text-red-900'
  }
  
  return colors[status] || 'bg-gray-100 text-gray-800'
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
 * Print invoice
 */
export const printInvoice = (invoice) => {
  const printWindow = window.open('', '_blank')
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice - ${invoice.invoiceNo}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .header h1 { margin: 0; color: #333; }
        .invoice-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .invoice-info div { flex: 1; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .totals { margin-top: 30px; text-align: right; }
        .totals div { margin: 8px 0; font-size: 14px; }
        .grand-total { font-size: 20px; font-weight: bold; color: #333; padding-top: 10px; border-top: 2px solid #333; }
        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
        @media print {
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>SALES INVOICE</h1>
        <p style="margin: 5px 0;">Your Store Name</p>
        <p style="margin: 5px 0; font-size: 14px;">123 Main Street, City, Country</p>
      </div>
      
      <div class="invoice-info">
        <div>
          <p><strong>Invoice No:</strong> ${invoice.invoiceNo}</p>
          <p><strong>Date:</strong> ${formatDateTime(invoice.createdAt)}</p>
          <p><strong>Payment Status:</strong> ${invoice.paymentStatus}</p>
        </div>
        <div>
          <p><strong>Bill To:</strong></p>
          <p>${invoice.customerName}</p>
          <p>${invoice.customerPhone || ''}</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Discount</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items.map((item, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${item.productName}</td>
              <td>${item.quantity}</td>
              <td>${formatCurrency(item.unitPrice)}</td>
              <td>${formatCurrency(item.discount || 0)}</td>
              <td>${formatCurrency(item.subtotal)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="totals">
        <div>Subtotal: ${formatCurrency(invoice.subtotal)}</div>
        <div>Discount: -${formatCurrency(invoice.totalDiscount)}</div>
        <div>Tax: ${formatCurrency(invoice.tax)}</div>
        <div class="grand-total">Grand Total: ${formatCurrency(invoice.grandTotal)}</div>
        ${invoice.amountPaid ? `<div>Amount Paid: ${formatCurrency(invoice.amountPaid)}</div>` : ''}
        ${invoice.grandTotal - (invoice.amountPaid || 0) > 0 ? `<div style="color: red;">Amount Due: ${formatCurrency(invoice.grandTotal - (invoice.amountPaid || 0))}</div>` : ''}
      </div>

      <div class="footer">
        <p>Thank you for your business!</p>
        <p>For any queries, please contact us at support@yourstore.com</p>
      </div>

      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `
  
  printWindow.document.write(html)
  printWindow.document.close()
}

/**
 * Download invoice as PDF (using print to PDF)
 */
export const downloadInvoicePDF = (invoice) => {
  printInvoice(invoice)
}

/**
 * Export invoices to CSV
 */
export const exportInvoicesToCSV = (invoices) => {
  const csv = [
    ['Invoice No', 'Customer', 'Date', 'Total', 'Paid', 'Due', 'Status'],
    ...invoices.map(inv => [
      inv.invoiceNo || '',
      inv.customerName || '',
      formatDate(inv.createdAt),
      inv.grandTotal || 0,
      inv.amountPaid || 0,
      (inv.grandTotal - (inv.amountPaid || 0)) || 0,
      inv.paymentStatus || ''
    ])
  ].map(row => row.join(',')).join('\n')
  
  return csv
}

/**
 * Download CSV
 */
export const downloadCSV = (csvContent, filename = 'invoices-export.csv') => {
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

/**
 * Calculate invoice summary
 */
export const calculateInvoiceSummary = (invoices) => {
  return {
    total: invoices.length,
    totalSales: invoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0),
    totalPaid: invoices.reduce((sum, inv) => sum + (inv.amountPaid || 0), 0),
    totalDue: invoices.reduce((sum, inv) => sum + ((inv.grandTotal || 0) - (inv.amountPaid || 0)), 0),
    paidCount: invoices.filter(inv => inv.paymentStatus === 'Paid').length,
    dueCount: invoices.filter(inv => inv.paymentStatus === 'Due').length,
    partialCount: invoices.filter(inv => inv.paymentStatus === 'Partial').length
  }
}

