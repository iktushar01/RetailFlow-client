import React, { useMemo } from 'react'
import { Eye, MapPin, Package, Calendar, Hash, Inbox } from 'lucide-react'
import { Button } from "@/Components/UI/button"
import { Badge } from "@/Components/UI/badge"
import { Card } from "@/Components/UI/card"
import { TableSkeleton } from "@/Components/UI/PageSkeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/UI/table"
import {
  formatDate,
  getStockStatusColor,
  getStockStatusText,
  getExpiryStatus
} from '../utils/inventoryHelpers'

const ProductInventoryList = ({ 
  inventory = [], 
  loading = false,
  onView
}) => {
  
  // Flatten product locations into individual rows for the table
  const flattenedData = useMemo(() => {
    const flattened = []
    
    inventory.forEach(product => {
      const locations = product.locations || []
      
      locations.forEach(location => {
        flattened.push({
          ...product,
          ...location,
          // Explicit mapping to prevent naming collisions
          displayProductName: product.productName || 'Unknown Product',
          displaySku: product.sku || 'N/A',
          displayCategory: product.category || 'Uncategorized',
          rowQuantity: location.quantity || 0,
          rowLocation: location.location || 'Unknown Location',
          rowBatch: location.batch || 'N/A',
          rowExpiry: location.expiry || 'N/A',
          rowStatus: location.status || 'Unknown',
          rowLastUpdated: location.lastUpdated || product.updatedAt || product.createdAt,
        })
      })
    })
    
    return flattened
  }, [inventory])

  if (loading) {
    return <TableSkeleton rows={6} columns={6} showActions />
  }

  if (flattenedData.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-12 border-dashed">
        <div className="bg-muted rounded-full p-4 mb-4">
          <Inbox className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No inventory found</h3>
        <p className="text-sm text-muted-foreground max-w-xs text-center">
          There are currently no products with assigned locations or stock levels.
        </p>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden border shadow-none">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[300px]">Product</TableHead>
            <TableHead>Batch & SKU</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Expiry</TableHead>
            <TableHead className="text-center">Stock</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flattenedData.map((item, index) => {
            const expiryInfo = getExpiryStatus(item.rowExpiry)
            const qtyColor = item.rowQuantity === 0 
              ? 'text-destructive' 
              : item.rowQuantity <= 10 
                ? 'text-amber-600' 
                : 'text-emerald-600'

            return (
              <TableRow key={`${item.productId}-${index}`} className="group transition-colors hover:bg-muted/30">
                {/* Product & Category */}
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground line-clamp-1">
                      {item.displayProductName}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                      {item.displayCategory}
                    </span>
                  </div>
                </TableCell>

                {/* SKU & Batch */}
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-xs font-mono text-muted-foreground">
                      <Hash className="w-3 h-3 mr-1 opacity-70" />
                      {item.displaySku}
                    </div>
                    <div className="inline-flex items-center px-1.5 py-0.5 rounded border bg-background text-[10px] font-medium uppercase">
                      Batch: {item.rowBatch}
                    </div>
                  </div>
                </TableCell>

                {/* Location */}
                <TableCell>
                  <div className="flex items-center text-sm text-foreground">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                    {item.rowLocation}
                  </div>
                </TableCell>

                {/* Expiry */}
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center text-sm">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                      {item.rowExpiry}
                    </div>
                    {expiryInfo && (
                      <span className={`text-[10px] font-bold mt-0.5 ${expiryInfo.color}`}>
                        {expiryInfo.status.toUpperCase()}
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* Quantity */}
                <TableCell className="text-center">
                  <div className="flex flex-col items-center">
                    <span className={`text-lg font-black tracking-tighter ${qtyColor}`}>
                      {item.rowQuantity}
                    </span>
                    <span className="text-[9px] uppercase font-bold opacity-50">Units</span>
                  </div>
                </TableCell>

                {/* Status Badge */}
                <TableCell className="text-center">
                  <Badge 
                    variant="outline" 
                    className={`whitespace-nowrap shadow-sm border ${getStockStatusColor(item.rowQuantity, 10)}`}
                  >
                    {getStockStatusText(item.rowQuantity, 10)}
                  </Badge>
                </TableCell>

                {/* Action */}
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 hover:bg-blue-500/10 hover:text-blue-600 transition-all"
                    onClick={() => onView(item)}
                  >
                    <Eye className="w-4 h-4 mr-1.5" />
                    <span className="font-medium">Details</span>
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      
      {/* Footer info for traceability */}
      <div className="bg-muted/30 px-4 py-2 border-t">
        <p className="text-[10px] text-muted-foreground text-center italic">
          Showing {flattenedData.length} stock allocations across multiple warehouse zones.
        </p>
      </div>
    </Card>
  )
}

export default ProductInventoryList

