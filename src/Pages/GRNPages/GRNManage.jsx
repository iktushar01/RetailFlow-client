import React, { useState, useEffect, useMemo } from 'react'
import { Plus, RefreshCw, ClipboardList, ShoppingCart, Users, Info } from 'lucide-react'
import Swal from 'sweetalert2'
import Button from '../../Components/UI/Button'
import StatsCard from '../../Shared/StatsCard/StatsCard'
import GRNForm from './components/GRNForm'
import GRNList from './components/GRNList'
import GRNFilter from './components/GRNFilter'
import { grnAPI, purchaseOrdersAPI, suppliersAPI } from './services/grnService'
import { getStatusColor, formatDate, determineGRNStatus } from './utils/grnHelpers'

const GRNManage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [suppliers, setSuppliers] = useState([])
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [grns, setGrns] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingGRN, setEditingGRN] = useState(null)
  
  // Filter state
  const [filters, setFilters] = useState({
    status: '',
    supplier: '',
    poNumber: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  })

  // Initial form state
  const initialFormState = {
    grnNumber: '',
    poId: '',
    poNumber: '',
    supplierId: '',
    receivedDate: new Date().toISOString().split('T')[0],
    items: [],
    notes: '',
    status: 'Pending'
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
      fetchPurchaseOrders(),
      fetchGRNs()
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

  const fetchPurchaseOrders = async () => {
    try {
      // Fetch POs that are sent or partially received (not fully received yet)
      const allPOs = await purchaseOrdersAPI.getAll()
      const availablePOs = allPOs.filter(po => 
        po.status === 'Sent' || po.status === 'Partially Received'
      )
      setPurchaseOrders(availablePOs || [])
    } catch (error) {
      console.error('Error fetching purchase orders:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch purchase orders. Please try again.',
        confirmButtonColor: '#3B82F6'
      })
    }
  }

  const fetchGRNs = async () => {
    try {
      setFetchLoading(true)
      const data = await grnAPI.getAll()
      setGrns(data || [])
    } catch (error) {
      console.error('Error fetching GRNs:', error)
    } finally {
      setFetchLoading(false)
    }
  }

  // Filter handler
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  // Filtered and sorted GRNs
  const filteredGRNs = useMemo(() => {
    const filtered = grns.filter(grn => {
      // Status filter
      if (filters.status && grn.status !== filters.status) {
        return false
      }

      // Supplier filter
      if (filters.supplier && grn.supplierId !== filters.supplier) {
        return false
      }

      // Date from filter
      if (filters.dateFrom) {
        const grnDate = new Date(grn.receivedDate)
        const fromDate = new Date(filters.dateFrom)
        if (grnDate < fromDate) {
          return false
        }
      }

      // Date to filter
      if (filters.dateTo) {
        const grnDate = new Date(grn.receivedDate)
        const toDate = new Date(filters.dateTo)
        if (grnDate > toDate) {
          return false
        }
      }

      // Search filter (GRN Number)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        if (!grn.grnNumber.toLowerCase().includes(searchLower)) {
          return false
        }
      }

      return true
    })

    // Sort by newest first with multi-level fallback (createdAt -> _id -> receivedDate)
    return filtered.sort((a, b) => {
      // Try sorting by createdAt first
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
      
      // Fallback to _id (MongoDB ObjectIds are sortable by creation time)
      if (a._id && b._id && a._id !== b._id) {
        return b._id.localeCompare(a._id)
      }
      
      // Final fallback to receivedDate
      if (a.receivedDate && b.receivedDate) {
        return new Date(b.receivedDate) - new Date(a.receivedDate)
      }
      
      return 0
    })
  }, [grns, filters])

  const handleOpenModal = () => {
    setIsModalOpen(true)
    setIsEditing(false)
    setEditingGRN(null)
    setFormData(initialFormState)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setIsEditing(false)
    setEditingGRN(null)
    setFormData(initialFormState)
  }

  const handleSubmit = async (grnData) => {
    try {
      setLoading(true)
      
      // Determine status based on received quantities
      const status = determineGRNStatus(grnData.items)
      
      const finalGRNData = {
        ...grnData,
        status
      }

      if (isEditing && editingGRN) {
        // Update existing GRN
        await grnAPI.update(editingGRN._id, finalGRNData)
        await Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'GRN updated successfully',
          confirmButtonColor: '#3B82F6',
          timer: 2000,
          showConfirmButton: false
        })
      } else {
        // Create new GRN
        await grnAPI.create(finalGRNData)
        
        const totalReceived = finalGRNData.items.reduce((sum, item) => sum + (item.receivedQty || 0), 0)
        
        await Swal.fire({
          icon: 'success',
          title: '✅ GRN Created Successfully!',
          html: `
            <div class="text-left space-y-3">
              <p class="text-lg font-semibold text-gray-900">📦 Inventory Updated Immediately!</p>
              <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                <p class="text-sm text-gray-700">✅ <strong>${totalReceived} items</strong> added to stock RIGHT NOW</p>
                <p class="text-sm text-gray-700">✅ Items are <strong>available for sale/use</strong> immediately</p>
                <p class="text-sm text-gray-700">✅ PO status updated</p>
              </div>
              <p class="text-xs text-gray-600 mt-2">
                💡 <em>Note: Approval is for authorization/audit, not inventory update. Stock is already updated!</em>
              </p>
            </div>
          `,
          confirmButtonColor: '#3B82F6',
          confirmButtonText: 'Got it!',
          timer: 5000,
          timerProgressBar: true
        })
      }

      await fetchAllData()
      handleCloseModal()
    } catch (error) {
      console.error('Error saving GRN:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to save GRN',
        confirmButtonColor: '#3B82F6'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleView = (grn) => {
    const supplier = suppliers.find(s => s._id === grn.supplierId)
    const itemsTable = grn.items?.map((item, index) => `
      <tr class="border-b">
        <td class="py-2 px-3 text-left">${index + 1}</td>
        <td class="py-2 px-3 text-left">${item.productName || 'N/A'}</td>
        <td class="py-2 px-3 text-center">${item.orderedQty}</td>
        <td class="py-2 px-3 text-center font-semibold text-green-600">${item.receivedQty}</td>
        <td class="py-2 px-3 text-center">${item.batch || 'N/A'}</td>
        <td class="py-2 px-3 text-center">${item.expiry ? new Date(item.expiry).toLocaleDateString() : 'N/A'}</td>
      </tr>
    `).join('') || '<tr><td colspan="6" class="py-4 text-center text-gray-500">No items</td></tr>'

    const totalOrdered = grn.items?.reduce((sum, item) => sum + (item.orderedQty || 0), 0) || 0
    const totalReceived = grn.items?.reduce((sum, item) => sum + (item.receivedQty || 0), 0) || 0
    const completionPercentage = totalOrdered > 0 ? Math.round((totalReceived / totalOrdered) * 100) : 0

    Swal.fire({
      title: `<div class="flex items-center justify-center"><svg class="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>GRN: ${grn.grnNumber}</div>`,
      html: `
        <div class="text-left space-y-4 max-h-96 overflow-y-auto">
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p class="text-gray-600 font-semibold">PO Number</p>
              <p class="text-gray-900 font-mono">${grn.poNumber || 'N/A'}</p>
            </div>
            <div>
              <p class="text-gray-600 font-semibold">Supplier</p>
              <p class="text-gray-900">${supplier?.supplierName || 'N/A'}</p>
            </div>
            <div>
              <p class="text-gray-600 font-semibold">Received Date</p>
              <p class="text-gray-900">${formatDate(grn.receivedDate)}</p>
            </div>
            <div>
              <p class="text-gray-600 font-semibold">Status</p>
              <p><span class="px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(grn.status)}">${grn.status}</span></p>
            </div>
          </div>
          
          <div class="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div class="grid grid-cols-3 gap-3 text-center">
              <div>
                <p class="text-xs text-gray-600">Total Ordered</p>
                <p class="text-lg font-bold text-gray-900">${totalOrdered}</p>
              </div>
              <div>
                <p class="text-xs text-gray-600">Total Received</p>
                <p class="text-lg font-bold text-green-600">${totalReceived}</p>
              </div>
              <div>
                <p class="text-xs text-gray-600">Completion</p>
                <p class="text-lg font-bold text-blue-600">${completionPercentage}%</p>
              </div>
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
                    <th class="py-2 px-3 text-center">Ordered</th>
                    <th class="py-2 px-3 text-center">Received</th>
                    <th class="py-2 px-3 text-center">Batch</th>
                    <th class="py-2 px-3 text-center">Expiry</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsTable}
                </tbody>
              </table>
            </div>
          </div>
          
          ${grn.notes ? `
            <div class="mt-3">
              <p class="text-gray-600 font-semibold mb-1">Notes</p>
              <p class="text-gray-700 text-sm bg-gray-50 p-3 rounded">${grn.notes}</p>
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

  const handleEdit = (grn) => {
    setIsEditing(true)
    setEditingGRN(grn)
    setFormData({
      grnNumber: grn.grnNumber,
      poId: grn.poId,
      poNumber: grn.poNumber,
      supplierId: grn.supplierId,
      receivedDate: grn.receivedDate?.split('T')[0] || grn.receivedDate,
      items: grn.items || [],
      notes: grn.notes || '',
      status: grn.status
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (grn) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      html: `<p>You are about to delete:</p><p class="font-bold text-lg mt-2">${grn.grnNumber}</p><p class="text-sm text-gray-600 mt-1">This action cannot be undone.</p>`,
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
        await grnAPI.delete(grn._id)
        await Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'GRN has been deleted.',
          confirmButtonColor: '#3B82F6',
          timer: 2000,
          showConfirmButton: false
        })
        await fetchAllData()
      } catch (error) {
        console.error('Error deleting GRN:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to delete GRN',
          confirmButtonColor: '#3B82F6'
        })
      }
    }
  }

  const handleApprove = async (grn) => {
    const totalItems = grn.items?.reduce((sum, item) => sum + (item.receivedQty || 0), 0) || 0
    const totalOrdered = grn.items?.reduce((sum, item) => sum + (item.orderedQty || 0), 0) || 0
    const isPartialReceipt = grn.status === 'Partially Received'
    
    const result = await Swal.fire({
      title: 'Approve GRN?',
      html: `
        <div class="text-left space-y-3">
          <p class="text-gray-700">You are about to approve <strong class="text-blue-600">${grn.grnNumber}</strong></p>
          
          <div class="${isPartialReceipt ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'} p-3 rounded-lg border">
            <p class="text-sm text-gray-700"><strong>PO:</strong> ${grn.poNumber}</p>
            <p class="text-sm text-gray-700"><strong>Received:</strong> ${totalItems} of ${totalOrdered} units</p>
            <p class="text-sm text-gray-700"><strong>Status:</strong> ${isPartialReceipt ? 'Partial receipt' : 'All items fully received'} ${isPartialReceipt ? '⚠️' : '✅'}</p>
          </div>
          
          ${isPartialReceipt ? `
            <div class="bg-orange-50 p-3 rounded-lg border border-orange-200">
              <p class="text-xs text-gray-700"><strong>⚠️ Partial Receipt:</strong></p>
              <p class="text-xs text-gray-600 mt-1">
                This GRN is for a partial receipt. Additional GRNs can still be created for remaining items from PO ${grn.poNumber}.
              </p>
            </div>
          ` : ''}
          
          <div class="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p class="text-xs text-gray-700"><strong>ℹ️ What approval does:</strong></p>
            <ul class="text-xs text-gray-600 mt-1 ml-4 list-disc space-y-1">
              <li>Locks this GRN (cannot edit/delete)</li>
              <li>Completes audit trail for this receipt</li>
              <li>Finalizes payment record for received items</li>
              ${isPartialReceipt ? '<li>Allows additional GRNs for remaining items</li>' : ''}
            </ul>
            <p class="text-xs text-gray-500 mt-2">
              <em>Note: Inventory was already updated when GRN was created</em>
            </p>
          </div>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, approve it!',
      cancelButtonText: 'Cancel',
      width: '600px'
    })

    if (result.isConfirmed) {
      try {
        await grnAPI.approve(grn._id)
        await Swal.fire({
          icon: 'success',
          title: '✅ GRN Approved!',
          html: `
            <div class="text-left space-y-2">
              <p class="text-gray-700"><strong>${grn.grnNumber}</strong> has been approved and locked.</p>
              <div class="bg-green-50 p-3 rounded-lg border border-green-200 text-sm">
                <p class="text-gray-700">✅ Audit trail completed</p>
                <p class="text-gray-700">✅ Payment record finalized</p>
                <p class="text-gray-700">✅ GRN locked for data integrity</p>
              </div>
              <p class="text-xs text-gray-500 mt-2">
                <em>Inventory remains unchanged (was updated when GRN was created)</em>
              </p>
            </div>
          `,
          confirmButtonColor: '#3B82F6',
          confirmButtonText: 'OK',
          timer: 4000,
          timerProgressBar: true
        })
        await fetchAllData()
      } catch (error) {
        console.error('Error approving GRN:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to approve GRN',
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Goods Receive Notes (GRN)
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Receive and manage goods from purchase orders
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
                <span className="text-sm sm:text-base">New GRN</span>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-blue-900">Goods Receive Note (GRN) Process</p>
          <p className="text-sm text-blue-700 mt-1">
            Record received goods from purchase orders. Stock is automatically updated to inventory upon GRN creation.
            GRNs can be approved to finalize the receiving process and lock the record for audit purposes.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          label="Total GRNs"
          value={grns.length}
          icon={ClipboardList}
          color="blue"
        />
        <StatsCard
          label="Available POs"
          value={purchaseOrders.length}
          icon={ShoppingCart}
          color="green"
        />
        <StatsCard
          label="Active Suppliers"
          value={suppliers.length}
          icon={Users}
          color="purple"
        />
      </div>

      {/* Filter Section */}
      <GRNFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        suppliers={suppliers}
        resultsCount={filteredGRNs.length}
        totalCount={grns.length}
      />

      {/* GRN List Table */}
      <GRNList
        grns={filteredGRNs}
        suppliers={suppliers}
        loading={fetchLoading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onApprove={handleApprove}
      />

      {/* Create/Edit GRN Form Modal */}
      <GRNForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        formData={formData}
        setFormData={setFormData}
        purchaseOrders={purchaseOrders}
        loading={loading}
        onSubmit={handleSubmit}
        isEditing={isEditing}
      />
    </div>
  )
}

export default GRNManage
