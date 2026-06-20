import { apiClient as api } from '../../../config/apiConfig'

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

