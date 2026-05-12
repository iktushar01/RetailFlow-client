import React from 'react'
import { Eye, Pencil, Trash2, Box, Tag, Calendar, User } from 'lucide-react'
import { Button } from '../../../Components/UI/Button'

const ProductCard = ({ product, onView, onEdit, onDelete }) => {
  return (
    <div className="group bg-card text-card-foreground rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Visual Header */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={product.productImage || 'https://via.placeholder.com/400'}
          alt={product.productName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Category Badge - Glass Effect */}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-primary/90 text-primary-foreground backdrop-blur-md shadow-sm">
            {product.category}
          </span>
        </div>

        {/* Quick View Overlay (Optional interaction) */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
           <Button 
            variant="secondary" 
            size="sm" 
            className="rounded-full h-9 px-4 gap-2"
            onClick={() => onView(product)}
          >
            <Eye className="w-4 h-4" /> Quick Look
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
            {product.productName}
          </h3>
          <p className="text-xs text-muted-foreground font-mono mt-1 opacity-70">
            {product.sku || 'NO-SKU'}
          </p>
        </div>
        
        <div className="space-y-2.5 mb-6 flex-grow">
          <div className="flex items-center text-sm text-muted-foreground gap-2">
            <Tag className="w-3.5 h-3.5" />
            <span className="truncate">{product.brand || 'Generic'}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground gap-2">
            <User className="w-3.5 h-3.5" />
            <span className="truncate">{product.supplier || 'Direct'}</span>
          </div>

          <div className="flex items-center text-[11px] text-muted-foreground/60 gap-2 font-mono bg-muted/50 p-1.5 rounded-md">
            <Box className="w-3 h-3" />
            <span className="truncate">QR: {product.qrCode}</span>
          </div>
        </div>

        {/* Date and Footer Actions */}
        <div className="mt-auto space-y-4">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground uppercase font-semibold tracking-tighter opacity-60">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(product.createdAt).toLocaleDateString()}
            </div>
            <span>Verified</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(product)}
              className="h-8 text-xs font-medium hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
            >
              <Pencil className="w-3.5 h-3.5 mr-1.5" />
              Edit
            </Button>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => onDelete(product)}
              className="h-8 text-xs font-medium hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard