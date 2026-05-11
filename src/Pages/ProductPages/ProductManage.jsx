import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutGrid, List, Eye, Pencil, Trash2, Plus, Package, Info, RefreshCw } from 'lucide-react'
import Swal from 'sweetalert2'
import Button from '../../Components/UI/Button'
import InfoCard from '../../Shared/InfoCard/InfoCard'
import { SharedTable } from '../../Shared/SharedTable/SharedTable'
import ViewProductModal from './components/ViewProductModal'
import EditProductModal from './components/EditProductModal'
import ProductFilter from './components/ProductFilter'
import ProductCard from './components/ProductCard'
import { productsAPI } from './services/productService'
import { applyProductFilters, getUniqueCategories, getUniqueSuppliers } from './utils/productHelpers'

const ProductManage = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('table') // 'table' or 'card'
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    supplier: ''
  })

  // Fetch products
  useEffect(() => {
    fetchProducts()
  }, [])

  const applyFilters = useCallback(() => {
    const filtered = applyProductFilters(products, filters)
    setFilteredProducts(filtered)
  }, [products, filters])

  // Apply filters
  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = await productsAPI.getAll()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
      Swal.fire({
        title: 'Error!',
        text: 'Failed to load products',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      supplier: ''
    })
  }

  const handleView = (product) => {
    setSelectedProduct(product)
    setViewModalOpen(true)
  }

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setEditModalOpen(true)
  }

  const handleDelete = async (product) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete "${product.productName}"? This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      try {
        await productsAPI.delete(product._id)
        
        await Swal.fire({
          title: 'Deleted!',
          text: 'Product has been deleted successfully.',
          icon: 'success',
          confirmButtonColor: '#3b82f6',
          timer: 2000,
          timerProgressBar: true
        })
        
        fetchProducts()
      } catch (error) {
        console.error('Error deleting product:', error)
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete product',
          icon: 'error',
          confirmButtonColor: '#ef4444'
        })
      }
    }
  }

  const handleEditSuccess = () => {
    setEditModalOpen(false)
    fetchProducts()
  }

  // Get unique categories and suppliers for filters
  const categories = getUniqueCategories(products)
  const suppliers = getUniqueSuppliers(products)

  // Table columns
  const columns = [
    {
      accessorKey: 'productImage',
      header: 'Image',
      cell: ({ row }) => (
        <img 
          src={row.original.productImage || 'https://via.placeholder.com/50'} 
          alt={row.original.productName}
          className="w-12 h-12 object-cover rounded-lg border border-gray-200"
        />
      )
    },
    {
      accessorKey: 'productName',
      header: 'Product Name',
      cell: ({ row }) => (
        <div>
          <div className="font-semibold text-gray-900">{row.original.productName}</div>
          <div className="text-xs text-gray-500">{row.original.qrCode}</div>
        </div>
      )
    },
    {
      accessorKey: 'sku',
      header: 'SKU',
      cell: ({ row }) => (
        <div className="font-mono text-sm text-gray-700">
          {row.original.sku || '-'}
        </div>
      )
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {row.original.category}
        </span>
      )
    },
    {
      accessorKey: 'brand',
      header: 'Brand',
      cell: ({ row }) => row.original.brand || '-'
    },
    {
      accessorKey: 'supplier',
      header: 'Supplier',
      cell: ({ row }) => row.original.supplier || '-'
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
    }
  ]


  // Render row actions for table
  const renderRowActions = (product) => (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleView(product)}
      >
        <div className='items-center'>
        <div className='flex items-center'>
        <Eye className="w-4 h-4 mr-1" />
        View
        </div>
        </div>
      </Button>
      <Button
        variant="edit"
        size="sm"
        onClick={() => handleEdit(product)}
      >
        <div className='flex items-center'>
        <Pencil className="w-4 h-4 mr-1" />
        Edit
        </div>
      </Button>
      <Button
        variant="delete"
        size="sm"
        onClick={() => handleDelete(product)}
      >
        <div className='flex items-center'>
        <Trash2 className="w-4 h-4 mr-1" />
        Delete
        </div>
      </Button>
    </div>
  )

  // Card View Component
  const CardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {loading ? (
        <div className="col-span-full flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No products found</p>
          <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-red-50 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <Package className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-purple-600" />
              Manage Products
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              View, search, and manage your product inventory
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* View Toggle */}
            <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1 self-center sm:self-auto">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-md transition-all text-xs sm:text-sm ${
                  viewMode === 'table' 
                    ? 'bg-purple-600 text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-medium">Table</span>
              </button>
              <button
                onClick={() => setViewMode('card')}
                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-md transition-all text-xs sm:text-sm ${
                  viewMode === 'card' 
                    ? 'bg-purple-600 text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <LayoutGrid className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-medium">Cards</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={fetchProducts}
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center"
              >
                <div className="flex items-center">
                  <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span className="text-sm sm:text-base">Refresh</span>
                </div>
              </Button>

              <Button 
                variant="primary" 
                size="sm"
                onClick={() => navigate('/products/add')}
                className="w-full sm:w-auto flex items-center justify-center"
              >
                <div className="flex items-center">
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span className="text-sm sm:text-base">Add Product</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <InfoCard
        type="info"
        title="Product Catalog Management"
        message="Maintain your complete product catalog with detailed information, categories, suppliers, and QR codes. Products are linked to purchase orders, inventory, and sales transactions for complete traceability."
        icon={Info}
      />

      {/* Filters */}
      <ProductFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        products={products}
        filteredProducts={filteredProducts}
        categories={categories}
        suppliers={suppliers}
        resultsCount={filteredProducts.length}
        totalCount={products.length}
      />

      {/* Content - Table or Card View */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <SharedTable
            columns={columns}
            data={filteredProducts}
            loading={loading}
            renderRowActions={renderRowActions}
            pageSize={10}
          />
        </div>
      ) : (
        <CardView />
      )}

      {/* View Product Modal */}
      {selectedProduct && (
        <ViewProductModal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          product={selectedProduct}
        />
      )}

      {/* Edit Product Modal */}
      {selectedProduct && (
        <EditProductModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          product={selectedProduct}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  )
}

export default ProductManage
