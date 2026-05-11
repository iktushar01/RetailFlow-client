import React from 'react'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import Button from '../../../Components/UI/Button'

const ProductCard = ({ product, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Product Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <img
          src={product.productImage || 'https://via.placeholder.com/400'}
          alt={product.productName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-600 text-white shadow-lg">
            {product.category}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
          {product.productName}
        </h3>
        
        <div className="space-y-2 mb-4">
          {product.sku && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">SKU:</span> <span className="font-mono">{product.sku}</span>
            </p>
          )}
          {product.brand && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Brand:</span> {product.brand}
            </p>
          )}
          {product.supplier && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Supplier:</span> {product.supplier}
            </p>
          )}
          <p className="text-xs text-gray-500 font-mono">
            QR: {product.qrCode}
          </p>
          <p className="text-xs text-gray-400">
            Added: {new Date(product.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(product)}
            className="flex-1"
          >
            <div className='flex items-center'>
              <Eye className="w-4 h-4 mr-1" />
              View
            </div>
          </Button>
          <Button
            variant="edit"
            size="sm"
            onClick={() => onEdit(product)}
            className="flex-1"
          >
            <div className="flex items-center">
              <Pencil className="w-4 h-4 mr-1" />
              Edit
            </div>
          </Button>
          <Button 
            variant="delete"
            size="sm"
            onClick={() => onDelete(product)}
            className="flex-1"
          >
            <div className="flex items-center">
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard

