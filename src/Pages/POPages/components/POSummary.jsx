import React from 'react'
import { Calculator, Receipt, DollarSign, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatCurrency } from '../utils/poHelpers'
import { cn } from "@/lib/utils"

const POSummary = ({ subtotal, taxAmount, total, taxRate, onTaxRateChange }) => {
  return (
    <Card className="border-2 border-primary/10 bg-card shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          Order Summary
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Subtotal Row */}
        <div className="flex justify-between items-center py-1">
          <span className="text-sm font-medium text-muted-foreground">Subtotal</span>
          <span className="font-bold text-foreground">
            {formatCurrency(subtotal)}
          </span>
        </div>
        
        {/* Tax Rate Row */}
        <div className="flex justify-between items-center py-2 border-y border-dashed border-border">
          <div className="flex items-center gap-3">
            <Label className="text-sm font-medium text-muted-foreground">Tax Rate</Label>
            <div className="relative flex items-center">
              <Input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={taxRate}
                onChange={(e) => onTaxRateChange(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                className="w-20 h-8 px-2 pr-6 text-center font-bold text-xs bg-background"
              />
              <span className="absolute right-2 text-[10px] font-bold text-muted-foreground">%</span>
            </div>
          </div>
          <span className="font-bold text-foreground">
            {formatCurrency(taxAmount)}
          </span>
        </div>
        
        {/* Total Row */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-base font-bold text-foreground flex items-center gap-2">
            <Receipt className="w-4 h-4 text-primary" />
            Total Amount
          </span>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-black text-primary tracking-tight">
              {formatCurrency(total)}
            </span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              BDT Current
            </span>
          </div>
        </div>

        {/* Informational Footer */}
        <div className="mt-4 flex gap-2 p-3 bg-primary/5 border border-primary/10 rounded-lg">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            <span className="font-bold text-primary">Note:</span> Tax adjustments affect the final purchase order sent to the supplier. Ensure compliance with local tax regulations.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default POSummary