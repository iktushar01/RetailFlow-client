import React, { useState } from 'react'
import { Search, Package, Plus, Edit3, Check, X, AlertTriangle } from 'lucide-react'
import Swal from 'sweetalert2'

// Shadcn UI Components
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select"
import { Badge } from "@/Components/ui/badge"
import { ScrollArea } from "@/Components/ui/scroll-area"
import { Card } from "@/Components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip"

const ProductList = ({ products, inventory, onAddToCart, onUpdateProductPrice, filters, onFilterChange }) => {
  const [editingPrice, setEditingPrice] = useState(null)
  const [tempPrice, setTempPrice] = useState('')

  const handlePriceEdit = (product, currentPrice) => {
    setEditingPrice(product._id)
    setTempPrice(currentPrice.toString())
  }

  const handlePriceSave = async (product) => {
    const newPrice = parseFloat(tempPrice)
    if (isNaN(newPrice) || newPrice < 0) {
      Swal.fire('Invalid Price', 'Please enter a valid price', 'error')
      return
    }

    try {
      if (onUpdateProductPrice) {
        await onUpdateProductPrice(product._id, newPrice)
        Swal.fire({ title: 'Updated', icon: 'success', timer: 1000, showConfirmButton: false })
      }
      setEditingPrice(null)
      setTempPrice('')
    } catch (error) {
      Swal.fire('Error', error.message, 'error')
    }
  }

  const getProductStock = (productId) => {
    const inventoryItems = inventory.filter(item => item.productId === productId)
    const totalStock = inventoryItems.reduce((sum, item) => sum + (parseFloat(item.stockQty) || 0), 0)
    return Math.max(0, totalStock)
  }

  return (
    <div className="bg-background rounded-xl border shadow-sm h-full flex flex-col overflow-hidden">
      {/* Search and Filters */}
      <div className="p-4 border-b bg-muted/20 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search product or scan barcode..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Select value={filters.category} onValueChange={(val) => onFilterChange('category', val)}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {[...new Set(products.map(p => p.category))].map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.warehouse} onValueChange={(val) => onFilterChange('warehouse', val)}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="All Warehouses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Warehouses</SelectItem>
              {[...new Set(inventory.map(i => i.location))].filter(Boolean).map(loc => (
                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Grid */}
      <ScrollArea className="flex-1">
        <div className="p-4 grid gap-3">
          {products.length > 0 ? (
            products.map(product => {
              const stock = getProductStock(product._id)
              const price = product.sellingPrice || product.price || 0
              const isLowStock = stock <= 5 && stock > 0
              
              return (
                <Card key={product._id} className="p-3 transition-all hover:border-primary/50 group">
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <img
                        src={product.productImage || 'https://via.placeholder.com/60'}
                        alt={product.productName}
                        className="w-14 h-14 object-cover rounded-md border bg-muted"
                      />
                      {isLowStock && (
                        <div className="absolute -top-2 -right-2 bg-orange-500 text-white p-1 rounded-full shadow-sm">
                          <AlertTriangle className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-sm leading-none mb-1 truncate">
                            {product.productName}
                          </h4>
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                            {product.category}
                          </span>
                        </div>
                        <Badge 
                          variant={stock > 0 ? "secondary" : "destructive"} 
                          className="text-[10px] px-1.5 h-5"
                        >
                          Stock: {stock}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          {editingPrice === product._id ? (
                            <div className="flex items-center gap-1 animate-in fade-in zoom-in-95 duration-200">
                              <Input
                                type="number"
                                value={tempPrice}
                                onChange={(e) => setTempPrice(e.target.value)}
                                className="h-7 w-20 text-xs px-2"
                                autoFocus
                              />
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-green-600" onClick={() => handlePriceSave(product)}>
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => setEditingPrice(null)}>
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-bold text-primary">
                                BDT {price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handlePriceEdit(product, price)}
                              >
                                <Edit3 className="w-3 h-3 text-muted-foreground" />
                              </Button>
                            </div>
                          )}
                        </div>

                        <Button
                          size="sm"
                          variant={stock === 0 ? "outline" : "default"}
                          disabled={stock === 0}
                          onClick={() => onAddToCart(product, price)}
                          className="h-8 w-8 p-0 shrink-0"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Package className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm font-medium">No products match your search</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

export default ProductList
