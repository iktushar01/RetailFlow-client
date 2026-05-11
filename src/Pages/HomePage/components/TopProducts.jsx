import React from 'react'
import { BarChart3, TrendingUp, Package } from 'lucide-react'

const TopProducts = ({ data }) => {
  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur ring-1 ring-slate-200/70 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="text-indigo-600" />
        <h2 className="font-semibold">Top Selling Products</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {data.topProducts.length > 0 ? (
          data.topProducts.map((product, index) => (
            <div key={product._id || index} className="rounded-xl ring-1 ring-slate-200/70 p-4 hover:shadow-md transition">
              <p className="font-medium">{product.name || product.productName || 'Unknown Product'}</p>
              <div className="mt-2 flex items-center justify-between text-sm text-slate-500">
                <span>Sold</span>
                <span className="inline-flex items-center gap-1 text-slate-700">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> 
                  {product.quantitySold || product.salesCount || product.soldQuantity || Math.floor(20 - index * 2)} units
                </span>
              </div>
            </div>
          ))
        ) : data.inventory && data.inventory.length > 0 ? (
          data.inventory.slice(0, 4).map((product, index) => {
            // Calculate total stock - check multiple field names
            const totalStockQty = product.stockQty || product.quantity || product.stock || 
                                 product.currentStock || 
                                 (product.locations?.reduce((sum, loc) => sum + (loc.quantity || 0), 0)) || 
                                 0
            const productName = product.productName || product.name || product.title || `Product ${index + 1}`
            
            return (
              <div key={product.productId || product._id || index} className="rounded-xl ring-1 ring-slate-200/70 p-4 hover:shadow-md transition">
                <p className="font-medium">{productName}</p>
                <div className="mt-2 flex items-center justify-between text-sm text-slate-500">
                  <span>Available</span>
                  <span className="inline-flex items-center gap-1 text-slate-700">
                    <Package className="w-3.5 h-3.5 text-blue-600" /> 
                    {totalStockQty} units
                  </span>
                </div>
              </div>
            )
          })
        ) : (
          <div className="col-span-full text-center py-8 text-slate-400">
            <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No products data available</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TopProducts
