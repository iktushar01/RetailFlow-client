import React, { useState, useEffect, useMemo } from 'react'
import { Plus, RefreshCw, FileText, Users, Package, Info, ShoppingCart, CheckCircle2, AlertCircle } from 'lucide-react'

// Shadcn UI Components
import { Button } from "@/Components/UI/button"
import { Alert, AlertDescription, AlertTitle } from "@/Components/UI/alert"
import { Separator } from "@/Components/UI/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/UI/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/UI/alert-dialog"

// Shared & Sub-components
import StatsCard from '../../Shared/StatsCard/StatsCard'
import POForm from './components/POForm'
import POList from './components/POList'
import POFilter from './components/POFilter'

// Services & Helpers
import { suppliersAPI, productsAPI, purchaseOrdersAPI } from './services/poService'
import { getStatusColor, formatCurrency, formatDate } from './utils/poHelpers'

const ManagePO = () => {
  
  // State Management
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [suppliers, setSuppliers] = useState([])
  const [products, setProducts] = useState([])
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingPO, setEditingPO] = useState(null)
  
  // Dialog States
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedPO, setSelectedPO] = useState(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [confirmSendOpen, setConfirmSendOpen] = useState(false)
  const [actionTarget, setActionTarget] = useState(null)

  const [filters, setFilters] = useState({
    status: '',
    supplier: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  })

  const initialFormState = {
    supplier: '',
    poNumber: '',
    poDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: '',
    items: [],
    notes: '',
    tax: 0
  }

  const [formData, setFormData] = useState(initialFormState)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setFetchLoading(true)
    try {
      const [suppliersRes, productsRes, poRes] = await Promise.all([
        suppliersAPI.getAll(),
        productsAPI.getAll(),
        purchaseOrdersAPI.getAll()
      ])
      setSuppliers(suppliersRes || [])
      setProducts(productsRes || [])
      setPurchaseOrders(poRes || [])
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fetch Error",
        description: "Failed to sync dashboard data."
      })
    } finally {
      setFetchLoading(false)
    }
  }

  const filteredPurchaseOrders = useMemo(() => {
    return purchaseOrders
      .filter(po => {
        const matchesStatus = !filters.status || po.status === filters.status
        const matchesSupplier = !filters.supplier || po.supplier === filters.supplier
        const matchesSearch = !filters.search || po.poNumber.toLowerCase().includes(filters.search.toLowerCase())
        return matchesStatus && matchesSupplier && matchesSearch
      })
      .sort((a, b) => new Date(b.createdAt || b.poDate) - new Date(a.createdAt || a.poDate))
  }, [purchaseOrders, filters])

  // --- UI Action Handlers ---

  const handleView = (po) => {
    setSelectedPO(po)
    setViewDialogOpen(true)
  }

  const handleEdit = (po) => {
    setEditingPO(po)
    setFormData({
      supplier: po.supplier,
      poNumber: po.poNumber,
      poDate: po.poDate,
      expectedDeliveryDate: po.expectedDeliveryDate,
      items: po.items || [],
      notes: po.notes || '',
      tax: po.tax || 0
    })
    setIsEditing(true)
    setIsModalOpen(true)
  }

  const handleDeleteTrigger = (po) => {
    setActionTarget(po)
    setConfirmDeleteOpen(true)
  }

  const confirmDelete = async () => {
    try {
      await purchaseOrdersAPI.delete(actionTarget.id)
      setPurchaseOrders(prev => prev.filter(p => p.id !== actionTarget.id))
      toast({
        title: "Order Deleted",
        description: `${actionTarget.poNumber} has been removed.`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: "Could not remove purchase order."
      })
    }
  }

  const handleSendTrigger = (po) => {
    setActionTarget(po)
    setConfirmSendOpen(true)
  }

  const confirmSend = async () => {
    try {
      await purchaseOrdersAPI.send(actionTarget.id)
      setPurchaseOrders(prev => prev.map(p => 
        p.id === actionTarget.id ? { ...p, status: 'Sent' } : p
      ))
      toast({
        title: "PO Sent",
        description: `Order successfully dispatched to supplier.`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Send Error",
        description: "Failed to dispatch purchase order."
      })
    }
  }

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      if (isEditing && editingPO) {
        await purchaseOrdersAPI.update(editingPO.id, values)
        toast({ title: "Updated!", description: "Order changes saved." })
      } else {
        await purchaseOrdersAPI.create(values)
        toast({ title: "Created!", description: "New purchase order added." })
      }
      fetchAllData()
      setIsModalOpen(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Save Error",
        description: error.message || "Could not save the order."
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className=" mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Purchase Orders</h1>
          </div>
          <p className="text-muted-foreground mt-1">Manage Store-Xen procurement.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={fetchAllData} disabled={fetchLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${fetchLoading ? 'animate-spin' : ''}`} />
            Sync
          </Button>
          <Button onClick={() => { setIsEditing(false); setFormData(initialFormState); setIsModalOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" /> New Order
          </Button>
        </div>
      </div>

      <Separator />

      <Alert className="bg-primary/5 border-primary/20">
        <Info className="h-4 w-4 text-primary" />
        <AlertTitle className="font-bold text-primary">Overview</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          You have {purchaseOrders.length} total orders in the system.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard label="Total Orders" value={purchaseOrders.length} icon={FileText} color="blue" />
        <StatsCard label="Suppliers" value={suppliers.length} icon={Users} color="green" />
        <StatsCard label="Products" value={products.length} icon={Package} color="purple" />
      </div>

      <POFilter filters={filters} onFilterChange={setFilters} suppliers={suppliers} resultsCount={filteredPurchaseOrders.length} totalCount={purchaseOrders.length} />

      <POList 
        purchaseOrders={filteredPurchaseOrders} 
        suppliers={suppliers} 
        loading={fetchLoading} 
        onView={handleView} 
        onEdit={handleEdit} 
        onDelete={handleDeleteTrigger} 
        onSend={handleSendTrigger} 
      />

      {/* --- SHADCN DIALOGS --- */}

      {/* View Detail Modal */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <FileText className="text-primary w-6 h-6" />
              {selectedPO?.poNumber}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-dashed border-border">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Supplier</p>
              <p className="font-semibold">{selectedPO?.supplierName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Status</p>
              <p className="font-semibold text-primary">{selectedPO?.status}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Date</p>
              <p className="font-semibold">{formatDate(selectedPO?.poDate)}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Amount</p>
              <p className="font-bold text-lg">{formatCurrency(selectedPO?.total || 0)}</p>
            </div>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
             <p className="text-xs font-bold mb-2">Order Items: {selectedPO?.items?.length || 0}</p>
             {/* Add a mini table or list here if needed */}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{actionTarget?.poNumber}</strong>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Send Confirmation */}
      <AlertDialog open={confirmSendOpen} onOpenChange={setConfirmSendOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="text-emerald-500 w-5 h-5" />
              Send to Supplier?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Ready to dispatch <strong>{actionTarget?.poNumber}</strong> to the supplier? 
              This will update the order status to "Sent".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSend}>Send Now</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Main PO Form Modal */}
      <POForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} formData={formData} setFormData={setFormData} suppliers={suppliers} products={products} loading={loading} onSubmit={handleSubmit} isEditing={isEditing} />
    </div>
  )
}

export default ManagePO

