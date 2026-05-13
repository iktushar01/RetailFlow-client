import React from 'react'
import { Package } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table"
import { Badge } from "@/Components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card"
import { Skeleton } from "@/Components/ui/skeleton"

const StockTable = ({ stockData, loading, getStockStatus, getStatusIcon }) => {
  
  // Helper to handle status colors based on shadcn Badge variants
  const getBadgeVariant = (status) => {
    const s = status.toLowerCase()
    if (s.includes('out')) return "destructive"
    if (s.includes('low')) return "outline" // Or a custom yellow if defined
    return "secondary"
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="border-b border-border/50 pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          Live Stock Table
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[300px]">Product</TableHead>
              <TableHead className="text-center">Current Qty</TableHead>
              <TableHead className="text-center">Location</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}><Skeleton className="h-12 w-full" /></TableCell>
                </TableRow>
              ))
            ) : stockData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No stock data available
                </TableCell>
              </TableRow>
            ) : (
              stockData.map((item, index) => {
                const statusInfo = getStockStatus(item.stockQty || 0)
                const totalValue = (item.stockQty || 0) * (item.costPrice || 0)

                return (
                  <TableRow key={item.id || index} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {item.productName || 'Unknown'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          SKU: {item.sku || 'N/A'} • {item.category || 'N/A'}
                        </span>
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-center">
                      <div className="font-semibold text-foreground">
                        {item.stockQty || 0}
                      </div>
                      <div className="text-[10px] uppercase text-muted-foreground tracking-wider">
                        units
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="text-sm font-medium">{item.location || 'N/A'}</div>
                      {item.batch && item.batch !== 'N/A' && (
                        <div className="text-[11px] text-muted-foreground italic">
                          Batch: {item.batch}
                        </div>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <span>{getStatusIcon(item.stockQty || 0)}</span>
                        <Badge 
                          variant={getBadgeVariant(statusInfo.status)}
                          className="capitalize font-normal"
                        >
                          {statusInfo.status}
                        </Badge>
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="font-medium text-foreground">
                        BDT {totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        BDT {(item.costPrice || 0).toFixed(2)} / unit
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default StockTable
