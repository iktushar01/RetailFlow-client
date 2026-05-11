import React from 'react'
import SharedModal from '../../../Shared/SharedModal/SharedModal'
import Button from '../../../Components/UI/Button'

const ViewProductModal = ({ isOpen, onClose, product }) => {
  if (!product) return null

  const modalFooter = (
    <div className="flex justify-end">
      <Button
        variant="secondary"
        size="md"
        onClick={onClose}
      >
        Close
      </Button>
    </div>
  )

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Product Details"
      size="large"
      footer={modalFooter}
    >
      <div className="space-y-6">
        {/* Product Image */}
        {product.productImage && (
          <div className="flex justify-center">
            <img
              src={product.productImage}
              alt={product.productName}
              className="max-w-full h-64 object-contain rounded-lg border-2 border-gray-200"
            />
          </div>
        )}

        {/* Product Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Product Name</label>
            <p className="text-base text-gray-900 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
              {product.productName}
            </p>
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Category</label>
            <p className="text-base text-gray-900 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {product.category}
              </span>
            </p>
          </div>

          {/* Brand */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Brand</label>
            <p className="text-base text-gray-900 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
              {product.brand || 'N/A'}
            </p>
          </div>

          {/* SKU */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">SKU</label>
            <p className="text-base text-gray-900 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 font-mono">
              {product.sku || 'N/A'}
            </p>
          </div>

          {/* Supplier */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Supplier</label>
            <p className="text-base text-gray-900 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
              {product.supplier || 'N/A'}
            </p>
          </div>

          {/* QR Code */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">QR Code</label>
            <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
              <p className="text-sm font-mono text-gray-900 break-all">{product.qrCode}</p>
            </div>
          </div>

          {/* Created Date */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Created Date</label>
            <p className="text-base text-gray-900 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
              {new Date(product.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          {/* Description - Full Width */}
          {product.description && (
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">Description</label>
              <p className="text-base text-gray-900 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          )}
        </div>

        {/* QR Code Preview */}
        {product.qrCode && (
          <div className="flex flex-col items-center space-y-3 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <label className="text-sm font-semibold text-gray-700">QR Code Preview</label>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(product.qrCode)}`}
              alt="QR Code"
              className="border-2 border-gray-300 rounded-lg p-2 bg-white"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="14"%3EQR Error%3C/text%3E%3C/svg%3E'
              }}
            />
            <p className="text-xs text-gray-500">Scan to view product details</p>
          </div>
        )}
      </div>
    </SharedModal>
  )
}

export default ViewProductModal

