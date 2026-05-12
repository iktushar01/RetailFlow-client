import React, { useState, useMemo } from 'react'
import { 
  Warehouse, 
  Plus, 
  Pencil, 
  Trash2, 
  Eye, 
  MapPin, 
  Users, 
  Package2, 
  Download,
  MoreHorizontal
} from 'lucide-react'

// Shadcn UI Components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Shared & Sub-components
import { SharedTable } from '../../Shared/SharedTable/SharedTable'
import { ReusableFilter } from '../../Shared/ReusableFilter/ReusableFilter'
import EmptyState from '../../Shared/EmptyState/EmptyState'
import WarehouseForm from './components/WarehouseForm'
import WarehouseViewModal from './components/WarehouseViewModal'

// Hooks & Utils
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
  const {
    warehouses,
    loading,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse
  } = useWarehouseData()

  const {
    filters,
    filteredData: filteredWarehouses,
    handleFilterChange,
    clearFilters
  } = useFilters(warehouses, filterWarehouses, { search: '', location: '' })

  const [modalOpen, setModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedWarehouse, setSelectedWarehouse] = useState(null)
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)

  // Logic Handlers
  const handleAdd = () => {
    setFormData(INITIAL_FORM_DATA)
    setEditMode(false)
    setModalOpen(true)
  }

  const handleEdit = (warehouse) => {
    setFormData({ ...warehouse })
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

  // Column Definitions
  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Warehouse Details',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-foreground">{row.original.name}</span>
          <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {row.original.location || 'No Location'}
          </span>
        </div>
      )
    },
    {
      accessorKey: 'contactPerson',
      header: 'Point of Contact',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{row.original.contactPerson || 'Unassigned'}</span>
          <span className="text-xs text-muted-foreground">{row.original.phone || 'No Phone'}</span>
        </div>
      )
    },
    {
      accessorKey: 'totalProducts',
      header: 'SKUs',
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-mono font-bold">
          {row.original.totalProducts || 0}
        </Badge>
      )
    },
    {
      accessorKey: 'totalStock',
      header: 'Inventory Volume',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-black text-primary">{row.original.totalStock || 0}</span>
          <span className="text-[9px] uppercase font-bold text-muted-foreground">Total Units</span>
        </div>
      )
    }
  ], [])

  // Stats Calculation
  const totalProducts = warehouses.reduce((sum, w) => sum + (w.totalProducts || 0), 0)
  const totalStock = warehouses.reduce((sum, w) => sum + (w.totalStock || 0), 0)

  return (
    <div className=" mx-auto py-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Warehouse className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-black tracking-tight">Warehouses</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Operational overview of physical storage nodes and inventory distribution.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button size="sm" onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" /> New Warehouse
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Active Nodes", val: warehouses.length, icon: Warehouse, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Tracked SKUs", val: totalProducts, icon: Package2, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Global Stock", val: totalStock, icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((stat, i) => (
          <Card key={i} className="shadow-none border-muted">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[11px] font-black uppercase text-muted-foreground tracking-widest">{stat.label}</p>
                <p className="text-3xl font-black">{stat.val.toLocaleString()}</p>
              </div>
              <div className={`${stat.bg} p-3 rounded-xl`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      {/* Main Content Area */}
      <div className="space-y-4">
        <ReusableFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          filterConfig={[
            { key: 'search', label: 'Search', type: 'search', placeholder: 'Name, location, contact...' },
            { 
              key: 'location', 
              label: 'Location', 
              type: 'select', 
              options: [{ value: '', label: 'All Locations' }, ...getUniqueLocations(warehouses).map(loc => ({ value: loc, label: loc }))] 
            }
          ]}
          resultsCount={filteredWarehouses.length}
        />

        {filteredWarehouses.length === 0 && !loading ? (
          <Card className="border-dashed py-12">
            <EmptyState
              icon={Warehouse}
              title="No warehouses found"
              message="Adjust your filters or add a new storage facility to the network."
              action={{ label: 'Add Warehouse', icon: Plus, onClick: handleAdd }}
            />
          </Card>
        ) : (
          <Card className="shadow-sm overflow-hidden border-muted">
            <SharedTable
              columns={columns}
              data={filteredWarehouses}
              pageSize={10}
              loading={loading}
              renderRowActions={(warehouse) => (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleView(warehouse)}>
                      <Eye className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(warehouse)}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit Record
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleDelete(warehouse)}
                      className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              actionsHeader=""
            />
          </Card>
        )}
      </div>

      {/* Modal Layers */}
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