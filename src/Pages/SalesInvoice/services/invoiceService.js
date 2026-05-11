import axios from 'axios'

const API_BASE_URL = 'https://pos-system-management-server-20.vercel.app'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

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

