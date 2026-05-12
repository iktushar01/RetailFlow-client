import React from 'react'
import { CheckCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const GenerateAllModal = ({ 
  isOpen, 
  onClose, 
  selectedItems = [], 
  suppliers = [], 
  onConfirm 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Generate All Purchase Orders</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            You are about to generate purchase orders for {selectedItems.length} suggested items.
            Items will be grouped by supplier for efficient ordering.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <ScrollArea className="h-[300px] rounded-md border border-border p-4">
            <div className="space-y-3">
              {selectedItems.map((item, index) => {
                const supplier = suppliers.find(s => s._id === item.supplierId)
                return (
                  <React.Fragment key={index}>
                    <div className="flex items-center justify-between rounded-lg bg-muted/40 p-3 transition-colors hover:bg-muted/60">
                      <div className="space-y-1">
                        <div className="font-semibold leading-none">{item.productName}</div>
                        <div className="text-sm text-muted-foreground">
                          Supplier: <span className="text-foreground">{supplier?.name || 'Unknown'}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">Qty: {item.suggestedQty} units</div>
                        <div className="text-xs text-muted-foreground">
                          Value: BDT {item.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                    {index < selectedItems.length - 1 && <Separator className="opacity-50" />}
                  </React.Fragment>
                )
              })}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={onConfirm}
            className="w-full sm:w-auto"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Generate POs
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default GenerateAllModal