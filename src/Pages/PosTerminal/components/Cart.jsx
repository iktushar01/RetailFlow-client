import React, { useState } from 'react'
import { ShoppingCart, Plus, Minus, Trash2, Edit3, RotateCcw, Check, X, Receipt } from 'lucide-react'
import { Button } from "@/Components/UI/button"
import { Input } from "@/Components/UI/input"
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
  onRemoveDiscount,
  onCheckout,
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

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout()
    } else {
      window.dispatchEvent(new CustomEvent('openPaymentModal'))
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center justify-between border-b px-3 py-3 sm:px-4">
        <h2 className="flex items-center gap-2 text-base font-semibold">
          <ShoppingCart className="h-4 w-4 text-primary" />
          Cart ({cartItems.length})
        </h2>
        {cartItems.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearCart}
            className="h-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            Clear
          </Button>
        )}
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-3 p-3 sm:p-4">
          {cartItems.length > 0 ? (
            <>
              <DiscountSelector
                cartItems={cartItems}
                appliedDiscounts={appliedDiscounts || []}
                onApplyDiscount={onApplyDiscount}
                onRemoveDiscount={onRemoveDiscount}
              />

              <div className="space-y-2">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-lg border bg-background p-3"
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-medium">{item.productName}</h4>
                        {editingPrice === index ? (
                          <div className="mt-1.5 flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">BDT</span>
                            <Input
                              type="number"
                              inputMode="decimal"
                              value={tempPrice}
                              onChange={(e) => setTempPrice(e.target.value)}
                              className="h-9 w-24 text-sm"
                              autoFocus
                            />
                            <Button size="icon" variant="ghost" className="h-9 w-9" onClick={() => handlePriceSave(index)}>
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-9 w-9" onClick={() => setEditingPrice(null)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            <p className="text-xs text-muted-foreground">
                              BDT {item.unitPrice.toFixed(2)} × {item.quantity}
                            </p>
                            {item.isCustomPrice && (
                              <Badge variant="secondary" className="text-[10px]">Custom</Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handlePriceEdit(index, item.unitPrice)}
                              aria-label="Edit line price"
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                            {item.isCustomPrice && item.originalPrice && (
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onResetPrice(index)}>
                                <RotateCcw className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 shrink-0 text-destructive hover:bg-destructive/10"
                        onClick={() => onRemoveItem(index)}
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center rounded-md border bg-muted/30">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 touch-manipulation"
                          onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 touch-manipulation"
                          onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                          disabled={item.quantity >= item.availableStock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm font-bold text-primary sm:text-base">
                        BDT {(item.unitPrice * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <ShoppingCart className="mb-3 h-12 w-12 opacity-20" />
              <p className="text-sm font-medium">Your cart is empty</p>
              <p className="mt-1 text-xs">Tap + on a product to add it</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {cartItems.length > 0 && (
        <div className="shrink-0 space-y-3 border-t bg-muted/20 p-3 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:pb-4">
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">BDT {totals.subtotal.toFixed(2)}</span>
            </div>
            {totals.totalDiscount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Discount</span>
                <span className="font-medium text-green-600">-BDT {totals.totalDiscount.toFixed(2)}</span>
              </div>
            )}
            {totals.tax > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">BDT {totals.tax.toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total</span>
              <span className="text-lg font-bold text-primary sm:text-xl">
                BDT {totals.grandTotal.toFixed(2)}
              </span>
            </div>
          </div>

          <Button
            className="h-12 w-full touch-manipulation text-base font-semibold"
            onClick={handleCheckout}
          >
            <Receipt className="mr-2 h-5 w-5" />
            Checkout
          </Button>
        </div>
      )}
    </div>
  )
}

export default Cart
