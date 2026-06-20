import { apiClient as api } from '../../../config/apiConfig'

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

// Purchase Orders API
export const purchaseOrdersAPI = {
  getAll: async () => {
    const response = await api.get('/purchase-orders')
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/purchase-orders/${id}`)
    return response.data
  },
  
  create: async (poData) => {
    const response = await api.post('/purchase-orders', poData)
    return response.data
  },
  
  update: async (id, poData) => {
    const response = await api.put(`/purchase-orders/${id}`, poData)
    return response.data
  },
  
  delete: async (id) => {
    const response = await api.delete(`/purchase-orders/${id}`)
    return response.data
  },
  
  send: async (id) => {
    const response = await api.patch(`/purchase-orders/${id}/send`, {
      status: 'Sent'
    })
    return response.data
  },
  
  updateStatus: async (id, status) => {
    const response = await api.patch(`/purchase-orders/${id}/status`, {
      status
    })
    return response.data
  }
}

export default api

