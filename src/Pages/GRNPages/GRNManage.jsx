import React, { useState, useEffect, useMemo } from 'react'
import { Plus, RefreshCw, ClipboardList, ShoppingCart, Users, Info, CheckCircle2, AlertCircle } from 'lucide-react'
// UI Components - using relative paths
import { Button } from '../../Components/UI/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert"

// Internal Components
import StatsCard from '../../Shared/StatsCard/StatsCard'
import GRNForm from './components/GRNForm'
import GRNList from './components/GRNList'
import GRNFilter from './components/GRNFilter'
import GRNViewModal from './components/GRNViewModal' // New: Separated View logic

// Services & Utils
import { grnAPI, purchaseOrdersAPI, suppliersAPI } from './services/grnService'
import { determineGRNStatus } from './utils/grnHelpers'

const GRNManage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedGRN, setSelectedGRN] = useState(null)
  
  const [suppliers, setSuppliers] = useState([])
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [grns, setGrns] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  
  // Notification State
  const [notification, setNotification] = useState(null)
  
  // Dialog States
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [grnToProcess, setGrnToProcess] = useState(null)

  const [filters, setFilters] = useState({
    status: '',
    supplier: '',
    poNumber: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  })

  const [formData, setFormData] = useState({
    grnNumber: '',
    poId: '',
    poNumber: '',
    supplierId: '',
    receivedDate: new Date().toISOString().split('T')[0],
    items: [],
    notes: '',
    status: 'Pending'
  })

  const notify = (title, message, type = "default") => {
    setNotification({ title, message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setFetchLoading(true)
    try {
      const [sData, poData, grnData] = await Promise.all([
        suppliersAPI.getAll(),
        purchaseOrdersAPI.getAll(),
        grnAPI.getAll()
      ])
      setSuppliers(sData || [])
      setPurchaseOrders(poData?.filter(po => po.status === 'Sent' || po.status === 'Partially Received') || [])
      setGrns(grnData || [])
    } catch (error) {
      notify("Error", "Could not synchronize data.", "destructive")
    } finally {
      setFetchLoading(false)
    }
  }

  const filteredGRNs = useMemo(() => {
    return grns
      .filter(grn => {
        if (filters.status && grn.status !== filters.status) return false
        if (filters.supplier && grn.supplierId !== filters.supplier) return false
        if (filters.search && !grn.grnNumber.toLowerCase().includes(filters.search.toLowerCase())) return false
        return true
      })
      .sort((a, b) => new Date(b.createdAt || b.receivedDate) - new Date(a.createdAt || a.receivedDate))
  }, [grns, filters])

  const handleSubmit = async (grnData) => {
    setLoading(true)
    try {
      const status = determineGRNStatus(grnData.items)
      const finalData = { ...grnData, status }

      if (isEditing) {
        await grnAPI.update(grnToProcess._id, finalData)
        notify("Success", "GRN updated successfully.")
      } else {
        await grnAPI.create(finalData)
        notify("Inventory Updated", `Stock increased immediately.`)
      }
      setIsModalOpen(false)
      fetchAllData()
    } catch (error) {
      notify("Error", error.response?.data?.message || "Operation failed", "destructive")
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmDelete = async () => {
    try {
      await grnAPI.delete(grnToProcess._id)
      notify("Deleted", "GRN record removed.")
      fetchAllData()
    } catch (error) {
      notify("Error", "Failed to delete record.", "destructive")
    } finally {
      setDeleteDialogOpen(false)
    }
  }

  const handleConfirmApprove = async () => {
    try {
      await grnAPI.approve(grnToProcess._id)
      notify("Approved", "GRN record is now locked and finalized.")
      fetchAllData()
    } catch (error) {
      notify("Error", "Approval failed.", "destructive")
    } finally {
      setApproveDialogOpen(false)
    }
  }

  return (
    <div className="space-y-6 mx-auto p-4 sm:p-6">
      {/* Toast Notification Area */}
      {notification && (
        <div className="fixed top-4 right-4 z-[100] w-full max-w-sm animate-in slide-in-from-right-5">
          <Alert variant={notification.type === "destructive" ? "destructive" : "default"} className="bg-card shadow-2xl border-primary/20">
            {notification.type === "destructive" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4 text-green-500" />}
            <AlertTitle>{notification.title}</AlertTitle>
            <AlertDescription>{notification.message}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Header */}
      <Card className="border-none shadow-sm bg-gradient-to-br from-card to-muted/30">
        <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl sm:text-3xl font-bold flex items-center">
              <ClipboardList className="w-8 h-8 mr-3 text-primary" />
              Goods Receive Notes
            </CardTitle>
            <CardDescription>Receive and manage goods from purchase orders</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchAllData} disabled={fetchLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${fetchLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={() => { setIsEditing(false); setIsModalOpen(true); setFormData({ ...formData, receivedDate: new Date().toISOString().split('T')[0] }); }}>
              <Plus className="w-4 h-4 mr-2" />
              New GRN
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Info Alert */}
      <Alert className="bg-blue-500/5 border-blue-500/20 text-blue-700 dark:text-blue-400">
        <Info className="h-4 w-4" />
        <AlertTitle>Inventory Process</AlertTitle>
        <AlertDescription>
          Stock is automatically updated upon GRN creation. Approval locks the record for audit.
        </AlertDescription>
      </Alert>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard label="Total GRNs" value={grns.length} icon={ClipboardList} color="blue" />
        <StatsCard label="Available POs" value={purchaseOrders.length} icon={ShoppingCart} color="green" />
        <StatsCard label="Suppliers" value={suppliers.length} icon={Users} color="purple" />
      </div>

      <GRNFilter filters={filters} onFilterChange={setFilters} suppliers={suppliers} resultsCount={filteredGRNs.length} totalCount={grns.length} />

      <GRNList 
        grns={filteredGRNs} 
        suppliers={suppliers} 
        loading={fetchLoading} 
        onView={(grn) => { setSelectedGRN(grn); setIsViewOpen(true); }}
        onEdit={(grn) => { setGrnToProcess(grn); setIsEditing(true); setFormData(grn); setIsModalOpen(true); }}
        onDelete={(grn) => { setGrnToProcess(grn); setDeleteDialogOpen(true); }}
        onApprove={(grn) => { setGrnToProcess(grn); setApproveDialogOpen(true); }}
      />

      {/* Modals & Dialogs */}
      <GRNForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} formData={formData} setFormData={setFormData} purchaseOrders={purchaseOrders} loading={loading} onSubmit={handleSubmit} isEditing={isEditing} />
      
      {/* Separated View Component for cleaner logic */}
      <GRNViewModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} grn={selectedGRN} suppliers={suppliers} />

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete GRN <span className="font-mono font-bold text-foreground">{grnToProcess?.grnNumber}</span>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete Record</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Approve Dialog */}
      <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve & Lock GRN?</AlertDialogTitle>
            <AlertDialogDescription>
              Approving <span className="font-bold text-foreground">{grnToProcess?.grnNumber}</span> will lock the record for auditing. You won't be able to edit this receipt later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmApprove}>Finalize Approval</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default GRNManage
