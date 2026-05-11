import React from 'react'
import { SharedTable } from '../../../Shared/SharedTable/SharedTable'
import Button from '../../../Components/UI/Button'
import { QrCode, Barcode, Pencil } from 'lucide-react'
import { 
  getBarcodeStatusColor, 
  getBarcodeStatusDisplay,
  formatDate 
} from '../utils/barcodeHelpers'

const BarcodeList = ({
  inventory = [],
  products = [],
  loading = false,
  onEditBarcode
}) => {
  const columns = [
    { 
      header: "Product Name", 
      accessorKey: "productName",
      cell: ({ getValue }) => (
        <div className="font-medium text-gray-900">{getValue() || 'N/A'}</div>
      )
    },
    { 
      header: "Product ID", 
      accessorKey: "productId",
      cell: ({ getValue }) => (
        <div className="text-gray-700 font-mono text-sm">{getValue() || 'N/A'}</div>
      )
    },
    { 
      header: "SKU", 
      accessorKey: "sku",
      cell: ({ row }) => {
        const product = products.find(p => p._id === row.original.productId)
        return (
          <div className="text-gray-700 font-mono text-sm">{product?.sku || 'N/A'}</div>
        )
      }
    },
    { 
      header: "Location", 
      accessorKey: "location",
      cell: ({ getValue }) => (
        <div className="text-gray-700">{getValue() || 'N/A'}</div>
      )
    },
    { 
      header: "Barcode", 
      accessorKey: "barcode",
      cell: ({ getValue, row }) => {
        // Check inventory barcode first, then product barcode
        const inventoryBarcode = getValue()
        const product = products.find(p => p._id === row.original.productId)
        const barcode = inventoryBarcode || product?.barcode
        
        return barcode ? (
          <div className="flex items-center gap-2">
            <Barcode className="w-4 h-4 text-blue-600" />
            <div className="font-mono text-sm text-blue-600">{barcode}</div>
          </div>
        ) : (
          <span className="text-gray-400 text-sm italic">Not assigned</span>
        )
      }
    },
    { 
      header: "QR Code", 
      accessorKey: "qrCode",
      cell: ({ row }) => {
        // Check inventory QR code first, then product QR code
        const inventoryQR = row.original.qrCode
        const product = products.find(p => p._id === row.original.productId)
        const qrCode = inventoryQR || product?.qrCode
        
        return qrCode ? (
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-green-600" />
            <div className="font-mono text-xs text-green-600 truncate max-w-[200px]" title={qrCode}>
              {qrCode}
            </div>
          </div>
        ) : (
          <span className="text-gray-400 text-sm italic">Not assigned</span>
        )
      }
    },
    { 
      header: "Status", 
      accessorKey: "barcode",
      cell: ({ getValue, row }) => {
        const inventoryBarcode = getValue()
        const inventoryQR = row.original.qrCode
        const product = products.find(p => p._id === row.original.productId)
        const productQR = product?.qrCode
        
        // Check if any code exists (inventory or product)
        const hasCode = inventoryBarcode || inventoryQR || productQR
        const colorClasses = getBarcodeStatusColor(hasCode)
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colorClasses}`}>
            {getBarcodeStatusDisplay(hasCode)}
          </span>
        )
      }
    },
    { 
      header: "Last Updated", 
      accessorKey: "updatedAt",
      cell: ({ getValue }) => (
        <div className="text-gray-500 text-sm">{formatDate(getValue())}</div>
      )
    }
  ]

  const renderRowActions = (item) => (
    <div className="flex items-center gap-2">
      <Button
        variant="primary"
        size="sm"
        onClick={() => onEditBarcode(item)}
        title="Edit Barcode/QR Code"
      >
        <div className="flex items-center">
          <Pencil className="w-4 h-4 mr-1" />
          <span>Edit</span>
        </div>
      </Button>
    </div>
  )

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {!loading && inventory.length === 0 ? (
        <div className="text-center py-12">
          <div className="flex flex-col items-center">
            <QrCode className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Inventory Items</h3>
            <p className="text-gray-500 mb-4">
              No inventory items available. Add products to inventory via:
              <br />
              <span className="font-medium">GRN (Goods Receive Note)</span> or <span className="font-medium">Stock In</span>
            </p>
          </div>
        </div>
      ) : (
        <SharedTable
          columns={columns}
          data={inventory}
          pageSize={10}
          loading={loading}
          renderRowActions={renderRowActions}
          actionsHeader="Actions"
        />
      )}
    </div>
  )
}

export default BarcodeList
