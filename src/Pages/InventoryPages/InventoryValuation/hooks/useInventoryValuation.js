import { useState, useEffect } from 'react'
import { inventoryAPI, productsAPI, warehousesAPI } from '../../services/inventoryService'

export const useInventoryValuation = () => {
  const [valuationData, setValuationData] = useState([])
  const [products, setProducts] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    warehouse: '',
    valueRange: ''
  })

  // Summary stats
  const [summary, setSummary] = useState({
    totalValue: 0,
    totalItems: 0,
    averageMargin: 0,
    categoryBreakdown: []
  })

  const calculateValuation = (inventoryData) => {
    const valuation = []
    
    // inventoryData is now product-centric with locations array
    inventoryData.forEach(product => {
      // Flatten locations for each product
      product.locations?.forEach(location => {
        const quantity = location.quantity || 0
        const costPrice = product.costPrice || 0 // Now includes avg PO cost price
        const sellingPrice = product.sellingPrice || 0
        const totalValue = quantity * costPrice
        const potentialValue = quantity * sellingPrice
        const margin = sellingPrice - costPrice
        const marginPercentage = costPrice > 0 ? ((margin / costPrice) * 100) : 0
        
        valuation.push({
          productId: product.productId,
          productName: product.productName,
          sku: product.sku,
          category: product.category,
          location: location.location,
          batch: location.batch,
          quantity,
          costPrice,
          sellingPrice,
          totalValue,
          potentialValue,
          margin,
          marginPercentage,
          lastUpdated: location.lastUpdated
        })
      })
    })
    
    return valuation.sort((a, b) => b.totalValue - a.totalValue)
  }

  const calculateSummary = (valuationData) => {
    const totalValue = valuationData.reduce((sum, item) => sum + item.totalValue, 0)
    const totalItems = valuationData.length
    
    // Calculate weighted average margin percentage
    const totalMarginPercentage = valuationData.reduce((sum, item) => {
      return sum + (item.marginPercentage * item.totalValue)
    }, 0)
    const averageMargin = totalValue > 0 ? (totalMarginPercentage / totalValue) : 0
    
    // Category breakdown
    const categoryBreakdown = {}
    valuationData.forEach(item => {
      if (!categoryBreakdown[item.category]) {
        categoryBreakdown[item.category] = {
          count: 0,
          value: 0,
          margin: 0
        }
      }
      categoryBreakdown[item.category].count += 1
      categoryBreakdown[item.category].value += item.totalValue
      categoryBreakdown[item.category].margin += item.margin
    })
    
    const categoryArray = Object.entries(categoryBreakdown).map(([category, data]) => ({
      category,
      count: data.count,
      value: data.value,
      margin: data.margin,
      marginPercentage: data.value > 0 ? ((data.margin / data.value) * 100) : 0
    })).sort((a, b) => b.value - a.value)
    
    setSummary({
      totalValue,
      totalItems,
      averageMargin,
      categoryBreakdown: categoryArray
    })
  }

  const getMarginColor = (marginPercentage) => {
    if (marginPercentage >= 50) return 'text-green-600 bg-green-100'
    if (marginPercentage >= 25) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getValueRange = (value) => {
    if (value >= 10000) return 'High'
    if (value >= 1000) return 'Medium'
    return 'Low'
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const [inventoryData, productsData, warehousesData] = await Promise.all([
        inventoryAPI.getProducts(), // Use product-centric inventory endpoint
        productsAPI.getAll(),
        warehousesAPI.getAll()
      ])
      
      console.log('Inventory Valuation - Fetched data:', inventoryData)
      
      setProducts(productsData)
      setWarehouses(warehousesData)
      
      // Calculate valuation data from product-centric structure
      const valuation = calculateValuation(inventoryData)
      setValuationData(valuation)
      
      // Calculate summary
      calculateSummary(valuation)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      warehouse: '',
      valueRange: ''
    })
  }

  const handleExport = () => {
    console.log('Exporting valuation data...')
  }

  const filteredValuation = valuationData.filter(item => {
    const matchesSearch = !filters.search || 
      item.productName?.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.sku?.toLowerCase().includes(filters.search.toLowerCase())
    
    const matchesCategory = !filters.category || item.category === filters.category
    const matchesWarehouse = !filters.warehouse || item.location === filters.warehouse
    
    const matchesValueRange = !filters.valueRange || 
      (filters.valueRange === 'high' && item.totalValue >= 10000) ||
      (filters.valueRange === 'medium' && item.totalValue >= 1000 && item.totalValue < 10000) ||
      (filters.valueRange === 'low' && item.totalValue < 1000)

    return matchesSearch && matchesCategory && matchesWarehouse && matchesValueRange
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
      key: 'warehouse',
      label: 'Warehouse',
      type: 'select',
      options: [
        { label: 'All Warehouses', value: '' },
        ...warehouses.map(w => ({ label: w.name, value: w.name }))
      ]
    },
    {
      key: 'valueRange',
      label: 'Value Range',
      type: 'select',
      options: [
        { label: 'All Values', value: '' },
        { label: 'High (≥BDT 10,000)', value: 'high' },
        { label: 'Medium (BDT 1,000-9,999)', value: 'medium' },
        { label: 'Low (<BDT 1,000)', value: 'low' }
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
    valuationData,
    products,
    warehouses,
    loading,
    filters,
    summary,
    filteredValuation,
    filterConfig,
    
    // Actions
    fetchData,
    handleFilterChange,
    handleClearFilters,
    handleExport,
    getMarginColor,
    getValueRange
  }
}
