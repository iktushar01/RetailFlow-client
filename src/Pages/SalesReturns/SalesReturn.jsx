import React, { useState, useEffect, useCallback } from 'react'
import { RotateCcw, Plus, RefreshCw, Info, XCircle } from 'lucide-react'
import Swal from 'sweetalert2'
import Button from '../../Components/UI/Button'
import InfoCard from '../../Shared/InfoCard/InfoCard'
import ReturnsList from './components/ReturnsList'
import ReturnFilter from './components/ReturnFilter'
import ReturnModal from './components/ReturnModal'
import { returnsAPI, salesAPI } from './services/returnsService'
import { applyReturnFilters, getStatusColor, formatDateTime } from './utils/returnsHelpers'

const SalesReturn = () => {
  const [returns, setReturns] = useState([])
  const [invoices, setInvoices] = useState([])
  const [filteredReturns, setFilteredReturns] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedReturn, setSelectedReturn] = useState(null)
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const applyFilters = useCallback(() => {
    const filtered = applyReturnFilters(returns, filters)
    setFilteredReturns(filtered)
  }, [returns, filters])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [returnsData, invoicesData] = await Promise.all([
        returnsAPI.getAll(),
        salesAPI.getAll()
      ])
      console.log("=== FETCHED RETURNS ===");
      console.log("Total returns:", returnsData.length);
      if (returnsData.length > 0) {
        console.log("Sample return data:", returnsData[0]);
        console.log("Sample return reason:", returnsData[0].reason);
      }
      setReturns(returnsData)
      setInvoices(invoicesData.filter(inv => inv.status !== 'Hold'))
    } catch (error) {
      console.error('Error fetching data:', error)
      Swal.fire('Error', 'Failed to load data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({ search: '', status: '', dateFrom: '', dateTo: '' })
  }

  const handleCreate = () => {
    setModalOpen(true)
  }

  const handleView = (returnItem) => {
    console.log("=== VIEWING RETURN ===");
    console.log("Return item data:", returnItem);
    console.log("Return reason:", returnItem.reason);
    setSelectedReturn(returnItem)
    setViewModalOpen(true)
  }

  const handleSave = async (returnData) => {
    try {
      console.log("=== SAVING RETURN ===");
      console.log("Return data to save:", returnData);
      console.log("Return reason:", returnData.reason);
      await returnsAPI.create(returnData)
      await Swal.fire('Success!', 'Return created successfully', 'success')
      setModalOpen(false)
      fetchData()
    } catch (error) {
      console.error('Error creating return:', error)
      Swal.fire('Error', 'Failed to create return', 'error')
    }
  }

  const handleApprove = async (returnItem) => {
    const result = await Swal.fire({
      title: 'Approve Return?',
      text: 'Stock will be adjusted automatically',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      confirmButtonText: 'Yes, approve it!'
    })

    if (result.isConfirmed) {
      try {
        await returnsAPI.approve(returnItem._id)
        await Swal.fire('Approved!', 'Return approved and stock adjusted', 'success')
        fetchData()
      } catch (error) {
        console.error('Error approving return:', error)
        Swal.fire('Error', 'Failed to approve return', 'error')
      }
    }
  }

  const handleReject = async (returnItem) => {
    const result = await Swal.fire({
      title: 'Reject Return?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, reject it!'
    })

    if (result.isConfirmed) {
      try {
        await returnsAPI.reject(returnItem._id)
        await Swal.fire('Rejected!', 'Return has been rejected', 'success')
        fetchData()
      } catch (error) {
        console.error('Error rejecting return:', error)
        Swal.fire('Error', 'Failed to reject return', 'error')
      }
    }
  }

  const handleDelete = async (returnItem) => {
    const result = await Swal.fire({
      title: 'Delete Return?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!'
    })

    if (result.isConfirmed) {
      try {
        await returnsAPI.delete(returnItem._id)
        await Swal.fire('Deleted!', 'Return has been deleted', 'success')
        fetchData()
      } catch (error) {
        Swal.fire('Error', error.response?.data?.message || 'Failed to delete return', 'error')
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <RotateCcw className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-red-600" />
              Sales Returns
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Manage product returns and stock adjustments</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button variant="secondary" size="sm" onClick={fetchData} className="w-full sm:w-auto flex items-center justify-center">
              <div className="flex items-center">
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="text-sm sm:text-base">Refresh</span>
              </div>
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreate} className="w-full sm:w-auto flex items-center justify-center">
              <div className="flex items-center">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="text-sm sm:text-base">New Return</span>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <InfoCard
        type="warning"
        title="Sales Returns Management"
        message="Process customer returns, manage refunds, and automatically adjust inventory. Returns must be approved before stock adjustments are made to maintain accurate inventory levels."
        icon={Info}
      />

      <ReturnFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        resultsCount={filteredReturns.length}
        totalCount={returns.length}
      />

      <ReturnsList
        returns={filteredReturns}
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={handleDelete}
        onView={handleView}
        loading={loading}
      />

      <ReturnModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        invoices={invoices}
      />

      {/* View Return Modal */}
      {viewModalOpen && selectedReturn && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Return Details</h3>
              <button
                onClick={() => setViewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Return Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Return ID</label>
                  <p className="text-sm text-gray-900 font-mono">{selectedReturn.returnId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Invoice No</label>
                  <p className="text-sm text-gray-900">{selectedReturn.invoiceNo}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer</label>
                  <p className="text-sm text-gray-900">{selectedReturn.customerName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedReturn.status)}`}>
                    {selectedReturn.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reason</label>
                  <p className="text-sm text-gray-900">{selectedReturn.reason || 'No reason provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <p className="text-sm text-gray-900">{formatDateTime(selectedReturn.createdAt)}</p>
                </div>
              </div>

              {/* Items */}
              {selectedReturn.items && selectedReturn.items.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Returned Items</label>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedReturn.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm text-gray-900">{item.productName}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{item.reason || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedReturn.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedReturn.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <Button
                variant="secondary"
                onClick={() => setViewModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SalesReturn