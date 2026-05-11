import React, { useState } from 'react'
import { Warehouse, Plus, Pencil, Trash2, Eye } from 'lucide-react'
import Button from '../../Components/UI/Button'
import PageHeader from '../../Shared/PageHeader/PageHeader'
import StatsCard from '../../Shared/StatsCard/StatsCard'
import EmptyState from '../../Shared/EmptyState/EmptyState'
import { SharedTable } from '../../Shared/SharedTable/SharedTable'
import { ReusableFilter } from '../../Shared/ReusableFilter/ReusableFilter'
import WarehouseForm from './components/WarehouseForm'
import WarehouseViewModal from './components/WarehouseViewModal'
import { useWarehouseData } from './hooks/useWarehouseData'
import { useFilters } from '../../hooks/useFilters'
import { filterWarehouses, getUniqueLocations, getExportConfig } from './utils/warehouseHelpers'
import { exportToCSV } from '../../utils/export'

const INITIAL_FORM_DATA = {
  name: '',
  location: '',
  address: '',
  contactPerson: '',
  phone: '',
  email: ''
}

const WarehouseListRefactored = () => {
  // Data management
  const {
    warehouses,
    loading,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse
  } = useWarehouseData()

  // Filtering
  const {
    filters,
    filteredData: filteredWarehouses,
    handleFilterChange,
    clearFilters
  } = useFilters(warehouses, filterWarehouses, { search: '', location: '' })

  // Modal states
  const [modalOpen, setModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedWarehouse, setSelectedWarehouse] = useState(null)
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)

  // Handlers
  const handleAdd = () => {
    setFormData(INITIAL_FORM_DATA)
    setEditMode(false)
    setModalOpen(true)
  }

  const handleEdit = (warehouse) => {
    setFormData({
      name: warehouse.name || '',
      location: warehouse.location || '',
      address: warehouse.address || '',
      contactPerson: warehouse.contactPerson || '',
      phone: warehouse.phone || '',
      email: warehouse.email || ''
    })
    setSelectedWarehouse(warehouse)
    setEditMode(true)
    setModalOpen(true)
  }

  const handleView = (warehouse) => {
    setSelectedWarehouse(warehouse)
    setViewModalOpen(true)
  }

  const handleDelete = async (warehouse) => {
    await deleteWarehouse(warehouse._id, warehouse.name)
  }

  const handleSubmit = async (data) => {
    const success = editMode
      ? await updateWarehouse(selectedWarehouse._id, data)
      : await createWarehouse(data)

    if (success) {
      setModalOpen(false)
      setFormData(INITIAL_FORM_DATA)
      setSelectedWarehouse(null)
    }
  }

  const handleExport = () => {
    const { headers, keys, filename } = getExportConfig()
    exportToCSV(filteredWarehouses, headers, keys, filename)
  }

  // Filter configuration
  const uniqueLocations = getUniqueLocations(warehouses)
  const filterConfig = [
    {
      key: 'search',
      label: 'Search',
      type: 'search',
      placeholder: 'Search by name, location, or contact person...',
      span: 2
    },
    {
      key: 'location',
      label: 'Location',
      type: 'select',
      options: [
        { value: '', label: 'All Locations' },
        ...uniqueLocations.map(loc => ({ value: loc, label: loc }))
      ]
    }
  ]

  // Table columns
  const columns = [
    {
      accessorKey: 'name',
      header: 'Warehouse Name',
      cell: ({ row }) => (
        <div className="font-semibold text-gray-900">{row.original.name}</div>
      )
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">{row.original.location || 'N/A'}</span>
      )
    },
    {
      accessorKey: 'contactPerson',
      header: 'Contact Person',
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">{row.original.contactPerson || 'N/A'}</span>
      )
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">{row.original.phone || 'N/A'}</span>
      )
    },
    {
      accessorKey: 'totalProducts',
      header: 'Products',
      cell: ({ row }) => (
        <span className="font-semibold text-blue-600">{row.original.totalProducts || 0}</span>
      )
    },
    {
      accessorKey: 'totalStock',
      header: 'Total Stock',
      cell: ({ row }) => (
        <span className="font-semibold text-green-600">{row.original.totalStock || 0}</span>
      )
    }
  ]

  // Row actions
  const renderRowActions = (warehouse) => (
    <div className="flex gap-2">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => handleView(warehouse)}
      >
        <Eye className="w-4 h-4" />
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => handleEdit(warehouse)}
      >
        <Pencil className="w-4 h-4" />
      </Button>
      <Button
        variant="danger"
        size="sm"
        onClick={() => handleDelete(warehouse)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  )

  // Calculate stats
  const totalProducts = warehouses.reduce((sum, w) => sum + (w.totalProducts || 0), 0)
  const totalStock = warehouses.reduce((sum, w) => sum + (w.totalStock || 0), 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Warehouse Management"
        subtitle="Manage your warehouse locations and inventory"
        icon={Warehouse}
        actions={[
          {
            label: 'Add Warehouse',
            icon: Plus,
            onClick: handleAdd,
            variant: 'primary'
          }
        ]}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          label="Total Warehouses"
          value={warehouses.length}
          icon={Warehouse}
          color="blue"
        />
        <StatsCard
          label="Total Products"
          value={totalProducts}
          icon={Plus}
          color="purple"
        />
        <StatsCard
          label="Total Stock"
          value={totalStock}
          icon={Plus}
          color="green"
        />
      </div>

      {/* Filters */}
      <ReusableFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        filterConfig={filterConfig}
        title="Search & Filter"
        resultsCount={filteredWarehouses.length}
        totalCount={warehouses.length}
        onExport={handleExport}
      />

      {/* Table or Empty State */}
      {filteredWarehouses.length === 0 && !loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <EmptyState
            icon={Warehouse}
            title="No warehouses found"
            message="Get started by adding your first warehouse location"
            action={{
              label: 'Add Warehouse',
              icon: Plus,
              onClick: handleAdd
            }}
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <SharedTable
            columns={columns}
            data={filteredWarehouses}
            pageSize={10}
            loading={loading}
            renderRowActions={renderRowActions}
            actionsHeader="Actions"
          />
        </div>
      )}

      {/* Modals */}
      <WarehouseForm
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setFormData(INITIAL_FORM_DATA)
          setSelectedWarehouse(null)
        }}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        editMode={editMode}
        loading={loading}
      />

      <WarehouseViewModal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false)
          setSelectedWarehouse(null)
        }}
        warehouse={selectedWarehouse}
      />
    </div>
  )
}

export default WarehouseListRefactored

