import React from 'react'
import { X, Plus, PackageOpen, AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { validateItem } from '../utils/poHelpers'
import { cn } from "@/lib/utils"

const POItemsTable = ({ items, products, onAddItem, onRemoveItem, onItemChange, hasAttemptedSubmit }) => {
  
  const handleProductSelect = (itemId, productId) => {
    const selectedProduct = products.find(p => p._id === productId)
    if (selectedProduct) {
      onItemChange(itemId, 'product', productId)
      onItemChange(itemId, 'productName', selectedProduct.productName || selectedProduct.name)
      onItemChange(itemId, 'unitPrice', selectedProduct.price || selectedProduct.unitPrice || 0)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-base font-bold flex items-center gap-2">
          Order Items <span className="text-destructive">*</span>
        </Label>
        <Button
          variant="secondary"
          size="sm"
          onClick={onAddItem}
          type="button"
          className="h-8 gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      <div className="rounded-md border border-border bg-background">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[350px]">Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit Price (BDT)</TableHead>
              <TableHead>Subtotal</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <PackageOpen className="h-10 w-10 mb-2 opacity-20" />
                    <p className="font-medium">No items added yet</p>
                    <p className="text-xs">Start building your purchase order by adding a product.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => {
                const validation = validateItem(item)
                const isProductInvalid = hasAttemptedSubmit && !validation.isValid && !item.product

                return (
                  <TableRow key={item.id} className="group transition-colors hover:bg-muted/30">
                    <TableCell>
                      <div className="space-y-1">
                        <Select
                          value={item.product || undefined}
                          onValueChange={(val) => handleProductSelect(item.id, val)}
                        >
                          <SelectTrigger className={cn(
                            "bg-background",
                            isProductInvalid && "border-destructive ring-destructive/20"
                          )}>
                            <SelectValue placeholder={products.length === 0 ? "No products available" : "Select Product..."} />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map(product => (
                              <SelectItem key={product._id} value={product._id}>
                                {product.productName || product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {isProductInvalid && (
                          <p className="text-[10px] font-bold text-destructive flex items-center gap-1 uppercase">
                            <AlertCircle className="w-3 h-3" /> Required
                          </p>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity || ''}
                        onChange={(e) => onItemChange(item.id, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 bg-background"
                      />
                    </TableCell>

                    <TableCell>
                      <div className="relative">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice || ''}
                          onChange={(e) => onItemChange(item.id, 'unitPrice', Math.max(0, parseFloat(e.target.value) || 0))}
                          className="w-32 bg-background pl-10"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">
                          BDT
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="font-mono font-bold text-foreground">
                        {(item.subtotal || 0).toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {items.length > 0 && (
        <div className="flex items-center gap-2 px-1 text-xs text-muted-foreground font-medium uppercase tracking-wider">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
            {items.length}
          </span>
          item{items.length !== 1 ? 's' : ''} in this order
        </div>
      )}
    </div>
  )
}

export default POItemsTable