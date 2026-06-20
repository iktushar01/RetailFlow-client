import { apiClient as api } from '../../../config/apiConfig'

// Purchase Orders API (for fetching sent POs)
export const purchaseOrdersAPI = {
  getAll: async (params) => {
    const response = await api.get('/purchase-orders', { params })
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/purchase-orders/${id}`)
    return response.data
  },
  
  getSentOrders: async () => {
    const response = await api.get('/purchase-orders?status=Sent')
    return response.data
  }
}

// GRN API
export const grnAPI = {
  getAll: async () => {
    const response = await api.get('/grn')
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/grn/${id}`)
    return response.data
  },
  
  create: async (grnData) => {
    const response = await api.post('/grn', grnData)
    return response.data
  },
  
  update: async (id, grnData) => {
    const response = await api.put(`/grn/${id}`, grnData)
    return response.data
  },
  
  delete: async (id) => {
    const response = await api.delete(`/grn/${id}`)
    return response.data
  },
  
  approve: async (id) => {
    const response = await api.patch(`/grn/${id}/approve`, {
      status: 'Approved'
    })
    return response.data
  },
  
  getCumulativeReceivedByPO: async (poId) => {
    const response = await api.get(`/grn/po/${poId}/received`)
    return response.data
  }
}

// Suppliers API
export const suppliersAPI = {
  getAll: async () => {
    const response = await api.get('/suppliers')
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/suppliers/${id}`)
    return response.data
  }
}

// Products API
export const productsAPI = {
  getAll: async () => {
    const response = await api.get('/products')
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  }
}

export default api

