import { apiClient } from '../../config/apiConfig'

/**
 * Unified RetailFlow API layer.
 * Page services should import from here instead of duplicating axios wrappers.
 */

const unwrap = (response) => response.data

const createCrud = (resource) => ({
  getAll: () => apiClient.get(`/${resource}`).then(unwrap),
  getById: (id) => apiClient.get(`/${resource}/${id}`).then(unwrap),
  create: (data) => apiClient.post(`/${resource}`, data).then(unwrap),
  update: (id, data) => apiClient.put(`/${resource}/${id}`, data).then(unwrap),
  remove: (id) => apiClient.delete(`/${resource}/${id}`).then(unwrap),
})

export const retailApi = {
  client: apiClient,
  products: {
    ...createCrud('products'),
    getTopSelling: (limit = 5) =>
      apiClient.get('/products/top-selling', { params: { limit } }).then(unwrap),
    getByBarcode: (barcode) => apiClient.get(`/products/barcode/${barcode}`).then(unwrap),
    updatePrice: (id, sellingPrice) =>
      apiClient.patch(`/products/${id}/price`, { sellingPrice }).then(unwrap),
  },
  sales: {
    ...createCrud('sales'),
    hold: (data) => apiClient.post('/sales/hold', data).then(unwrap),
    getByInvoiceNo: (invoiceNo) => apiClient.get(`/sales/invoice/${invoiceNo}`).then(unwrap),
    getHeld: () => apiClient.get('/sales', { params: { status: 'Hold' } }).then(unwrap),
    exportCsv: () =>
      apiClient.get('/sales/export', { responseType: 'blob' }).then((res) => res.data),
  },
  customers: createCrud('customers'),
  inventory: createCrud('inventory'),
  warehouses: createCrud('warehouses'),
  suppliers: createCrud('suppliers'),
  purchaseOrders: {
    ...createCrud('purchase-orders'),
    send: (id) => apiClient.patch(`/purchase-orders/${id}/send`).then(unwrap),
  },
  grn: {
    ...createCrud('grn'),
    getReceivedByPO: (poId) => apiClient.get(`/grn/po/${poId}/received`).then(unwrap),
    approve: (id) => apiClient.patch(`/grn/${id}/approve`).then(unwrap),
  },
  salesPayments: createCrud('sales-payments'),
  returns: createCrud('returns'),
  discounts: createCrud('discounts'),
  stockTransfers: createCrud('stock-transfers'),
  payments: createCrud('payments'),
  ai: {
    getReorderSuggestions: async () => {
      const res = await apiClient.get('/ai/reorder-suggestions')
      return res.data?.data ?? res.data
    },
    query: async (query) => {
      const res = await apiClient.post('/ai/query', { query })
      return res.data?.data ?? res.data
    },
  },
}

export const authApi = {
  login: async (email, password) => {
    const res = await apiClient.post('/api/v1/auth/login', { email, password })
    return res.data
  },
  logout: () => apiClient.post('/api/v1/auth/logout').catch(() => null),
  refreshToken: () => apiClient.post('/api/v1/auth/refresh-token'),
  getMe: async () => {
    const res = await apiClient.get('/api/v1/auth/me')
    return res.data
  },
}

export const unwrapAnalytics = (response) => response?.data?.data ?? response?.data ?? response

export default retailApi
