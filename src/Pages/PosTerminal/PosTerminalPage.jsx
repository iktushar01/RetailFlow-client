import React, { useState, useEffect, useCallback } from 'react'
import { RefreshCw, Calendar, Percent, ShoppingCart, Package, Receipt } from 'lucide-react'
import { notify } from '../../utils/notifications'
import { confirmDialog } from '../../utils/confirmDialog'

import ProductList from './components/ProductList'
import Cart from './components/Cart'
import PaymentSection from './components/PaymentSection'
import HeldSalesPanel from './components/HeldSalesPanel'
import { productsAPI, inventoryAPI, customersAPI, salesAPI, salesPaymentsAPI } from './services/posService'
import {
  calculateCartTotals,
  validateSaleData,
  prepareSaleData,
  filterProducts,
  printInvoice,
  getProductStock,
} from './utils/posHelpers'

import { Button } from "@/Components/UI/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/UI/select"
import { Badge } from "@/Components/UI/badge"
import { Card } from "@/Components/UI/card"
import { SalesLoading } from '../../Components/UI/LoadingAnimation'
import { cn } from '@/lib/utils'

const pickWalkInCustomer = (list) => {
  if (!list?.length) {
    return { _id: 'walk-in', name: 'Walk-in Customer', phone: '' }
  }
  return (
    list.find((c) => c.name?.toLowerCase().includes('walk-in')) ||
    list.find((c) => c.name?.toLowerCase() === 'walk in customer') ||
    list[0]
  )
}

const PosTerminalPage = () => {
  const [products, setProducts] = useState([])
  const [inventory, setInventory] = useState([])
  const [customers, setCustomers] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState({ search: '', category: '', warehouse: '' })
  const [totals, setTotals] = useState({ subtotal: 0, totalDiscount: 0, tax: 0, grandTotal: 0 })
  const [appliedDiscounts, setAppliedDiscounts] = useState([])
  const [taxRate, setTaxRate] = useState(0.1)
  const [mobileTab, setMobileTab] = useState('products')
  const [heldRefreshKey, setHeldRefreshKey] = useState(0)

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

      const customerList =
        customersData.length > 0
          ? customersData
          : [{ _id: 'walk-in', name: 'Walk-in Customer', phone: '' }]
      setCustomers(customerList)
      setSelectedCustomer((prev) => prev || pickWalkInCustomer(customerList))

      if (isSilent && isSilent !== "auto") {
        notify.success('Synced')
      }
    } catch (error) {
      console.error('Fetch error:', error)
      notify.error('Sync Error', 'Failed to update store data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  useEffect(() => {
    const interval = setInterval(() => fetchData("auto"), 45000)
    return () => clearInterval(interval)
  }, [fetchData])

  useEffect(() => {
    setFilteredProducts(filterProducts(products, filters.search, filters.category, filters.warehouse, inventory))
  }, [products, filters, inventory])

  useEffect(() => {
    setTotals(calculateCartTotals(cartItems, appliedDiscounts, taxRate))
  }, [cartItems, appliedDiscounts, taxRate])

  const handleAddToCart = (product, price) => {
    const inventoryItems = inventory.filter(item => item.productId === product._id)
    const currentStock = inventoryItems.reduce((sum, item) => sum + (parseFloat(item.stockQty) || 0), 0)

    if (currentStock <= 0) {
      notify.warning('Out of Stock', 'This product is currently unavailable')
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
        notify.info('Limit Reached', `Only ${currentStock} units in stock`)
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
      notify.error('Checkout Blocked', validation.errors[0])
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

      const shouldPrint = await confirmDialog({
        title: 'Sale Successful',
        description: `Invoice ${saleData.invoiceNo} generated`,
        confirmText: 'Print Receipt',
        cancelText: 'Close',
      })
      if (shouldPrint) printInvoice(saleData)

      setCartItems([])
      setSelectedCustomer(pickWalkInCustomer(customers))
      setAppliedDiscounts([])
      setHeldRefreshKey((k) => k + 1)
      setMobileTab('products')
      fetchData(true)
    } catch (err) {
      notify.error('Sale Failed', err.message)
    }
  }

  const handleUpdateProductPrice = async (productId, newPrice) => {
    await productsAPI.updatePrice(productId, newPrice)
    setProducts((prev) =>
      prev.map((p) => (p._id === productId ? { ...p, sellingPrice: newPrice, price: newPrice } : p))
    )
    await fetchData(true)
  }

  const handleResumeHeldSale = (sale) => {
    const customer =
      customers.find((c) => c._id === sale.customerId) ||
      { _id: sale.customerId, name: sale.customerName, phone: sale.customerPhone || '' }

    setCartItems(
      (sale.items || []).map((item) => ({
        productId: item.productId,
        productName: item.productName,
        unitPrice: item.unitPrice,
        originalPrice: item.unitPrice,
        quantity: item.quantity,
        availableStock: getProductStock(item.productId, inventory),
        category: products.find((p) => p._id === item.productId)?.category,
      }))
    )
    setSelectedCustomer(customer)
    setMobileTab('cart')
    notify.info('Sale resumed', sale.invoiceNo, { duration: 1500 })
  }

  const openCheckout = () => {
    window.dispatchEvent(new CustomEvent('openPaymentModal'))
  }

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  if (loading) return <SalesLoading message="Initializing Terminal..." />

  return (
    <div className={cn(
      "flex flex-col min-h-0 h-[calc(100dvh-7rem)] sm:h-[calc(100dvh-7.5rem)] -mx-4 px-4 md:-mx-6 md:px-6 pb-2",
      mobileTab === 'products' && cartItems.length > 0 && "pb-20 lg:pb-2"
    )}>
      {/* Compact header */}
      <div className="shrink-0 space-y-3 pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">POS Terminal</h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground text-xs sm:text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                {new Date().toLocaleDateString()}
              </span>
              <Badge variant="secondary" className="font-mono text-xs">
                {inventory.length} SKUs
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-md border bg-muted/40 px-2 py-1">
              <Percent className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <Select value={taxRate.toString()} onValueChange={val => setTaxRate(parseFloat(val))}>
                <SelectTrigger className="h-8 w-[7.5rem] border-none bg-transparent shadow-none focus:ring-0 text-xs sm:text-sm">
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

            <Button variant="outline" size="sm" onClick={() => fetchData(true)} className="h-8">
              <RefreshCw className="h-3.5 w-3.5 sm:mr-1.5" />
              <span className="hidden sm:inline">Sync</span>
            </Button>
          </div>
        </div>

        {/* Mobile / tablet tab switcher */}
        <div className="lg:hidden grid grid-cols-2 gap-2 rounded-lg border bg-muted/30 p-1">
          <Button
            variant={mobileTab === 'products' ? 'default' : 'ghost'}
            size="sm"
            className="h-10 gap-2"
            onClick={() => setMobileTab('products')}
          >
            <Package className="h-4 w-4 shrink-0" />
            Products
          </Button>
          <Button
            variant={mobileTab === 'cart' ? 'default' : 'ghost'}
            size="sm"
            className="h-10 gap-2 relative"
            onClick={() => setMobileTab('cart')}
          >
            <ShoppingCart className="h-4 w-4 shrink-0" />
            Cart
            {cartItemCount > 0 && (
              <Badge className="ml-1 h-5 min-w-5 px-1 text-[10px]">{cartItemCount}</Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Main panels */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-12 lg:gap-4">
        <Card
          className={cn(
            "lg:col-span-8 flex min-h-0 flex-col overflow-hidden border shadow-none",
            mobileTab !== 'products' && "hidden lg:flex"
          )}
        >
          <ProductList
            products={filteredProducts}
            inventory={inventory}
            onAddToCart={handleAddToCart}
            onUpdateProductPrice={handleUpdateProductPrice}
            filters={filters}
            onFilterChange={(k, v) => setFilters(p => ({ ...p, [k]: v }))}
          />
        </Card>

        <Card
          className={cn(
            "lg:col-span-4 flex min-h-0 flex-col overflow-hidden border shadow-none",
            mobileTab !== 'cart' && "hidden lg:flex"
          )}
        >
          <HeldSalesPanel onResume={handleResumeHeldSale} onRefresh={heldRefreshKey} />
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
            onCheckout={openCheckout}
          />
        </Card>
      </div>

      {/* Mobile floating cart bar — visible on products tab when cart has items */}
      {mobileTab === 'products' && cartItems.length > 0 && (
        <div className="lg:hidden fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div className="mx-auto flex max-w-lg items-center gap-3">
            <button
              type="button"
              className="min-w-0 flex-1 text-left"
              onClick={() => setMobileTab('cart')}
            >
              <p className="text-xs text-muted-foreground">{cartItemCount} item{cartItemCount !== 1 ? 's' : ''} in cart</p>
              <p className="truncate text-base font-bold text-primary">
                BDT {totals.grandTotal.toFixed(2)}
              </p>
            </button>
            <Button variant="outline" size="sm" className="shrink-0 h-10" onClick={() => setMobileTab('cart')}>
              View cart
            </Button>
            <Button size="sm" className="shrink-0 h-10 gap-1.5" onClick={openCheckout}>
              <Receipt className="h-4 w-4" />
              Pay
            </Button>
          </div>
        </div>
      )}

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
          saleData.status = 'Hold'
          saleData.paymentStatus = 'Due'
          saleData.amountPaid = 0
          await salesAPI.hold(saleData)
          setCartItems([])
          setHeldRefreshKey((k) => k + 1)
        }}
      />
    </div>
  )
}

export default PosTerminalPage
