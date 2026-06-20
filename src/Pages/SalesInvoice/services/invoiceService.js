import { apiClient as api } from '../../../config/apiConfig'

export const invoiceAPI = {
  getAll: async () => {
    const response = await api.get('/sales')
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/sales/${id}`)
    return response.data
  },
  
  getByInvoiceNo: async (invoiceNo) => {
    const response = await api.get(`/sales/invoice/${invoiceNo}`)
    return response.data
  }
}

export default api

