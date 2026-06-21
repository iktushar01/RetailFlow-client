import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { RefreshCw, Package, AlertTriangle, TrendingUp, XCircle, Clock, Info, Eye, Boxes } from 'lucide-react'
import { toast } from "sonner"
import { Button } from "@/Components/UI/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/UI/card"
import { Alert, AlertDescription, AlertTitle } from "@/Components/UI/alert"
import { Badge } from "@/Components/UI/badge"
import { Separator } from "@/Components/UI/separator"
import { ScrollArea } from "@/Components/UI/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/Components/UI/dialog"

import ProductInventoryList from './components/ProductInventoryList'
import InventoryFilter from './components/InventoryFilter'
import { inventoryAPI, productsAPI } from './services/inventoryService'
import { formatDate, getExpiryStatus } from './utils/inventoryHelpers'

export const InStockProductPages = () => {
  const [inventory, setInventory] = useState([])
  const [products, setProducts] = useState([])
  const [fetchLoading, setFetchLoading] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    stockStatus: '',
    expiryStatus: '',
    location: ''
  })

  const fetchInventory = useCallback(async () => {
    try {
      setFetchLoading(true)
      const data = await inventoryAPI.getProducts()
      setInventory(data || [])
    } catch (error) {
      toast.error("Fetch Error", {
        description: "Failed to load inventory. Please check your connection."
      })
    } finally {
      setFetchLoading(false)
    }
  }, [])

  const fetchProducts = useCallback(async () => {
    try {
      const data = await productsAPI.getAll()
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }, [])

  const fetchAllData = useCallback(async () => {
    await Promise.all([fetchInventory(), fetchProducts()])
  }, [fetchInventory, fetchProducts])

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  const categories = useMemo(() => {
    const cats = products.map(p => p.category).filter(Boolean)
    return [...new Set(cats)]
  }, [products])

  const filteredInventory = useMemo(() => {
    return inventory.filter(product => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        if (!product.productName?.toLowerCase().includes(searchLower) && 
            !product.sku?.toLowerCase().includes(searchLower)) return false
      }
      if (filters.category && product.category !== filters.category) return false
      
      // Multi-location logic for Stock/Expiry status
      if (filters.stockStatus || filters.expiryStatus || filters.location) {
        return product.locations.some(loc => {
          const stockQty = loc.quantity || 0
          const lowStockThreshold = 10
          
          let matchesStock = true
          if (filters.stockStatus === 'out-of-stock') matchesStock = stockQty === 0
          else if (filters.stockStatus === 'low-stock') matchesStock = stockQty > 0 && stockQty <= lowStockThreshold
          else if (filters.stockStatus === 'in-stock') matchesStock = stockQty > lowStockThreshold

          let matchesExpiry = true
          if (filters.expiryStatus) {
            const exp = getExpiryStatus(loc.expiry)
            if (filters.expiryStatus === 'expired') matchesExpiry = exp?.status === 'Expired'
            else if (filters.expiryStatus === 'expiring-soon') matchesExpiry = exp?.status === 'Expiring Soon'
            else if (filters.expiryStatus === 'valid') matchesExpiry = exp?.status === 'Valid'
          }

          let matchesLoc = true
          if (filters.location) matchesLoc = loc.location?.toLowerCase().includes(filters.location.toLowerCase())

          return matchesStock && matchesExpiry && matchesLoc
        })
      }
      return true
    }).sort((a, b) => a.productName.localeCompare(b.productName))
  }, [inventory, filters])

  const stats = useMemo(() => {
    const totalProducts = inventory.length
    const totalStock = inventory.reduce((s, p) => s + p.locations.reduce((ls, l) => ls + (l.quantity || 0), 0), 0)
    const lowStock = inventory.filter(p => p.locations.some(l => (l.quantity || 0) > 0 && (l.quantity || 0) <= 10)).length
    const outOfStock = inventory.filter(p => p.locations.every(l => (l.quantity || 0) === 0)).length
    const expiring = inventory.filter(p => p.locations.some(l => {
      const st = getExpiryStatus(l.expiry)
      return st?.status === 'Expired' || st?.status === 'Expiring Soon'
    })).length

    return { totalProducts, totalStock, lowStock, outOfStock, expiring }
  }, [inventory])

  const handleView = (locationItem) => {
    const product = inventory.find(p => p.productId === locationItem.productId)
    setSelectedItem({ ...locationItem, parentProduct: product })
    setIsDetailsOpen(true)
  }

  return (
    <div className=" mx-auto py-6 space-y-6">
      {/* Header Section */}
      <Card className="border-none shadow-md bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-purple-500/5">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="space-y-1">
            <CardTitle className="text-2xl sm:text-3xl font-bold flex items-center tracking-tight">
              <Package className="w-8 h-8 mr-3 text-blue-600" />
              Warehouse Inventory
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              Monitor real-time stock levels, batches, and warehouse locations.
            </CardDescription>
          </div>
          <Button variant="outline" onClick={fetchAllData} disabled={fetchLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${fetchLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </CardHeader>
      </Card>

      {/* Info Alert */}
      <Alert variant="info" className="bg-blue-500/5 border-blue-500/20">
        <Info className="h-5 w-5 text-blue-600" />
        <AlertTitle className="font-semibold text-blue-900 dark:text-blue-200">Inventory Insight</AlertTitle>
        <AlertDescription className="text-blue-800 dark:text-blue-300">
          Stock levels are automatically synchronized with Goods Received Notes (GRN).
        </AlertDescription>
      </Alert>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Products", val: stats.totalProducts, icon: Boxes, color: "text-slate-600" },
          { label: "Total Units", val: stats.totalStock, icon: TrendingUp, color: "text-blue-600" },
          { label: "Low Stock", val: stats.lowStock, icon: AlertTriangle, color: "text-amber-600" },
          { label: "Out of Stock", val: stats.outOfStock, icon: XCircle, color: "text-destructive" },
          { label: "Expiring Soon", val: stats.expiring, icon: Clock, color: "text-purple-600" },
        ].map((stat, idx) => (
          <Card key={idx} className="shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.val}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color} opacity-20`} />
            </CardContent>
          </Card>
        ))}
      </div>

      <InventoryFilter
        filters={filters}
        onFilterChange={setFilters}
        categories={categories}
        resultsCount={filteredInventory.length}
        totalCount={inventory.length}
      />

      <ProductInventoryList
        inventory={filteredInventory}
        loading={fetchLoading}
        onView={handleView}
      />

      {/* Product Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Package className="w-5 h-5 text-blue-600" /> 
              {selectedItem?.productName || 'Product Details'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <DetailItem label="SKU" value={selectedItem.sku || selectedItem.parentProduct?.sku} mono />
                <DetailItem label="Category" value={selectedItem.category || selectedItem.parentProduct?.category} />
                <DetailItem label="Batch #" value={selectedItem.batch} mono />
                <DetailItem label="Location" value={selectedItem.location} />
              </div>

              <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-6 text-center">
                <p className="text-sm font-medium text-blue-600 uppercase tracking-widest">Available Stock</p>
                <p className="text-5xl font-extrabold text-blue-700 my-2">{selectedItem.quantity || 0}</p>
                <p className="text-xs text-muted-foreground uppercase">Units in current location</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="p-3 bg-muted/30">
                  <p className="text-xs font-semibold text-muted-foreground">EXPIRY DATE</p>
                  <p className="text-sm font-medium">{selectedItem.expiry ? formatDate(selectedItem.expiry).split(',')[0] : 'N/A'}</p>
                  {getExpiryStatus(selectedItem.expiry) && (
                    <Badge variant="outline" className={`mt-1 ${getExpiryStatus(selectedItem.expiry).color}`}>
                      {getExpiryStatus(selectedItem.expiry).status}
                    </Badge>
                  )}
                </Card>
                <Card className="p-3 bg-muted/30">
                  <p className="text-xs font-semibold text-muted-foreground">UNIT PRICE</p>
                  <p className="text-sm font-medium">BDT {selectedItem.parentProduct?.sellingPrice || 'N/A'}</p>
                  <p className="text-[10px] text-muted-foreground uppercase mt-1">Selling Price</p>
                </Card>
              </div>

              {selectedItem.parentProduct?.locations?.length > 1 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
                    <Boxes className="w-3 h-3" /> Distribution Across All Locations
                  </p>
                  <ScrollArea className="h-24 border rounded-md p-2">
                    {selectedItem.parentProduct.locations.map((loc, i) => (
                      <div key={i} className="flex justify-between text-sm py-1 border-b last:border-0">
                        <span className="text-muted-foreground">{loc.location}</span>
                        <span className="font-semibold">{(loc.quantity || 0)} units</span>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const DetailItem = ({ label, value, mono }) => (
  <div>
    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">{label}</p>
    <p className={`text-sm font-medium ${mono ? 'font-mono' : ''}`}>{value || 'N/A'}</p>
  </div>
)

export default InStockProductPages

