import axios from 'axios'

const API_BASE_URL = 'https://pos-system-management-server-20.vercel.app'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

// Dashboard API Service
export const dashboardAPI = {
  // Get dashboard overview data
  getOverview: async () => {
    try {
      console.log('Fetching dashboard overview data...')
      
      const [sales, inventory, products, suppliers, lowStock] = await Promise.allSettled([
        api.get('/sales').catch(err => {
          console.error('Sales API error:', err)
          return { data: [] }
        }),
        // Use /inventory/products endpoint which includes calculated average cost
        api.get('/inventory/products').catch(err => { 
          console.error('Inventory products API error:', err)
          // Fallback to regular inventory if product-centric view fails
          return api.get('/inventory').catch(() => ({ data: [] }))
        }),
        api.get('/products').catch(err => {
          console.error('Products API error:', err)
          return { data: [] }
        }),
        api.get('/suppliers').catch(err => {
          console.error('Suppliers API error:', err)
          return { data: [] }
        }),
        api.get('/inventory/low-stock/10').catch(err => {
          console.error('Low stock API error:', err)
          return { data: [] }
        })
      ])

      const result = {
        sales: sales.status === 'fulfilled' ? (sales.value.data || []) : [],
        inventory: inventory.status === 'fulfilled' ? (inventory.value.data || []) : [],
        products: products.status === 'fulfilled' ? (products.value.data || []) : [],
        suppliers: suppliers.status === 'fulfilled' ? (suppliers.value.data || []) : [],
        lowStock: lowStock.status === 'fulfilled' ? (lowStock.value.data || []) : []
      }

      // Calculate total stock value from inventory data merged with products
      const inventoryData = result.inventory
      const productsData = result.products
      
      console.log('Inventory data for stock value calculation:', inventoryData)
      console.log('Products data:', productsData)
      
      // Create a product lookup map for easy access
      const productMap = {}
      if (productsData && productsData.length > 0) {
        productsData.forEach(product => {
          const productId = product._id || product.productId
          if (productId) {
            productMap[productId.toString()] = product
          }
        })
      }
      
      let totalStockValue = 0
      
      // If we have inventory data, use it
      if (inventoryData && inventoryData.length > 0) {
        console.log('Sample inventory item:', inventoryData[0])
        console.log('All inventory item keys:', Object.keys(inventoryData[0] || {}))
        console.log('\n📋 INVENTORY VALUATION CALCULATION:')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        
        inventoryData.forEach((item, index) => {
          // Get the corresponding product for additional data
          const productId = (item.productId || item._id || '').toString()
          const product = productMap[productId] || {}
          
          // Get stock quantity - check multiple possible field names
          // Handle both single values and arrays
          let stockQty = 0
          if (Array.isArray(item.stockQty)) {
            // If stockQty is an array, sum all values
            stockQty = item.stockQty.reduce((sum, qty) => sum + (parseFloat(qty) || 0), 0)
          } else {
            stockQty = parseFloat(item.stockQty) || parseFloat(item.quantity) || 
                      parseFloat(item.stock) || parseFloat(item.currentStock) || 
                      parseFloat(item.availableQty) || parseFloat(item.onHand) || 0
          }
          
          // If no direct stockQty, check locations array
          if (stockQty === 0 && item.locations && Array.isArray(item.locations)) {
            stockQty = item.locations.reduce((sum, loc) => sum + (parseFloat(loc.quantity) || parseFloat(loc.stockQty) || 0), 0)
          }
          
          // Get COST price (not selling price!) for inventory valuation
          // Priority: avgCost > avgPurchasePrice > costPrice > unitCost > purchasePrice > buyingPrice
          // DO NOT use sellingPrice for inventory valuation (that's for profit calculation)
          let costPrice = parseFloat(item.avgCost) || parseFloat(item.averageCost) ||
                         parseFloat(item.avgPurchasePrice) || parseFloat(item.averagePurchasePrice) || 
                         parseFloat(item.avgPOPrice) || parseFloat(item.averagePOCost) ||
                         parseFloat(item.costPrice) || parseFloat(item.unitCost) || 
                         parseFloat(item.cost) || parseFloat(item.purchasePrice) || 
                         parseFloat(item.buyingPrice) || parseFloat(item.wholesalePrice) || 0
          
          // If no cost price in inventory, check product (but still prioritize cost fields)
          if (costPrice === 0 && product) {
            costPrice = parseFloat(product.avgCost) || parseFloat(product.averageCost) ||
                       parseFloat(product.avgPurchasePrice) || parseFloat(product.averagePurchasePrice) ||
                       parseFloat(product.avgPOPrice) || parseFloat(product.averagePOCost) ||
                       parseFloat(product.costPrice) || parseFloat(product.unitCost) || 
                       parseFloat(product.cost) || parseFloat(product.purchasePrice) || 
                       parseFloat(product.buyingPrice) || parseFloat(product.wholesalePrice) || 0
          }
          
          // Last resort fallback (if absolutely no cost price available)
          // WARNING: Using selling price is NOT ideal for inventory valuation
          if (costPrice === 0) {
            const sellingPrice = parseFloat(item.price) || parseFloat(item.unitPrice) || 
                                parseFloat(item.sellingPrice) || parseFloat(product?.price) || 
                                parseFloat(product?.unitPrice) || parseFloat(product?.sellingPrice) || 0
            if (sellingPrice > 0) {
              console.warn(`⚠️ No cost price found for ${item.productName || 'item'}, using selling price ${sellingPrice} as fallback`)
              costPrice = sellingPrice
            }
          }
          
          const productValue = stockQty * costPrice
          
          // Log ALL items to see what's contributing to total
          console.log(`[${index + 1}] ${item.productName || item.name}: ${stockQty} units × ${costPrice} BDT = ${productValue} BDT`)
          
          if (index < 3) { // Detailed log for first 3 items
            console.log(`  📦 Full Details:`)
            console.log(`    Available fields:`, Object.keys(item))
            console.log(`    Raw stockQty:`, item.stockQty, `(array: ${Array.isArray(item.stockQty)})`)
            console.log(`    🔍 Price Fields in Item:`)
            console.log(`       avgCost:`, item.avgCost)
            console.log(`       averageCost:`, item.averageCost)
            console.log(`       avgPurchasePrice:`, item.avgPurchasePrice)
            console.log(`       avgPOPrice:`, item.avgPOPrice)
            console.log(`       costPrice:`, item.costPrice)
            console.log(`       unitCost:`, item.unitCost)
            console.log(`       purchasePrice:`, item.purchasePrice)
            console.log(`       sellingPrice:`, item.sellingPrice)
            console.log(`       price:`, item.price)
            console.log(`    🔍 Price Fields in Product:`)
            console.log(`       avgCost:`, product?.avgCost)
            console.log(`       avgPurchasePrice:`, product?.avgPurchasePrice)
            console.log(`       costPrice:`, product?.costPrice)
            console.log(`       sellingPrice:`, product?.sellingPrice)
            console.log(`    ✅ USING: ${costPrice} BDT per unit`)
          }
          
          totalStockValue += productValue
        })
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log(`\n✅ TOTAL STOCK VALUE: BDT ${totalStockValue.toFixed(2)}`)
        console.log(`   (from ${inventoryData.length} inventory items)`)
        console.log(`\n⚠️ Expected: BDT 3,000`)
        console.log(`   Actual: BDT ${totalStockValue.toFixed(2)}`)
        console.log(`   Difference: BDT ${(totalStockValue - 3000).toFixed(2)}`)
        console.log(`\nℹ️ If incorrect, check the per-item calculations above to find the issue.`)
      } 
      // Fallback: calculate from products data if no inventory
      else if (productsData && productsData.length > 0) {
        console.log('Using products data as fallback for stock value calculation')
        console.log('Sample product item:', productsData[0])
        console.log('All product item keys:', Object.keys(productsData[0] || {}))
        
        productsData.forEach((product, index) => {
          // Get stock quantity
          const stockQty = product.stockQty || product.quantity || product.stock || 
                          product.currentStock || product.availableQty || product.onHand || 0
          
          // Get price
          const price = product.sellingPrice || product.costPrice || product.unitPrice || 
                       product.price || product.unitCost || product.purchasePrice || 
                       product.buyingPrice || product.wholesalePrice || 0
          
          const productValue = stockQty * price
          
          if (index < 3) { // Log first 3 items for debugging
            console.log(`Product ${index + 1}: ${product.productName || product.name}`)
            console.log(`  Available fields:`, Object.keys(product))
            console.log(`  Stock Qty: ${stockQty}`)
            console.log(`  Price: ${price}`)
            console.log(`  Value: ${productValue}`)
          }
          
          totalStockValue += productValue
        })
        
        console.log(`Total from ${productsData.length} products: ${totalStockValue}`)
      } else {
        console.warn('No inventory or products data available for stock value calculation')
      }

      result.totalStockValue = totalStockValue
      
      // Enrich inventory items with product information (especially category)
      if (inventoryData && inventoryData.length > 0) {
        result.enrichedInventory = inventoryData.map(item => {
          const productId = (item.productId || item._id || '').toString()
          const product = productMap[productId] || {}
          
          return {
            ...item,
            category: product.category || product.productCategory || item.category || 'Uncategorized',
            productInfo: product
          }
        })
      }

      console.log('Dashboard overview data:', result)
      console.log('Total stock value calculated:', totalStockValue)
      return result
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Return empty data structure instead of throwing
      return {
        sales: [],
        inventory: [],
        products: [],
        suppliers: [],
        lowStock: [],
        totalStockValue: 0
      }
    }
  },

  // Get sales data for charts
  getSalesData: async (period = 'today') => {
    try {
      // Map frontend period names to backend expected values
      const periodMap = {
        'today': 'today',
        'week': 'week',
        'month': 'month',
        'daily': 'today',
        'weekly': 'week',
        'monthly': 'month'
      }
      
      const mappedPeriod = periodMap[period.toLowerCase()] || 'week'
      console.log(`Fetching sales data for period: ${period} (mapped to: ${mappedPeriod})`)
      
      // Direct fetch from /sales endpoint
      const response = await api.get(`/sales`)
      const salesData = response.data || []
      
      console.log(`Processing ${salesData.length} sales records for period: ${mappedPeriod}`)
      
      if (salesData.length === 0) {
        return {
          labels: [],
          data: [],
          datasets: []
        }
      }
      
      // Filter and process sales based on period
      const now = new Date()
      let startDate
      
      switch (mappedPeriod) {
        case 'today':
          startDate = new Date()
          startDate.setHours(0, 0, 0, 0)
          break
        case 'week':
          startDate = new Date()
          startDate.setDate(startDate.getDate() - 7)
          startDate.setHours(0, 0, 0, 0)
          break
        case 'month':
          startDate = new Date()
          startDate.setMonth(startDate.getMonth() - 1)
          startDate.setHours(0, 0, 0, 0)
          break
        default:
          startDate = new Date()
          startDate.setHours(0, 0, 0, 0)
      }
      
      // Filter sales by period
      const filteredSales = salesData.filter(sale => {
        const saleDate = new Date(sale.createdAt || sale.date)
        return saleDate >= startDate && saleDate <= now
      })
      
      console.log(`Filtered ${filteredSales.length} sales for period ${mappedPeriod}`)
      
      let labels, revenueData, salesCountData
      
      // Handle "today" differently - group by hour instead of date
      if (mappedPeriod === 'today') {
        // Group by hour (8 AM to 7 PM like in the first image)
        const hourlyData = {}
        
        // Initialize all hours from 8 AM to 7 PM
        for (let hour = 8; hour <= 19; hour++) {
          const hourKey = `${hour}:00`
          hourlyData[hourKey] = { sales: 0, revenue: 0 }
        }
        
        // Fill in actual sales data
        filteredSales.forEach(sale => {
          const saleDate = new Date(sale.createdAt || sale.date)
          const hour = saleDate.getHours()
          
          if (hour >= 8 && hour <= 19) {
            const hourKey = `${hour}:00`
            hourlyData[hourKey].sales += 1
            hourlyData[hourKey].revenue += sale.grandTotal || sale.totalAmount || sale.amount || sale.total || 0
          }
        })
        
        // Convert to arrays (already in correct order)
        labels = Object.keys(hourlyData)
        revenueData = Object.values(hourlyData).map(h => h.revenue)
        salesCountData = Object.values(hourlyData).map(h => h.sales)
        
        console.log('Today hourly data:', { labels, revenueData, salesCountData })
      } else {
        // For week/month - group by date
        const dailyData = {}
        
        filteredSales.forEach(sale => {
          const saleDate = new Date(sale.createdAt || sale.date)
          const dateKey = saleDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          
          if (!dailyData[dateKey]) {
            dailyData[dateKey] = { sales: 0, revenue: 0 }
          }
          
          dailyData[dateKey].sales += 1
          dailyData[dateKey].revenue += sale.grandTotal || sale.totalAmount || sale.amount || sale.total || 0
        })
        
        // Sort dates and create arrays
        const sortedDates = Object.keys(dailyData).sort((a, b) => new Date(a) - new Date(b))
        labels = sortedDates
        revenueData = sortedDates.map(date => dailyData[date].revenue)
        salesCountData = sortedDates.map(date => dailyData[date].sales)
      }
      
      // If no data for period, create empty structure
      if (labels.length === 0) {
        return {
          labels: [],
          data: [],
          datasets: []
        }
      }
      
      // Return formatted data
      const result = {
        labels: labels,
        data: revenueData,
        datasets: [
          {
            label: 'Sales Count',
            data: salesCountData
          },
          {
            label: 'Revenue (BDT)',
            data: revenueData
          }
        ]
      }
      
      console.log('Returning sales data with datasets:', result)
      return result
    } catch (error) {
      console.error('Error fetching sales data:', error)
      // Return empty data if API fails
      return {
        labels: [],
        data: [],
        datasets: []
      }
    }
  },

  // Get top selling products
  getTopProducts: async (limit = 4) => {
    try {
      const response = await api.get(`/products/top-selling?limit=${limit}`)
      return response.data || []
    } catch (error) {
      console.error('Error fetching top products:', error)
      
      // Fallback: get all products and calculate top selling from sales data
      try {
        const [productsResponse, salesResponse] = await Promise.all([
          api.get('/products'),
          api.get('/sales')
        ])
        
        const products = productsResponse.data || []
        const sales = salesResponse.data || []
        
        if (products.length === 0 || sales.length === 0) {
          return []
        }
        
        // Calculate product sales
        const productSales = {}
        sales.forEach(sale => {
          if (sale.items && Array.isArray(sale.items)) {
            sale.items.forEach(item => {
              const productId = item.productId || item._id
              if (productId) {
                if (!productSales[productId]) {
                  productSales[productId] = {
                    productId,
                    name: item.productName || 'Unknown Product',
                    quantitySold: 0,
                    revenue: 0
                  }
                }
                productSales[productId].quantitySold += item.quantity || 0
                productSales[productId].revenue += (item.unitPrice || 0) * (item.quantity || 0)
              }
            })
          }
        })
        
        // Sort by revenue and return top products
        return Object.values(productSales)
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, limit)
          .map(product => ({
            _id: product.productId,
            name: product.name,
            productName: product.name,
            quantitySold: product.quantitySold,
            salesCount: product.quantitySold,
            soldQuantity: product.quantitySold,
            revenue: product.revenue
          }))
      } catch (fallbackError) {
        console.error('Error in fallback top products:', fallbackError)
        return []
      }
    }
  },

  // Get recent activities
  getRecentActivities: async () => {
    try {
      const [sales] = await Promise.allSettled([
        api.get('/sales?limit=5&sort=-createdAt').catch(() => ({ data: [] }))
      ])

      const activities = []
      
      // Process sales
      const salesData = sales.status === 'fulfilled' ? sales.value.data : []
      salesData.forEach(sale => {
        const amount = sale.grandTotal || sale.totalAmount || sale.amount || sale.total || 0
        const paymentMethod = sale.paymentMethod || 'Cash'
        const status = sale.status || 'Completed'
        const invoiceRef = sale.invoiceNo || sale._id?.slice(-6) || 'N/A'
        
        activities.push({
          id: sale._id,
          type: 'sale',
          title: `Sale #${invoiceRef}`,
          description: `BDT ${amount} - ${status} via ${paymentMethod}`,
          timestamp: sale.createdAt || sale.date,
          icon: 'receipt'
        })
      })

      // Sort by timestamp and return latest 5
      return activities
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5)
    } catch (error) {
      console.error('Error fetching recent activities:', error)
      return []
    }
  },

  // Get alerts and notifications
  getAlerts: async () => {
    try {
      const [lowStock, suppliers] = await Promise.allSettled([
        api.get('/inventory/low-stock/5').catch(err => {
          console.error('Low stock API error:', err)
          return { data: [] }
        }),
        api.get('/suppliers').catch(err => {
          console.error('Suppliers API error:', err)
          return { data: [] }
        })
      ])

      const alerts = []

      // Low stock alerts
      const lowStockData = lowStock.status === 'fulfilled' ? lowStock.value.data : []
      lowStockData.forEach(item => {
        alerts.push({
          id: `low-stock-${item._id}`,
          type: 'warning',
          severity: 'high',
          title: 'Low Stock Alert',
          message: `${item.productName || 'Product'} only ${item.stockQty || 0} left`,
          timestamp: new Date(),
          icon: 'alert-triangle'
        })
      })

      // Payment due alerts (using suppliers data)
      const suppliersData = suppliers.status === 'fulfilled' ? suppliers.value.data : []
      suppliersData.forEach(supplier => {
        const outstandingBalance = supplier.outstandingBalance || supplier.balance || supplier.dueAmount || 0
        if (outstandingBalance > 0) {
          alerts.push({
            id: `payment-${supplier._id}`,
            type: 'info',
            severity: 'medium',
            title: 'Payment Due',
            message: `${supplier.name || 'Supplier'} - BDT ${outstandingBalance} Due`,
            timestamp: new Date(),
            icon: 'credit-card'
          })
        }
      })

      return alerts.sort((a, b) => {
        const severityOrder = { high: 3, medium: 2, low: 1 }
        return severityOrder[b.severity] - severityOrder[a.severity]
      })
    } catch (error) {
      console.error('Error fetching alerts:', error)
      return []
    }
  },

  // Export dashboard data
  exportData: async (type = 'overview') => {
    try {
      // For now, return a mock export since the endpoint doesn't exist
      console.log(`Exporting dashboard data for type: ${type}`)
      
      // Create a simple CSV export
      const csvData = `Dashboard Export - ${type}\nDate,${new Date().toISOString().split('T')[0]}\nType,${type}\nStatus,Exported`
      
      // Create download link
      const blob = new Blob([csvData], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `dashboard-${type}-${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting data:', error)
      throw error
    }
  }
}

export default dashboardAPI
