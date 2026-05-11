import api from '../../../utils/api'

// Inventory API
export const inventoryAPI = {
  getAll: async () => {
    const response = await api.get('/inventory')
    return response.data || []
  },
  
  // New method for product-centric inventory view
  getProducts: async () => {
    const response = await api.get('/inventory/products')
    return response.data || []
  },
  
  getById: async (id) => {
    const response = await api.get(`/inventory/${id}`)
    return response.data || null
  },
  
  create: async (inventoryData) => {
    const response = await api.post('/inventory', inventoryData)
    return response.data || null
  },
  
  update: async (id, inventoryData) => {
    const response = await api.put(`/inventory/${id}`, inventoryData)
    return response.data || null
  },
  
  delete: async (id) => {
    const response = await api.delete(`/inventory/${id}`)
    return response.data || null
  }
}

// Products API
export const productsAPI = {
  getAll: async () => {
    const response = await api.get('/products')
    return response.data || []
  },
  
  getById: async (id) => {
    const response = await api.get(`/products/${id}`)
    return response.data || null
  },
  
  create: async (productData) => {
    const response = await api.post('/products', productData)
    return response.data || null
  },
  
  update: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData)
    return response.data || null
  },
  
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`)
    return response.data || null
  }
}

// Warehouses API
export const warehousesAPI = {
  getAll: async () => {
    const response = await api.get('/warehouses')
    return response.data || []
  },
  
  getById: async (id) => {
    const response = await api.get(`/warehouses/${id}`)
    return response.data || null
  },
  
  create: async (warehouseData) => {
    const response = await api.post('/warehouses', warehouseData)
    return response.data || null
  },
  
  update: async (id, warehouseData) => {
    const response = await api.put(`/warehouses/${id}`, warehouseData)
    return response.data || null
  },
  
  delete: async (id) => {
    const response = await api.delete(`/warehouses/${id}`)
    return response.data || null
  }
}

// Sales API
export const salesAPI = {
  getAll: async () => {
    const response = await api.get('/sales')
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/sales/${id}`)
    return response.data
  },
  
  create: async (saleData) => {
    const response = await api.post('/sales', saleData)
    return response.data
  },
  
  update: async (id, saleData) => {
    const response = await api.put(`/sales/${id}`, saleData)
    return response.data
  },
  
  delete: async (id) => {
    const response = await api.delete(`/sales/${id}`)
    return response.data
  }
}

// Customers API
export const customersAPI = {
  getAll: async () => {
    const response = await api.get('/customers')
    return response.data || []
  },
  
  getById: async (id) => {
    const response = await api.get(`/customers/${id}`)
    return response.data || null
  },
  
  create: async (customerData) => {
    const response = await api.post('/customers', customerData)
    return response.data || null
  },
  
  update: async (id, customerData) => {
    const response = await api.put(`/customers/${id}`, customerData)
    return response.data || null
  },
  
  delete: async (id) => {
    const response = await api.delete(`/customers/${id}`)
    return response.data || null
  }
}

// Suppliers API
export const suppliersAPI = {
  getAll: async () => {
    const response = await api.get('/suppliers')
    return response.data || []
  },
  
  getById: async (id) => {
    const response = await api.get(`/suppliers/${id}`)
    return response.data || null
  },
  
  create: async (supplierData) => {
    const response = await api.post('/suppliers', supplierData)
    return response.data || null
  },
  
  update: async (id, supplierData) => {
    const response = await api.put(`/suppliers/${id}`, supplierData)
    return response.data || null
  },
  
  delete: async (id) => {
    const response = await api.delete(`/suppliers/${id}`)
    return response.data || null
  }
}

// Purchase Orders API
export const purchaseOrdersAPI = {
  getAll: async () => {
    const response = await api.get('/purchase-orders')
    return response.data || []
  },
  
  getById: async (id) => {
    const response = await api.get(`/purchase-orders/${id}`)
    return response.data || null
  },
  
  create: async (poData) => {
    const response = await api.post('/purchase-orders', poData)
    return response.data || null
  },
  
  update: async (id, poData) => {
    const response = await api.put(`/purchase-orders/${id}`, poData)
    return response.data || null
  },
  
  delete: async (id) => {
    const response = await api.delete(`/purchase-orders/${id}`)
    return response.data || null
  }
}

// Payments API
export const paymentsAPI = {
  getAll: async () => {
    const response = await api.get('/payments')
    return response.data || []
  },
  
  getById: async (id) => {
    const response = await api.get(`/payments/${id}`)
    return response.data || null
  },
  
  create: async (paymentData) => {
    const response = await api.post('/payments', paymentData)
    return response.data || null
  },
  
  update: async (id, paymentData) => {
    const response = await api.put(`/payments/${id}`, paymentData)
    return response.data || null
  },
  
  delete: async (id) => {
    const response = await api.delete(`/payments/${id}`)
    return response.data || null
  }
}

// Discounts API
export const discountsAPI = {
  getAll: async () => {
    const response = await api.get('/discounts')
    return response.data || []
  },
  
  getActive: async () => {
    const response = await api.get('/discounts/active')
    return response.data || []
  },
  
  getById: async (id) => {
    const response = await api.get(`/discounts/${id}`)
    return response.data || null
  },
  
  create: async (discountData) => {
    const response = await api.post('/discounts', discountData)
    return response.data || null
  },
  
  update: async (id, discountData) => {
    const response = await api.put(`/discounts/${id}`, discountData)
    return response.data || null
  },
  
  delete: async (id) => {
    const response = await api.delete(`/discounts/${id}`)
    return response.data || null
  }
}

export default api
