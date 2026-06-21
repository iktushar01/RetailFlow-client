import React from 'react'
import { Save, X, Warehouse, MapPin, Contact, Phone, Mail, Navigation } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/Components/UI/dialog"
import { Input } from "@/Components/UI/input"
import { Label } from "@/Components/UI/label"
import { Textarea } from "@/Components/UI/textarea"
import { Button } from "@/Components/UI/button"
import { Separator } from "@/Components/UI/separator"
import { validateWarehouseForm } from '../utils/warehouseHelpers'
import { toast } from "sonner"

/**
 * Warehouse Form Component refactored with Shadcn UI
 */
const WarehouseForm = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  editMode,
  loading
}) => {

  const handleSubmit = (e) => {
    e.preventDefault()

    const validation = validateWarehouseForm(formData)
    if (!validation.isValid) {
      toast.error('Validation Error', {
        description: validation.errors.join(', ')
      })
      return
    }

    onSubmit(formData)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent size="md" className="p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Warehouse className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="text-xl font-bold">
              {editMode ? 'Edit Warehouse' : 'Add New Warehouse'}
            </DialogTitle>
          </div>
          <DialogDescription>
            {editMode 
              ? 'Update existing warehouse details and contact information.' 
              : 'Register a new storage facility in your logistics network.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Warehouse Name */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider">
                Warehouse Name <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  placeholder="e.g. North Hub Distribution"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="font-medium"
                  required
                />
              </div>
            </div>

            {/* Location Tag */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-xs font-bold uppercase tracking-wider">
                Zone / Location <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="e.g. Sector 7"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Contact Person */}
            <div className="space-y-2">
              <Label htmlFor="contact" className="text-xs font-bold uppercase tracking-wider">
                Manager <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Contact className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="contact"
                  placeholder="Full name"
                  value={formData.contactPerson}
                  onChange={(e) => handleChange('contactPerson', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Navigation className="w-3 h-3" /> Physical Address
              </Label>
              <Textarea
                id="address"
                placeholder="Enter full physical address..."
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="resize-none min-h-[80px]"
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider">
                Phone <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider">
                Email <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="warehouse@company.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <Separator className="my-2" />

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={loading}
              className="font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="font-bold min-w-[120px] shadow-lg shadow-primary/20"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {editMode ? 'Update Warehouse' : 'Create Warehouse'}
                </div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default WarehouseForm

