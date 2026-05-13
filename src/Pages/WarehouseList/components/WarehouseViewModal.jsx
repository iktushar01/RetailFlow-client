import React from 'react'
import { 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Package, 
  Layers, 
  Building2,
  ExternalLink 
} from 'lucide-react'

// Shadcn UI Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog"
import { Badge } from "@/Components/ui/badge"
import { Separator } from "@/Components/ui/separator"
import { Card, CardContent } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"

/**
 * Warehouse View Modal refactored with Shadcn UI
 */
const WarehouseViewModal = ({ isOpen, onClose, warehouse }) => {
  if (!warehouse) return null

  const InfoRow = ({ icon: Icon, label, value, colorClass = "text-primary" }) => (
    <div className="flex items-center gap-4 py-3">
      <div className={`w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0`}>
        <Icon className={`w-4 h-4 ${colorClass}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-none mb-1">
          {label}
        </p>
        <p className="text-sm font-semibold truncate text-foreground">
          {value || 'Not Specified'}
        </p>
      </div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl">
        {/* Decorative Header Banner */}
        <div className="h-24 bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b relative">
          <div className="absolute -bottom-6 left-6 p-3 bg-background rounded-xl border shadow-sm">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="px-6 pt-10 pb-6 space-y-6">
          {/* Title Section */}
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl font-black tracking-tight mb-1">
                {warehouse.name}
              </DialogTitle>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">{warehouse.location}</span>
              </div>
            </div>
            <Badge variant="outline" className="px-3 py-1 border-primary/20 bg-primary/5 text-primary font-bold">
              Active Facility
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Stock Analytics Card */}
            <Card className="bg-muted/30 border-none shadow-none">
              <CardContent className="p-4 space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">
                  Inventory Overview
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold">
                      <Package className="w-4 h-4" />
                      <span className="text-xl">{warehouse.totalProducts || 0}</span>
                    </div>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase">Unique SKUs</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-blue-600 font-bold">
                      <Layers className="w-4 h-4" />
                      <span className="text-xl">{warehouse.totalStock || 0}</span>
                    </div>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase">Total Units</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Card */}
            <Card className="bg-muted/30 border-none shadow-none">
              <CardContent className="p-4 space-y-1">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Physical Location
                  </p>
                  <Button variant="ghost" size="icon" className="h-5 w-5 opacity-50">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs font-medium leading-relaxed italic text-foreground/80">
                  {warehouse.address || 'Address not listed in records.'}
                </p>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Contact Information Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
              Management Contact
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <InfoRow 
                icon={User} 
                label="Manager" 
                value={warehouse.contactPerson} 
              />
              <InfoRow 
                icon={Phone} 
                label="Direct Line" 
                value={warehouse.phone} 
              />
              <InfoRow 
                icon={Mail} 
                label="Email" 
                value={warehouse.email} 
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default WarehouseViewModal
