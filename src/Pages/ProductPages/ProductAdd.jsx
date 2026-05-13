import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, List, Info, PackagePlus, ArrowLeft, ShieldCheck } from 'lucide-react'
import Swal from 'sweetalert2'
import { Button } from '../../Components/UI/Button'
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
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validation = validateProductForm(formData, allProducts)
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
          imageUrl = await imageAPI.upload(imageFile, import.meta.env.VITE_IMGBB_API_KEY)
        } catch {
          const result = await Swal.fire({
            title: 'Image Upload Failed',
            text: 'Would you like to add this product without an image?',
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
      <div className="relative overflow-hidden bg-card border rounded-2xl p-8 shadow-sm">
        {/* Decorative Background Blur */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary rounded-xl shadow-lg shadow-primary/20">
                <PackagePlus className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase italic">
                Registry <span className="text-primary/80">New</span>
              </h1>
            </div>
            <p className="text-muted-foreground text-sm max-w-md">
              Initialize a new entry into the global inventory system.
              QR identifiers are auto-generated upon entry.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/products/manage')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Vault
            </Button>
          </div>
        </div>
      </div>

      {/* Info Notice */}
      <div className="flex items-start gap-4 p-4 rounded-xl border bg-primary/5 border-primary/10">
        <div className="mt-1">
          <ShieldCheck className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-primary uppercase tracking-wider">System Integrity</h4>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            Ensure SKU and Product Names are unique to prevent collisions in the database.
            All uploads are routed through encrypted image servers.
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
