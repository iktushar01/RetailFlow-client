import api from '../../../../utils/api'

/**
 * Sales Reports Service
 * Handles all sales-related API calls for reporting and analytics
 */

export const salesReportsAPI = {
  // Get all sales with proper data structure
  getAll: async () => {
    try {
      const response = await api.get('/sales')
      return response.success ? response.data : []
    } catch (error) {
      console.error('Error fetching sales data:', error)
      return []
    }
  },

  // Get sales analytics data
  getAnalytics: async (period = 'week') => {
    try {
      const response = await api.get(`/sales/analytics?period=${period}`)
      return response.success ? response.data : { labels: [], data: [] }
    } catch (error) {
      console.error('Error fetching sales analytics:', error)
      return { labels: [], data: [] }
    }
  },

  // Get sales summary statistics
  getSummary: async (dateFrom = null, dateTo = null) => {
    try {
      const params = new URLSearchParams()
      if (dateFrom) params.append('dateFrom', dateFrom)
      if (dateTo) params.append('dateTo', dateTo)
      
      const response = await api.get(`/sales/summary?${params.toString()}`)
      return response.success ? response.data : {
        totalSales: 0,
        totalAmount: 0,
        totalProfit: 0,
        averageOrderValue: 0,
        topProducts: [],
        salesTrend: []
      }
    } catch (error) {
      console.error('Error fetching sales summary:', error)
      return {
        totalSales: 0,
        totalAmount: 0,
        totalProfit: 0,
        averageOrderValue: 0,
        topProducts: [],
        salesTrend: []
      }
    }
  },

  // Get sales trend data for charts
  getTrend: async (period = 'week') => {
    try {
      const response = await api.get(`/sales/analytics?period=${period}`)
      return response.success ? response.data : { labels: [], data: [] }
    } catch (error) {
      console.error('Error fetching sales trend:', error)
      return { labels: [], data: [] }
    }
  },

  // Get top selling products
  getTopProducts: async (limit = 5, dateFrom = null, dateTo = null) => {
    try {
      const params = new URLSearchParams()
      params.append('limit', limit)
      if (dateFrom) params.append('dateFrom', dateFrom)
      if (dateTo) params.append('dateTo', dateTo)
      
      const response = await api.get(`/sales/top-products?${params.toString()}`)
      return response.success ? response.data : []
    } catch (error) {
      console.error('Error fetching top products:', error)
      return []
    }
  },

  // Get sales by date range
  getByDateRange: async (dateFrom, dateTo) => {
    try {
      const params = new URLSearchParams()
      params.append('dateFrom', dateFrom)
      params.append('dateTo', dateTo)
      
      const response = await api.get(`/sales/date-range?${params.toString()}`)
      return response.success ? response.data : []
    } catch (error) {
      console.error('Error fetching sales by date range:', error)
      return []
    }
  },

  // Get sales analytics dashboard data
  getDashboardData: async () => {
    try {
      const response = await api.get('/sales/analytics?period=week')
      return response.success ? response.data : {
        labels: [],
        data: []
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      return {
        labels: [],
        data: []
      }
    }
  },

  // Export sales data
  exportData: async (format = 'csv', filters = {}) => {
    try {
      const params = new URLSearchParams()
      params.append('format', format)
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key])
      })
      
      const response = await api.get(`/sales/export?${params.toString()}`)
      return response.success ? response.data : null
    } catch (error) {
      console.error('Error exporting sales data:', error)
      return null
    }
  }
}

export default salesReportsAPI
