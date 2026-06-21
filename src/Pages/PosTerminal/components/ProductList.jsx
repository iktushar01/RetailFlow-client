import React, { useState } from 'react'
import { Search, Package, Plus, Edit3, Check, X, AlertTriangle } from 'lucide-react'
import Swal from 'sweetalert2'

import { Button } from "@/Components/UI/button"
import { Input } from "@/Components/UI/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/UI/select"
import { Badge } from "@/Components/UI/badge"
import { ScrollArea } from "@/Components/UI/scroll-area"
import { Card } from "@/Components/UI/card"

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

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))]
  const warehouses = [...new Set(inventory.map(i => i.location).filter(Boolean))]

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="shrink-0 space-y-2 border-b bg-muted/20 p-3 sm:p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search or scan barcode..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="h-10 pl-9 bg-background"
          />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Select value={filters.category || 'all'} onValueChange={(val) => onFilterChange('category', val === 'all' ? '' : val)}>
            <SelectTrigger className="h-10 bg-background">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.warehouse || 'all'} onValueChange={(val) => onFilterChange('warehouse', val === 'all' ? '' : val)}>
            <SelectTrigger className="h-10 bg-background">
              <SelectValue placeholder="All Warehouses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Warehouses</SelectItem>
              {warehouses.map(loc => (
                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-2 sm:gap-3 sm:p-4 xl:grid-cols-2">
          {products.length > 0 ? (
            products.map(product => {
              const stock = getProductStock(product._id)
              const price = product.sellingPrice || product.price || 0
              const isLowStock = stock <= 5 && stock > 0
              const outOfStock = stock === 0

              return (
                <Card
                  key={product._id}
                  className={`p-3 transition-colors ${outOfStock ? 'opacity-60' : 'hover:border-primary/40 active:border-primary/50'}`}
                >
                  <div className="flex gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={product.productImage || 'https://via.placeholder.com/60'}
                        alt={product.productName}
                        className="h-14 w-14 rounded-md border bg-muted object-cover sm:h-16 sm:w-16"
                      />
                      {isLowStock && (
                        <div className="absolute -right-1 -top-1 rounded-full bg-orange-500 p-0.5 text-white">
                          <AlertTriangle className="h-3 w-3" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="truncate text-sm font-semibold leading-tight">
                            {product.productName}
                          </h4>
                          {product.category && (
                            <span className="text-[11px] text-muted-foreground">{product.category}</span>
                          )}
                        </div>
                        <Badge
                          variant={stock > 0 ? "secondary" : "destructive"}
                          className="shrink-0 text-[10px]"
                        >
                          {stock}
                        </Badge>
                      </div>

                      <div className="mt-2 flex items-center justify-between gap-2">
                        {editingPrice === product._id ? (
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              inputMode="decimal"
                              value={tempPrice}
                              onChange={(e) => setTempPrice(e.target.value)}
                              className="h-9 w-24 text-sm"
                              autoFocus
                            />
                            <Button size="icon" variant="ghost" className="h-9 w-9" onClick={() => handlePriceSave(product)}>
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-9 w-9" onClick={() => setEditingPrice(null)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex min-w-0 items-center gap-1">
                            <span className="truncate text-sm font-bold text-primary">
                              BDT {price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 shrink-0 sm:opacity-70"
                              onClick={() => handlePriceEdit(product, price)}
                              aria-label="Edit price"
                            >
                              <Edit3 className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                          </div>
                        )}

                        <Button
                          size="icon"
                          variant={outOfStock ? "outline" : "default"}
                          disabled={outOfStock}
                          onClick={() => onAddToCart(product, price)}
                          className="h-10 w-10 shrink-0 touch-manipulation"
                          aria-label={`Add ${product.productName}`}
                        >
                          <Plus className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Package className="mb-3 h-12 w-12 opacity-20" />
              <p className="text-sm font-medium">No products match your search</p>
              <p className="mt-1 text-xs">Try a different keyword or filter</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

export default ProductList
