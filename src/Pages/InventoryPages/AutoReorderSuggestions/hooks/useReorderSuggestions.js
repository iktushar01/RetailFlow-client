import { useState, useEffect, useCallback } from 'react'
import { inventoryAPI, productsAPI, suppliersAPI, salesAPI, purchaseOrdersAPI } from '../../services/inventoryService'
import { toast } from "sonner" // or "@/components/ui/use-toast" depending on your shadcn setup

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
  const calculateMonthlySales = (productId, salesData) => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const totalSold = salesData
      .filter(sale => new Date(sale.createdAt) >= thirtyDaysAgo)
      .reduce((sum, sale) => {
        const item = sale.items.find(item => item.productId === productId)
        return sum + (item?.quantity || 0)
      }, 0)
    
    return totalSold
  }

  const getLastSaleDate = (productId, salesData) => {
    const productSales = salesData
      .filter(sale => sale.items.some(item => item.productId === productId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    return productSales[0]?.createdAt || null
  }

  const generateReorderSuggestions = (inventoryData, productsData, salesData) => {
    return productsData.map(product => {
      const inventoryItem = inventoryData.find(inv => inv.productId === product._id)
      if (!inventoryItem) return null
      
      const monthlySales = calculateMonthlySales(product._id, salesData)
      const currentStock = inventoryItem.stockQty
      const minStockLevel = product.minStockLevel || 10
      const safetyStock = Math.ceil(monthlySales * 0.2)
      
      const suggestedQty = Math.max(monthlySales * 2, minStockLevel * 3, safetyStock * 2)
      
      let priority = 'Low'
      if (currentStock <= minStockLevel * 0.5) priority = 'High'
      else if (currentStock <= minStockLevel) priority = 'Medium'
      
      const urgencyScore = (monthlySales * 30) / (currentStock + 1)
      
      if (suggestedQty > 0 && (currentStock < minStockLevel * 2 || urgencyScore > 1)) {
        return {
          productId: product._id,
          productName: product.productName,
          sku: product.sku,
          category: product.category,
          supplierId: product.supplierId,
          currentStock,
          monthlySales,
          suggestedQty: Math.ceil(suggestedQty),
          priority,
          urgencyScore,
          lastSaleDate: getLastSaleDate(product._id, salesData),
          costPrice: product.costPrice || 0,
          totalValue: Math.ceil(suggestedQty) * (product.costPrice || 0)
        }
      }
      return null
    }).filter(Boolean).sort((a, b) => b.urgencyScore - a.urgencyScore)
  }

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
      const [inventoryData, productsData, suppliersData, salesData] = await Promise.all([
        inventoryAPI.getAll(),
        productsAPI.getAll(),
        suppliersAPI.getAll(),
        salesAPI.getAll()
      ])
      
      setProducts(productsData)
      setSuppliers(suppliersData)
      setSales(salesData)
      
      const suggestionsData = generateReorderSuggestions(inventoryData, productsData, salesData)
      setSuggestions(suggestionsData)
      calculateStats(suggestionsData)
    } catch (error) {
      toast.error("Failed to fetch inventory data")
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

      await purchaseOrdersAPI.create(poData)
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

        return purchaseOrdersAPI.create({
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