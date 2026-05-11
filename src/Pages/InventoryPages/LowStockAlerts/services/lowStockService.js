import api from '../../../../utils/api'

/**
 * Low Stock Service - API calls for low stock management
 */

export const lowStockAPI = {
  /**
   * Get all low stock items based on threshold
   * @param {Number} threshold - Stock level threshold
   * @returns {Promise<Array>} Array of low stock items
   */
  getLowStock: async (threshold = 10) => {
    try {
      const response = await api.get(`/inventory/low-stock/${threshold}`)
      return response.data
    } catch (error) {
      console.error('Error fetching low stock:', error)
      throw error
    }
  },

  /**
   * Create reorder purchase order
   * @param {Object} orderData - Purchase order data
   * @returns {Promise<Object>} Created order
   */
  createReorderPO: async (orderData) => {
    try {
      const response = await api.post('/purchase-orders', orderData)
      return response.data
    } catch (error) {
      console.error('Error creating reorder PO:', error)
      throw error
    }
  },

  /**
   * Create multiple purchase orders
   * @param {Array} orders - Array of purchase order data
   * @returns {Promise<Array>} Created orders
   */
  createBulkReorderPOs: async (orders) => {
    try {
      const promises = orders.map(order => api.post('/purchase-orders', order))
      const responses = await Promise.all(promises)
      return responses.map(res => res.data)
    } catch (error) {
      console.error('Error creating bulk reorder POs:', error)
      throw error
    }
  }
}

// Re-export shared APIs for convenience
export { inventoryAPI, productsAPI, suppliersAPI, purchaseOrdersAPI } from '../../services/inventoryService'

