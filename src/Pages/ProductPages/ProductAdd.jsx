import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, List, Info } from 'lucide-react'
import Swal from 'sweetalert2'
import Button from '../../Components/UI/Button'
import ProductForm from './components/ProductForm'
import { productsAPI, suppliersAPI, imageAPI } from './services/productService'
import { 
  generateQRCode, 
  validateProductForm, 
  validateImageFile, 
  prepareProductData, 
  DEFAULT_CATEGORIES 
} from './utils/productHelpers'

const ProductAdd = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    brand: '',
    sku: '',
    description: '',
    qrCode: '',
    supplier: '',
    productImage: ''
  })

  const [errors, setErrors] = useState({})
  const [suppliers, setSuppliers] = useState([])
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [allProducts, setAllProducts] = useState([])

  // Fetch suppliers and products on component mount
  useEffect(() => {
    fetchSuppliers()
    fetchAllProducts()
    handleGenerateQRCode()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchSuppliers = async () => {
    try {
      const data = await suppliersAPI.getAll()
      setSuppliers(data)
    } catch (error) {
      console.error('Error fetching suppliers:', error)
      Swal.fire({
        title: 'Warning',
        text: 'Could not fetch suppliers list',
        icon: 'warning',
        confirmButtonColor: '#3b82f6'
      })
    }
  }

  const fetchAllProducts = async () => {
    try {
      const data = await productsAPI.getAll()
      setAllProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const handleGenerateQRCode = () => {
    const qrValue = generateQRCode()
    setFormData(prev => ({ ...prev, qrCode: qrValue }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) {
      setImageFile(null)
      setImagePreview(null)
      return
    }

    const validation = validateImageFile(file)
    if (!validation.isValid) {
      Swal.fire({
        title: 'Invalid File',
        text: validation.error,
        icon: 'error',
        confirmButtonColor: '#ef4444'
      })
      return
    }

    // Store file and show preview only (no upload yet)
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validation = validateProductForm(formData, allProducts)
    if (!validation.isValid) {
      setErrors(validation.errors)
      Swal.fire({
        title: 'Validation Error',
        text: 'Please fill in all required fields',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      })
      return
    }

    setIsSubmitting(true)

    try {
      let imageUrl = ''

      // Upload image to imgbb if a new image is selected
      if (imageFile) {
        try {
          imageUrl = await imageAPI.upload(imageFile, import.meta.env.VITE_IMGBB_API_KEY)
        } catch (uploadError) {
          console.error('Image upload error:', uploadError)
          const result = await Swal.fire({
            title: 'Upload Failed',
            text: 'Failed to upload image. Product will be added without image.',
            icon: 'warning',
            confirmButtonColor: '#f59e0b',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Continue'
          })
          
          if (!result.isConfirmed) {
            setIsSubmitting(false)
            return
          }
        }
      }

      const productData = prepareProductData(formData, imageUrl, suppliers)
      await productsAPI.create(productData)

      await Swal.fire({
        title: 'Success!',
        text: 'Product added successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3b82f6',
        timer: 2000,
        timerProgressBar: true
      })

      // Reset form
      setFormData({
        productName: '',
        category: '',
        brand: '',
        sku: '',
        description: '',
        qrCode: '',
        supplier: '',
        productImage: ''
      })
      setImageFile(null)
      setImagePreview(null)
      setErrors({})
      handleGenerateQRCode()

    } catch (error) {
      console.error('Error adding product:', error)
      await Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || error.message || 'Failed to add product',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'All unsaved changes will be lost',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, cancel',
      cancelButtonText: 'No, continue editing'
    }).then((result) => {
      if (result.isConfirmed) {
        setFormData({
          productName: '',
          category: '',
          brand: '',
          description: '',
          qrCode: '',
          supplier: '',
          productImage: ''
        })
        setImageFile(null)
        setImagePreview(null)
        setErrors({})
        handleGenerateQRCode()
      }
    })
  }

  const handleCategoryAdded = (newCategory) => {
    setCategories(prev => [...prev, newCategory])
    setFormData(prev => ({ ...prev, category: newCategory }))
  }

  const handleCategoryModalOpen = () => setIsCategoryModalOpen(true)
  const handleCategoryModalClose = () => setIsCategoryModalOpen(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-red-50 p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Plus className="w-8 h-8 mr-3 text-purple-600" />
              Add New Product
            </h1>
            <p className="text-gray-600 mt-2">
              Create and manage your product inventory with ease
            </p>
          </div>

          <Button 
            variant="primary" 
            size="md"
            onClick={() => navigate('/products/manage')}
          >
            <div className="flex items-center">
              <List className="w-5 h-5 mr-2" />
              Manage Products
            </div>
          </Button>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-blue-900">Product Creation</p>
          <p className="text-sm text-blue-700 mt-1">
            Add new products to your catalog with complete details including category, brand, supplier, and images.
            A unique QR code is automatically generated for each product for easy tracking and identification.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <ProductForm
          formData={formData}
          errors={errors}
          categories={categories}
          suppliers={suppliers}
          imagePreview={imagePreview}
          isSubmitting={isSubmitting}
          isCategoryModalOpen={isCategoryModalOpen}
          onInputChange={handleInputChange}
          onImageChange={handleImageChange}
          onGenerateQRCode={handleGenerateQRCode}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onCategoryModalOpen={handleCategoryModalOpen}
          onCategoryModalClose={handleCategoryModalClose}
          onCategoryAdded={handleCategoryAdded}
        />
      </div>
    </div>
  )
}

export default ProductAdd
