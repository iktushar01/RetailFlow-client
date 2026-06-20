import { apiClient as api } from '../../../config/apiConfig'

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

