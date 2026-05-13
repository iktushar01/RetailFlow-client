import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  LayoutGrid, 
  List, 
  Eye, 
  Pencil, 
  Trash2, 
  Plus, 
  Package, 
  Info, 
  RefreshCw,
  Search,
  ArrowRight
} from 'lucide-react'
import Swal from 'sweetalert2'
import { Button } from '../../Components/UI/Button'
import { Badge } from "../../Components/UI/badge"
import { SharedTable } from '../../Shared/SharedTable/SharedTable'
import ViewProductModal from './components/ViewProductModal'
import EditProductModal from './components/EditProductModal'
import ProductFilter from './components/ProductFilter'
import ProductCard from './components/ProductCard'
import { productsAPI } from './services/productService'
import { applyProductFilters, getUniqueCategories, getUniqueSuppliers } from './utils/productHelpers'
import { cn } from "@/lib/utils"

const ProductManage = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('table') 
  
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    supplier: ''
  })

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const data = await productsAPI.getAll()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
      Swal.fire({
        title: 'System Error',
        text: 'Failed to synchronize product vault',
        icon: 'error',
        confirmButtonColor: 'oklch(var(--destructive))'
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    const filtered = applyProductFilters(products, filters)
    setFilteredProducts(filtered)
  }, [products, filters])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({ search: '', category: '', supplier: '' })
  }

  const handleAction = (product, mode) => {
    setSelectedProduct(product)
    if (mode === 'view') setViewModalOpen(true)
    if (mode === 'edit') setEditModalOpen(true)
  }

  const handleDelete = async (product) => {
    const result = await Swal.fire({
      title: 'De-list Product?',
      text: `Are you sure you want to remove ${product.productName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      confirmButtonColor: 'oklch(var(--destructive))',
      cancelButtonColor: 'oklch(var(--muted))',
    })

    if (result.isConfirmed) {
      try {
        await productsAPI.delete(product._id)
        Swal.fire({ title: 'Deleted', icon: 'success', timer: 1500, showConfirmButton: false })
        fetchProducts()
      } catch {
        Swal.fire({ title: 'Error', text: 'Deletion failed', icon: 'error' })
      }
    }
  }

  const columns = [
    {
      accessorKey: 'productImage',
      header: 'Assets',
      cell: ({ row }) => (
        <div className="relative w-10 h-10 group cursor-pointer" onClick={() => handleAction(row.original, 'view')}>
          <img 
            src={row.original.productImage || 'https://via.placeholder.com/50'} 
            alt={row.original.productName}
            className="w-full h-full object-cover rounded-lg border bg-muted group-hover:scale-110 transition-transform"
          />
        </div>
      )
    },
    {
      accessorKey: 'productName',
      header: 'Product Identity',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-foreground text-sm uppercase tracking-tight leading-none mb-1">
            {row.original.productName}
          </span>
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            {row.original.qrCode?.slice(-8) || 'NO-ID'}
          </span>
        </div>
      )
    },
    {
      accessorKey: 'sku',
      header: 'SKU',
      cell: ({ row }) => (
        <code className="text-[11px] bg-muted px-1.5 py-0.5 rounded border">
          {row.original.sku || '-'}
        </code>
      )
    },
    {
      accessorKey: 'category',
      header: 'Classification',
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-medium text-[10px] uppercase tracking-wide">
          {row.original.category}
        </Badge>
      )
    },
    {
      accessorKey: 'supplier',
      header: 'Source',
      cell: ({ row }) => <span className="text-xs font-medium italic">{row.original.supplier || 'N/A'}</span>
    },
    {
      accessorKey: 'createdAt',
      header: 'Enrolled',
      cell: ({ row }) => <span className="text-xs text-muted-foreground">{new Date(row.original.createdAt).toLocaleDateString()}</span>
    }
  ]

  const renderRowActions = (product) => (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" onClick={() => handleAction(product, 'view')} title="Inspect">
        <Eye className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => handleAction(product, 'edit')} title="Modify">
        <Pencil className="w-4 h-4 text-muted-foreground hover:text-blue-500 transition-colors" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => handleDelete(product)} title="Purge">
        <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive transition-colors" />
      </Button>
    </div>
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Dynamic Dashboard Header */}
      <div className="relative overflow-hidden bg-card border rounded-2xl p-6 shadow-sm">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary rounded-2xl shadow-xl shadow-primary/10">
              <Package className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase italic leading-none">
                Vault <span className="text-primary/70">Inventory</span>
              </h1>
              <p className="text-muted-foreground text-xs mt-1 font-medium tracking-wide uppercase">
                {products.length} Units Cataloged — {filteredProducts.length} Showing
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* View Mode Switcher */}
            <div className="flex bg-muted rounded-xl p-1 border">
              <Button 
                variant={viewMode === 'table' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('table')} 
                className="rounded-lg h-8 px-3"
              >
                <List className="w-4 h-4 mr-2" /> <span className="text-xs">List</span>
              </Button>
              <Button 
                variant={viewMode === 'card' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('card')} 
                className="rounded-lg h-8 px-3"
              >
                <LayoutGrid className="w-4 h-4 mr-2" /> <span className="text-xs">Grid</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={fetchProducts} disabled={loading} className="h-9 w-9 p-0">
                <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
              </Button>
              <Button onClick={() => navigate('/products/add')} size="sm" className="h-9 gap-2 shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4" /> Add Asset
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="bg-card border p-4 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total SKU</p>
              <p className="text-xl font-black tracking-tighter">{products.length}</p>
            </div>
            <div className="h-10 w-1 bg-primary/20 rounded-full" />
         </div>
         {/* Additional fast-stats can go here */}
      </div>

      {/* Filters Area */}
      <div className="bg-card border rounded-2xl p-4 shadow-sm">
        <ProductFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          categories={getUniqueCategories(products)}
          suppliers={getUniqueSuppliers(products)}
          resultsCount={filteredProducts.length}
          products={products}
          filteredProducts={filteredProducts}
        />
      </div>

      {/* Main Content Area */}
      <div className="min-h-[400px]">
        {viewMode === 'table' ? (
          <div className="bg-card border rounded-2xl p-6 shadow-sm overflow-hidden">
            <SharedTable
              columns={columns}
              data={filteredProducts}
              loading={loading}
              renderRowActions={renderRowActions}
              pageSize={10}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse border" />
              ))
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onView={() => handleAction(product, 'view')}
                  onEdit={() => handleAction(product, 'edit')}
                  onDelete={() => handleDelete(product)}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center border-2 border-dashed rounded-3xl bg-muted/20">
                <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-muted-foreground">No Assets Found</h3>
                <p className="text-sm text-muted-foreground/60 max-w-xs mx-auto mt-1">
                  Adjust your search parameters or inventory classifications to find hidden entries.
                </p>
                <Button variant="link" onClick={handleClearFilters} className="mt-4 gap-1">
                  Reset System Filters <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <ViewProductModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        product={selectedProduct}
      />

      {selectedProduct && (
        <EditProductModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          product={selectedProduct}
          onSuccess={() => {
            setEditModalOpen(false);
            fetchProducts();
          }}
        />
      )}
    </div>
  )
}

export default ProductManage
