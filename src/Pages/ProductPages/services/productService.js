import { apiClient as api } from '../../../config/apiConfig'

// Products API
export const productsAPI = {
  getAll: async () => {
    const response = await api.get('/products')
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },
  
  getByBarcode: async (barcode) => {
    const response = await api.get(`/products/barcode/${barcode}`)
    return response.data
  },
  
  create: async (productData) => {
    const response = await api.post('/products', productData)
    return response.data
  },
  
  update: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData)
    return response.data
  },
  
  updatePrice: async (id, price) => {
    const response = await api.patch(`/products/${id}/price`, { sellingPrice: price })
    return response.data
  },
  
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`)
    return response.data
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
  },
  
  create: async (supplierData) => {
    const response = await api.post('/suppliers', supplierData)
    return response.data
  },
  
  update: async (id, supplierData) => {
    const response = await api.put(`/suppliers/${id}`, supplierData)
    return response.data
  },
  
  delete: async (id) => {
    const response = await api.delete(`/suppliers/${id}`)
    return response.data
  }
}

// Categories API (if you have a backend endpoint for categories)
export const categoriesAPI = {
  getAll: async () => {
    // If you have a backend endpoint, use it
    // For now, returning default categories
    return [
      'Electronics',
      'Clothing',
      'Food & Beverage',
      'Home & Garden',
      'Sports & Outdoors',
      'Books & Media',
      'Health & Beauty',
      'Toys & Games'
    ]
  },
  
  create: async (categoryName) => {
    // If you have a backend endpoint, use it
    // For now, just return the category name
    return categoryName
  }
}

// Image Upload API (Cloudinary via server)
export const imageAPI = {
  upload: async (file) => {
    const formData = new FormData()
    formData.append('image', file)

    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    const url = response.data?.url
    if (url) {
      return url
    }
    throw new Error('Image upload failed')
  }
}

export default api

