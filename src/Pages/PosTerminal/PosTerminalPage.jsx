import React, { useState, useEffect, useCallback } from 'react'
import { ShoppingCart, RefreshCw, ChevronDown, Calendar, Percent, Plus } from 'lucide-react'
import Swal from 'sweetalert2'

// Internal Components
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

// Shadcn UI Components
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
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
  
  const [filters, setFilters] = useState({ search: '', category: '', warehouse: '' })
  const [totals, setTotals] = useState({ subtotal: 0, totalDiscount: 0, tax: 0, grandTotal: 0 })
  const [appliedDiscounts, setAppliedDiscounts] = useState([])
  const [taxRate, setTaxRate] = useState(0.1)

  // Memoized Fetch for stability
  const fetchData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true)
    try {
      const [productsData, inventoryData, customersData] = await Promise.all([
        productsAPI.getAll(),
        inventoryAPI.getAll(),
        customersAPI.getAll()
      ])
      
      setProducts(productsData)
      setInventory(inventoryData)
      
      if (customersData.length === 0) {
        const fallback = [{ _id: 'default', name: 'Walk-in Customer', phone: '' }]
        setCustomers(fallback)
      } else {
        setCustomers(customersData)
      }

      if (isSilent && isSilent !== "auto") {
        Swal.fire({ title: 'Synced', icon: 'success', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false })
      }
    } catch (error) {
      console.error('Fetch error:', error)
      Swal.fire('Sync Error', 'Failed to update store data', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  // Automatic Background Sync
  useEffect(() => {
    const interval = setInterval(() => fetchData("auto"), 45000)
    return () => clearInterval(interval)
  }, [fetchData])

  // Logic: Filtering & Totals
  useEffect(() => {
    setFilteredProducts(filterProducts(products, filters.search, filters.category, filters.warehouse, inventory))
  }, [products, filters, inventory])

  useEffect(() => {
    setTotals(calculateCartTotals(cartItems, appliedDiscounts, taxRate))
  }, [cartItems, appliedDiscounts, taxRate])

  // Cart Actions
  const handleAddToCart = (product, price) => {
    const inventoryItems = inventory.filter(item => item.productId === product._id)
    const currentStock = inventoryItems.reduce((sum, item) => sum + (parseFloat(item.stockQty) || 0), 0)
    
    if (currentStock <= 0) {
      Swal.fire('Out of Stock', 'This product is currently unavailable', 'warning')
      return
    }

    setCartItems(prev => {
      const idx = prev.findIndex(item => item.productId === product._id)
      if (idx >= 0) {
        if (prev[idx].quantity < currentStock) {
          const newItems = [...prev]
          newItems[idx].quantity += 1
          return newItems
        }
        Swal.fire('Limit Reached', `Only ${currentStock} units in stock`, 'info')
        return prev
      }
      return [...prev, {
        productId: product._id,
        productName: product.productName,
        unitPrice: price,
        originalPrice: product.sellingPrice || product.price || 0,
        quantity: 1,
        availableStock: currentStock,
        category: product.category
      }]
    })
  }

  const handleCompleteSale = async (paymentMethod) => {
    const validation = validateSaleData(cartItems, selectedCustomer, paymentMethod, inventory)
    if (!validation.isValid) {
      Swal.fire('Checkout Blocked', validation.errors[0], 'error')
      return
    }

    try {
      const saleData = prepareSaleData(cartItems, selectedCustomer, paymentMethod, totals, `INV-${Date.now()}`)
      await salesAPI.create(saleData)
      
      await salesPaymentsAPI.create({
        invoiceNo: saleData.invoiceNo,
        amount: saleData.grandTotal,
        paymentMethod: paymentMethod,
        status: 'Completed'
      })

      Swal.fire({
        title: 'Sale Successful',
        text: `Invoice ${saleData.invoiceNo} generated`,
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Print Receipt'
      }).then(res => res.isConfirmed && printInvoice(saleData))

      setCartItems([]); setSelectedCustomer(null); setAppliedDiscounts([])
      fetchData(true)
    } catch (err) {
      Swal.fire('Sale Failed', err.message, 'error')
    }
  }

  if (loading) return <SalesLoading message="Initializing Terminal..." />

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] gap-4 overflow-hidden bg-background">
      {/* Shadcn Card Header */}
      <Card className={`transition-all duration-500 overflow-hidden shrink-0 border-none shadow-sm bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 ${
        headerVisible ? 'max-h-64 p-6' : 'max-h-0 p-0 opacity-0'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg text-primary-foreground shadow-blue-200 shadow-lg">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-black tracking-tight uppercase">Terminal</h1>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground text-sm pt-1">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date().toLocaleDateString()}</span>
              <Separator orientation="vertical" className="h-4" />
              <Badge variant="secondary" className="font-mono">{inventory.length} SKUs Live</Badge>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-background p-1 rounded-md border shadow-sm">
              <div className="pl-2 text-muted-foreground"><Percent className="w-4 h-4" /></div>
              <Select value={taxRate.toString()} onValueChange={val => setTaxRate(parseFloat(val))}>
                <SelectTrigger className="w-[110px] border-none shadow-none h-8 focus:ring-0">
                  <SelectValue placeholder="Tax" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No Tax (0%)</SelectItem>
                  <SelectItem value="0.05">GST (5%)</SelectItem>
                  <SelectItem value="0.1">Standard (10%)</SelectItem>
                  <SelectItem value="0.15">High (15%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" size="sm" onClick={() => fetchData(true)} className="h-10">
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync
            </Button>
            
            <Button variant="ghost" size="icon" onClick={() => setHeaderVisible(false)} className="rounded-full">
              <ChevronDown className="w-4 h-4 rotate-180" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Hidden Header Trigger */}
      {!headerVisible && (
        <div className="flex justify-center -mb-2 shrink-0">
          <Button 
            variant="secondary" 
            size="sm" 
            className="rounded-full h-8 px-6 shadow-md border animate-in slide-in-from-top-2 flex gap-2"
            onClick={() => setHeaderVisible(true)}
          >
            <ChevronDown className="w-4 h-4" /> Expand Dashboard
          </Button>
        </div>
      )}

      {/* Terminal Main Grid */}
      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0 overflow-hidden">
        {/* Left Column: Product Selection */}
        <Card className="col-span-12 lg:col-span-8 flex flex-col overflow-hidden border-slate-200/60 shadow-none">
          <ProductList
            products={filteredProducts}
            inventory={inventory}
            onAddToCart={handleAddToCart}
            onUpdateProductPrice={(id, price) => fetchData(true)} // Example
            filters={filters}
            onFilterChange={(k, v) => setFilters(p => ({ ...p, [k]: v }))}
          />
        </Card>

        {/* Right Column: Cart Management */}
        <Card className="col-span-12 lg:col-span-4 flex flex-col overflow-hidden border-slate-200/60 shadow-none">
          <Cart
            cartItems={cartItems}
            onUpdateQuantity={(idx, q) => {
              const items = [...cartItems]; items[idx].quantity = q; setCartItems(items)
            }}
            onRemoveItem={idx => setCartItems(prev => prev.filter((_, i) => i !== idx))}
            onUpdatePrice={(idx, p) => {
              const items = [...cartItems]; items[idx].unitPrice = p; setCartItems(items)
            }}
            onResetPrice={idx => {
              const items = [...cartItems]; items[idx].unitPrice = items[idx].originalPrice; setCartItems(items)
            }}
            onClearCart={() => setCartItems([])}
            totals={totals}
            appliedDiscounts={appliedDiscounts}
            onApplyDiscount={d => setAppliedDiscounts(prev => [...prev, d])}
            onRemoveDiscount={id => setAppliedDiscounts(prev => prev.filter(d => d._id !== id))}
          />
        </Card>
      </div>

      {/* Footer: Customer & Payment Logic */}
      <div className="shrink-0 bg-white dark:bg-slate-950 border-t p-2">
        <PaymentSection
          customers={customers}
          selectedCustomer={selectedCustomer}
          onSelectCustomer={setSelectedCustomer}
          onCreateCustomer={async (data) => {
             await customersAPI.create(data)
             fetchData(true)
          }}
          cartItems={cartItems}
          totals={totals}
          onCompleteSale={handleCompleteSale}
          onHoldSale={async () => {
             const saleData = prepareSaleData(cartItems, selectedCustomer, 'Cash', totals, `HOLD-${Date.now()}`)
             await salesAPI.hold(saleData)
             setCartItems([])
          }}
        />
      </div>
    </div>
  )
}

export default PosTerminalPage