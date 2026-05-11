import React from 'react'
import Swal from 'sweetalert2'
import { formatDate, getTotalOrderedQty, getTotalReceivedQty } from '../utils/stockInHelpers'

/**
 * Show detailed view of a stock in entry (GRN)
 * @param {Object} grn - GRN object
 * @param {Array} suppliers - Array of suppliers
 */
export const showStockInDetails = (grn, suppliers = []) => {
  const supplier = suppliers.find(s => s._id === grn.supplierId)
  
  const itemsTable = grn.items?.map((item, index) => `
    <tr class="border-b">
      <td class="py-2 px-3 text-left">${index + 1}</td>
      <td class="py-2 px-3 text-left">${item.productName || 'N/A'}</td>
      <td class="py-2 px-3 text-center">${item.orderedQty}</td>
      <td class="py-2 px-3 text-center font-semibold text-green-600">${item.receivedQty}</td>
      <td class="py-2 px-3 text-center">${item.batch || 'N/A'}</td>
      <td class="py-2 px-3 text-center">${item.expiry ? new Date(item.expiry).toLocaleDateString() : 'N/A'}</td>
    </tr>
  `).join('') || '<tr><td colspan="6" class="py-4 text-center text-gray-500">No items</td></tr>'

  const totalOrdered = getTotalOrderedQty(grn)
  const totalReceived = getTotalReceivedQty(grn)

  Swal.fire({
    title: `<div class="flex items-center justify-center"><svg class="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Stock In Details: ${grn.grnNumber}</div>`,
    html: `
      <div class="text-left space-y-4 max-h-96 overflow-y-auto">
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p class="text-gray-600 font-semibold">PO Number</p>
            <p class="text-gray-900 font-mono">${grn.poNumber || 'N/A'}</p>
          </div>
          <div>
            <p class="text-gray-600 font-semibold">Supplier</p>
            <p class="text-gray-900">${supplier?.supplierName || 'N/A'}</p>
          </div>
          <div>
            <p class="text-gray-600 font-semibold">Received Date</p>
            <p class="text-gray-900">${formatDate(grn.receivedDate)}</p>
          </div>
          <div>
            <p class="text-gray-600 font-semibold">Status</p>
            <p><span class="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">${grn.status}</span></p>
          </div>
        </div>
        
        <div class="bg-green-50 p-3 rounded-lg border border-green-200">
          <p class="text-sm font-semibold text-green-800 mb-2">✅ Stock Added to Warehouse</p>
          <p class="text-xs text-green-700">This GRN has been processed and ${totalReceived} units have been added to your inventory.</p>
        </div>
        
        <div class="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div class="grid grid-cols-2 gap-3 text-center">
            <div>
              <p class="text-xs text-gray-600">Total Ordered</p>
              <p class="text-lg font-bold text-gray-900">${totalOrdered}</p>
            </div>
            <div>
              <p class="text-xs text-gray-600">Total Received</p>
              <p class="text-lg font-bold text-green-600">${totalReceived}</p>
            </div>
          </div>
        </div>
        
        <div class="mt-4">
          <p class="text-gray-600 font-semibold mb-2">Items Received</p>
          <div class="overflow-x-auto border rounded-lg">
            <table class="min-w-full text-sm">
              <thead class="bg-gray-50">
                <tr>
                  <th class="py-2 px-3 text-left">#</th>
                  <th class="py-2 px-3 text-left">Product</th>
                  <th class="py-2 px-3 text-center">Ordered</th>
                  <th class="py-2 px-3 text-center">Received</th>
                  <th class="py-2 px-3 text-center">Batch</th>
                  <th class="py-2 px-3 text-center">Expiry</th>
                </tr>
              </thead>
              <tbody>
                ${itemsTable}
              </tbody>
            </table>
          </div>
        </div>

        ${grn.notes ? `
          <div class="mt-3">
            <p class="text-gray-600 font-semibold mb-1">Notes</p>
            <p class="text-gray-700 text-sm bg-gray-50 p-3 rounded">${grn.notes}</p>
          </div>
        ` : ''}
      </div>
    `,
    width: '800px',
    confirmButtonColor: '#3B82F6',
    confirmButtonText: 'Close'
  })
}

// Export as default component (for consistency)
const StockInDetails = { showStockInDetails }
export default StockInDetails

