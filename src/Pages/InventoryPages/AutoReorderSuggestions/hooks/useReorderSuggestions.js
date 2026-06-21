import { useState, useEffect, useCallback } from 'react'
import { retailApi } from '@/services/api'
import { toast } from 'sonner'

export const useReorderSuggestions = () => {
  const [suggestions, setSuggestions] = useState([])
  const [products, setProducts] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedItems, setSelectedItems] = useState([])
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    supplier: '',
    priority: ''
  })
  const [stats, setStats] = useState({
    totalSuggestions: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0
  })

  // --- Helper Functions (Pure Logic) ---
  const generateReorderSuggestions = (serverSuggestions) => serverSuggestions

  const calculateStats = (suggestionsData) => {
    setStats({
      totalSuggestions: suggestionsData.length,
      highPriority: suggestionsData.filter(s => s.priority === 'High').length,
      mediumPriority: suggestionsData.filter(s => s.priority === 'Medium').length,
      lowPriority: suggestionsData.filter(s => s.priority === 'Low').length
    })
  }

  // --- API Actions ---
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [suggestionsData, suppliersData] = await Promise.all([
        retailApi.ai.getReorderSuggestions(),
        retailApi.suppliers.getAll(),
      ])

      const normalized = (suggestionsData || []).map((item) => ({
        ...item,
        productId: item.productId || item._id,
      }))

      setSuppliers(suppliersData || [])
      setSuggestions(normalized)
      calculateStats(normalized)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch reorder suggestions')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleAddToPO = async (item) => {
    const supplier = suppliers.find(s => s._id === item.supplierId)
    
    if (!supplier) {
      toast.error("No supplier found for this product")
      return
    }

    try {
      const poData = {
        supplierId: supplier._id,
        supplierName: supplier.name,
        items: [{
          productId: item.productId,
          productName: item.productName,
          quantity: item.suggestedQty,
          unitPrice: item.costPrice,
          totalPrice: item.totalValue
        }],
        status: 'Draft',
        notes: `Auto-generated PO from reorder suggestion - ${item.productName}`
      }

      await retailApi.purchaseOrders.create(poData)
      toast.success(`Purchase order created for ${item.productName}`)
      fetchData() 
    } catch (error) {
      toast.error("Failed to create purchase order")
    }
  }

  const handleGenerateConfirm = async () => {
    if (selectedItems.length === 0) return

    try {
      const supplierGroups = selectedItems.reduce((acc, item) => {
        acc[item.supplierId] = acc[item.supplierId] || []
        acc[item.supplierId].push(item)
        return acc
      }, {})

      const creationPromises = Object.entries(supplierGroups).map(([supplierId, items]) => {
        const supplier = suppliers.find(s => s._id === supplierId)
        if (!supplier) return null

        return retailApi.purchaseOrders.create({
          supplierId: supplier._id,
          supplierName: supplier.name,
          items: items.map(item => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.suggestedQty,
            unitPrice: item.costPrice,
            totalPrice: item.totalValue
          })),
          status: 'Draft',
          notes: `Auto-generated bulk PO for ${items.length} items`
        })
      }).filter(Boolean)

      await Promise.all(creationPromises)
      
      toast.success(`Generated ${Object.keys(supplierGroups).length} purchase orders successfully`)
      
      setShowGenerateModal(false)
      setSelectedItems([])
      fetchData()
    } catch (error) {
      toast.error("An error occurred while generating bulk orders")
    }
  }

  // --- Filter Logic ---
  const filteredSuggestions = suggestions.filter(item => {
    const matchesSearch = !filters.search || 
      item.productName?.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.sku?.toLowerCase().includes(filters.search.toLowerCase())
    
    const matchesCategory = !filters.category || item.category === filters.category
    const matchesSupplier = !filters.supplier || item.supplierId === filters.supplier
    const matchesPriority = !filters.priority || item.priority === filters.priority

    return matchesSearch && matchesCategory && matchesSupplier && matchesPriority
  })

  const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }))
  const handleClearFilters = () => setFilters({ search: '', category: '', supplier: '', priority: '' })
  const handleSelectAll = () => setSelectedItems(filteredSuggestions)
  const handleDeselectAll = () => setSelectedItems([])
  const handleGenerateAll = () => {
    setSelectedItems(filteredSuggestions)
    setShowGenerateModal(true)
  }

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    suggestions, products, suppliers, sales, loading, selectedItems,
    showGenerateModal, filters, stats, filteredSuggestions,
    fetchData, handleAddToPO, handleGenerateConfirm, handleFilterChange,
    handleClearFilters, handleSelectAll, handleDeselectAll, handleGenerateAll,
    setShowGenerateModal
  }
}