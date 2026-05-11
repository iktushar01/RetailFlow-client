import axios from 'axios'

const API_URL = 'https://pos-system-management-server-20.vercel.app'

/**
 * API Service Utility
 * Centralized API calls with error handling
 */

// Generic API call with error handling
const apiCall = async (method, endpoint, data = null, config = {}) => {
  try {
    const response = await axios({
      method,
      url: `${API_URL}${endpoint}`,
      data,
      ...config
    })
    return { success: true, data: response.data }
  } catch (error) {
    console.error(`API Error [${method} ${endpoint}]:`, error)
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'An error occurred'
    }
  }
}

// API methods
export const api = {
  // Generic methods
  get: (endpoint, config) => apiCall('GET', endpoint, null, config),
  post: (endpoint, data, config) => apiCall('POST', endpoint, data, config),
  put: (endpoint, data, config) => apiCall('PUT', endpoint, data, config),
  patch: (endpoint, data, config) => apiCall('PATCH', endpoint, data, config),
  delete: (endpoint, config) => apiCall('DELETE', endpoint, null, config),

  // Warehouse endpoints
  warehouses: {
    getAll: () => apiCall('GET', '/warehouses'),
    getById: (id) => apiCall('GET', `/warehouses/${id}`),
    create: (data) => apiCall('POST', '/warehouses', data),
    update: (id, data) => apiCall('PUT', `/warehouses/${id}`, data),
    delete: (id) => apiCall('DELETE', `/warehouses/${id}`)
  },

  // Inventory endpoints
  inventory: {
    getAll: () => apiCall('GET', '/inventory'),
    getById: (id) => apiCall('GET', `/inventory/${id}`),
    getByProductId: (productId) => apiCall('GET', `/inventory/product/${productId}`),
    update: (id, data) => apiCall('PUT', `/inventory/${id}`, data),
    updateBarcode: (id, data) => apiCall('PATCH', `/inventory/${id}/barcode`, data)
  },

  // Stock Transfer endpoints
  stockTransfers: {
    getAll: () => apiCall('GET', '/stock-transfers'),
    create: (data) => apiCall('POST', '/stock-transfers', data)
  },

  // Batch endpoints
  batches: {
    getAll: () => apiCall('GET', '/batches'),
    create: (data) => apiCall('POST', '/batches', data),
    update: (id, data) => apiCall('PUT', `/batches/${id}`, data),
    delete: (id) => apiCall('DELETE', `/batches/${id}`)
  },

  // GRN endpoints
  grn: {
    getAll: () => apiCall('GET', '/grn'),
    getById: (id) => apiCall('GET', `/grn/${id}`),
    getReceivedByPO: (poId) => apiCall('GET', `/grn/po/${poId}/received`),
    create: (data) => apiCall('POST', '/grn', data),
    update: (id, data) => apiCall('PUT', `/grn/${id}`, data),
    delete: (id) => apiCall('DELETE', `/grn/${id}`),
    approve: (id) => apiCall('PATCH', `/grn/${id}/approve`)
  },

  // Purchase Order endpoints
  purchaseOrders: {
    getAll: () => apiCall('GET', '/purchase-orders'),
    getById: (id) => apiCall('GET', `/purchase-orders/${id}`),
    create: (data) => apiCall('POST', '/purchase-orders', data),
    update: (id, data) => apiCall('PUT', `/purchase-orders/${id}`, data),
    delete: (id) => apiCall('DELETE', `/purchase-orders/${id}`),
    send: (id) => apiCall('PATCH', `/purchase-orders/${id}/send`)
  },

  // Product endpoints
  products: {
    getAll: () => apiCall('GET', '/products'),
    getById: (id) => apiCall('GET', `/products/${id}`),
    create: (data) => apiCall('POST', '/products', data),
    update: (id, data) => apiCall('PUT', `/products/${id}`, data),
    delete: (id) => apiCall('DELETE', `/products/${id}`)
  },

  // Supplier endpoints
  suppliers: {
    getAll: () => apiCall('GET', '/suppliers'),
    getById: (id) => apiCall('GET', `/suppliers/${id}`),
    create: (data) => apiCall('POST', '/suppliers', data),
    update: (id, data) => apiCall('PUT', `/suppliers/${id}`, data),
    delete: (id) => apiCall('DELETE', `/suppliers/${id}`)
  },

  // Payment endpoints
  payments: {
    getAll: () => apiCall('GET', '/payments'),
    getById: (id) => apiCall('GET', `/payments/${id}`),
    update: (id, data) => apiCall('PUT', `/payments/${id}`, data)
  }
}

export default api

