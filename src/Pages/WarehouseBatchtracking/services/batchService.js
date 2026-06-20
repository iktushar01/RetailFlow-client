import { apiClient as api } from '../../../config/apiConfig'

// Inventory API
export const inventoryAPI = {
  getAll: async () => {
    const response = await api.get('/inventory')
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/inventory/${id}`)
    return response.data
  },
  
  update: async (id, data) => {
    const response = await api.put(`/inventory/${id}`, data)
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

