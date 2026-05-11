// POS Helper Functions

/**
 * Generate unique invoice number
 */
export const generateInvoiceNumber = () => {
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `INV-${randomStr}-${timestamp}`
}

/**
 * Calculate cart totals
 */
export const calculateCartTotals = (cartItems, discounts = [], taxRate = 0) => {
  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.unitPrice * item.quantity)
  }, 0)

  // Calculate item-level discounts
  let itemDiscounts = 0
  cartItems.forEach(item => {
    if (item.discount) {
      if (item.discountType === 'percentage') {
        itemDiscounts += (item.unitPrice * item.quantity * item.discount) / 100
      } else {
        itemDiscounts += item.discount
      }
    }
  })

  // Calculate cart-level discounts (from discount offers)
  let cartDiscounts = 0
  discounts.forEach(discount => {
    if (discount.type === 'Percentage') {
      cartDiscounts += (subtotal * discount.value) / 100
    } else if (discount.type === 'Flat') {
      cartDiscounts += discount.value
    }
  })

  const totalDiscount = itemDiscounts + cartDiscounts
  const afterDiscount = subtotal - totalDiscount

  // Calculate tax
  const tax = (afterDiscount * taxRate) / 100

  // Grand total
  const grandTotal = afterDiscount + tax

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    totalDiscount: parseFloat(totalDiscount.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    grandTotal: parseFloat(grandTotal.toFixed(2))
  }
}

/**
 * Check if discount is applicable
 */
export const isDiscountApplicable = (discount, cartItems) => {
  if (discount.status !== 'Active') return false
  
  // Check validity dates
  const now = new Date()
  const startDate = new Date(discount.validFrom)
  const endDate = new Date(discount.validTo)
  
  if (now < startDate || now > endDate) return false

  // Check if any cart item matches discount products/categories
  if (discount.applicableProducts && discount.applicableProducts.length > 0) {
    return cartItems.some(item => discount.applicableProducts.includes(item.productId))
  }

  if (discount.applicableCategories && discount.applicableCategories.length > 0) {
    return cartItems.some(item => discount.applicableCategories.includes(item.category))
  }

  // If no specific products/categories, applies to all
  return true
}

/**
 * Get applicable discounts for cart
 */
export const getApplicableDiscounts = (allDiscounts, cartItems) => {
  return allDiscounts.filter(discount => isDiscountApplicable(discount, cartItems))
}

/**
 * Format currency
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT'
  }).format(amount)
}

/**
 * Format date and time
 */
export const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

/**
 * Validate sale data
 */
export const validateSaleData = (cartItems, customer, paymentMethod, inventory = []) => {
  const errors = []

  if (!cartItems || cartItems.length === 0) {
    errors.push('Cart is empty. Please add items to proceed.')
  }

  if (!customer) {
    errors.push('Please select a customer.')
  }

  if (!paymentMethod) {
    errors.push('Please select a payment method.')
  }

  cartItems.forEach((item) => {
    if (item.quantity <= 0) {
      errors.push(`Invalid quantity for ${item.productName}`)
    }
    
    // Get current stock from inventory for validation (aggregate across all locations)
    const inventoryItems = inventory.filter(inv => inv.productId === item.productId)
    const currentStock = inventoryItems.reduce((sum, inv) => sum + (inv.stockQty || 0), 0)
    
    if (currentStock < item.quantity) {
      errors.push(`Insufficient stock for ${item.productName}. Available: ${currentStock}, Requested: ${item.quantity}`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Prepare sale data for API
 */
export const prepareSaleData = (cartItems, customer, paymentMethod, totals, invoiceNo) => {
  return {
    invoiceNo,
    customerId: customer._id,
    customerName: customer.name,
    customerPhone: customer.phone,
    items: cartItems.map(item => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discount: item.discount || 0,
      discountType: item.discountType || 'flat',
      subtotal: item.unitPrice * item.quantity
    })),
    subtotal: totals.subtotal,
    totalDiscount: totals.totalDiscount,
    tax: totals.tax,
    grandTotal: totals.grandTotal,
    paymentMethod,
    paymentStatus: paymentMethod === 'Cash' ? 'Paid' : 'Due',
    amountPaid: paymentMethod === 'Cash' ? totals.grandTotal : 0,
    status: 'Completed'
  }
}

/**
 * Filter products
 */
export const filterProducts = (products, searchTerm, category = '', warehouse = '', inventory = []) => {
  let filtered = [...products]

  if (searchTerm) {
    const search = searchTerm.toLowerCase()
    filtered = filtered.filter(p =>
      p.productName?.toLowerCase().includes(search) ||
      p.qrCode?.toLowerCase().includes(search) ||
      p.barcode?.toLowerCase().includes(search)
    )
  }

  if (category) {
    filtered = filtered.filter(p => p.category === category)
  }

  if (warehouse) {
    // Filter based on warehouse stock - check if product has inventory in the selected warehouse
    filtered = filtered.filter(p => {
      const productInventory = inventory.filter(inv => inv.productId === p._id)
      return productInventory.some(inv => inv.location === warehouse && inv.stockQty > 0)
    })
  }

  return filtered
}

/**
 * Get product stock from inventory (aggregated across all locations)
 */
export const getProductStock = (productId, inventory) => {
  const inventoryItems = inventory.filter(item => item.productId === productId)
  
  if (inventoryItems.length === 0) {
    return 0
  }
  
  // Sum up stock from all locations
  const totalStock = inventoryItems.reduce((sum, item) => {
    return sum + (item.stockQty || 0)
  }, 0)
  
  return Math.max(0, totalStock)
}

/**
 * Print invoice
 */
export const printInvoice = (saleData) => {
  const printWindow = window.open('', '_blank')
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice - ${saleData.invoiceNo}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .invoice-info { margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .totals { margin-top: 20px; text-align: right; }
        .totals div { margin: 5px 0; }
        .grand-total { font-size: 18px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>INVOICE</h1>
        <p>Invoice No: ${saleData.invoiceNo}</p>
        <p>Date: ${formatDateTime(saleData.createdAt)}</p>
      </div>
      
      <div class="invoice-info">
        <p><strong>Customer:</strong> ${saleData.customerName}</p>
        <p><strong>Phone:</strong> ${saleData.customerPhone || 'N/A'}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Discount</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${saleData.items.map(item => `
            <tr>
              <td>${item.productName}</td>
              <td>${item.quantity}</td>
              <td>${formatCurrency(item.unitPrice)}</td>
              <td>${formatCurrency(item.discount || 0)}</td>
              <td>${formatCurrency(item.subtotal)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="totals">
        <div>Subtotal: ${formatCurrency(saleData.subtotal)}</div>
        <div>Discount: ${formatCurrency(saleData.totalDiscount)}</div>
        <div>Tax: ${formatCurrency(saleData.tax)}</div>
        <div class="grand-total">Grand Total: ${formatCurrency(saleData.grandTotal)}</div>
        <div>Payment Method: ${saleData.paymentMethod}</div>
        <div>Status: ${saleData.paymentStatus}</div>
      </div>

      <script>
        window.onload = function() {
          window.print();
          window.onafterprint = function() {
            window.close();
          }
        }
      </script>
    </body>
    </html>
  `
  
  printWindow.document.write(html)
  printWindow.document.close()
}

