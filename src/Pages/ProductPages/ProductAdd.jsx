import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, List, Info, PackagePlus, ArrowLeft, ShieldCheck } from 'lucide-react'
import Swal from 'sweetalert2'
import { Button } from '../../Components/UI/button'
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

  const initialFormState = {
    productName: '',
    category: '',
    brand: '',
    sku: '',
    description: '',
    qrCode: '',
    supplier: '',
    productImage: ''
  }

  const [formData, setFormData] = useState(initialFormState)
  const [errors, setErrors] = useState({})
  const [suppliers, setSuppliers] = useState([])
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [allProducts, setAllProducts] = useState([])

  useEffect(() => {
    fetchSuppliers()
    fetchAllProducts()
    handleGenerateQRCode()
  }, [])

  const fetchSuppliers = async () => {
    try {
      const data = await suppliersAPI.getAll()
      setSuppliers(data)
    } catch (error) {
      console.error('Error fetching suppliers:', error)
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
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
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
        confirmButtonColor: 'oklch(var(--destructive))'
      })
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    if (errors.productImage) setErrors(prev => ({ ...prev, productImage: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validation = validateProductForm(formData, allProducts, { imageFile, imagePreview })
    if (!validation.isValid) {
      setErrors(validation.errors)
      Swal.fire({
        title: 'Validation Error',
        text: 'Please check the required fields',
        icon: 'error',
        confirmButtonColor: 'oklch(var(--destructive))'
      })
      return
    }

    setIsSubmitting(true)

    try {
      let imageUrl = ''

      if (imageFile) {
        try {
          imageUrl = await imageAPI.upload(imageFile)
        } catch (uploadError) {
          const message =
            uploadError.response?.data?.message ||
            uploadError.message ||
            'Could not upload image to server'
          const result = await Swal.fire({
            title: 'Image Upload Failed',
            text: `${message}. Add product without an image?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, continue',
            confirmButtonColor: 'oklch(var(--primary))'
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
        text: 'Product archived successfully',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })

      resetForm()
      fetchAllProducts() // Refresh the unique check list

    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to create product',
        icon: 'error'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData(initialFormState)
    setImageFile(null)
    setImagePreview(null)
    setErrors({})
    handleGenerateQRCode()
  }

  const handleCancel = () => {
    Swal.fire({
      title: 'Discard changes?',
      text: 'You will lose all data entered in this form',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Discard',
      confirmButtonColor: 'oklch(var(--destructive))'
    }).then((result) => {
      if (result.isConfirmed) navigate('/products/manage')
    })
  }

  const handleCategoryAdded = (newCategory) => {
    setCategories(prev => [...prev, newCategory])
    setFormData(prev => ({ ...prev, category: newCategory }))
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b pb-6">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Add Product</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Create a new product entry in the inventory catalog.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/products/manage')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Button>
      </div>

      {/* Info Notice */}
      <div className="flex items-start gap-4 p-4 rounded-xl border bg-primary/5 border-primary/10">
        <div className="mt-1">
          <ShieldCheck className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="text-sm font-medium">Note</h4>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            Ensure SKU and Product Names are unique to prevent collisions in the database.
            Product images are uploaded to Cloudinary via the API (`POST /upload/image`).
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-card rounded-2xl border shadow-sm p-2 md:p-6 lg:p-10">
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
          onCategoryModalOpen={() => setIsCategoryModalOpen(true)}
          onCategoryModalClose={() => setIsCategoryModalOpen(false)}
          onCategoryAdded={handleCategoryAdded}
        />
      </div>
    </div>
  )
}

export default ProductAdd
