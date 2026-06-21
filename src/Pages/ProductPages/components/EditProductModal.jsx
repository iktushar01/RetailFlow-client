import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from "../../../Components/UI/dialog"
import { Button } from '../../../Components/UI/button'
import { Input } from "../../../Components/UI/input"
import { Label } from "../../../Components/UI/label"
import { Textarea } from "../../../Components/UI/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../Components/UI/select"
import { 
  Loader2, 
  Upload, 
  X, 
  QrCode, 
  RefreshCcw, 
  Image as ImageIcon 
} from "lucide-react"
import { productsAPI, suppliersAPI, imageAPI } from '../services/productService'
import { generateQRCode, validateImageFile, DEFAULT_CATEGORIES } from '../utils/productHelpers'
import Swal from 'sweetalert2'
import { cn } from "@/lib/utils"

const EditProductModal = ({ isOpen, onClose, product, onSuccess }) => {
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
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [allProducts, setAllProducts] = useState([])

  // Load product data into form
  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName || '',
        category: product.category || '',
        brand: product.brand || '',
        sku: product.sku || '',
        description: product.description || '',
        qrCode: product.qrCode || '',
        supplier: product.supplier || '',
        productImage: product.productImage || ''
      })
      setImagePreview(product.productImage || null)
    }
  }, [product])

  // Data fetching
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const [suppliersData, productsData] = await Promise.all([
            suppliersAPI.getAll(),
            productsAPI.getAll()
          ])
          setSuppliers(suppliersData)
          setAllProducts(productsData)
        } catch (error) {
          console.error('Error fetching modal data:', error)
        }
      }
      fetchData()
    }
  }, [isOpen])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.isValid) {
      Swal.fire({ title: 'Invalid File', text: validation.error, icon: 'error' })
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const validateForm = () => {
    const newErrors = {}
    const required = ['productName', 'category', 'brand', 'sku', 'supplier', 'qrCode']
    
    required.forEach(field => {
      if (!formData[field]?.trim?.() && !formData[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
      }
    })

    // Check duplicates
    if (formData.sku && allProducts.find(p => p.sku === formData.sku && p._id !== product._id)) {
      newErrors.sku = 'SKU already exists'
    }
    if (formData.qrCode && allProducts.find(p => p.qrCode === formData.qrCode && p._id !== product._id)) {
      newErrors.qrCode = 'QR Code already exists'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      let imageUrl = formData.productImage

      if (imageFile) {
        try {
          imageUrl = await imageAPI.upload(imageFile)
        } catch (uploadError) {
          Swal.fire({
            title: 'Image Upload Failed',
            text:
              uploadError.response?.data?.message ||
              uploadError.message ||
              'Could not upload image',
            icon: 'error'
          })
          setIsSubmitting(false)
          return
        }
      }

      const selectedSupplier = suppliers.find(s => s.supplierName === formData.supplier || s.name === formData.supplier)
      
      await productsAPI.update(product._id, {
        ...formData,
        productImage: imageUrl,
        supplierId: selectedSupplier?._id || null
      })

      Swal.fire({ title: 'Updated!', icon: 'success', timer: 1500, showConfirmButton: false })
      onSuccess()
    } catch {
      Swal.fire({ title: 'Error', text: 'Failed to update product', icon: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent size="lg" className="gap-0 p-0">
        <DialogHeader className="shrink-0 px-4 py-4 sm:px-6 border-b">
          <DialogTitle className="text-2xl pr-8">Edit Product</DialogTitle>
          <DialogDescription>
            Modify the product details below. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="px-4 sm:px-6">
        <form id="edit-product-form" onSubmit={handleSubmit} className="space-y-8 py-4">
          {/* Image Upload Section */}
          <div className="space-y-4">
            <Label className="text-base">Product Image</Label>
            <div className="flex flex-col items-center gap-4">
              {imagePreview ? (
                <div className="relative group w-full max-w-[400px]">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-56 object-cover rounded-xl border shadow-sm transition-opacity group-hover:opacity-90"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <label className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                     <div className="bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full border text-xs font-medium flex items-center gap-2">
                        <RefreshCcw className="h-3 w-3" /> Change Image
                     </div>
                     <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                </div>
              ) : (
                <label className={cn(
                  "flex flex-col items-center justify-center w-full h-56 border-2 border-dashed rounded-xl cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors",
                  errors.productImage && "border-destructive bg-destructive/5"
                )}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="text-sm font-medium text-muted-foreground">Click to upload product photo</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">PNG, JPG or WEBP (Max 5MB)</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name *</Label>
              <Input 
                id="productName" 
                name="productName" 
                value={formData.productName} 
                onChange={handleInputChange}
                className={errors.productName && "border-destructive"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(v) => handleSelectChange('category', v)}>
                <SelectTrigger className={errors.category && "border-destructive"}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Input id="brand" name="brand" value={formData.brand} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU (Stock Keeping Unit) *</Label>
              <Input 
                id="sku" 
                name="sku" 
                value={formData.sku} 
                onChange={handleInputChange} 
                className={cn("font-mono", errors.sku && "border-destructive")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier *</Label>
              <Select value={formData.supplier} onValueChange={(v) => handleSelectChange('supplier', v)}>
                <SelectTrigger className={errors.supplier && "border-destructive"}>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map(s => (
                    <SelectItem key={s._id} value={s.supplierName || s.name}>
                      {s.supplierName || s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* QR Section */}
            <div className="space-y-2">
              <Label htmlFor="qrCode">QR Code Reference *</Label>
              <div className="flex gap-2">
                <Input 
                  id="qrCode" 
                  name="qrCode" 
                  value={formData.qrCode} 
                  onChange={handleInputChange}
                  className={cn("font-mono", errors.qrCode && "border-destructive")}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleSelectChange('qrCode', generateQRCode())}
                >
                  <QrCode className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Product Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              rows={4} 
              value={formData.description} 
              onChange={handleInputChange}
              placeholder="Enter product specifications or features..."
            />
          </div>

          {/* QR Preview Card */}
          {formData.qrCode && (
            <div className="flex items-center gap-4 p-4 rounded-xl border bg-muted/20">
              <div className="bg-white p-2 rounded-lg border shadow-sm">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(formData.qrCode)}`}
                  alt="QR"
                  className="w-16 h-16"
                />
              </div>
              <div>
                <p className="text-sm font-semibold">QR Preview</p>
                <p className="text-xs text-muted-foreground font-mono">{formData.qrCode}</p>
              </div>
            </div>
          )}

          </form>
        </DialogBody>

        <DialogFooter className="shrink-0 px-4 py-4 sm:px-6 border-t bg-muted/20">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" form="edit-product-form" disabled={isSubmitting} className="min-w-[140px]">
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditProductModal
