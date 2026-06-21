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
import { Button } from '../../Components/UI/button'
import { Badge } from "../../Components/UI/badge"
import { Card } from '../../Components/UI/card'
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
          <span className="font-medium text-foreground text-sm">
            {row.original.productName}
          </span>
          <span className="text-xs font-mono text-muted-foreground">
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
      cell: ({ row }) => <span className="text-sm">{row.original.supplier || 'N/A'}</span>
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
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Products
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            {products.length} products cataloged — {filteredProducts.length} showing
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
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
              <Button onClick={() => navigate('/products/add')} size="sm" className="h-9 gap-2">
                <Plus className="w-4 h-4" /> Add Product
              </Button>
            </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total SKU</p>
            <p className="text-xl font-semibold">{products.length}</p>
          </div>
          <div className="h-10 w-1 bg-primary/20 rounded-full" />
        </div>
        {/* Additional fast-stats can go here */}
      </div>

      {/* Filters Area */}
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

      <div className="min-h-[400px]">
        {viewMode === 'table' ? (
          <Card className="overflow-hidden border shadow-none">
            <SharedTable
              embedded
              columns={columns}
              data={filteredProducts}
              loading={loading}
              renderRowActions={renderRowActions}
              pageSize={10}
            />
          </Card>
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
