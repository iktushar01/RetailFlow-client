import axios from 'axios'

const API_BASE_URL = 'https://pos-system-management-server-20.vercel.app'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 seconds
})

// Request interceptor for adding auth token if needed
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data)
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message)
    } else {
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

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

