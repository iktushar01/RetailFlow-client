import React from 'react'
import { 
  ArrowRightLeft, 
  Package, 
  MapPin, 
  Layers, 
  AlertCircle,
  TrendingDown,
  TrendingUp,
  Info
} from 'lucide-react'

// Shadcn UI Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/Components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select"
import { Input } from "@/Components/ui/input"
import { Button } from "@/Components/ui/button"
import { Badge } from "@/Components/ui/badge"
import { Separator } from "@/Components/ui/separator"
import { Alert, AlertDescription } from "@/Components/ui/alert"
import { Label } from "@/Components/ui/label"
import { Card } from "@/Components/ui/card"

// Utils
import { validateTransferForm } from '../utils/stockTransferHelpers'
import { toast } from "sonner"

const TransferModal = ({
  isOpen,
  onClose,
  selectedItem,
  warehouses,
  transferData,
  setTransferData,
  onSubmit,
  warehousesLoading
}) => {
  if (!selectedItem) return null

  const handleSubmit = (e) => {
    e.preventDefault()

    const validation = validateTransferForm(transferData, selectedItem.stockQty)
    if (!validation.isValid) {
      toast.warning('Validation Error', {
        description: validation.errors.join('\n')
      })
      return
    }

    onSubmit()
  }

  const remainingStock = selectedItem.stockQty - transferData.quantity

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl overflow-hidden p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <ArrowRightLeft className="w-6 h-6 text-primary" />
            Stock Transfer
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Header Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 bg-muted/30 border-dashed shadow-none">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-background rounded-lg border">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Selected Item</p>
                  <p className="font-bold text-sm truncate max-w-[200px]">{selectedItem.productName}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-muted/30 border-dashed shadow-none">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-background rounded-lg border text-emerald-600">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Available At Source</p>
                  <p className="font-bold text-sm">{selectedItem.stockQty} Units</p>
                </div>
              </div>
            </Card>
          </div>

          <Separator />

          {/* Logistics Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Source Warehouse
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input 
                  value={selectedItem.location} 
                  disabled 
                  className="pl-10 bg-muted/50 font-semibold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider">
                Destination Warehouse <span className="text-destructive">*</span>
              </Label>
              <Select
                value={transferData.destinationWarehouse}
                onValueChange={(val) => setTransferData({ ...transferData, destinationWarehouse: val })}
                disabled={warehousesLoading}
              >
                <SelectTrigger className="w-full font-medium">
                  <SelectValue placeholder="Select target location" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses
                    .filter(wh => wh.name !== selectedItem.location)
                    .map(wh => (
                      <SelectItem key={wh._id} value={wh.name}>
                        {wh.name}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs font-bold uppercase tracking-wider">
                Quantity to Move <span className="text-destructive">*</span>
              </Label>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Input
                    type="number"
                    value={transferData.quantity || ''}
                    onChange={(e) => setTransferData({ ...transferData, quantity: parseInt(e.target.value) || 0 })}
                    className="text-lg font-bold"
                    max={selectedItem.stockQty}
                  />
                  <Badge variant="secondary" className="absolute right-2 top-2 h-6">Units</Badge>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Remaining After</p>
                  <p className={`text-sm font-black ${remainingStock < 0 ? 'text-destructive' : 'text-foreground'}`}>
                    {remainingStock} Units
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Preview Section */}
          {transferData.destinationWarehouse && transferData.quantity > 0 && (
            <Card className="bg-primary/5 border-primary/20 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 text-center space-y-1">
                  <p className="text-[10px] font-bold text-primary uppercase">{selectedItem.location}</p>
                  <div className="flex items-center justify-center gap-1 text-destructive font-bold">
                    <TrendingDown className="w-4 h-4" />
                    <span>-{transferData.quantity}</span>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="h-px w-12 bg-primary/30" />
                  <ArrowRightLeft className="w-5 h-5 text-primary my-1" />
                  <div className="h-px w-12 bg-primary/30" />
                </div>

                <div className="flex-1 text-center space-y-1">
                  <p className="text-[10px] font-bold text-primary uppercase">{transferData.destinationWarehouse}</p>
                  <div className="flex items-center justify-center gap-1 text-emerald-600 font-bold">
                    <TrendingUp className="w-4 h-4" />
                    <span>+{transferData.quantity}</span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          <Alert className="bg-muted/50 border-none">
            <Info className="h-4 w-4 text-muted-foreground" />
            <AlertDescription className="text-[11px] text-muted-foreground leading-relaxed">
              This movement will be recorded in the global audit log. Ensure the physical stock movement 
              matches this digital entry to maintain inventory integrity.
            </AlertDescription>
          </Alert>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!transferData.destinationWarehouse || !transferData.quantity || transferData.quantity <= 0 || remainingStock < 0}
              className="px-8 font-bold shadow-lg shadow-primary/20"
            >
              Confirm Transfer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default TransferModal
