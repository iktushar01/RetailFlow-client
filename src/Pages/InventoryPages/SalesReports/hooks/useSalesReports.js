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
    paymentMethod: '',
  })

  const [summary, setSummary] = useState({
    totalSales: 0,
    totalAmount: 0,
    totalProfit: 0,
    averageOrderValue: 0,
    topProducts: [],
    salesTrend: { labels: [], revenue: [], salesCount: [] },
  })

  const fetchData = async () => {
    try {
      setLoading(true)

      const [sales, productsData, customersData, analyticsData, summaryData, topProductsData] =
        await Promise.all([
          salesReportsAPI.getAll(),
          productsAPI.getAll(),
          customersAPI.getAll(),
          salesReportsAPI.getAnalytics('week'),
          salesReportsAPI.getSummary(filters.dateFrom || null, filters.dateTo || null),
          salesReportsAPI.getTopProducts(5, filters.dateFrom || null, filters.dateTo || null),
        ])

      setProducts(productsData)
      setCustomers(customersData)

      let filteredSales = sales
      if (filters.dateFrom) {
        filteredSales = filteredSales.filter(
          (sale) => new Date(sale.createdAt || sale.date) >= new Date(filters.dateFrom)
        )
      }
      if (filters.dateTo) {
        filteredSales = filteredSales.filter(
          (sale) => new Date(sale.createdAt || sale.date) <= new Date(filters.dateTo)
        )
      }

      setSalesData(filteredSales)

      setSummary({
        totalSales: summaryData.totalSales || filteredSales.length,
        totalAmount: summaryData.totalAmount || 0,
        totalProfit: summaryData.totalProfit || 0,
        averageOrderValue: summaryData.averageOrderValue || 0,
        topProducts: topProductsData.map((p) => ({
          productId: p.productId,
          name: p.name || p.productName,
          quantity: p.quantitySold,
          revenue: p.revenue,
        })),
        salesTrend: analyticsData,
      })
    } catch (error) {
      console.error('Error fetching data:', error)
      setSalesData([])
      setSummary({
        totalSales: 0,
        totalAmount: 0,
        totalProfit: 0,
        averageOrderValue: 0,
        topProducts: [],
        salesTrend: { labels: [], revenue: [], salesCount: [] },
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({
      search: '',
      dateFrom: '',
      dateTo: '',
      customer: '',
      product: '',
      paymentMethod: '',
    })
  }

  const handleExport = async () => {
    try {
      const exportData = await salesReportsAPI.exportData('csv', filters)
      if (exportData) {
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

  const filteredSales = salesData.filter((sale) => {
    const matchesSearch =
      !filters.search ||
      sale.invoiceNo?.toLowerCase().includes(filters.search.toLowerCase()) ||
      sale.customerName?.toLowerCase().includes(filters.search.toLowerCase())

    const matchesCustomer = !filters.customer || sale.customerId === filters.customer
    const matchesPaymentMethod = !filters.paymentMethod || sale.paymentMethod === filters.paymentMethod

    const matchesProduct =
      !filters.product || sale.items?.some((item) => item.productId === filters.product)

    return matchesSearch && matchesCustomer && matchesPaymentMethod && matchesProduct
  })

  const filterConfig = [
    {
      key: 'search',
      label: 'Search',
      type: 'search',
      placeholder: 'Search by invoice or customer...',
    },
    { key: 'dateFrom', label: 'From Date', type: 'date' },
    { key: 'dateTo', label: 'To Date', type: 'date' },
    {
      key: 'customer',
      label: 'Customer',
      type: 'select',
      options: [
        { label: 'All Customers', value: '' },
        ...customers.map((c) => ({ label: c.name, value: c._id })),
      ],
    },
    {
      key: 'product',
      label: 'Product',
      type: 'select',
      options: [
        { label: 'All Products', value: '' },
        ...products.map((p) => ({ label: p.productName, value: p._id })),
      ],
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
        { label: 'Mobile Banking', value: 'Mobile Banking' },
      ],
    },
  ]

  useEffect(() => {
    fetchData()
  }, [filters])

  return {
    salesData,
    products,
    customers,
    loading,
    filters,
    summary,
    filteredSales,
    filterConfig,
    fetchData,
    handleFilterChange,
    handleClearFilters,
    handleExport,
    formatCurrency,
    formatDate,
    formatDateTime,
  }
}
