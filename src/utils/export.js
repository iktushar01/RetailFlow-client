/**
 * Export Utility Functions
 * Handle CSV and other export formats
 */

/**
 * Convert array of objects to CSV and trigger download
 * @param {Array} data - Array of data objects
 * @param {Array} headers - Array of header labels
 * @param {Array} keys - Array of object keys to extract
 * @param {string} filename - Filename for download
 */
export const exportToCSV = (data, headers, keys, filename = 'export.csv') => {
  try {
    // Create CSV content
    const csvRows = []
    
    // Add headers
    csvRows.push(headers.join(','))
    
    // Add data rows
    data.forEach(item => {
      const values = keys.map(key => {
        const value = item[key]
        // Handle values with commas or quotes
        const escaped = String(value || '').replace(/"/g, '""')
        return `"${escaped}"`
      })
      csvRows.push(values.join(','))
    })
    
    // Create blob and download
    const csvString = csvRows.join('\n')
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    
    return true
  } catch (error) {
    console.error('Export to CSV failed:', error)
    return false
  }
}

/**
 * Export to JSON file
 * @param {Array|Object} data - Data to export
 * @param {string} filename - Filename for download
 */
export const exportToJSON = (data, filename = 'export.json') => {
  try {
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const link = document.createElement('a')
    
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    return true
  } catch (error) {
    console.error('Export to JSON failed:', error)
    return false
  }
}

/**
 * Format date for export
 * @param {string|Date} date - Date to format
 */
export const formatDateForExport = (date) => {
  if (!date) return ''
  try {
    const d = new Date(date)
    if (isNaN(d.getTime())) return ''
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch {
    return ''
  }
}

/**
 * Format currency for export
 * @param {number} amount - Amount to format
 */
export const formatCurrencyForExport = (amount) => {
  if (!amount && amount !== 0) return '0.00'
  return Number(amount).toFixed(2)
}

export default {
  exportToCSV,
  exportToJSON,
  formatDateForExport,
  formatCurrencyForExport
}

