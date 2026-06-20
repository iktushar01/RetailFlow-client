import axios from 'axios'
import { apiClient } from '../../../config/apiConfig'

// API Services
export const paymentsAPI = {
  getAll: async () => {
    const response = await apiClient.get('/suppliers/payments')
    return response.data
  },
  
  getById: async (id) => {
    const response = await apiClient.get(`/suppliers/payments/${id}`)
    return response.data
  },
  
  create: async (paymentData) => {
    const response = await apiClient.post('/suppliers/payments', paymentData)
    return response.data
  },
  
  update: async (id, data) => {
    const response = await apiClient.put(`/suppliers/payments/${id}`, data)
    return response.data
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(`/suppliers/payments/${id}`)
    return response.data
  }
}

export const suppliersAPI = {
  getAll: async () => {
    const response = await apiClient.get('/suppliers')
    return response.data
  }
}

export const grnAPI = {
  getAll: async () => {
    const response = await apiClient.get('/grn')
    return response.data
  }
}
