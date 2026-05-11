import { useState, useEffect } from 'react'
import { inventoryAPI, productsAPI, salesAPI } from '../../services/inventoryService'

export const useStockAnalysis = () => {
  const [analysisData, setAnalysisData] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('fast-moving')
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    timeRange: '30',
    minSales: ''
  })

  // Analysis stats
  const [stats, setStats] = useState({
    fastMoving: 0,
    slowMoving: 0,
    deadStock: 0,
    totalProducts: 0
  })

  const analyzeStockMovement = (inventoryData, productsData, salesData) => {
    const analysis = []
    const timeRange = parseInt(filters.timeRange) || 30
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - timeRange)
    
    productsData.forEach(product => {
      const inventoryItem = inventoryData.find(inv => inv.productId === product._id)
      if (!inventoryItem) return
      
      // Get sales data for this product in the time range
      const productSales = salesData.filter(sale => {
        const saleDate = new Date(sale.createdAt)
        return saleDate >= cutoffDate && 
               sale.items.some(item => item.productId === product._id)
      })
      
      // Calculate total sold quantity
      const totalSold = productSales.reduce((sum, sale) => {
        const item = sale.items.find(item => item.productId === product._id)
        return sum + (item?.quantity || 0)
      }, 0)
      
      // Get last sale date
      const lastSaleDate = productSales.length > 0 
        ? productSales.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0].createdAt
        : null
      
      // Calculate days since last sale
      const daysSinceLastSale = lastSaleDate 
        ? Math.floor((new Date() - new Date(lastSaleDate)) / (1000 * 60 * 60 * 24))
        : null
      
      // Determine movement category
      let category = 'slow-moving'
      let status = 'Slow Moving'
      let statusColor = 'text-yellow-600 bg-yellow-100'
      let statusIcon = '🟡'
      
      if (totalSold === 0) {
        category = 'dead-stock'
        status = 'Dead Stock'
        statusColor = 'text-red-600 bg-red-100'
        statusIcon = '🔴'
      } else if (totalSold >= 50) {
        category = 'fast-moving'
        status = 'Fast Moving'
        statusColor = 'text-green-600 bg-green-100'
        statusIcon = '🟢'
      }
      
      // Calculate velocity (sales per day)
      const velocity = timeRange > 0 ? totalSold / timeRange : 0
      
      analysis.push({
        productId: product._id,
        productName: product.productName,
        sku: product.sku,
        category: product.category,
        currentStock: inventoryItem.stockQty,
        totalSold,
        lastSaleDate,
        daysSinceLastSale,
        velocity,
        movementCategory: category,
        status,
        statusColor,
        statusIcon,
        costPrice: product.costPrice || 0,
        sellingPrice: product.sellingPrice || 0,
        totalValue: inventoryItem.stockQty * (product.costPrice || 0)
      })
    })
    
    return analysis.sort((a, b) => b.totalSold - a.totalSold)
  }

  const calculateStats = (analysisData) => {
    const fastMoving = analysisData.filter(item => item.movementCategory === 'fast-moving').length
    const slowMoving = analysisData.filter(item => item.movementCategory === 'slow-moving').length
    const deadStock = analysisData.filter(item => item.movementCategory === 'dead-stock').length
    const totalProducts = analysisData.length
    
    setStats({
      fastMoving,
      slowMoving,
      deadStock,
      totalProducts
    })
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const [inventoryData, productsData, salesData] = await Promise.all([
        inventoryAPI.getAll(),
        productsAPI.getAll(),
        salesAPI.getAll()
      ])
      
      setProducts(productsData)
      
      // Analyze stock movement
      const analysis = analyzeStockMovement(inventoryData, productsData, salesData)
      setAnalysisData(analysis)
      calculateStats(analysis)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFilteredData = () => {
    let filtered = analysisData.filter(item => {
      const matchesSearch = !filters.search || 
        item.productName?.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.sku?.toLowerCase().includes(filters.search.toLowerCase())
      
      const matchesCategory = !filters.category || item.category === filters.category
      const matchesMinSales = !filters.minSales || item.totalSold >= parseInt(filters.minSales)
      const matchesTab = activeTab === 'all' || item.movementCategory === activeTab

      return matchesSearch && matchesCategory && matchesMinSales && matchesTab
    })
    
    return filtered
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      timeRange: '30',
      minSales: ''
    })
  }

  const handleExport = () => {
    console.log('Exporting stock analysis...')
  }

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
  }

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
      key: 'timeRange',
      label: 'Time Range (Days)',
      type: 'select',
      options: [
        { label: 'Last 7 Days', value: '7' },
        { label: 'Last 30 Days', value: '30' },
        { label: 'Last 90 Days', value: '90' },
        { label: 'Last 180 Days', value: '180' }
      ]
    },
    {
      key: 'minSales',
      label: 'Min Sales Qty',
      type: 'select',
      options: [
        { label: 'Any Quantity', value: '' },
        { label: '1+ Units', value: '1' },
        { label: '5+ Units', value: '5' },
        { label: '10+ Units', value: '10' },
        { label: '25+ Units', value: '25' }
      ]
    }
  ]

  const tabs = [
    { id: 'all', label: 'All Products', count: analysisData.length },
    { id: 'fast-moving', label: 'Fast Moving', count: stats.fastMoving },
    { id: 'slow-moving', label: 'Slow Moving', count: stats.slowMoving },
    { id: 'dead-stock', label: 'Dead Stock', count: stats.deadStock }
  ]

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    fetchData()
  }, [filters])

  return {
    // State
    analysisData,
    products,
    loading,
    activeTab,
    filters,
    stats,
    filteredData: getFilteredData(),
    filterConfig,
    tabs,
    
    // Actions
    fetchData,
    handleFilterChange,
    handleClearFilters,
    handleExport,
    handleTabChange
  }
}
