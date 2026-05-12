import React from 'react'
import { Package, TrendingUp } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const ValuationTable = ({ 
  valuationData = [], 
  loading, 
  getMarginColor, // Note: You might want to update this function to return shadcn-friendly classes
  getValueRange 
}) => {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center">
          <Package className="w-5 h-5 mr-2 text-primary" />
          Inventory Valuation Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[250px]">Product</TableHead>
              <TableHead className="text-center">Qty</TableHead>
              <TableHead className="text-right">Cost Price</TableHead>
              <TableHead className="text-right">Total Value (BDT)</TableHead>
              <TableHead className="text-center">Margin %</TableHead>
              <TableHead className="text-right">Potential Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-6 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : valuationData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No valuation data available
                </TableCell>
              </TableRow>
            ) : (
              valuationData.map((item, index) => (
                <TableRow key={item._id || index} className="hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-semibold text-foreground">{item.productName}</div>
                      <div className="flex flex-col text-xs text-muted-foreground font-mono">
                        <span>SKU: {item.sku}</span>
                        <span className="text-[10px] opacity-70 italic">{item.category}</span>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <div className="text-base font-semibold">{item.quantity}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">units</div>
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <div className="font-medium">BDT {item.costPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    <div className="text-[10px] text-muted-foreground uppercase">Avg Cost</div>
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <div className="text-base font-bold text-primary">
                      BDT {item.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <Badge variant="outline" className="text-[10px] font-normal h-4 px-1.5 border-border/50">
                      {getValueRange(item.totalValue)}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <Badge 
                        variant="secondary" 
                        className={cn("font-semibold rounded-full", getMarginColor(item.marginPercentage))}
                      >
                        {item.marginPercentage.toFixed(1)}%
                      </Badge>
                      <div className="text-[10px] text-muted-foreground">
                        BDT {item.margin.toFixed(2)}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end">
                      <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        BDT {item.potentialValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-[10px] text-muted-foreground italic">Target Revenue</div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default ValuationTable