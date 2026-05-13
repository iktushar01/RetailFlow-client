import React, { useState } from 'react'
import { ShoppingCart, Plus, Minus, Trash2, Edit3, RotateCcw, Check, X } from 'lucide-react'
import { Button } from "@/Components/UI/button"
import { Input } from "@/Components/UI/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/Components/UI/card"
import { ScrollArea } from "@/Components/UI/scroll-area"
import { Separator } from "@/Components/UI/separator"
import { Badge } from "@/Components/UI/badge"
import DiscountSelector from './DiscountSelector'
import Swal from 'sweetalert2'

const Cart = ({ 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart, 
  onUpdatePrice, 
  onResetPrice, 
  totals,
  appliedDiscounts,
  onApplyDiscount,
  onRemoveDiscount
}) => {
  const [editingPrice, setEditingPrice] = useState(null)
  const [tempPrice, setTempPrice] = useState('')

  const handlePriceEdit = (index, currentPrice) => {
    setEditingPrice(index)
    setTempPrice(currentPrice.toString())
  }

  const handlePriceSave = (index) => {
    const newPrice = parseFloat(tempPrice)
    if (isNaN(newPrice) || newPrice < 0) {
      Swal.fire('Invalid Price', 'Please enter a valid price', 'error')
      return
    }
    onUpdatePrice(index, newPrice)
    setEditingPrice(null)
  }

  return (
    <Card className="h-full flex flex-col shadow-sm border-border bg-card">
      <CardHeader className="px-4 py-4 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <ShoppingCart className="w-5 h-5 text-primary" />
          Cart ({cartItems.length})
        </CardTitle>
        {cartItems.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearCart}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8"
          >
            Clear All
          </Button>
        )}
      </CardHeader>
      
      <Separator />

      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full p-4">
          {cartItems.length > 0 ? (
            <div className="space-y-4">
              <DiscountSelector
                cartItems={cartItems}
                appliedDiscounts={appliedDiscounts || []}
                onApplyDiscount={onApplyDiscount}
                onRemoveDiscount={onRemoveDiscount}
              />
              
              <div className="space-y-3">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="group border border-border rounded-lg p-3 hover:border-primary/50 transition-colors bg-background"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0 mr-2">
                        <h4 className="font-medium text-sm truncate">{item.productName}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          {editingPrice === index ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold text-muted-foreground">BDT</span>
                              <Input
                                type="number"
                                value={tempPrice}
                                onChange={(e) => setTempPrice(e.target.value)}
                                className="w-20 h-7 text-xs px-2"
                                autoFocus
                              />
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-green-600" onClick={() => handlePriceSave(index)}>
                                <Check className="w-3.5 h-3.5" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => setEditingPrice(null)}>
                                <X className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-muted-foreground">
                                BDT {item.unitPrice.toFixed(2)} × {item.quantity}
                              </p>
                              {item.isCustomPrice && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400">
                                  Custom
                                </Badge>
                              )}
                              <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handlePriceEdit(index, item.unitPrice)}>
                                <Edit3 className="w-3 h-3" />
                              </Button>
                              {item.isCustomPrice && item.originalPrice && (
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onResetPrice(index)}>
                                  <RotateCcw className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => onRemoveItem(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-input rounded-md bg-muted/30">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-none"
                          onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-none"
                          onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                          disabled={item.quantity >= item.availableStock}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="font-bold text-primary">
                        BDT {(item.unitPrice * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <ShoppingCart className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm font-medium">Your cart is empty</p>
              <p className="text-xs">Add products to get started</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>

      {cartItems.length > 0 && (
        <CardFooter className="flex-col p-4 bg-muted/20 border-t border-border">
          <div className="w-full space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">BDT {totals.subtotal.toFixed(2)}</span>
            </div>
            {totals.totalDiscount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span className="font-medium text-green-600">-BDT {totals.totalDiscount.toFixed(2)}</span>
              </div>
            )}
            {totals.tax > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">BDT {totals.tax.toFixed(2)}</span>
              </div>
            )}
            <Separator className="my-2" />
            <div className="flex justify-between items-center">
              <span className="text-base font-bold">Total</span>
              <span className="text-xl font-bold text-primary">BDT {totals.grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <Button 
            className="w-full h-12 text-base font-bold shadow-lg"
            onClick={() => window.dispatchEvent(new CustomEvent('openPaymentModal'))}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Proceed to Checkout
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

export default Cart

