import { apiClient } from '../../../config/apiConfig'

// API Services
export const inventoryAPI = {
  getAll: async () => {
    const response = await apiClient.get('/inventory')
    return response.data
  },
  
  // New method for product-centric inventory view
  getProducts: async () => {
    const response = await apiClient.get('/inventory/products')
    return response.data
  },
  
  getByProductId: async (productId) => {
    const response = await apiClient.get(`/inventory/product/${productId}`)
    return response.data
  },
  
  getById: async (id) => {
    const response = await apiClient.get(`/inventory/${id}`)
    return response.data
  },
  
  create: async (inventoryData) => {
    const response = await apiClient.post('/inventory', inventoryData)
    return response.data
  },
  
  update: async (id, inventoryData) => {
    const response = await apiClient.put(`/inventory/${id}`, inventoryData)
    return response.data
  },
  
  updateStock: async (id, stockQty) => {
    const response = await apiClient.patch(`/inventory/${id}/stock`, { 
      stockQty,
      quantity: stockQty 
    })
    return response.data
  },
  
  updateBarcode: async (id, barcode) => {
    const response = await apiClient.patch(`/inventory/${id}/barcode`, { barcode })
    return response.data
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(`/inventory/${id}`)
    return response.data
  },
  
  getLowStock: async (threshold = 10) => {
    const response = await apiClient.get(`/inventory/low-stock/${threshold}`)
    return response.data
  }
}

export const productsAPI = {
  getAll: async () => {
    const response = await apiClient.get('/products')
    return response.data
  },
  
  getById: async (id) => {
    const response = await apiClient.get(`/products/${id}`)
    return response.data
  },
  
  getByBarcode: async (barcode) => {
    const response = await apiClient.get(`/products/barcode/${barcode}`)
    return response.data
  }
}
