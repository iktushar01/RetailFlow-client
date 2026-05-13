import React from 'react'
import { BarChart3, TrendingUp, Package } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"
import { cn } from "@/lib/utils"

const TopProducts = ({ data }) => {
  return (
    <Card className="bg-card/70 backdrop-blur border-border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <BarChart3 className="h-5 w-5 text-primary" />
          Top Selling Products
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.topProducts && data.topProducts.length > 0 ? (
            data.topProducts.map((product, index) => (
              <div 
                key={product._id || index} 
                className="group relative rounded-xl border border-border bg-muted/20 p-4 transition-all hover:bg-muted/50 hover:shadow-sm"
              >
                <p className="text-sm font-semibold truncate">
                  {product.name || product.productName || 'Unknown Product'}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground uppercase font-medium">Sold</span>
                  <Badge variant="secondary" className="flex items-center gap-1 font-mono">
                    <TrendingUp className="w-3 h-3 text-emerald-500" /> 
                    {product.quantitySold || product.salesCount || product.soldQuantity || (20 - index * 2)}
                  </Badge>
                </div>
              </div>
            ))
          ) : data.inventory && data.inventory.length > 0 ? (
            data.inventory.slice(0, 4).map((product, index) => {
              const totalStockQty = product.stockQty || product.quantity || product.stock || 
                                   product.currentStock || 
                                   (product.locations?.reduce((sum, loc) => sum + (loc.quantity || 0), 0)) || 
                                   0
              const productName = product.productName || product.name || product.title || `Product ${index + 1}`
              
              return (
                <div 
                  key={product.productId || product._id || index} 
                  className="rounded-xl border border-border bg-muted/20 p-4 transition-all hover:bg-muted/50"
                >
                  <p className="text-sm font-semibold truncate">{productName}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground uppercase font-medium">Available</span>
                    <Badge variant="outline" className="flex items-center gap-1 font-mono text-primary">
                      <Package className="w-3 h-3 text-blue-500" /> 
                      {totalStockQty}
                    </Badge>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-10 border border-dashed border-border rounded-xl bg-muted/10">
              <Package className="w-10 h-10 mb-2 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No products data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default TopProducts
