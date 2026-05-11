import React from 'react'
import { X, Printer, Download } from 'lucide-react'
import Button from '../../../Components/UI/Button'
import SharedModal from '../../../Shared/SharedModal/SharedModal'
import { formatCurrency, formatDateTime } from '../utils/invoiceHelpers'

const InvoiceViewModal = ({ isOpen, onClose, invoice, onPrint }) => {
  if (!invoice) return null

  return (
    <SharedModal isOpen={isOpen} onClose={onClose} title={`Invoice - ${invoice.invoiceNo}`} size="large">
      <div className="space-y-6">
        {/* Invoice Header */}
        <div className="border-b pb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Invoice Number</p>
              <p className="font-semibold text-gray-900">{invoice.invoiceNo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-semibold text-gray-900">{formatDateTime(invoice.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-medium">{invoice.customerName}</p>
            {invoice.customerPhone && <p className="text-sm text-gray-600">{invoice.customerPhone}</p>}
          </div>
        </div>

        {/* Items */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Items</h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Product</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Qty</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Price</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {invoice.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm">{item.productName}</td>
                    <td className="px-4 py-2 text-sm text-right">{item.quantity}</td>
                    <td className="px-4 py-2 text-sm text-right">{formatCurrency(item.unitPrice)}</td>
                    <td className="px-4 py-2 text-sm text-right font-semibold">{formatCurrency(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="border-t pt-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.totalDiscount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount:</span>
                <span className="font-medium text-green-600">-{formatCurrency(invoice.totalDiscount)}</span>
              </div>
            )}
            {invoice.tax > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium">{formatCurrency(invoice.tax)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Grand Total:</span>
              <span className="text-blue-600">{formatCurrency(invoice.grandTotal)}</span>
            </div>
            {invoice.amountPaid > 0 && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-medium text-green-600">{formatCurrency(invoice.amountPaid)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Balance Due:</span>
                  <span className="font-medium text-red-600">{formatCurrency(invoice.grandTotal - invoice.amountPaid)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">Payment Method:</span>
              <span className="ml-2 font-semibold">{invoice.paymentMethod}</span>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <span className={`ml-2 font-semibold ${invoice.paymentStatus === 'Paid' ? 'text-green-600' : 'text-red-600'}`}>
                {invoice.paymentStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Button variant="secondary" size="md" onClick={onClose} className="flex-1">
          Close
        </Button>
        <Button variant="primary" size="md" onClick={() => onPrint(invoice)} className="flex-1">
          <Printer className="w-4 h-4 mr-2" />
          Print Invoice
        </Button>
      </div>
    </SharedModal>
  )
}

export default InvoiceViewModal

