import React, { useState, useEffect, useMemo } from 'react'
import { Plus, RefreshCw, FileText, Users, Package, Info } from 'lucide-react'
import Swal from 'sweetalert2'
import Button from '../../Components/UI/Button'
import StatsCard from '../../Shared/StatsCard/StatsCard'
import POForm from './components/POForm'
import POList from './components/POList'
import POFilter from './components/POFilter'
import { suppliersAPI, productsAPI, purchaseOrdersAPI } from './services/poService'
import { getStatusColor, formatCurrency, formatDate } from './utils/poHelpers'

const ManagePO = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [suppliers, setSuppliers] = useState([])
  const [products, setProducts] = useState([])
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingPO, setEditingPO] = useState(null)
  
  // Filter state
  const [filters, setFilters] = useState({
    status: '',
    supplier: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  })

  // Initial form state
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

  // Fetch initial data
  useEffect(() => {
    fetchAllData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchAllData = async () => {
    await Promise.all([
      fetchSuppliers(),
      fetchProducts(),
      fetchPurchaseOrders()
    ])
  }

  const fetchSuppliers = async () => {
    try {
      const data = await suppliersAPI.getAll()
      setSuppliers(data || [])
    } catch (error) {
      console.error('Error fetching suppliers:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch suppliers. Please try again.',
        confirmButtonColor: '#3B82F6'
      })
    }
  }

  const fetchProducts = async () => {
    try {
      const data = await productsAPI.getAll()
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch products. Please try again.',
        confirmButtonColor: '#3B82F6'
      })
    }
  }

  const fetchPurchaseOrders = async () => {
    try {
      setFetchLoading(true)
      const data = await purchaseOrdersAPI.getAll()
      setPurchaseOrders(data || [])
    } catch (error) {
      console.error('Error fetching purchase orders:', error)
    } finally {
      setFetchLoading(false)
    }
  }

  // Filter handler
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  // Filtered and sorted purchase orders
  const filteredPurchaseOrders = useMemo(() => {
    const filtered = purchaseOrders.filter(po => {
      // Status filter
      if (filters.status && po.status !== filters.status) {
        return false
      }

      // Supplier filter
      if (filters.supplier && po.supplier !== filters.supplier) {
        return false
      }

      // Date from filter
      if (filters.dateFrom) {
        const poDate = new Date(po.poDate)
        const fromDate = new Date(filters.dateFrom)
        if (poDate < fromDate) {
          return false
        }
      }

      // Date to filter
      if (filters.dateTo) {
        const poDate = new Date(po.poDate)
        const toDate = new Date(filters.dateTo)
        if (poDate > toDate) {
          return false
        }
      }

      // Search filter (PO Number)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        if (!po.poNumber.toLowerCase().includes(searchLower)) {
          return false
        }
      }

      return true
    })

    // Sort by newest first with multi-level fallback (createdAt -> _id -> poDate)
    return filtered.sort((a, b) => {
      // Try sorting by createdAt first
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
      
      // Fallback to _id (MongoDB ObjectIds are sortable by creation time)
      if (a._id && b._id && a._id !== b._id) {
        return b._id.localeCompare(a._id)
      }
      
      // Final fallback to poDate
      if (a.poDate && b.poDate) {
        return new Date(b.poDate) - new Date(a.poDate)
      }
      
      return 0
    })
  }, [purchaseOrders, filters])

  const handleOpenModal = () => {
    setIsModalOpen(true)
    setIsEditing(false)
    setEditingPO(null)
    setFormData(initialFormState)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setIsEditing(false)
    setEditingPO(null)
    setFormData(initialFormState)
  }

  const handleSubmit = async ({ subtotal, taxAmount, total }) => {
    try {
      setLoading(true)
      
      const poData = {
        ...formData,
        subtotal,
        taxAmount,
        total,
        status: isEditing ? formData.status : 'Pending'
      }

      if (isEditing && editingPO) {
        // Update existing PO
        await purchaseOrdersAPI.update(editingPO._id, poData)
        await Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Purchase Order updated successfully',
          confirmButtonColor: '#3B82F6',
          timer: 2000,
          showConfirmButton: false
        })
      } else {
        // Create new PO
        await purchaseOrdersAPI.create(poData)
        await Swal.fire({
          icon: 'success',
          title: 'Created!',
          text: 'Purchase Order created successfully',
          confirmButtonColor: '#3B82F6',
          timer: 2000,
          showConfirmButton: false
        })
      }

      await fetchPurchaseOrders()
      handleCloseModal()
    } catch (error) {
      console.error('Error saving purchase order:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to save purchase order',
        confirmButtonColor: '#3B82F6'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleView = (po) => {
    const supplier = suppliers.find(s => s._id === po.supplier)
    const itemsTable = po.items?.map((item, index) => `
      <tr class="border-b">
        <td class="py-2 px-3 text-left">${index + 1}</td>
        <td class="py-2 px-3 text-left">${item.productName || 'N/A'}</td>
        <td class="py-2 px-3 text-center">${item.quantity}</td>
        <td class="py-2 px-3 text-right">${formatCurrency(item.unitPrice)}</td>
        <td class="py-2 px-3 text-right font-semibold">${formatCurrency(item.subtotal)}</td>
      </tr>
    `).join('') || '<tr><td colspan="5" class="py-4 text-center text-gray-500">No items</td></tr>'

    Swal.fire({
      title: `<div class="flex items-center justify-center"><svg class="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>Purchase Order: ${po.poNumber}</div>`,
      html: `
        <div class="text-left space-y-4 max-h-96 overflow-y-auto">
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p class="text-gray-600 font-semibold">Supplier</p>
              <p class="text-gray-900">${supplier?.supplierName || 'N/A'}</p>
            </div>
            <div>
              <p class="text-gray-600 font-semibold">PO Date</p>
              <p class="text-gray-900">${formatDate(po.poDate)}</p>
            </div>
            <div>
              <p class="text-gray-600 font-semibold">Expected Delivery</p>
              <p class="text-gray-900">${formatDate(po.expectedDeliveryDate)}</p>
            </div>
            <div>
              <p class="text-gray-600 font-semibold">Status</p>
              <p><span class="px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(po.status)}">${po.status}</span></p>
            </div>
          </div>
          
          <div class="mt-4">
            <p class="text-gray-600 font-semibold mb-2">Items</p>
            <div class="overflow-x-auto border rounded-lg">
              <table class="min-w-full text-sm">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="py-2 px-3 text-left">#</th>
                    <th class="py-2 px-3 text-left">Product</th>
                    <th class="py-2 px-3 text-center">Qty</th>
                    <th class="py-2 px-3 text-right">Price</th>
                    <th class="py-2 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsTable}
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="border-t pt-3 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Subtotal:</span>
              <span class="font-semibold">${formatCurrency(po.subtotal)}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Tax (${po.tax}%):</span>
              <span class="font-semibold">${formatCurrency(po.taxAmount)}</span>
            </div>
            <div class="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span class="text-blue-600">${formatCurrency(po.total)}</span>
            </div>
          </div>
          
          ${po.notes ? `
            <div class="mt-3">
              <p class="text-gray-600 font-semibold mb-1">Notes</p>
              <p class="text-gray-700 text-sm bg-gray-50 p-3 rounded">${po.notes}</p>
            </div>
          ` : ''}
        </div>
      `,
      width: '800px',
      confirmButtonColor: '#3B82F6',
      confirmButtonText: 'Close',
      customClass: {
        htmlContainer: 'text-left'
      }
    })
  }

  const handleEdit = (po) => {
    setIsEditing(true)
    setEditingPO(po)
    setFormData({
      supplier: po.supplier,
      poNumber: po.poNumber,
      poDate: po.poDate?.split('T')[0] || po.poDate,
      expectedDeliveryDate: po.expectedDeliveryDate?.split('T')[0] || po.expectedDeliveryDate,
      items: po.items || [],
      notes: po.notes || '',
      tax: po.tax || 0,
      status: po.status
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (po) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      html: `<p>You are about to delete:</p><p class="font-bold text-lg mt-2">${po.poNumber}</p><p class="text-sm text-gray-600 mt-1">This action cannot be undone.</p>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      focusCancel: true
    })

    if (result.isConfirmed) {
      try {
        await purchaseOrdersAPI.delete(po._id)
        await Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Purchase order has been deleted.',
          confirmButtonColor: '#3B82F6',
          timer: 2000,
          showConfirmButton: false
        })
        await fetchPurchaseOrders()
      } catch (error) {
        console.error('Error deleting purchase order:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to delete purchase order',
          confirmButtonColor: '#3B82F6'
        })
      }
    }
  }

  const handleSend = async (po) => {
    const supplier = suppliers.find(s => s._id === po.supplier)
    
    const result = await Swal.fire({
      title: 'Send Purchase Order?',
      html: `
        <div class="text-left space-y-2">
          <p class="text-gray-700">You are about to send <strong>${po.poNumber}</strong> to:</p>
          <div class="bg-blue-50 p-3 rounded-lg mt-2">
            <p class="font-semibold text-gray-900">${supplier?.supplierName || 'N/A'}</p>
            <p class="text-sm text-gray-600">${supplier?.email || 'No email available'}</p>
          </div>
          <p class="text-sm text-gray-600 mt-2">Total Amount: <strong>${formatCurrency(po.total)}</strong></p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, send it!',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      try {
        await purchaseOrdersAPI.send(po._id)
        await Swal.fire({
          icon: 'success',
          title: 'Sent!',
          text: 'Purchase order has been sent to supplier.',
          confirmButtonColor: '#3B82F6',
          timer: 2000,
          showConfirmButton: false
        })
        await fetchPurchaseOrders()
      } catch (error) {
        console.error('Error sending purchase order:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to send purchase order',
          confirmButtonColor: '#3B82F6'
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Purchase Orders
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Create and manage purchase orders for your suppliers
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={fetchAllData}
              disabled={fetchLoading}
              loading={fetchLoading}
              className="w-full sm:w-auto flex items-center justify-center"
            >
              <div className="flex items-center">
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="text-sm sm:text-base">Refresh</span>
              </div>
            </Button>
            <Button 
              variant="primary" 
              size="sm"
              onClick={handleOpenModal}
              className="w-full sm:w-auto flex items-center justify-center"
            >
              <div className="flex items-center">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="text-sm sm:text-base">New Purchase Order</span>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-blue-900">Purchase Order Management</p>
          <p className="text-sm text-blue-700 mt-1">
            Create purchase orders for your suppliers, track their status, and manage the ordering process. 
            POs can be sent to suppliers and converted to GRNs when goods are received.
          </p>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          label="Total Purchase Orders"
          value={purchaseOrders.length}
          icon={FileText}
          color="blue"
        />
        <StatsCard
          label="Active Suppliers"
          value={suppliers.length}
          icon={Users}
          color="green"
        />
        <StatsCard
          label="Available Products"
          value={products.length}
          icon={Package}
          color="purple"
        />
      </div>

      {/* Filter Section */}
      <POFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        suppliers={suppliers}
        resultsCount={filteredPurchaseOrders.length}
        totalCount={purchaseOrders.length}
      />

      {/* PO List Table */}
      <POList
        purchaseOrders={filteredPurchaseOrders}
        suppliers={suppliers}
        loading={fetchLoading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSend={handleSend}
      />

      {/* Create/Edit PO Form Modal */}
      <POForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        formData={formData}
        setFormData={setFormData}
        suppliers={suppliers}
        products={products}
        loading={loading}
        onSubmit={handleSubmit}
        isEditing={isEditing}
      />
    </div>
  )
}

export default ManagePO
