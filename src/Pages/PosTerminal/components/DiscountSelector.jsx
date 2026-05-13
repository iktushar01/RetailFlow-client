import React, { useState, useEffect } from 'react'
import { Tag, X, Check, AlertCircle, Loader2, ChevronDown } from 'lucide-react'
import { Button } from "@/Components/UI/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/UI/popover"
import { Badge } from "@/Components/UI/badge"
import { ScrollArea } from "@/Components/UI/scroll-area"
import { Separator } from "@/Components/UI/separator"
import { discountsAPI } from '../services/posService'
import { getApplicableDiscounts, isDiscountApplicable } from '../utils/posHelpers'
import Swal from 'sweetalert2'

const DiscountSelector = ({ cartItems, appliedDiscounts, onApplyDiscount, onRemoveDiscount }) => {
  const [availableDiscounts, setAvailableDiscounts] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetchDiscounts()
  }, [])

  const fetchDiscounts = async () => {
    setLoading(true)
    try {
      const discounts = await discountsAPI.getActive()
      setAvailableDiscounts(discounts)
    } catch (error) {
      console.error('Error fetching discounts:', error)
      Swal.fire('Error', 'Failed to load discounts', 'error')
    } finally {
      setLoading(false)
    }
  }

  const applicableDiscounts = getApplicableDiscounts(availableDiscounts, cartItems)

  const handleApplyDiscount = (discount) => {
    if (appliedDiscounts.some(applied => applied._id === discount._id)) {
      Swal.fire('Already Applied', 'This discount is already applied', 'info')
      return
    }

    if (!isDiscountApplicable(discount, cartItems)) {
      Swal.fire('Not Applicable', 'Criteria not met for this discount', 'warning')
      return
    }

    onApplyDiscount(discount)
    setOpen(false)
    Swal.fire({
      title: 'Applied!',
      text: `"${discount.offerName}" applied`,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    })
  }

  const getDiscountValue = (discount) => {
    return discount.type === 'Percentage' ? `${discount.value}%` : `BDT ${discount.value}`
  }

  const getDiscountDescription = (discount) => {
    if (discount.applicableProducts?.length > 0) return 'Specific products'
    if (discount.applicableCategories?.length > 0) return 'Specific categories'
    return 'All items'
  }

  return (
    <div className="space-y-4">
      {/* Applied Discounts Section */}
      {appliedDiscounts.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <Tag className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Applied Discounts
            </span>
          </div>
          <div className="grid gap-2">
            {appliedDiscounts.map((discount) => (
              <div
                key={discount._id}
                className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-lg p-2.5 transition-all animate-in fade-in slide-in-from-top-1"
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{discount.offerName}</span>
                    <Badge variant="success" className="h-5 px-1.5 text-[10px]">
                      -{getDiscountValue(discount)}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {getDiscountDescription(discount)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:bg-destructive/10"
                  onClick={() => onRemoveDiscount(discount._id)}
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selector Trigger */}
      <div className="flex flex-col gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between bg-background border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 h-10"
              disabled={loading}
            >
              <div className="flex items-center gap-2">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : (
                  <Tag className="h-4 w-4 text-primary" />
                )}
                <span className="text-sm font-medium">
                  {loading ? "Fetching deals..." : "Apply Discount Offer"}
                </span>
              </div>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          
          <PopoverContent className="w-[300px] p-0" align="start">
            <div className="p-3 border-b bg-muted/30">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Tag className="w-4 h-4" /> Available Offers
              </h4>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Eligible based on your current cart
              </p>
            </div>
            
            <ScrollArea className="h-[280px]">
              {applicableDiscounts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                  <AlertCircle className="w-8 h-8 text-muted-foreground/30 mb-2" />
                  <p className="text-sm font-medium text-muted-foreground">No eligible discounts</p>
                  <p className="text-[11px] text-muted-foreground/60 mt-1">
                    Try adding more items to unlock specific offers
                  </p>
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {applicableDiscounts.map((discount) => {
                    const isApplied = appliedDiscounts.some(a => a._id === discount._id);
                    return (
                      <button
                        key={discount._id}
                        disabled={isApplied}
                        onClick={() => handleApplyDiscount(discount)}
                        className={`w-full text-left p-3 rounded-md transition-colors flex flex-col gap-1 border border-transparent ${
                          isApplied 
                            ? "bg-muted/50 cursor-not-allowed opacity-60" 
                            : "hover:bg-primary/5 hover:border-primary/20"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-sm font-bold">{discount.offerName}</span>
                          <span className="text-xs font-bold text-primary">
                            -{getDiscountValue(discount)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground italic">
                            {getDiscountDescription(discount)}
                          </span>
                          {isApplied && (
                            <Badge variant="outline" className="text-[9px] h-4 py-0">Applied</Badge>
                          )}
                        </div>
                        {discount.code && (
                          <div className="mt-1 text-[9px] font-mono bg-muted px-1.5 py-0.5 rounded self-start">
                            CODE: {discount.code}
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </ScrollArea>
            <Separator />
            <div className="p-2">
              <Button variant="ghost" size="sm" className="w-full text-[11px] h-8" onClick={() => fetchDiscounts()}>
                Refresh Discounts
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

export default DiscountSelector

