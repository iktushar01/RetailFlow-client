import React, { useCallback, useEffect, useState } from 'react'
import { Plus, Users, Mail, Phone, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/Components/UI/button'
import { Input } from '@/Components/UI/input'
import { Label } from '@/Components/UI/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/UI/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/Components/UI/dialog'
import { SharedTable } from '@/Shared/SharedTable/SharedTable'
import EmptyState from '@/Shared/EmptyState/EmptyState'
import { retailApi } from '@/services/api'

const emptyForm = { name: '', email: '', phone: '', address: '' }

const CustomersPage = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    try {
      const data = await retailApi.customers.getAll()
      setCustomers(Array.isArray(data) ? data : [])
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load customers')
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  const filtered = customers.filter((customer) => {
    const q = search.toLowerCase()
    return (
      customer.name?.toLowerCase().includes(q) ||
      customer.email?.toLowerCase().includes(q) ||
      customer.phone?.toLowerCase().includes(q)
    )
  })

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEdit = (customer) => {
    setEditingId(customer._id)
    setForm({
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Customer name is required')
      return
    }

    try {
      if (editingId) {
        await retailApi.customers.update(editingId, form)
        toast.success('Customer updated')
      } else {
        await retailApi.customers.create(form)
        toast.success('Customer created')
      }
      setDialogOpen(false)
      fetchCustomers()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save customer')
    }
  }

  const handleDelete = async (customer) => {
    if (!window.confirm(`Delete ${customer.name}?`)) return
    try {
      await retailApi.customers.remove(customer._id)
      toast.success('Customer deleted')
      fetchCustomers()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete customer')
    }
  }

  const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'phone', header: 'Phone' },
    { accessorKey: 'address', header: 'Address' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Customers</h1>
          <p className="text-muted-foreground text-sm">Manage walk-in and registered customers for POS checkout.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Search</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardContent>
      </Card>

      {!loading && filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No customers yet"
          message="Add your first customer to speed up POS checkout."
          action={{ label: 'Add Customer', onClick: openCreate, icon: Plus }}
        />
      ) : (
        <SharedTable
          columns={columns}
          data={filtered}
          loading={loading}
          renderRowActions={(row) => (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => openEdit(row)}>
                <Pencil className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(row)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          )}
        />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Address</Label>
              <Input value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CustomersPage
