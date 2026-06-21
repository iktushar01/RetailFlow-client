import React, { useState, useEffect } from 'react'
import { AlertTriangle, Package, RotateCcw, RefreshCw, Plus, Search } from 'lucide-react'
import { Button } from "@/Components/UI/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/UI/card"
import { Alert, AlertDescription, AlertTitle } from "@/Components/UI/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/UI/table"
import { Badge } from "@/Components/UI/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from "@/Components/UI/dialog"
import { Input } from "@/Components/UI/input"
import { ListPageSkeleton } from '../../../Components/UI/PageSkeleton'
import { 
  inventoryAPI, 
  productsAPI, 
  suppliersAPI, 
  purchaseOrdersAPI 
} from '../services/inventoryService'
import { notify } from '../../../utils/notifications'

const LowStockAlerts = () => {
  const [lowStockItems, setLowStockItems] = useState([])
  const [products, setProducts] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showReorderModal, setShowReorderModal] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    supplier: '',
    severity: ''
  })

  const [stats, setStats] = useState({
    totalAlerts: 0,
    criticalAlerts: 0,
    warningAlerts: 0,
    totalValue: 0
  })

  useEffect(() => {
    fetchData()
  }, [filters])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [inventoryData, productsData, suppliersData] = await Promise.all([
        inventoryAPI.getAll(),
        productsAPI.getAll(),
        suppliersAPI.getAll()
      ])
      
      setProducts(productsData)
      setSuppliers(suppliersData)
      
      const lowStock = inventoryData.filter(item => {
        const product = productsData.find(p => p._id === item.productId)
        return product && item.stockQty <= (product.minStockLevel || 10)
      })
      
      setLowStockItems(lowStock)
      calculateStats(lowStock, productsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (lowStockData, productsData) => {
    const totalAlerts = lowStockData.length
    const criticalAlerts = lowStockData.filter(item => {
      const product = productsData.find(p => p._id === item.productId)
      return item.stockQty <= (product?.criticalStockLevel || 5)
    }).length
    
    const totalValue = lowStockData.reduce((sum, item) => {
      const product = productsData.find(p => p._id === item.productId)
      return sum + (item.stockQty * (product?.costPrice || 0))
    }, 0)
    
    setStats({
      totalAlerts,
      criticalAlerts,
      warningAlerts: totalAlerts - criticalAlerts,
      totalValue: totalValue.toFixed(2)
    })
  }

  const getSeverity = (item) => {
    const product = products.find(p => p._id === item.productId)
    if (item.stockQty <= (product?.criticalStockLevel || 5)) return { label: 'Critical', variant: 'destructive', icon: '🔴' }
    if (item.stockQty <= (product?.minStockLevel || 10)) return { label: 'Warning', variant: 'outline', icon: '🟡' }
    return { label: 'Low', variant: 'secondary', icon: '🟠' }
  }

  const filteredItems = lowStockItems.filter(item => {
    const product = products.find(p => p._id === item.productId)
    if (!product) return false
    const matchesSearch = !filters.search || product.productName?.toLowerCase().includes(filters.search.toLowerCase())
    const matchesSeverity = !filters.severity || (filters.severity === 'critical' && item.stockQty <= (product.criticalStockLevel || 5))
    return matchesSearch && matchesSeverity
  })

  const handleReorderNow = async (item) => {
    const product = products.find(p => p._id === item.productId)
    let supplier = suppliers.find(s => s._id === product?.supplierId)
    
    if (!supplier) {
      notify.error('Error', 'No supplier assigned to this product.')
      return
    }

    const suggestedQty = Math.max(50, (product?.minStockLevel || 10) * 3)
    
    try {
      await purchaseOrdersAPI.create({
        supplierId: supplier._id,
        supplierName: supplier.name,
        items: [{
          productId: product._id,
          productName: product.productName,
          quantity: suggestedQty,
          unitPrice: product.costPrice || 0,
          totalPrice: suggestedQty * (product.costPrice || 0)
        }],
        status: 'Draft',
        notes: `Auto-generated for low stock - ${product.productName}`
      })
      notify.success('Success', 'PO created successfully')
      fetchData()
    } catch (e) { notify.error('Error', 'Failed to create PO') }
  }

  if (loading) {
    return <ListPageSkeleton stats={4} tableColumns={6} />
  }

  return (
    <div className="space-y-6 mx-auto animate-in fade-in duration-500">
      {/* Header Card */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Low Stock Alerts</h1>
          <p className="text-muted-foreground text-sm md:text-base">Monitor and restock items below threshold</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
          <Button variant="default" size="sm" onClick={() => { setSelectedItems(filteredItems); setShowReorderModal(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Bulk Reorder
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard label="Total Alerts" value={stats.totalAlerts} variant="destructive" />
        <StatsCard label="Critical" value={stats.criticalAlerts} variant="destructive" />
        <StatsCard label="Warning" value={stats.warningAlerts} variant="secondary" />
        <StatsCard label="Value at Risk" value={`BDT ${stats.totalValue}`} variant="default" />
      </div>

      <Alert variant="destructive" className="bg-destructive/5">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Action Required</AlertTitle>
        <AlertDescription>
          There are {stats.criticalAlerts} products currently at critical levels. Restock immediately to avoid service disruption.
        </AlertDescription>
      </Alert>

      {/* Table Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Low Stock Items</CardTitle>
            <div className="flex items-center gap-2 max-w-sm">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search products..." 
                    value={filters.search}
                    onChange={(e) => setFilters(f => ({...f, search: e.target.value}))}
                    className="h-8"
                />
            </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-center">Current Qty</TableHead>
                <TableHead className="text-center">Min Level</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => {
                const product = products.find(p => p._id === item.productId)
                const sev = getSeverity(item)
                return (
                  <TableRow key={item._id}>
                    <TableCell>
                      <div className="font-medium">{product?.productName}</div>
                      <div className="text-xs text-muted-foreground font-mono">{product?.sku}</div>
                    </TableCell>
                    <TableCell className="text-center font-bold">{item.stockQty}</TableCell>
                    <TableCell className="text-center text-muted-foreground">{product?.minStockLevel || 10}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={sev.variant} className="gap-1">
                        <span>{sev.icon}</span> {sev.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleReorderNow(item)}>
                        <RotateCcw className="h-4 w-4 mr-2" /> Reorder
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Bulk Reorder Dialog */}
      <Dialog open={showReorderModal} onOpenChange={setShowReorderModal}>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>Bulk Reorder Confirmation</DialogTitle>
            <DialogDescription>Review items before creating draft Purchase Orders.</DialogDescription>
          </DialogHeader>
          <div className="min-h-0 max-h-[min(50dvh,400px)] overflow-y-auto space-y-2 py-4">
            {selectedItems.map((item, idx) => {
              const product = products.find(p => p._id === item.productId)
              return (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <div>
                    <p className="font-medium text-sm">{product?.productName}</p>
                    <p className="text-xs text-muted-foreground">Current Stock: {item.stockQty}</p>
                  </div>
                  <Badge variant="outline">Suggested: {Math.max(50, (product?.minStockLevel || 10) * 3)} units</Badge>
                </div>
              )
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReorderModal(false)}>Cancel</Button>
            <Button onClick={() => notify.info('Wait', 'Processing bulk orders...')}>Create Orders</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const StatsCard = ({ label, value, variant = "default" }) => (
    <Card>
        <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className={`text-2xl font-bold ${variant === 'destructive' ? 'text-destructive' : ''}`}>{value}</p>
        </CardContent>
    </Card>
)

export default LowStockAlerts

