import React, { useState, useEffect } from 'react'
import { ShoppingCart, Package, RefreshCw, ChevronDown } from 'lucide-react'
import Swal from 'sweetalert2'
import ProductList from './components/ProductList'
import Cart from './components/Cart'
import PaymentSection from './components/PaymentSection'
import { productsAPI, inventoryAPI, customersAPI, salesAPI, salesPaymentsAPI } from './services/posService'
import { 
  calculateCartTotals, 
  validateSaleData, 
  prepareSaleData, 
  filterProducts,
  printInvoice 
} from './utils/posHelpers'
import { SalesLoading } from '../../Components/UI/LoadingAnimation'

const PosTerminalPage = () => {
  const [products, setProducts] = useState([])
  const [inventory, setInventory] = useState([])
  const [customers, setCustomers] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [headerVisible, setHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    warehouse: ''
  })

  const [totals, setTotals] = useState({
    subtotal: 0,
    totalDiscount: 0,
    tax: 0,
    grandTotal: 0
  })

  const [appliedDiscounts, setAppliedDiscounts] = useState([])
  const [taxRate, setTaxRate] = useState(0.1) // 10% default tax rate

  // Fetch initial data
  useEffect(() => {
    fetchData()
  }, [])

  // Refresh inventory data periodically to ensure stock accuracy
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const inventoryData = await inventoryAPI.getAll()
        setInventory(inventoryData)
      } catch (error) {
        console.error('Error refreshing inventory:', error)
      }
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Apply filters
  useEffect(() => {
    const filtered = filterProducts(products, filters.search, filters.category, filters.warehouse, inventory)
    setFilteredProducts(filtered)
  }, [products, filters, inventory])

  // Calculate totals when cart changes
  useEffect(() => {
    const newTotals = calculateCartTotals(cartItems, appliedDiscounts, taxRate)
    setTotals(newTotals)
  }, [cartItems, appliedDiscounts, taxRate])

  // Handle scroll to hide/show header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down
        setHeaderVisible(false)
      } else {
        // Scrolling up
        setHeaderVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [productsData, inventoryData, customersData] = await Promise.all([
        productsAPI.getAll(),
        inventoryAPI.getAll(),
        customersAPI.getAll()
      ])
      
      console.log('=== FETCHED DATA DEBUG ===')
      console.log('Products count:', productsData.length)
      console.log('Inventory count:', inventoryData.length)
      console.log('Customers count:', customersData.length)
      console.log('Sample inventory item:', inventoryData[0])
      console.log('Sony PS5 inventory items:', inventoryData.filter(item => item.productName && item.productName.includes('Sony PS5')))
      
      setProducts(productsData)
      setInventory(inventoryData)
      
      // Add default customers if none exist (for localStorage fallback)
      if (customersData.length === 0) {
        const defaultCustomers = [
          {
            _id: 'customer_default_1',
            name: 'Walk-in Customer',
            phone: '',
            email: '',
            createdAt: new Date().toISOString()
          },
          {
            _id: 'customer_default_2',
            name: 'Regular Customer',
            phone: '01700000000',
            email: 'customer@example.com',
            createdAt: new Date().toISOString()
          }
        ]
        localStorage.setItem('pos_customers', JSON.stringify(defaultCustomers))
        setCustomers(defaultCustomers)
      } else {
        setCustomers(customersData)
      }
      
      setFilteredProducts(productsData)
    } catch (error) {
      console.error('Error fetching data:', error)
      Swal.fire('Error', 'Failed to load data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const refreshInventory = async () => {
    try {
      const inventoryData = await inventoryAPI.getAll()
      console.log('Inventory data received:', inventoryData)
      
      // Debug: Log products with multiple inventory records
      const productCounts = {}
      inventoryData.forEach(item => {
        if (!productCounts[item.productId]) {
          productCounts[item.productId] = []
        }
        productCounts[item.productId].push(item)
      })
      
      Object.keys(productCounts).forEach(productId => {
        if (productCounts[productId].length > 1) {
          console.log(`Product ${productId} has ${productCounts[productId].length} inventory records:`, productCounts[productId])
        }
      })
      
      setInventory(inventoryData)
      Swal.fire('Success', 'Inventory data refreshed', 'success')
    } catch (error) {
      console.error('Error refreshing inventory:', error)
      Swal.fire('Error', 'Failed to refresh inventory', 'error')
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleAddToCart = (product, price) => {
    // Get current stock from inventory to ensure accuracy (aggregate across all locations)
    const inventoryItems = inventory.filter(item => item.productId === product._id)
    
    // Debug logging
    console.log('=== ADD TO CART DEBUG ===')
    console.log('Product:', product.productName, 'ID:', product._id)
    console.log('Inventory items found:', inventoryItems)
    
    const currentStock = inventoryItems.reduce((sum, item) => {
      const stockQty = parseFloat(item.stockQty) || 0
      console.log(`Location: ${item.location}, StockQty: ${item.stockQty} (parsed: ${stockQty})`)
      return sum + stockQty
    }, 0)
    
    console.log('Total calculated stock:', currentStock)
    
    if (currentStock <= 0) {
      console.log('Stock check failed - currentStock:', currentStock)
      Swal.fire('Out of Stock', 'This product is not available', 'warning')
      return
    }

    const existingItemIndex = cartItems.findIndex(item => item.productId === product._id)
    const originalPrice = product.sellingPrice || product.price || 0
    const isCustomPrice = price !== originalPrice

    if (existingItemIndex >= 0) {
      // Update quantity if already in cart
      const newCartItems = [...cartItems]
      const currentCartQuantity = newCartItems[existingItemIndex].quantity
      
      if (currentCartQuantity < currentStock) {
        newCartItems[existingItemIndex].quantity += 1
        newCartItems[existingItemIndex].availableStock = currentStock // Update available stock
        setCartItems(newCartItems)
      } else {
        Swal.fire('Stock Limit', `Cannot add more than available stock (${currentStock})`, 'warning')
      }
    } else {
      // Add new item to cart
      setCartItems([
        ...cartItems,
        {
          productId: product._id,
          productName: product.productName,
          unitPrice: price,
          originalPrice: originalPrice,
          isCustomPrice: isCustomPrice,
          quantity: 1,
          availableStock: currentStock,
          category: product.category
        }
      ])
    }
  }

  const handleUpdateQuantity = (index, newQuantity) => {
    const newCartItems = [...cartItems]
    
    if (newQuantity <= 0) {
      handleRemoveItem(index)
      return
    }

    // Get current stock from inventory for real-time validation (aggregate across all locations)
    const productId = newCartItems[index].productId
    const inventoryItems = inventory.filter(item => item.productId === productId)
    const currentStock = inventoryItems.reduce((sum, item) => sum + (item.stockQty || 0), 0)

    if (newQuantity > currentStock) {
      Swal.fire('Stock Limit', `Cannot exceed available stock (${currentStock})`, 'warning')
      return
    }

    newCartItems[index].quantity = newQuantity
    newCartItems[index].availableStock = currentStock // Update available stock
    setCartItems(newCartItems)
  }

  const handleRemoveItem = (index) => {
    const newCartItems = cartItems.filter((_, i) => i !== index)
    setCartItems(newCartItems)
  }

  const handleUpdatePrice = (index, newPrice) => {
    const newCartItems = [...cartItems]
    const originalPrice = newCartItems[index].originalPrice || newCartItems[index].unitPrice
    newCartItems[index].unitPrice = newPrice
    newCartItems[index].isCustomPrice = newPrice !== originalPrice
    setCartItems(newCartItems)
  }

  const handleResetPrice = (index) => {
    const newCartItems = [...cartItems]
    if (newCartItems[index].originalPrice) {
      newCartItems[index].unitPrice = newCartItems[index].originalPrice
      newCartItems[index].isCustomPrice = false
      setCartItems(newCartItems)
    }
  }

  const handleUpdateProductPrice = async (productId, newPrice) => {
    try {
      // Validate input
      if (!productId || newPrice === undefined || newPrice < 0) {
        throw new Error('Invalid product ID or price')
      }

      console.log('Attempting to update product price:', productId, newPrice)

      // Update the product in the backend
      const response = await productsAPI.update(productId, { sellingPrice: newPrice })
      
      console.log('Backend update response:', response)
      
      // Update the product in the local state regardless of backend response
      // This ensures the UI updates even if there are network issues
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product._id === productId 
            ? { ...product, sellingPrice: newPrice }
            : product
        )
      )
      
      return response
    } catch (error) {
      console.error('Error updating product price:', error)
      
      // Even if backend fails, update the local state for better UX
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product._id === productId 
            ? { ...product, sellingPrice: newPrice }
            : product
        )
      )
      
      throw error
    }
  }

  const handleApplyDiscount = (discount) => {
    setAppliedDiscounts(prev => [...prev, discount])
  }

  const handleRemoveDiscount = (discountId) => {
    setAppliedDiscounts(prev => prev.filter(d => d._id !== discountId))
  }

  const handleClearCart = () => {
    Swal.fire({
      title: 'Clear Cart?',
      text: 'All items will be removed from cart',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, clear it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setCartItems([])
        setSelectedCustomer(null)
        setAppliedDiscounts([])
      }
    })
  }

  const handleCreateCustomer = async (customerData) => {
    await customersAPI.create(customerData)
    
    await Swal.fire({
      title: 'Success!',
      text: 'Customer created successfully',
      icon: 'success',
      timer: 1500
    })
    
    // Refresh customers and select the new one
    const customersData = await customersAPI.getAll()
    setCustomers(customersData)
    
    const newCustomer = customersData.find(c => c.name === customerData.name)
    setSelectedCustomer(newCustomer)
  }

  const handleCompleteSale = async (paymentMethod) => {
    console.log('=== COMPLETE SALE DEBUG ===')
    console.log('Cart items:', cartItems)
    console.log('Selected customer:', selectedCustomer)
    console.log('Payment method:', paymentMethod)
    console.log('Totals:', totals)
    console.log('Inventory:', inventory)
    
    // Validate with current inventory data
    const validation = validateSaleData(cartItems, selectedCustomer, paymentMethod, inventory)
    console.log('Validation result:', validation)
    
    if (!validation.isValid) {
      console.log('Validation failed:', validation.errors)
      Swal.fire('Validation Error', validation.errors.join('\n'), 'error')
      return
    }

    try {
      // Prepare sale data
      const invoiceNo = `INV-${Date.now()}`
      const saleData = prepareSaleData(cartItems, selectedCustomer, paymentMethod, totals, invoiceNo)
      console.log('Prepared sale data:', saleData)

      // Create sale
      console.log('Sending sale data to server...')
      await salesAPI.create(saleData)

      // Create sales payment record
      try {
        const paymentData = {
          invoiceNo: saleData.invoiceNo,
          customerId: saleData.customerId,
          customerName: saleData.customerName,
          customerPhone: saleData.customerPhone,
          amount: saleData.grandTotal,
          paymentMethod: saleData.paymentMethod,
          status: 'Completed',
          notes: `Payment for invoice ${saleData.invoiceNo}`,
          appliedDiscounts: appliedDiscounts.map(d => ({
            discountId: d._id,
            discountName: d.offerName,
            discountValue: d.value,
            discountType: d.type
          }))
        }
        
        console.log('Creating sales payment record...')
        await salesPaymentsAPI.create(paymentData)
        console.log('Sales payment record created successfully')
      } catch (paymentError) {
        console.error('Error creating sales payment record:', paymentError)
        // Don't fail the sale if payment record creation fails
        Swal.fire('Warning', 'Sale completed but payment record creation failed', 'warning')
      }

      await Swal.fire({
        title: 'Sale Completed!',
        text: `Invoice: ${saleData.invoiceNo}`,
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Print Invoice',
        cancelButtonText: 'Close'
      }).then((result) => {
        if (result.isConfirmed) {
          printInvoice({ ...saleData, createdAt: new Date() })
        }
      })

      // Clear cart
      setCartItems([])
      setSelectedCustomer(null)
      setAppliedDiscounts([])
      
      // Refresh inventory
      const inventoryData = await inventoryAPI.getAll()
      setInventory(inventoryData)
    } catch (err) {
      console.error('Error completing sale:', err)
      Swal.fire('Error', err.response?.data?.message || 'Failed to complete sale', 'error')
    }
  }

  const handleHoldSale = async () => {
    if (cartItems.length === 0) return

    try {
      const invoiceNo = `HOLD-${Date.now()}`
      const saleData = prepareSaleData(cartItems, selectedCustomer, 'Cash', totals, invoiceNo)
      
      await salesAPI.hold(saleData)
      
      await Swal.fire({
        title: 'Sale Held',
        text: 'Sale has been saved for later',
        icon: 'success',
        timer: 1500
      })

      setCartItems([])
      setSelectedCustomer(null)
    } catch {
      Swal.fire('Error', 'Failed to hold sale', 'error')
    }
  }

  if (loading) {
    return <SalesLoading message="Loading POS terminal..." />
  }

  return (
    <div className="space-y-4 relative">
      {/* Toggle Header Button - Shows when header is hidden */}
      {!headerVisible && (
        <button
          onClick={() => setHeaderVisible(true)}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all animate-bounce"
          title="Show Header"
        >
          <ChevronDown className="w-4 h-4" />
          <span className="text-sm font-medium">Show Header</span>
        </button>
      )}

      {/* Header with Auto-hide */}
      <div 
        className={`bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 transition-all duration-300 ${
          headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full h-0 overflow-hidden p-0'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-blue-600" />
              POS Terminal
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Complete sales transactions quickly and efficiently</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Tax Rate:</label>
              <select
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>0%</option>
                <option value={0.05}>5%</option>
                <option value={0.1}>10%</option>
                <option value={0.15}>15%</option>
                <option value={0.2}>20%</option>
              </select>
            </div>
            <button
              onClick={refreshInventory}
              className="flex items-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors w-full sm:w-auto justify-center"
              title="Refresh Inventory"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm font-medium">Refresh Stock</span>
            </button>
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Dynamic Height Based on Header Visibility */}
      <div 
        className={`grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[600px] transition-all duration-300 ${
          headerVisible ? 'h-[calc(100vh-280px)]' : 'h-[calc(100vh-80px)]'
        }`}
      >
        {/* Left: Product List - Fixed Height with Scroll */}
        <div className="lg:col-span-2 h-full overflow-hidden">
          <ProductList
            products={filteredProducts}
            inventory={inventory}
            onAddToCart={handleAddToCart}
            onUpdateProductPrice={handleUpdateProductPrice}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Right: Cart Only - Full Height */}
        <div className="h-full overflow-hidden">
          <Cart
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onUpdatePrice={handleUpdatePrice}
            onResetPrice={handleResetPrice}
            onClearCart={handleClearCart}
            totals={totals}
            appliedDiscounts={appliedDiscounts}
            onApplyDiscount={handleApplyDiscount}
            onRemoveDiscount={handleRemoveDiscount}
          />
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentSection
        customers={customers}
        selectedCustomer={selectedCustomer}
        onSelectCustomer={setSelectedCustomer}
        onCreateCustomer={handleCreateCustomer}
        cartItems={cartItems}
        totals={totals}
        onCompleteSale={handleCompleteSale}
        onHoldSale={handleHoldSale}
      />
    </div>
  )
}

export default PosTerminalPage