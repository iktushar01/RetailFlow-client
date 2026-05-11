import { useState, useEffect } from 'react'
import { inventoryAPI, productsAPI, suppliersAPI, salesAPI, purchaseOrdersAPI } from '../../services/inventoryService'
import Swal from 'sweetalert2'

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

  const calculateMonthlySales = (productId, salesData) => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentSales = salesData.filter(sale => 
      new Date(sale.createdAt) >= thirtyDaysAgo &&
      sale.items.some(item => item.productId === productId)
    )
    
    const totalSold = recentSales.reduce((sum, sale) => {
      const item = sale.items.find(item => item.productId === productId)
      return sum + (item?.quantity || 0)
    }, 0)
    
    return totalSold
  }

  const getLastSaleDate = (productId, salesData) => {
    const productSales = salesData.filter(sale => 
      sale.items.some(item => item.productId === productId)
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    return productSales[0]?.createdAt || null
  }

  const generateReorderSuggestions = (inventoryData, productsData, salesData) => {
    const suggestions = []
    
    productsData.forEach(product => {
      const inventoryItem = inventoryData.find(inv => inv.productId === product._id)
      if (!inventoryItem) return
      
      // Calculate average monthly sales
      const monthlySales = calculateMonthlySales(product._id, salesData)
      const currentStock = inventoryItem.stockQty
      const minStockLevel = product.minStockLevel || 10
      const leadTime = product.leadTime || 7 // days
      const safetyStock = Math.ceil(monthlySales * 0.2) // 20% safety buffer
      
      // Calculate suggested quantity
      const suggestedQty = Math.max(
        monthlySales * 2, // 2 months supply
        minStockLevel * 3, // 3x minimum level
        safetyStock * 2 // 2x safety stock
      )
      
      // Calculate priority
      let priority = 'Low'
      if (currentStock <= minStockLevel * 0.5) priority = 'High'
      else if (currentStock <= minStockLevel) priority = 'Medium'
      
      // Calculate urgency score
      const urgencyScore = (monthlySales * 30) / (currentStock + 1) // sales per day / current stock
      
      if (suggestedQty > 0 && (currentStock < minStockLevel * 2 || urgencyScore > 1)) {
        suggestions.push({
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
        })
      }
    })
    
    return suggestions.sort((a, b) => b.urgencyScore - a.urgencyScore)
  }

  const calculateStats = (suggestionsData) => {
    const totalSuggestions = suggestionsData.length
    const highPriority = suggestionsData.filter(s => s.priority === 'High').length
    const mediumPriority = suggestionsData.filter(s => s.priority === 'Medium').length
    const lowPriority = suggestionsData.filter(s => s.priority === 'Low').length
    
    setStats({
      totalSuggestions,
      highPriority,
      mediumPriority,
      lowPriority
    })
  }

  const fetchData = async () => {
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
      
      // Generate reorder suggestions
      const suggestions = generateReorderSuggestions(inventoryData, productsData, salesData)
      setSuggestions(suggestions)
      calculateStats(suggestions)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToPO = async (item) => {
    const supplier = suppliers.find(s => s._id === item.supplierId)
    
    if (!supplier) {
      Swal.fire('Error', 'No supplier found for this product', 'error')
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
      
      Swal.fire({
        title: 'Success!',
        text: `Purchase order created for ${item.productName}`,
        icon: 'success'
      })
      
      fetchData() // Refresh data
    } catch (error) {
      console.error('Error creating PO:', error)
      Swal.fire('Error', 'Failed to create purchase order', 'error')
    }
  }

  const handleGenerateConfirm = async () => {
    try {
      // Group by supplier
      const supplierGroups = {}
      selectedItems.forEach(item => {
        if (!supplierGroups[item.supplierId]) {
          supplierGroups[item.supplierId] = []
        }
        supplierGroups[item.supplierId].push(item)
      })

      // Create PO for each supplier
      for (const [supplierId, items] of Object.entries(supplierGroups)) {
        const supplier = suppliers.find(s => s._id === supplierId)
        if (!supplier) continue

        const poData = {
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
        }

        await purchaseOrdersAPI.create(poData)
      }
      
      Swal.fire({
        title: 'Success!',
        text: `Generated ${Object.keys(supplierGroups).length} purchase orders for ${selectedItems.length} items`,
        icon: 'success'
      })
      
      setShowGenerateModal(false)
      setSelectedItems([])
      fetchData()
    } catch (error) {
      console.error('Error generating POs:', error)
      Swal.fire('Error', 'Failed to generate purchase orders', 'error')
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      supplier: '',
      priority: ''
    })
  }

  const handleSelectAll = () => {
    setSelectedItems(filteredSuggestions)
  }

  const handleDeselectAll = () => {
    setSelectedItems([])
  }

  const handleGenerateAll = () => {
    setSelectedItems(filteredSuggestions)
    setShowGenerateModal(true)
  }

  const handleExport = () => {
    console.log('Exporting reorder suggestions...')
  }

  const filteredSuggestions = suggestions.filter(item => {
    const matchesSearch = !filters.search || 
      item.productName?.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.sku?.toLowerCase().includes(filters.search.toLowerCase())
    
    const matchesCategory = !filters.category || item.category === filters.category
    const matchesSupplier = !filters.supplier || item.supplierId === filters.supplier
    const matchesPriority = !filters.priority || item.priority === filters.priority

    return matchesSearch && matchesCategory && matchesSupplier && matchesPriority
  })

  const filterConfig = [
    {
      key: 'search',
      label: 'Search Products',
      type: 'search',
      placeholder: 'Search by name or SKU...'
    },
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      options: [
        { label: 'All Categories', value: '' },
        ...Array.from(new Set(products.map(p => p.category))).map(cat => ({ label: cat, value: cat }))
      ]
    },
    {
      key: 'supplier',
      label: 'Supplier',
      type: 'select',
      options: [
        { label: 'All Suppliers', value: '' },
        ...suppliers.map(s => ({ label: s.name, value: s._id }))
      ]
    },
    {
      key: 'priority',
      label: 'Priority',
      type: 'select',
      options: [
        { label: 'All Priorities', value: '' },
        { label: 'High', value: 'High' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Low', value: 'Low' }
      ]
    }
  ]

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    fetchData()
  }, [filters])

  return {
    // State
    suggestions,
    products,
    suppliers,
    sales,
    loading,
    selectedItems,
    showGenerateModal,
    filters,
    stats,
    filteredSuggestions,
    filterConfig,
    
    // Actions
    fetchData,
    handleAddToPO,
    handleGenerateConfirm,
    handleFilterChange,
    handleClearFilters,
    handleSelectAll,
    handleDeselectAll,
    handleGenerateAll,
    handleExport,
    setShowGenerateModal
  }
}
