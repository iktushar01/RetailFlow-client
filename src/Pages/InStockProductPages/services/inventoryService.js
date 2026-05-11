import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://pos-system-management-server-20.vercel.app'

// API Services
export const inventoryAPI = {
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/inventory`)
    return response.data
  },
  
  // New method for product-centric inventory view
  getProducts: async () => {
    const response = await axios.get(`${API_BASE_URL}/inventory/products`)
    return response.data
  },
  
  getByProductId: async (productId) => {
    const response = await axios.get(`${API_BASE_URL}/inventory/product/${productId}`)
    return response.data
  },
  
  getById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/inventory/${id}`)
    return response.data
  },
  
  create: async (inventoryData) => {
    const response = await axios.post(`${API_BASE_URL}/inventory`, inventoryData)
    return response.data
  },
  
  update: async (id, inventoryData) => {
    const response = await axios.put(`${API_BASE_URL}/inventory/${id}`, inventoryData)
    return response.data
  },
  
  updateStock: async (id, stockQty, operation = 'set') => {
    const response = await axios.patch(`${API_BASE_URL}/inventory/${id}/stock`, { 
      stockQty, 
      operation 
    })
    return response.data
  },
  
  updateBarcode: async (id, barcode) => {
    const response = await axios.patch(`${API_BASE_URL}/inventory/${id}/barcode`, { barcode })
    return response.data
  },
  
  delete: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/inventory/${id}`)
    return response.data
  },
  
  getLowStock: async (threshold) => {
    const response = await axios.get(`${API_BASE_URL}/inventory/low-stock/${threshold}`)
    return response.data
  }
}

export const productsAPI = {
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/products`)
    return response.data
  },
  
  getById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`)
    return response.data
  },
  
  getByBarcode: async (barcode) => {
    const response = await axios.get(`${API_BASE_URL}/products/barcode/${barcode}`)
    return response.data
  }
}

