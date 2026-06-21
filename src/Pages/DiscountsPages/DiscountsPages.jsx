import React, { useState, useEffect, useCallback } from 'react'
import { Tag, Plus, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react'
// Importing via relative paths to ensure Vite resolves them correctly
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
} from "../../Components/UI/alert-dialog"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../Components/UI/card"
import { Alert, AlertDescription, AlertTitle } from "../../Components/UI/alert"

import DiscountsList from './components/DiscountsList'
import DiscountFilter from './components/DiscountFilter'
import DiscountModal from './components/DiscountModal'
import { discountsAPI, productsAPI } from './services/discountsService'
import { applyDiscountFilters } from './utils/discountsHelpers'

const DiscountsPages = () => {
  const [discounts, setDiscounts] = useState([])
  const [products, setProducts] = useState([])
  const [filteredDiscounts, setFilteredDiscounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedDiscount, setSelectedDiscount] = useState(null)

  // Local notification state
  const [notification, setNotification] = useState(null)

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [discountToDelete, setDiscountToDelete] = useState(null)

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    type: ''
  })

  // Helper to show local alerts that disappear
  const showAlert = (title, message, type = "default") => {
    setNotification({ title, message, type })
    setTimeout(() => setNotification(null), 4000)
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const [discountsData, productsData] = await Promise.all([
        discountsAPI.getAll(),
        productsAPI.getAll()
      ])
      setDiscounts(discountsData)
      setProducts(productsData)
    } catch (error) {
      showAlert("Error", "Failed to load data.", "destructive")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const applyFilters = useCallback(() => {
    const filtered = applyDiscountFilters(discounts, filters)
    setFilteredDiscounts(filtered)
  }, [discounts, filters])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const handleSave = async (discountData) => {
    try {
      if (selectedDiscount) {
        await discountsAPI.update(selectedDiscount._id, discountData)
        showAlert("Updated", "Discount updated successfully.")
      } else {
        await discountsAPI.create(discountData)
        showAlert("Created", "New discount added.")
      }
      setModalOpen(false)
      fetchData()
    } catch (error) {
      showAlert("Error", "Failed to save changes.", "destructive")
    }
  }

  const handleConfirmDelete = async () => {
    try {
      await discountsAPI.delete(discountToDelete._id)
      showAlert("Deleted", "The offer has been removed.")
      fetchData()
    } catch (error) {
      showAlert("Error", "Delete operation failed.", "destructive")
    } finally {
      setDeleteConfirmOpen(false)
      setDiscountToDelete(null)
    }
  }

  return (
    <div className="space-y-6 mx-auto">
      {/* Floating Notification using Shadcn Alert */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 w-80 animate-in fade-in slide-in-from-top-4">
          <Alert variant={notification.type === "destructive" ? "destructive" : "default"} className="bg-card border-border shadow-lg">
            {notification.type === "destructive" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4 text-green-500" />}
            <AlertTitle>{notification.title}</AlertTitle>
            <AlertDescription>{notification.message}</AlertDescription>
          </Alert>
        </div>
      )}

      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold flex items-center">
              <Tag className="w-6 h-6 mr-3 text-primary" />
              Discounts & Offers
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Manage promotional codes and active campaigns
            </CardDescription>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchData} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={() => { setSelectedDiscount(null); setModalOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Discount
            </Button>
          </div>
        </CardHeader>
      </Card>

      <DiscountFilter
        filters={filters}
        onFilterChange={(k, v) => setFilters(prev => ({ ...prev, [k]: v }))}
        onClearFilters={() => setFilters({ search: '', status: '', type: '' })}
        discounts={discounts}
        filteredDiscounts={filteredDiscounts}
        resultsCount={filteredDiscounts.length}
        totalCount={discounts.length}
      />

      <DiscountsList
        discounts={filteredDiscounts}
        onEdit={(d) => { setSelectedDiscount(d); setModalOpen(true); }}
        onDelete={(d) => { setDiscountToDelete(d); setDeleteConfirmOpen(true); }}
        onToggleStatus={fetchData}
        loading={loading}
      />

      <DiscountModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        discount={selectedDiscount}
        onSave={handleSave}
        products={products}
      />

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-bold">"{discountToDelete?.offerName}"</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Forever
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default DiscountsPages
