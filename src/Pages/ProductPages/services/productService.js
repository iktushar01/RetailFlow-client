import axios from 'axios'

const API_BASE_URL = 'https://pos-system-management-server-20.vercel.app'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 seconds
})

// Request interceptor for adding auth token if needed
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data)
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message)
    } else {
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

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

// Image Upload API (ImgBB)
export const imageAPI = {
  upload: async (file, apiKey) => {
    const formData = new FormData()
    formData.append('image', file)
    
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    
    if (response.data.success) {
      return response.data.data.url
    }
    throw new Error('Image upload failed')
  }
}

export default api

