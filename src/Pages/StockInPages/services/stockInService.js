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

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
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
      console.error('API Error:', error.response.data)
    } else if (error.request) {
      console.error('Network Error:', error.message)
    } else {
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

// GRN API (Stock In data comes from GRNs)
export const grnAPI = {
  getAll: async () => {
    const response = await api.get('/grn')
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/grn/${id}`)
    return response.data
  },
  
  getApprovedGRNs: async () => {
    const response = await api.get('/grn')
    // Filter for approved GRNs that represent stock entries
    return response.data.filter(grn => 
      grn.status === 'Approved' || 
      grn.status === 'Partially Received' || 
      grn.status === 'Fully Received'
    )
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

export default api

