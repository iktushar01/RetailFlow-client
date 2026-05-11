import { useMemo } from 'react'

export const useDashboardMetrics = (data) => {
  const calculateSalesToday = (sales) => {
    if (!sales || !Array.isArray(sales)) return 0
    
    console.log('Sales data for calculation:', sales)
    console.log('First sale object structure:', sales[0])
    console.log('All sale objects:', sales.map((sale, index) => ({ index, sale })))
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todaySales = sales.filter(sale => {
      if (!sale) return false
      const saleDate = new Date(sale.createdAt || sale.date || sale.timestamp)
      saleDate.setHours(0, 0, 0, 0)
      return saleDate.getTime() === today.getTime()
    })
    
    console.log('Today sales filtered:', todaySales)
    
    const total = todaySales.reduce((total, sale) => {
      // Handle sales data structure - check grandTotal first (most common in POS systems)
      const amount = sale.grandTotal || sale.totalAmount || sale.amount || sale.total || sale.totalPrice || sale.price || 0
      console.log('Sale amount:', amount, 'from sale:', sale)
      console.log('Sale keys:', Object.keys(sale))
      return total + (typeof amount === 'number' ? amount : parseFloat(amount) || 0)
    }, 0)
    
    console.log('Total sales today:', total)
    return total
  }

  const calculateTotalSales = (sales) => {
    if (!sales || !Array.isArray(sales)) return 0
    
    console.log('Calculating total sales from:', sales.length, 'sales')
    
    return sales.reduce((total, sale, index) => {
      // Handle sales data structure - check grandTotal first (most common in POS systems)
      const amount = sale.grandTotal || sale.totalAmount || sale.amount || sale.total || sale.totalPrice || sale.price || 0
      console.log(`Sale ${index} amount:`, amount, 'keys:', Object.keys(sale))
      console.log(`Sale ${index} full data:`, sale)
      return total + (typeof amount === 'number' ? amount : parseFloat(amount) || 0)
    }, 0)
  }

  const calculatePendingPayments = (suppliers) => {
    if (!suppliers || !Array.isArray(suppliers)) return 0
    
    return suppliers.reduce((total, supplier) => {
      if (!supplier) return total
      const balance = supplier.outstandingBalance || supplier.balance || supplier.dueAmount || supplier.pendingAmount || 0
      return total + (typeof balance === 'number' ? balance : parseFloat(balance) || 0)
    }, 0)
  }

  const metrics = useMemo(() => {
    const salesToday = calculateSalesToday(data.sales)
    const totalSales = calculateTotalSales(data.sales)
    
    return {
      salesToday: salesToday > 0 ? salesToday : totalSales,
      totalStockItems: data.inventory.length, // Use inventory data (product-centric)
      totalStockValue: data.totalStockValue || 0,
      lowStockAlerts: data.lowStock.length,
      pendingPayments: calculatePendingPayments(data.suppliers)
    }
  }, [data])

  // Debug metrics calculation
  console.log('Metrics calculated:', {
    salesData: data.sales,
    salesToday: calculateSalesToday(data.sales),
    totalSales: calculateTotalSales(data.sales),
    finalSalesToday: metrics.salesToday,
    productsData: data.products,
    totalStockItems: metrics.totalStockItems,
    totalStockValue: metrics.totalStockValue,
    suppliersData: data.suppliers,
    pendingPayments: metrics.pendingPayments
  })

  return metrics
}
