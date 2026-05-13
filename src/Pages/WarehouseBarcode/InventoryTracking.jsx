import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { 
  Package, Pencil, AlertTriangle, Calendar, RefreshCw, 
  Info, CheckCircle, XCircle, QrCode, Barcode, Search, Sparkles 
} from 'lucide-react'
import Swal from 'sweetalert2'

// shadcn/ui components
import { Button } from "@/Components/UI/button"
import { Input } from "@/Components/UI/input"
import { Badge } from "@/Components/UI/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/UI/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/Components/UI/dialog"
import { Switch } from "@/Components/UI/switch"
import { Label } from "@/Components/UI/label"
import { Alert, AlertDescription, AlertTitle } from "@/Components/UI/alert"

// APIs & Helpers
import { inventoryAPI } from './services/barcodeService'
import { productsAPI } from '../ProductPages/services/productService'
import { 
  getExpiryStatus,
  getExpiryStatusDisplay,
  formatDate,
  generateCode,
  generateBatchNumber,
  validateInventoryTracking,
  applyInventoryFilters,
  calculateInventoryStats
} from './utils/inventoryTrackingHelpers'

const InventoryTracking = () => {
  const [inventory, setInventory] = useState([])
  const [products, setProducts] = useState([])
  const [filteredInventory, setFilteredInventory] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  
  const [formData, setFormData] = useState({
    barcode: '',
    qrCode: '',
    batch: '',
    expiry: '',
    autoGenerate: true
  })

  const [filters, setFilters] = useState({ search: '', warehouse: '', status: 'all' })

  useEffect(() => { fetchAllData() }, [])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      const [inventoryData, productsData] = await Promise.all([inventoryAPI.getAll(), productsAPI.getAll()])
      const normalized = (inventoryData || []).map(item => ({
        ...item,
        batch: item.batch || item.batchNumber || '',
        expiry: item.expiry || item.expiryDate || '',
        qrCode: item.qrCode || ''
      }))
      setInventory(normalized); setProducts(productsData || [])
    } catch (error) {
      console.error(error);
    } finally { setLoading(false) }
  }

  // Auto-generate logic
  const handleAutoGenerate = useCallback(() => {
    if (formData.autoGenerate && selectedItem) {
      setFormData(prev => ({
        ...prev,
        barcode: generateCode('BAR'),
        qrCode: generateCode('QR'),
        batch: generateBatchNumber(selectedItem.productId || 'PROD')
      }))
    }
  }, [formData.autoGenerate, selectedItem])

  useEffect(() => {
    if (modalOpen && formData.autoGenerate && !formData.barcode) {
      handleAutoGenerate()
    }
  }, [modalOpen, formData.autoGenerate, handleAutoGenerate])

  const handleEdit = (item) => {
    setSelectedItem(item)
    const product = products.find(p => p._id === item.productId)
    setFormData({
      barcode: item.barcode || product?.barcode || '',
      qrCode: item.qrCode || product?.qrCode || '',
      batch: item.batch || '',
      expiry: item.expiry ? new Date(item.expiry).toISOString().split('T')[0] : '',
      autoGenerate: !(item.barcode || item.qrCode || item.batch)
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validation = validateInventoryTracking(formData)
    if (!validation.isValid) {
      Swal.fire({ icon: 'warning', title: 'Validation Error', text: validation.errors[0] })
      return
    }

    try {
      await inventoryAPI.update(selectedItem._id, {
        barcode: formData.barcode || null,
        qrCode: formData.qrCode || null,
        batch: formData.batch || null,
        expiry: formData.expiry || null
      })
      setModalOpen(false); fetchAllData()
      Swal.fire({ icon: 'success', title: 'Success', timer: 1500, showConfirmButton: false })
    } catch (error) { Swal.fire({ icon: 'error', title: 'Update Failed' }) }
  }

  const stats = useMemo(() => calculateInventoryStats(inventory, products), [inventory, products])
  const warehouses = useMemo(() => [...new Set(inventory.map(item => item.location).filter(Boolean))], [inventory])

  useEffect(() => {
    const filterParams = { ...filters, status: filters.status === 'all' ? '' : filters.status }
    setFilteredInventory(applyInventoryFilters(inventory, filterParams, products))
  }, [inventory, filters, products])

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-xl border">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
             <Package className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Inventory Tracking</h1>
            <p className="text-sm text-muted-foreground">Automate and manage product identifiers</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={fetchAllData} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Sync Data
        </Button>
      </div>

      {/* Info Alert */}
      <Alert className="bg-blue-50/50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800 dark:text-blue-300">Management Tip</AlertTitle>
        <AlertDescription className="text-blue-700 dark:text-blue-400">
          Auto-generation ensures unique identifiers. Batch and Expiry are optional for non-perishable goods.
        </AlertDescription>
      </Alert>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Items", value: stats.totalItems, icon: Package, color: "text-blue-500" },
          { label: "Valid Stock", value: stats.validCount, icon: CheckCircle, color: "text-green-500" },
          { label: "Near Expiry", value: stats.nearExpiryCount, icon: Calendar, color: "text-orange-500" },
          { label: "Expired", value: stats.expiredCount, icon: XCircle, color: "text-red-500" },
        ].map((stat, i) => (
          <Card key={i} className="shadow-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase">{stat.label}</span>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{stat.value}</div></CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Bar */}
      <Card className="p-4 shadow-none">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[240px] space-y-1.5">
            <Label className="text-xs">Search Products</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                className="pl-8" 
                placeholder="SKU, Batch, or Name..." 
                value={filters.search} 
                onChange={e => setFilters(f => ({...f, search: e.target.value}))} 
              />
            </div>
          </div>
          <div className="w-48 space-y-1.5">
            <Label className="text-xs">Warehouse</Label>
            <Select value={filters.warehouse} onValueChange={v => setFilters(f => ({...f, warehouse: v === 'all' ? '' : v}))}>
              <SelectTrigger><SelectValue placeholder="All Locations" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {warehouses.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setFilters({search:'', warehouse:'', status:'all'})}>
            Reset
          </Button>
        </div>
      </Card>

      {/* Table Card */}
      <Card className="overflow-hidden shadow-none border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr className="text-left font-medium text-muted-foreground">
                <th className="p-4">Product Info</th>
                <th className="p-4">Tracked Codes</th>
                <th className="p-4">Batch Details</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredInventory.map(item => (
                <tr key={item._id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-foreground">{item.productName}</div>
                    <div className="text-xs text-muted-foreground uppercase">{item.location}</div>
                  </td>
                  <td className="p-4 space-y-1">
                    {item.barcode && <Badge variant="secondary" className="font-mono text-[10px] block w-fit"><Barcode size={10} className="inline mr-1"/> {item.barcode}</Badge>}
                    {item.qrCode && <Badge variant="secondary" className="font-mono text-[10px] block w-fit"><QrCode size={10} className="inline mr-1"/> {item.qrCode}</Badge>}
                  </td>
                  <td className="p-4">
                    <div className="font-mono text-xs">{item.batch || '—'}</div>
                    <div className="text-xs text-muted-foreground">{item.expiry ? formatDate(item.expiry) : 'N/A'}</div>
                  </td>
                  <td className="p-4">
                    <Badge variant={getExpiryStatus(item.expiry) === 'expired' ? 'destructive' : 'outline'}>
                      {getExpiryStatusDisplay(getExpiryStatus(item.expiry))}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Modal with Auto-Generate UI */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Update Inventory Tracking</DialogTitle>
            <DialogDescription>Modify tracking codes for {selectedItem?.productName}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Auto Gen Switch */}
            <div className="flex items-center justify-between p-4 bg-muted/40 rounded-xl border border-dashed">
              <div className="space-y-1">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-500" /> Auto-generate Mode
                </Label>
                <p className="text-xs text-muted-foreground">Let system handle unique ID creation</p>
              </div>
              <Switch 
                checked={formData.autoGenerate} 
                onCheckedChange={checked => setFormData(f => ({...f, autoGenerate: checked}))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold">Barcode</Label>
                <div className="flex gap-2">
                   <Input 
                    value={formData.barcode} 
                    readOnly={formData.autoGenerate}
                    onChange={e => setFormData(f => ({...f, barcode: e.target.value}))}
                    className="font-mono text-xs"
                  />
                  {!formData.autoGenerate && (
                    <Button variant="outline" size="icon" onClick={() => setFormData(f => ({...f, barcode: generateCode('BAR')}))}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold">QR Code</Label>
                <Input 
                  value={formData.qrCode} 
                  readOnly={formData.autoGenerate}
                  onChange={e => setFormData(f => ({...f, qrCode: e.target.value}))}
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold">Batch Number</Label>
                <div className="flex gap-2">
                   <Input 
                    value={formData.batch} 
                    readOnly={formData.autoGenerate}
                    onChange={e => setFormData(f => ({...f, batch: e.target.value}))}
                    className="font-mono text-xs"
                  />
                  {!formData.autoGenerate && (
                    <Button variant="outline" size="icon" onClick={() => setFormData(f => ({...f, batch: generateBatchNumber(selectedItem?.productId)}))}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold">Expiry Date</Label>
                <Input 
                  type="date" 
                  value={formData.expiry} 
                  onChange={e => setFormData(f => ({...f, expiry: e.target.value}))}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {/* Live Preview Section */}
            {(formData.barcode || formData.batch) && (
              <div className="bg-green-50/50 dark:bg-green-950/10 p-4 rounded-lg border border-green-100 dark:border-green-900 space-y-2">
                <h4 className="text-xs font-bold text-green-700 flex items-center gap-1 uppercase">
                  <CheckCircle className="w-3 h-3" /> Previewing Changes
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] font-mono opacity-80">
                   {formData.barcode && <div className="text-green-800 dark:text-green-400 truncate">BAR: {formData.barcode}</div>}
                   {formData.batch && <div className="text-green-800 dark:text-green-400 truncate">BAT: {formData.batch}</div>}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="bg-muted/20 p-4 -mx-6 -mb-6 border-t">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Discard</Button>
            <Button onClick={handleSubmit}>Update Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const RotateCcw = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
)

export default InventoryTracking

