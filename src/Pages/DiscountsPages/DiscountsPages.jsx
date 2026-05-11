import React, { useState, useEffect, useCallback } from 'react'
import { Tag, Plus, RefreshCw } from 'lucide-react'
import Swal from 'sweetalert2'
import Button from '../../Components/UI/Button'
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
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    type: ''
  })

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
    setFilters({ search: '', status: '', type: '' })
  }

  const handleAdd = () => {
    setSelectedDiscount(null)
    setModalOpen(true)
  }

  const handleEdit = (discount) => {
    setSelectedDiscount(discount)
    setModalOpen(true)
  }

  const handleSave = async (discountData) => {
    try {
      if (selectedDiscount) {
        await discountsAPI.update(selectedDiscount._id, discountData)
        await Swal.fire('Updated!', 'Discount updated successfully', 'success')
      } else {
        await discountsAPI.create(discountData)
        await Swal.fire('Created!', 'Discount created successfully', 'success')
      }
      
      setModalOpen(false)
      fetchData()
    } catch (error) {
      console.error('Error saving discount:', error)
      Swal.fire('Error', 'Failed to save discount', 'error')
    }
  }

  const handleDelete = async (discount) => {
    const result = await Swal.fire({
      title: 'Delete Discount?',
      text: `Delete "${discount.offerName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!'
    })

    if (result.isConfirmed) {
      try {
        await discountsAPI.delete(discount._id)
        await Swal.fire('Deleted!', 'Discount deleted successfully', 'success')
        fetchData()
      } catch (error) {
        console.error('Error deleting discount:', error)
        Swal.fire('Error', 'Failed to delete discount', 'error')
      }
    }
  }

  const handleToggleStatus = async (discount) => {
    try {
      await discountsAPI.toggleStatus(discount._id)
      await Swal.fire('Success!', 'Discount status updated', 'success')
      fetchData()
    } catch (error) {
      console.error('Error updating status:', error)
      Swal.fire('Error', 'Failed to update status', 'error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <Tag className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-orange-600" />
              Discounts & Offers
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Manage promotional offers and discount codes</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button variant="secondary" size="sm" onClick={fetchData} className="w-full sm:w-auto flex items-center justify-center">
              <div className="flex items-center">
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="text-sm sm:text-base">Refresh</span>
              </div>
            </Button>
            <Button variant="primary" size="sm" onClick={handleAdd} className="w-full sm:w-auto flex items-center justify-center">
              <div className="flex items-center">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="text-sm sm:text-base">Add Discount</span>
              </div>
            </Button>
          </div>
        </div>
      </div>

      <DiscountFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        discounts={discounts}
        filteredDiscounts={filteredDiscounts}
        resultsCount={filteredDiscounts.length}
        totalCount={discounts.length}
      />

      <DiscountsList
        discounts={filteredDiscounts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        loading={loading}
      />

      <DiscountModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        discount={selectedDiscount}
        onSave={handleSave}
        products={products}
      />
    </div>
  )
}

export default DiscountsPages