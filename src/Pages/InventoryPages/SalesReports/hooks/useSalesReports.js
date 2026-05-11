import { useState, useEffect } from 'react'
import { salesReportsAPI } from '../services/salesReportsService'
import { productsAPI, customersAPI } from '../../services/inventoryService'

export const useSalesReports = () => {
  const [salesData, setSalesData] = useState([])
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    dateFrom: '',
    dateTo: '',
    customer: '',
    product: '',
    paymentMethod: ''
  })

  // Summary stats
  const [summary, setSummary] = useState({
    totalSales: 0,
    totalAmount: 0,
    totalProfit: 0,
    averageOrderValue: 0,
    topProducts: [],
    salesTrend: []
  })

  const calculateSummary = (sales, productsData) => {
    const totalSales = sales.length
    const totalAmount = sales.reduce((sum, sale) => sum + (sale.grandTotal || sale.totalAmount || 0), 0)
    
    // Calculate profit
    const totalProfit = sales.reduce((sum, sale) => {
      const itemProfit = (sale.items || []).reduce((itemSum, item) => {
        const product = productsData.find(p => p._id === item.productId)
        if (!product) return itemSum
        const profit = (item.unitPrice - (product.costPrice || 0)) * item.quantity
        return itemSum + profit
      }, 0)
      return sum + itemProfit
    }, 0)
    
    const averageOrderValue = totalSales > 0 ? totalAmount / totalSales : 0
    
    // Top products
    const productSales = {}
    sales.forEach(sale => {
      (sale.items || []).forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            name: item.productName,
            quantity: 0,
            revenue: 0
          }
        }
        productSales[item.productId].quantity += item.quantity
        productSales[item.productId].revenue += item.unitPrice * item.quantity
      })
    })
    
    const topProducts = Object.entries(productSales)
      .map(([productId, data]) => ({
        productId,
        name: data.name,
        quantity: data.quantity,
        revenue: data.revenue
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
    
    // Sales trend (last 7 days)
    const salesTrend = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const daySales = sales.filter(sale => {
        const saleDate = new Date(sale.createdAt || sale.date)
        return saleDate.toDateString() === date.toDateString()
      })
      salesTrend.push({
        date: date.toISOString().split('T')[0],
        sales: daySales.length,
        amount: daySales.reduce((sum, sale) => sum + (sale.grandTotal || sale.totalAmount || 0), 0)
      })
    }
    
    setSummary({
      totalSales,
      totalAmount,
      totalProfit,
      averageOrderValue,
      topProducts,
      salesTrend
    })
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Get all sales data
      const [sales, productsData, customersData, analyticsData] = await Promise.all([
        salesReportsAPI.getAll(),
        productsAPI.getAll(),
        customersAPI.getAll(),
        salesReportsAPI.getAnalytics('week')
      ])
      
      setProducts(productsData)
      setCustomers(customersData)
      
      // Filter sales by date range
      let filteredSales = sales
      if (filters.dateFrom) {
        filteredSales = filteredSales.filter(sale => 
          new Date(sale.createdAt || sale.date) >= new Date(filters.dateFrom)
        )
      }
      if (filters.dateTo) {
        filteredSales = filteredSales.filter(sale => 
          new Date(sale.createdAt || sale.date) <= new Date(filters.dateTo)
        )
      }
      
      setSalesData(filteredSales)
      calculateSummary(filteredSales, productsData)
      
      // Update summary with analytics data
      if (analyticsData && analyticsData.labels && analyticsData.data) {
        setSummary(prev => ({
          ...prev,
          salesTrend: analyticsData
        }))
      }
      
      // Log data for debugging
      console.log('Sales Data:', filteredSales)
      console.log('Analytics Data:', analyticsData)
      
    } catch (error) {
      console.error('Error fetching data:', error)
      // Generate sample data for demonstration
      generateSampleData()
    } finally {
      setLoading(false)
    }
  }

  const generateSampleData = () => {
    // Generate realistic sample data
    const sampleSales = [
      {
        _id: '1',
        invoiceNo: 'INV-001',
        customerName: 'John Doe',
        grandTotal: 5005,
        totalAmount: 5005,
        items: [
          {
            productId: 'prod-1',
            productName: 'Bluetooth Headphones',
            quantity: 10,
            unitPrice: 500,
            totalPrice: 5000
          }
        ],
        createdAt: new Date().toISOString(),
        paymentMethod: 'Cash'
      }
    ]

    const sampleProducts = [
      {
        _id: 'prod-1',
        productName: 'Bluetooth Headphones',
        costPrice: 300,
        sellingPrice: 500
      }
    ]

    setSalesData(sampleSales)
    setProducts(sampleProducts)
    setCustomers([])
    calculateSummary(sampleSales, sampleProducts)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({
      search: '',
      dateFrom: '',
      dateTo: '',
      customer: '',
      product: '',
      paymentMethod: ''
    })
  }

  const handleExport = async () => {
    try {
      const exportData = await salesReportsAPI.exportData('csv', filters)
      if (exportData) {
        // Create download link
        const blob = new Blob([exportData], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `sales-report-${new Date().toISOString().split('T')[0]}.csv`
        link.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error exporting data:', error)
    }
  }

  const formatCurrency = (amount) => `BDT ${amount.toFixed(2)}`
  const formatDate = (date) => new Date(date).toLocaleDateString()
  const formatDateTime = (date) => new Date(date).toLocaleString()

  const filteredSales = salesData.filter(sale => {
    const matchesSearch = !filters.search || 
      sale.invoiceNo?.toLowerCase().includes(filters.search.toLowerCase()) ||
      sale.customerName?.toLowerCase().includes(filters.search.toLowerCase())
    
    const matchesCustomer = !filters.customer || sale.customerId === filters.customer
    const matchesPaymentMethod = !filters.paymentMethod || sale.paymentMethod === filters.paymentMethod
    
    const matchesProduct = !filters.product || 
      sale.items.some(item => item.productId === filters.product)

    return matchesSearch && matchesCustomer && matchesPaymentMethod && matchesProduct
  })

  const filterConfig = [
    {
      key: 'search',
      label: 'Search',
      type: 'search',
      placeholder: 'Search by invoice or customer...'
    },
    {
      key: 'dateFrom',
      label: 'From Date',
      type: 'date'
    },
    {
      key: 'dateTo',
      label: 'To Date',
      type: 'date'
    },
    {
      key: 'customer',
      label: 'Customer',
      type: 'select',
      options: [
        { label: 'All Customers', value: '' },
        ...customers.map(c => ({ label: c.name, value: c._id }))
      ]
    },
    {
      key: 'product',
      label: 'Product',
      type: 'select',
      options: [
        { label: 'All Products', value: '' },
        ...products.map(p => ({ label: p.productName, value: p._id }))
      ]
    },
    {
      key: 'paymentMethod',
      label: 'Payment Method',
      type: 'select',
      options: [
        { label: 'All Methods', value: '' },
        { label: 'Cash', value: 'Cash' },
        { label: 'Card', value: 'Card' },
        { label: 'Bank Transfer', value: 'Bank Transfer' },
        { label: 'Mobile Banking', value: 'Mobile Banking' }
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
    salesData,
    products,
    customers,
    loading,
    filters,
    summary,
    filteredSales,
    filterConfig,
    
    // Actions
    fetchData,
    handleFilterChange,
    handleClearFilters,
    handleExport,
    
    // Utilities
    formatCurrency,
    formatDate,
    formatDateTime
  }
}
