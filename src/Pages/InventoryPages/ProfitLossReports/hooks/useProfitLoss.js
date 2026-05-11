import { useState, useEffect } from 'react'
import { salesAPI, productsAPI, purchaseOrdersAPI, paymentsAPI } from '../../services/inventoryService'

export const useProfitLoss = () => {
  const [pLData, setPLData] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    period: 'month',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  })

  // P&L Summary
  const [summary, setSummary] = useState({
    totalSales: 0,
    totalCOGS: 0,
    grossProfit: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0,
    monthlyBreakdown: [],
    expenseBreakdown: []
  })

  const calculateProfitLoss = (sales, productsData, purchaseOrders, payments) => {
    const currentDate = new Date()
    const year = filters.year || currentDate.getFullYear()
    const month = filters.month || currentDate.getMonth() + 1
    
    // Filter data by period
    const filteredSales = sales.filter(sale => {
      const saleDate = new Date(sale.createdAt)
      return saleDate.getFullYear() === year && saleDate.getMonth() + 1 === month
    })
    
    const filteredPOs = purchaseOrders.filter(po => {
      const poDate = new Date(po.createdAt)
      return poDate.getFullYear() === year && poDate.getMonth() + 1 === month
    })
    
    const filteredPayments = payments.filter(payment => {
      const paymentDate = new Date(payment.createdAt)
      return paymentDate.getFullYear() === year && paymentDate.getMonth() + 1 === month
    })
    
    // Calculate total sales
    const totalSales = filteredSales.reduce((sum, sale) => sum + sale.grandTotal, 0)
    
    // Calculate COGS (Cost of Goods Sold)
    const totalCOGS = filteredSales.reduce((sum, sale) => {
      const itemCOGS = sale.items.reduce((itemSum, item) => {
        const product = productsData.find(p => p._id === item.productId)
        if (!product) return itemSum
        return itemSum + ((product.costPrice || 0) * item.quantity)
      }, 0)
      return sum + itemCOGS
    }, 0)
    
    // Calculate gross profit
    const grossProfit = totalSales - totalCOGS
    
    // Calculate expenses (purchase orders + other payments)
    const purchaseExpenses = filteredPOs.reduce((sum, po) => {
      return sum + (po.totalAmount || 0)
    }, 0)
    
    const otherExpenses = filteredPayments.reduce((sum, payment) => {
      return sum + (payment.amount || 0)
    }, 0)
    
    const totalExpenses = purchaseExpenses + otherExpenses
    
    // Calculate net profit
    const netProfit = grossProfit - totalExpenses
    
    // Calculate profit margin
    const profitMargin = totalSales > 0 ? (netProfit / totalSales) * 100 : 0
    
    return {
      period: `${year}-${month.toString().padStart(2, '0')}`,
      totalSales,
      totalCOGS,
      grossProfit,
      totalExpenses,
      netProfit,
      profitMargin,
      purchaseExpenses,
      otherExpenses,
      salesCount: filteredSales.length,
      purchaseCount: filteredPOs.length
    }
  }

  const calculateSummary = (pL, sales, purchaseOrders, payments) => {
    // Monthly breakdown for the year
    const monthlyBreakdown = []
    const year = filters.year || new Date().getFullYear()
    
    for (let month = 1; month <= 12; month++) {
      const monthSales = sales.filter(sale => {
        const saleDate = new Date(sale.createdAt)
        return saleDate.getFullYear() === year && saleDate.getMonth() + 1 === month
      })
      
      const monthPOs = purchaseOrders.filter(po => {
        const poDate = new Date(po.createdAt)
        return poDate.getFullYear() === year && poDate.getMonth() + 1 === month
      })
      
      const monthPayments = payments.filter(payment => {
        const paymentDate = new Date(payment.createdAt)
        return paymentDate.getFullYear() === year && paymentDate.getMonth() + 1 === month
      })
      
      const monthSalesTotal = monthSales.reduce((sum, sale) => sum + sale.grandTotal, 0)
      const monthCOGS = monthSales.reduce((sum, sale) => {
        const itemCOGS = sale.items.reduce((itemSum, item) => {
          const product = products.find(p => p._id === item.productId)
          if (!product) return itemSum
          return itemSum + ((product.costPrice || 0) * item.quantity)
        }, 0)
        return sum + itemCOGS
      }, 0)
      
      const monthExpenses = monthPOs.reduce((sum, po) => sum + (po.totalAmount || 0), 0) +
                           monthPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0)
      
      const monthProfit = monthSalesTotal - monthCOGS - monthExpenses
      
      monthlyBreakdown.push({
        month: month,
        monthName: new Date(year, month - 1).toLocaleString('default', { month: 'short' }),
        sales: monthSalesTotal,
        cogs: monthCOGS,
        expenses: monthExpenses,
        profit: monthProfit
      })
    }
    
    // Expense breakdown
    const expenseBreakdown = [
      { category: 'Purchase Orders', amount: pL.purchaseExpenses, color: 'bg-blue-500' },
      { category: 'Other Payments', amount: pL.otherExpenses, color: 'bg-red-500' }
    ]
    
    setSummary({
      totalSales: pL.totalSales,
      totalCOGS: pL.totalCOGS,
      grossProfit: pL.grossProfit,
      totalExpenses: pL.totalExpenses,
      netProfit: pL.netProfit,
      profitMargin: pL.profitMargin,
      monthlyBreakdown,
      expenseBreakdown
    })
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const [sales, productsData, purchaseOrders, payments] = await Promise.all([
        salesAPI.getAll(),
        productsAPI.getAll(),
        purchaseOrdersAPI.getAll(),
        paymentsAPI.getAll()
      ])
      
      setProducts(productsData)
      
      // Calculate P&L data
      const pL = calculateProfitLoss(sales, productsData, purchaseOrders, payments)
      setPLData(pL)
      calculateSummary(pL, sales, purchaseOrders, payments)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: parseInt(value) }))
  }

  const handleClearFilters = () => {
    const currentDate = new Date()
    setFilters({
      period: 'month',
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1
    })
  }

  const handleExport = () => {
    console.log('Exporting P&L report...')
  }

  const formatCurrency = (amount) => `BDT ${amount.toFixed(2)}`
  const formatPercentage = (value) => `${value.toFixed(1)}%`

  const getProfitColor = (profit) => {
    return profit >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const getProfitIcon = (profit) => {
    return profit >= 0 ? 'TrendingUp' : 'TrendingDown'
  }

  const filterConfig = [
    {
      key: 'year',
      label: 'Year',
      type: 'select',
      options: [
        { label: '2024', value: 2024 },
        { label: '2025', value: 2025 },
        { label: '2026', value: 2026 }
      ]
    },
    {
      key: 'month',
      label: 'Month',
      type: 'select',
      options: [
        { label: 'January', value: 1 },
        { label: 'February', value: 2 },
        { label: 'March', value: 3 },
        { label: 'April', value: 4 },
        { label: 'May', value: 5 },
        { label: 'June', value: 6 },
        { label: 'July', value: 7 },
        { label: 'August', value: 8 },
        { label: 'September', value: 9 },
        { label: 'October', value: 10 },
        { label: 'November', value: 11 },
        { label: 'December', value: 12 }
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
    pLData,
    products,
    loading,
    filters,
    summary,
    filterConfig,
    
    // Actions
    fetchData,
    handleFilterChange,
    handleClearFilters,
    handleExport,
    
    // Utilities
    formatCurrency,
    formatPercentage,
    getProfitColor,
    getProfitIcon
  }
}
