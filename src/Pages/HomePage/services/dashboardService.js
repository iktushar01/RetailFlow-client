import { apiClient as api } from '../../../config/apiConfig'
import { unwrapApiData, getPeriodDateRange } from '../../../utils/unwrapApiData'

const getStockQty = (item) => {
  if (item.totalStock !== undefined) return parseFloat(item.totalStock) || 0
  if (Array.isArray(item.stockQty)) {
    return item.stockQty.reduce((sum, qty) => sum + (parseFloat(qty) || 0), 0)
  }
  let stockQty =
    parseFloat(item.stockQty) ||
    parseFloat(item.quantity) ||
    parseFloat(item.stock) ||
    parseFloat(item.currentStock) ||
    parseFloat(item.availableQty) ||
    parseFloat(item.onHand) ||
    0
  if (stockQty === 0 && Array.isArray(item.locations)) {
    stockQty = item.locations.reduce(
      (sum, loc) => sum + (parseFloat(loc.quantity) || parseFloat(loc.stockQty) || 0),
      0
    )
  }
  return stockQty
}

const getCostPrice = (item, product = {}) =>
  parseFloat(item.avgCost) ||
  parseFloat(item.averageCost) ||
  parseFloat(item.avgPurchasePrice) ||
  parseFloat(item.costPrice) ||
  parseFloat(item.unitCost) ||
  parseFloat(product.avgCost) ||
  parseFloat(product.costPrice) ||
  parseFloat(product.unitCost) ||
  0

export const dashboardAPI = {
  getOverview: async () => {
    try {
      const [sales, inventory, products, suppliers, lowStock] = await Promise.allSettled([
        api.get('/sales').catch(() => ({ data: [] })),
        api.get('/inventory/products').catch(() => api.get('/inventory').catch(() => ({ data: [] }))),
        api.get('/products').catch(() => ({ data: [] })),
        api.get('/suppliers').catch(() => ({ data: [] })),
        api.get('/inventory/low-stock/10').catch(() => ({ data: [] })),
      ])

      const result = {
        sales: sales.status === 'fulfilled' ? unwrapApiData(sales.value, []) : [],
        inventory: inventory.status === 'fulfilled' ? unwrapApiData(inventory.value, []) : [],
        products: products.status === 'fulfilled' ? unwrapApiData(products.value, []) : [],
        suppliers: suppliers.status === 'fulfilled' ? unwrapApiData(suppliers.value, []) : [],
        lowStock: lowStock.status === 'fulfilled' ? unwrapApiData(lowStock.value, []) : [],
      }

      const productMap = {}
      result.products.forEach((product) => {
        const productId = product._id || product.productId
        if (productId) productMap[productId.toString()] = product
      })

      let totalStockValue = 0
      if (result.inventory.length > 0) {
        result.inventory.forEach((item) => {
          const productId = (item.productId || item._id || '').toString()
          const product = productMap[productId] || {}
          totalStockValue += getStockQty(item) * getCostPrice(item, product)
        })
      }

      result.totalStockValue = totalStockValue
      result.enrichedInventory = result.inventory.map((item) => {
        const productId = (item.productId || item._id || '').toString()
        const product = productMap[productId] || {}
        return {
          ...item,
          category: product.category || product.productCategory || item.category || 'Uncategorized',
          productInfo: product,
        }
      })

      return result
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      return {
        sales: [],
        inventory: [],
        products: [],
        suppliers: [],
        lowStock: [],
        totalStockValue: 0,
        enrichedInventory: [],
      }
    }
  },

  getSalesData: async (period = 'today') => {
    try {
      const periodMap = {
        today: 'today',
        week: 'week',
        month: 'month',
        daily: 'today',
        weekly: 'week',
        monthly: 'month',
      }
      const mappedPeriod = periodMap[period.toLowerCase()] || 'today'
      const response = await api.get(`/sales/analytics?period=${mappedPeriod}`)
      const analytics = unwrapApiData(response, { labels: [], revenue: [], salesCount: [] })

      const labels = analytics.labels || []
      const revenue = analytics.revenue || analytics.data || []
      const salesCount = analytics.salesCount || []

      return {
        labels,
        data: revenue,
        datasets: [
          { label: 'Sales Count', data: salesCount },
          { label: 'Revenue (BDT)', data: revenue },
        ],
      }
    } catch (error) {
      console.error('Error fetching sales data:', error)
      return { labels: [], data: [], datasets: [] }
    }
  },

  getSummaryForPeriod: async (period = 'today') => {
    try {
      const { dateFrom, dateTo } = getPeriodDateRange(period)
      const response = await api.get(`/sales/summary?dateFrom=${encodeURIComponent(dateFrom)}&dateTo=${encodeURIComponent(dateTo)}`)
      return unwrapApiData(response, {
        totalSales: 0,
        totalAmount: 0,
        totalProfit: 0,
        averageOrderValue: 0,
      })
    } catch (error) {
      console.error('Error fetching sales summary:', error)
      return { totalSales: 0, totalAmount: 0, totalProfit: 0, averageOrderValue: 0 }
    }
  },

  getTopProducts: async (limit = 4, period = 'today') => {
    try {
      const { dateFrom, dateTo } = getPeriodDateRange(period)
      const params = new URLSearchParams({
        limit: String(limit),
        dateFrom,
        dateTo,
      })
      const response = await api.get(`/sales/top-products?${params.toString()}`)
      return unwrapApiData(response, [])
    } catch (error) {
      console.error('Error fetching top products:', error)
      return []
    }
  },

  getRecentActivities: async () => {
    try {
      const response = await api.get('/sales?limit=5&sort=-createdAt').catch(() => ({ data: [] }))
      const salesData = unwrapApiData(response, [])

      return salesData
        .map((sale) => {
          const amount = sale.grandTotal || sale.totalAmount || sale.amount || sale.total || 0
          const paymentMethod = sale.paymentMethod || 'Cash'
          const status = sale.status || 'Completed'
          const invoiceRef = sale.invoiceNo || sale._id?.slice(-6) || 'N/A'
          return {
            id: sale._id,
            type: 'sale',
            title: `Sale #${invoiceRef}`,
            description: `BDT ${amount} - ${status} via ${paymentMethod}`,
            timestamp: sale.createdAt || sale.date,
            icon: 'receipt',
          }
        })
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5)
    } catch (error) {
      console.error('Error fetching recent activities:', error)
      return []
    }
  },

  getAlerts: async () => {
    try {
      const [lowStock, suppliers] = await Promise.allSettled([
        api.get('/inventory/low-stock/5').catch(() => ({ data: [] })),
        api.get('/suppliers').catch(() => ({ data: [] })),
      ])

      const alerts = []
      const lowStockData = lowStock.status === 'fulfilled' ? unwrapApiData(lowStock.value, []) : []
      lowStockData.forEach((item) => {
        alerts.push({
          id: `low-stock-${item._id}`,
          type: 'warning',
          severity: 'high',
          title: 'Low Stock Alert',
          message: `${item.productName || 'Product'} only ${item.stockQty || 0} left`,
          timestamp: new Date(),
          icon: 'alert-triangle',
        })
      })

      const suppliersData = suppliers.status === 'fulfilled' ? unwrapApiData(suppliers.value, []) : []
      suppliersData.forEach((supplier) => {
        const outstandingBalance =
          supplier.outstandingBalance || supplier.balance || supplier.dueAmount || 0
        if (outstandingBalance > 0) {
          alerts.push({
            id: `payment-${supplier._id}`,
            type: 'info',
            severity: 'medium',
            title: 'Payment Due',
            message: `${supplier.name || 'Supplier'} - BDT ${outstandingBalance} Due`,
            timestamp: new Date(),
            icon: 'credit-card',
          })
        }
      })

      return alerts.sort((a, b) => {
        const severityOrder = { high: 3, medium: 2, low: 1 }
        return severityOrder[b.severity] - severityOrder[a.severity]
      })
    } catch (error) {
      console.error('Error fetching alerts:', error)
      return []
    }
  },

  exportData: async () => {
    try {
      const response = await api.get('/sales/export', { responseType: 'blob' })
      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `sales-export-${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting data:', error)
      throw error
    }
  },
}

export default dashboardAPI
