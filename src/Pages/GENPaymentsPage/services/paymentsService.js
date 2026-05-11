import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://pos-system-management-server-20.vercel.app'

// API Services
export const paymentsAPI = {
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/suppliers/payments`)
    return response.data
  },
  
  getById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/suppliers/payments/${id}`)
    return response.data
  },
  
  create: async (paymentData) => {
    const response = await axios.post(`${API_BASE_URL}/suppliers/payments`, paymentData)
    return response.data
  },
  
  update: async (id, data) => {
    const response = await axios.put(`${API_BASE_URL}/suppliers/payments/${id}`, data)
    return response.data
  },
  
  delete: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/suppliers/payments/${id}`)
    return response.data
  }
}

export const suppliersAPI = {
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/suppliers`)
    return response.data
  }
}

export const grnAPI = {
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/grn`)
    return response.data
  }
}

