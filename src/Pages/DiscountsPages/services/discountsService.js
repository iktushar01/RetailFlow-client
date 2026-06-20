import { apiClient as api } from '../../../config/apiConfig'

export const discountsAPI = {
  getAll: async () => {
    const response = await api.get('/discounts')
    return response.data
  },
  
  create: async (discountData) => {
    const response = await api.post('/discounts', discountData)
    return response.data
  },
  
  update: async (id, discountData) => {
    const response = await api.put(`/discounts/${id}`, discountData)
    return response.data
  },
  
  delete: async (id) => {
    const response = await api.delete(`/discounts/${id}`)
    return response.data
  },
  
  toggleStatus: async (id) => {
    const response = await api.patch(`/discounts/${id}/toggle`)
    return response.data
  }
}

// Products API (to select products for discount)
export const productsAPI = {
  getAll: async () => {
    const response = await api.get('/products')
    return response.data
  }
}

export default api

