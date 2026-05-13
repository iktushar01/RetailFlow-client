import React from 'react'
import { 
  Plus, 
  Image as ImageIcon, 
  QrCode, 
  Info, 
  X, 
  Upload, 
  Loader2, 
  Package 
} from 'lucide-react'
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
import AddCategoryModal from './AddCategoryModal'
import { cn } from "@/lib/utils"

const ProductForm = ({
  formData,
  errors,
  categories,
  suppliers,
  imagePreview,
  isSubmitting,
  isCategoryModalOpen,
  onInputChange,
  onImageChange,
  onGenerateQRCode,
  onSubmit,
  onCancel,
  onCategoryModalOpen,
  onCategoryModalClose,
  onCategoryAdded
}) => {
  return (
    <>
      <form onSubmit={onSubmit} className="space-y-8 max-w-4xl mx-auto">
        {/* Product Information Section */}
        <div className="bg-card p-6 rounded-xl border shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Info className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold tracking-tight">General Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name <span className="text-destructive">*</span></Label>
              <Input
                id="productName"
                name="productName"
                placeholder="e.g. Samsung Galaxy S24"
                value={formData.productName}
                onChange={onInputChange}
                className={errors.productName && "border-destructive focus-visible:ring-destructive"}
              />
              {errors.productName && (
                <p className="text-[10px] font-medium text-destructive uppercase tracking-wider">{errors.productName}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category <span className="text-destructive">*</span></Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => onInputChange({ target: { name: 'category', value } })}
                  >
                    <SelectTrigger className={errors.category && "border-destructive"}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat, idx) => (
                        <SelectItem key={idx} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={onCategoryModalOpen}
                  className="shrink-0"
                  title="Add New Category"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {errors.category && (
                <p className="text-[10px] font-medium text-destructive uppercase tracking-wider">{errors.category}</p>
              )}
            </div>

            {/* Brand */}
            <div className="space-y-2">
              <Label htmlFor="brand">Brand <span className="text-destructive">*</span></Label>
              <Input
                id="brand"
                name="brand"
                placeholder="e.g. Samsung"
                value={formData.brand}
                onChange={onInputChange}
                className={errors.brand && "border-destructive"}
              />
            </div>

            {/* SKU */}
            <div className="space-y-2">
              <Label htmlFor="sku">SKU <span className="text-destructive">*</span></Label>
              <Input
                id="sku"
                name="sku"
                placeholder="SAM-GAL-S24"
                value={formData.sku}
                onChange={onInputChange}
                className={cn("font-mono", errors.sku && "border-destructive")}
              />
            </div>

            {/* Supplier */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="supplier">Supplier <span className="text-destructive">*</span></Label>
              <Select 
                value={formData.supplier} 
                onValueChange={(value) => onInputChange({ target: { name: 'supplier', value } })}
              >
                <SelectTrigger className={errors.supplier && "border-destructive"}>
                  <SelectValue placeholder="Select a supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier._id} value={supplier.supplierName}>
                      {supplier.supplierName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Key specifications, warranty info, etc..."
                value={formData.description}
                onChange={onInputChange}
                className="resize-none"
              />
            </div>
          </div>
        </div>

        {/* Assets Section (QR & Image) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* QR Code Card */}
          <div className="bg-card p-6 rounded-xl border shadow-sm flex flex-col">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b">
              <QrCode className="w-5 h-5 text-primary" />
              <h3 className="text-base font-bold tracking-tight">Identity (QR)</h3>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center bg-muted/30 rounded-lg border-2 border-dashed min-h-[240px] p-4 text-center">
              {formData.qrCode ? (
                <div className="space-y-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm border inline-block">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(formData.qrCode)}`}
                      alt="QR Code"
                      className="w-40 h-40"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground font-mono break-all max-w-[200px] leading-tight">
                    {formData.qrCode}
                  </p>
                </div>
              ) : (
                <div className="text-muted-foreground/60 space-y-2">
                  <QrCode className="w-12 h-12 mx-auto stroke-[1.5]" />
                  <p className="text-xs">No QR Code generated yet</p>
                </div>
              )}
            </div>
            
            <Button
              type="button"
              variant="secondary"
              className="mt-4 w-full"
              onClick={onGenerateQRCode}
            >
              {formData.qrCode ? 'Regenerate Code' : 'Generate Identity'}
            </Button>
          </div>

          {/* Product Image Card */}
          <div className="bg-card p-6 rounded-xl border shadow-sm flex flex-col">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b">
              <ImageIcon className="w-5 h-5 text-primary" />
              <h3 className="text-base font-bold tracking-tight">Product Media</h3>
            </div>

            <div className="flex-1">
              {imagePreview ? (
                <div className="relative h-full min-h-[240px] group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg border shadow-inner"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => onImageChange({ target: { files: [] } })}
                    className="absolute top-2 right-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-[10px] py-1.5 text-center rounded-b-lg backdrop-blur-sm">
                    Upload scheduled on save
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-full min-h-[240px] border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center justify-center p-6 text-center space-y-2">
                    <Upload className="w-10 h-10 text-muted-foreground/60" />
                    <p className="text-sm font-medium text-muted-foreground">Select Product Photo</p>
                    <p className="text-[10px] text-muted-foreground/50">WEBP, PNG, JPG up to 5MB</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={onImageChange}
                    disabled={isSubmitting}
                  />
                </label>
              )}
            </div>
            {errors.productImage && (
              <p className="text-[10px] font-medium text-destructive uppercase tracking-wider mt-2">{errors.productImage}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 p-6 bg-muted/20 rounded-xl border border-dashed">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="px-8"
          >
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finalizing...</>
            ) : (
              <><Package className="mr-2 h-4 w-4" /> Add Product</>
            )}
          </Button>
        </div>
      </form>

      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={onCategoryModalClose}
        onCategoryAdded={onCategoryAdded}
      />
    </>
  )
}

export default ProductForm
