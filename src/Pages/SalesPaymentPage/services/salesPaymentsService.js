import { apiClient as api } from '../../../config/apiConfig'

export const salesPaymentsAPI = {
  getAll: async () => {
    const response = await api.get('/sales-payments')
    return response.data
  },
  
  getByInvoiceNo: async (invoiceNo) => {
    const response = await api.get(`/sales-payments/invoice/${invoiceNo}`)
    return response.data
  },
  
  create: async (paymentData) => {
    const response = await api.post('/sales-payments', paymentData)
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

