import React from 'react'
import { 
  Tag, 
  Package, 
  User, 
  Hash, 
  Calendar, 
  FileText, 
  QrCode as QrIcon, 
  Info,
  ExternalLink
} from 'lucide-react'
import SharedModal from '../../../Shared/SharedModal/SharedModal'
import { Button } from '../../../Components/UI/button'
import { Badge } from "../../../Components/UI/badge"
import { cn } from "@/lib/utils"

const ViewProductModal = ({ isOpen, onClose, product }) => {
  if (!product) return null

  const modalFooter = (
    <div className="flex items-center justify-between w-full">
      <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
        Product ID: {product._id?.slice(-8) || 'N/A'}
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={onClose}
        className="px-8"
      >
        Close
      </Button>
    </div>
  )

  const InfoBlock = ({ icon: Icon, label, value, isMono = false, fullWidth = false }) => {
    return (
      <div className={cn("space-y-1.5", fullWidth && "md:col-span-2")}>
        <div className="flex items-center gap-2 text-muted-foreground">
          {Icon ? <Icon className="w-3.5 h-3.5" /> : null}
          <span className="text-[11px] font-bold uppercase tracking-wider">{label}</span>
        </div>
        <div className={cn(
          "px-4 py-3 rounded-xl border bg-muted/30 text-sm",
          isMono && "font-mono text-xs"
        )}>
          {value || <span className="text-muted-foreground/50 italic">Not provided</span>}
        </div>
      </div>
    )
  }

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-primary" />
          <span>Product Specifications</span>
        </div>
      }
      size="large"
      footer={modalFooter}
    >
      <div className="space-y-8 py-2">
        {/* Header Section: Image and Primary Title */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="relative group w-full md:w-1/3 shrink-0">
            <div className="aspect-square rounded-2xl overflow-hidden border bg-white shadow-inner flex items-center justify-center">
              <img
                src={product.productImage || 'https://via.placeholder.com/400'}
                alt={product.productName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <Badge className="absolute top-3 right-3 shadow-lg" variant="secondary">
              {product.category}
            </Badge>
          </div>

          <div className="flex-1 space-y-4 w-full">
            <div>
              <h2 className="text-3xl font-black tracking-tighter text-foreground mb-1 uppercase italic">
                {product.productName}
              </h2>
              <p className="text-muted-foreground flex items-center gap-2">
                <Hash className="w-4 h-4" />
                <span className="font-mono text-sm tracking-tight">{product.sku || 'NO-SKU-ASSIGNED'}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl border bg-primary/5">
                <p className="text-[10px] font-bold text-primary uppercase mb-1">Brand</p>
                <p className="font-semibold text-sm">{product.brand || 'Generic'}</p>
              </div>
              <div className="p-3 rounded-xl border bg-primary/5">
                <p className="text-[10px] font-bold text-primary uppercase mb-1">Supplier</p>
                <p className="font-semibold text-sm truncate">{product.supplier || 'N/A'}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-dashed bg-muted/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> System Log
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Registered on <span className="text-foreground font-medium">
                  {new Date(product.createdAt).toLocaleDateString('en-US', {
                    month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
          <InfoBlock 
            icon={FileText} 
            label="Product Description" 
            value={product.description} 
            fullWidth 
          />
          
          <div className="space-y-6">
             <InfoBlock 
              icon={QrIcon} 
              label="Identity String (QR Content)" 
              value={product.qrCode} 
              isMono 
            />
          </div>

          {/* QR Visual Card */}
          <div className="md:col-span-1 bg-card rounded-2xl border shadow-sm overflow-hidden flex flex-col items-center justify-center p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
            <div className="bg-white p-4 rounded-2xl shadow-xl border-4 border-white mb-4">
               <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(product.qrCode || '')}`}
                alt="QR Code"
                className="w-32 h-32"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect width="150" height="150" fill="%23f3f4f6"/%3E%3C/svg%3E'
                }}
              />
            </div>
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-tighter">Digital Asset Tag</p>
              <p className="text-[10px] text-muted-foreground italic">Scan to verify authenticity</p>
            </div>
          </div>
        </div>
      </div>
    </SharedModal>
  )
}

export default ViewProductModal
