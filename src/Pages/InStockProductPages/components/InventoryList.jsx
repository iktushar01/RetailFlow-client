import React from 'react'
import { Eye, AlertTriangle, MapPin, Calendar, Layers } from 'lucide-react'
import { Button } from "@/Components/ui/button"
import { Badge } from "@/Components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table"
import { Card } from "@/Components/ui/card"
import { Skeleton } from "@/Components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/Components/ui/tooltip"
import { 
  formatDate, 
  getStockStatusColor, 
  getStockStatusText, 
  getExpiryStatus 
} from '../utils/inventoryHelpers'

const InventoryList = ({ 
  inventory = [], 
  products = [],
  loading = false,
  onView
}) => {

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </Card>
    )
  }

  return (
    <Card className="border-border shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="font-bold">Product Information</TableHead>
            <TableHead className="font-bold">Inventory Details</TableHead>
            <TableHead className="font-bold text-center">Stock Level</TableHead>
            <TableHead className="font-bold">Location & Date</TableHead>
            <TableHead className="font-bold text-center">Status</TableHead>
            <TableHead className="font-bold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory.length > 0 ? (
            inventory.map((item) => {
              const product = products.find(p => p._id === item.productId)
              const expiryStatus = getExpiryStatus(item.expiry)
              const stockQty = item.stockQty || 0
              const lowStockThreshold = product?.lowStockThreshold || 10
              const isExpiring = expiryStatus && (expiryStatus.status === 'Expired' || expiryStatus.status === 'Expiring Soon')

              return (
                <TableRow key={item._id} className="hover:bg-muted/30 transition-colors">
                  {/* Product Info Column */}
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <span className="font-bold text-foreground leading-none">
                        {item.productName}
                      </span>
                      <div className="flex items-center gap-2">
                         <Badge variant="secondary" className="text-[10px] h-4 px-1 uppercase tracking-tighter">
                            {product?.category || 'Uncategorized'}
                         </Badge>
                         <span className="font-mono text-xs text-muted-foreground italic">
                            SKU: {product?.sku || 'N/A'}
                         </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Batch & Expiry Column */}
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Layers className="w-3 h-3 text-muted-foreground" />
                        <span className="font-mono font-medium">{item.batch || 'N/A'}</span>
                      </div>
                      <div className={`flex items-center gap-1.5 text-xs ${isExpiring ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                        <Calendar className="w-3 h-3" />
                        <span>{item.expiry ? formatDate(item.expiry).split(',')[0] : 'No Expiry'}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Stock Quantity Column */}
                  <TableCell className="text-center">
                    <span className={`text-xl font-black tracking-tighter ${
                      stockQty === 0 ? 'text-destructive' : 
                      stockQty <= lowStockThreshold ? 'text-amber-500' : 
                      'text-emerald-600'
                    }`}>
                      {stockQty}
                    </span>
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold">Units</p>
                  </TableCell>

                  {/* Location Column */}
                  <TableCell>
                    <div className="flex flex-col space-y-1 text-xs">
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="w-3 h-3 mr-1" />
                        {item.location || 'Main Warehouse'}
                      </div>
                      <span className="text-[10px] opacity-70">Updated: {formatDate(item.updatedAt)}</span>
                    </div>
                  </TableCell>

                  {/* Status Badge Column */}
                  <TableCell className="text-center">
                    <Badge 
                      variant="outline" 
                      className={`capitalize shadow-sm ${getStockStatusColor(stockQty, lowStockThreshold)}`}
                    >
                      {getStockStatusText(stockQty, lowStockThreshold)}
                    </Badge>
                  </TableCell>

                  {/* Actions Column */}
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <div className="flex justify-end items-center gap-2">
                        {isExpiring && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="bg-destructive/10 p-1.5 rounded-full animate-pulse">
                                <AlertTriangle className="w-4 h-4 text-destructive" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-destructive text-destructive-foreground">
                              {expiryStatus.status}: {expiryStatus.days} days left
                            </TooltipContent>
                          </Tooltip>
                        )}

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                              onClick={() => onView(item)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Detailed View</TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground font-medium">
                No inventory items found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  )
}

export default InventoryList
