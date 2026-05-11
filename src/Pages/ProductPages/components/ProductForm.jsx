import React from 'react'
import Button from '../../../Components/UI/Button'
import AddCategoryModal from './AddCategoryModal'

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
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Product Information Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
            Product Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Product Name */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700" htmlFor="productName">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                id="productName"
                name="productName"
                type="text"
                placeholder="e.g. Samsung Galaxy S24"
                value={formData.productName}
                onChange={onInputChange}
                className={`block w-full rounded-xl border ${errors.productName ? 'border-red-500' : 'border-gray-300'} hover:border-gray-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3.5 py-2.5 text-sm placeholder-gray-400`}
              />
              {errors.productName && (
                <p className="text-xs text-red-600">{errors.productName}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700" htmlFor="category">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={onInputChange}
                  className={`block w-full rounded-xl border ${errors.category ? 'border-red-500' : 'border-gray-300'} hover:border-gray-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3.5 py-2.5 text-sm placeholder-gray-400`}
                >
                  <option value="">Select Category...</option>
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onCategoryModalOpen}
                  className="whitespace-nowrap"
                >
                  + Add
                </Button>
              </div>
              {errors.category && (
                <p className="text-xs text-red-600">{errors.category}</p>
              )}
            </div>

            {/* Brand */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700" htmlFor="brand">
                Brand <span className="text-red-500">*</span>
              </label>
              <input
                id="brand"
                name="brand"
                type="text"
                placeholder="e.g. Samsung"
                value={formData.brand}
                onChange={onInputChange}
                className={`block w-full rounded-xl border ${errors.brand ? 'border-red-500' : 'border-gray-300'} hover:border-gray-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3.5 py-2.5 text-sm placeholder-gray-400`}
              />
              {errors.brand && (
                <p className="text-xs text-red-600">{errors.brand}</p>
              )}
            </div>

            {/* SKU */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700" htmlFor="sku">
                SKU <span className="text-red-500">*</span>
              </label>
              <input
                id="sku"
                name="sku"
                type="text"
                placeholder="e.g. SAM-GAL-S24-128"
                value={formData.sku}
                onChange={onInputChange}
                className={`block w-full rounded-xl border ${errors.sku ? 'border-red-500' : 'border-gray-300'} hover:border-gray-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3.5 py-2.5 text-sm placeholder-gray-400`}
              />
              {errors.sku && (
                <p className="text-xs text-red-600">{errors.sku}</p>
              )}
            </div>

            {/* Supplier */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700" htmlFor="supplier">
                Supplier <span className="text-red-500">*</span>
              </label>
              <select
                id="supplier"
                name="supplier"
                value={formData.supplier}
                onChange={onInputChange}
                className={`block w-full rounded-xl border ${errors.supplier ? 'border-red-500' : 'border-gray-300'} hover:border-gray-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3.5 py-2.5 text-sm placeholder-gray-400`}
              >
                <option value="">Select Supplier...</option>
                {suppliers.map((supplier) => (
                  <option key={supplier._id} value={supplier.supplierName}>
                    {supplier.supplierName}
                  </option>
                ))}
              </select>
              {errors.supplier && (
                <p className="text-xs text-red-600">{errors.supplier}</p>
              )}
            </div>

            {/* Description - Full Width */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-sm font-semibold text-gray-700" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Enter product description..."
                value={formData.description}
                onChange={onInputChange}
                className="block w-full rounded-xl border border-gray-300 hover:border-gray-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3.5 py-2.5 text-sm placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* QR Code & Image Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* QR Code */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
              QR Code <span className="text-red-500">*</span>
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg h-64">
                {formData.qrCode ? (
                  <div className="text-center p-6">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(formData.qrCode)}`}
                      alt="QR Code"
                      className="mx-auto mb-3"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="180" height="180"%3E%3Crect width="180" height="180" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="14"%3EQR Error%3C/text%3E%3C/svg%3E'
                      }}
                    />
                    <p className="text-xs text-gray-600 font-mono break-all max-w-full">{formData.qrCode}</p>
                  </div>
                ) : (
                  <div className="text-center p-6">
                    <div className="w-44 h-44 mx-auto mb-3 bg-gray-200 rounded-lg flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-500">Click button below to generate QR code</p>
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onGenerateQRCode}
                className="w-full"
              >
                {formData.qrCode ? 'Regenerate QR Code' : 'Generate QR Code'}
              </Button>
              {errors.qrCode && (
                <p className="text-xs text-red-600">{errors.qrCode}</p>
              )}
            </div>
          </div>

          {/* Product Image */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
              Product Image <span className="text-red-500">*</span>
            </h3>
            <div className="space-y-3">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Product Preview"
                    className="w-full h-64 object-cover rounded-lg border-2 border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => onImageChange({ target: { files: [] } })}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    Preview only - will upload on submit
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 5MB)</p>
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
              {errors.productImage && (
                <p className="text-xs text-red-600">{errors.productImage}</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            {isSubmitting ? 'Adding Product...' : 'Add Product'}
          </Button>
        </div>
      </form>

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={onCategoryModalClose}
        onCategoryAdded={onCategoryAdded}
      />
    </>
  )
}

export default ProductForm

