import axios from 'axios'

const API_BASE_URL = 'https://pos-system-management-server-20.vercel.app'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

export const returnsAPI = {
  getAll: async () => {
    const response = await api.get('/returns')
    return response.data
  },
  
  create: async (returnData) => {
    const response = await api.post('/returns', returnData)
    return response.data
  },
  
  approve: async (id) => {
    const response = await api.patch(`/returns/${id}/approve`)
    return response.data
  },
  
  reject: async (id) => {
    const response = await api.patch(`/returns/${id}/reject`)
    return response.data
  },
  
  delete: async (id) => {
    const response = await api.delete(`/returns/${id}`)
    return response.data
  }
}

export const salesAPI = {
  getAll: async () => {
    const response = await api.get('/sales')
    return response.data
  },
  
  getByInvoiceNo: async (invoiceNo) => {
    const response = await api.get(`/sales/invoice/${invoiceNo}`)
    return response.data
  }
}

export default api

