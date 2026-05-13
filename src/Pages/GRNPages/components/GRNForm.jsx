import React, { useEffect, useState } from 'react'
import { X, Save, Info, MessageSquare, ClipboardList } from 'lucide-react'
import { Button } from "@/Components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/Components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select"
import { Input } from "@/Components/ui/input"
import { Textarea } from "@/Components/ui/textarea"
import { Progress } from "@/Components/ui/progress"
import { Label } from "@/Components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { ScrollArea } from "@/Components/ui/scroll-area"

import GRNItemsTable from './GRNItemsTable'
import { validateGRNForm, generateGRNNumber, MAX_NOTES_LENGTH } from '../utils/grnHelpers'
import { grnAPI } from '../services/grnService'
import Swal from 'sweetalert2'
import axios from 'axios'

const API_URL = 'https://pos-system-management-server-20.vercel.app'

const GRNForm = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  purchaseOrders = [],
  loading,
  onSubmit,
  isEditing
}) => {
  const [warehouses, setWarehouses] = useState([])
  const [warehousesLoading, setWarehousesLoading] = useState(false)

  useEffect(() => {
    const fetchWarehouses = async () => {
      if (isOpen) {
        setWarehousesLoading(true)
        try {
          const response = await axios.get(`${API_URL}/warehouses`)
          setWarehouses(response.data)
        } catch (error) {
          console.error('Error fetching warehouses:', error)
          setWarehouses([
            { _id: '1', name: 'Main Warehouse', location: 'Building A' },
            { _id: '2', name: 'Secondary Warehouse', location: 'Building B' }
          ])
        } finally {
          setWarehousesLoading(false)
        }
      }
    }
    fetchWarehouses()
  }, [isOpen])

  useEffect(() => {
    if (isOpen && !isEditing && !formData.grnNumber) {
      const grnNumber = generateGRNNumber()
      setFormData(prev => ({ ...prev, grnNumber }))
    }
  }, [isOpen, isEditing, formData.grnNumber, setFormData])

  const handlePOChange = async (poId) => {
    const selectedPO = purchaseOrders.find(po => po._id === poId)
    if (selectedPO) {
      try {
        const cumulativeReceived = await grnAPI.getCumulativeReceivedByPO(poId)
        const receivedMap = {}
        cumulativeReceived.forEach(item => {
          receivedMap[item.productId] = item.totalReceived
        })

        const grnItems = selectedPO.items?.map(item => {
          const productId = item.product || item.productId
          const orderedQty = item.quantity || item.orderedQty
          const alreadyReceived = receivedMap[productId] || 0
          return {
            id: item.id || Date.now() + Math.random(),
            productId,
            productName: item.productName,
            orderedQty,
            alreadyReceived,
            remainingQty: orderedQty - alreadyReceived,
            receivedQty: 0,
            batch: '',
            expiry: '',
            unitPrice: item.unitPrice || 0
          }
        }) || []

        setFormData(prev => ({
          ...prev,
          poId,
          poNumber: selectedPO.poNumber,
          supplierId: selectedPO.supplier,
          items: grnItems
        }))
      } catch (error) {
        console.error('Error mapping items:', error)
      }
    }
  }

  const handleFormSubmit = () => {
    const validation = validateGRNForm(formData)
    if (!validation.isValid) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        html: validation.errors.map(err => `• ${err}`).join('<br>'),
        confirmButtonColor: 'var(--primary)'
      })
      return
    }
    onSubmit(formData)
  }

  const totalOrdered = formData.items?.reduce((sum, item) => sum + (item.orderedQty || 0), 0) || 0
  const totalReceived = formData.items?.reduce((sum, item) => sum + (item.receivedQty || 0), 0) || 0
  const completionPercentage = totalOrdered > 0 ? Math.round((totalReceived / totalOrdered) * 100) : 0
  const remainingChars = MAX_NOTES_LENGTH - (formData.notes?.length || 0)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !loading && onClose()}>
      <DialogContent className="max-w-[95vw] w-full h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <ClipboardList className="w-6 h-6 text-primary" />
            {isEditing ? 'Edit Goods Receive Note' : 'Create New GRN'}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-6">
          <div className="space-y-6 pb-4">
            {/* Basic Information Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-md font-semibold flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>GRN Number</Label>
                  <Input 
                    value={formData.grnNumber || ''} 
                    readOnly 
                    className="bg-muted font-mono" 
                  />
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Auto-generated identifier</p>
                </div>

                <div className="space-y-2">
                  <Label>Purchase Order <span className="text-destructive">*</span></Label>
                  <Select 
                    disabled={isEditing} 
                    value={formData.poId} 
                    onValueChange={handlePOChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select PO" />
                    </SelectTrigger>
                    <SelectContent>
                      {purchaseOrders.map(po => (
                        <SelectItem key={po._id} value={po._id}>
                          {po.poNumber} ({po.items?.length || 0} items)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Received Date <span className="text-destructive">*</span></Label>
                  <Input 
                    type="date" 
                    value={formData.receivedDate || ''} 
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setFormData({ ...formData, receivedDate: e.target.value })}
                  />
                </div>

                <div className="md:col-span-3 space-y-2">
                  <Label>Destination Warehouse <span className="text-destructive">*</span></Label>
                  <Select 
                    value={formData.destinationWarehouse} 
                    onValueChange={(val) => setFormData({ ...formData, destinationWarehouse: val })}
                    disabled={warehousesLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={warehousesLoading ? "Loading..." : "Select warehouse"} />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map(w => (
                        <SelectItem key={w._id} value={w.name}>{w.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Summary Statistics */}
            {formData.items?.length > 0 && (
              <Card className="bg-accent/50 border-primary/20">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold">Total Items</p>
                      <p className="text-2xl font-black">{formData.items.length}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold">Ordered</p>
                      <p className="text-2xl font-black">{totalOrdered}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold">Received</p>
                      <p className="text-2xl font-black text-primary">{totalReceived}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground uppercase font-bold">Completion</p>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-primary">{completionPercentage}%</span>
                        <Progress value={completionPercentage} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Items Table */}
            <div className="rounded-xl border bg-card overflow-hidden">
              <GRNItemsTable
                items={formData.items || []}
                onItemChange={(id, field, value) => {
                  setFormData(prev => ({
                    ...prev,
                    items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
                  }))
                }}
                readOnly={false}
              />
            </div>

            {/* Notes Section */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-md font-semibold flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    Notes (Optional)
                  </CardTitle>
                  <span className={`text-[10px] font-bold ${remainingChars < 50 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {remainingChars} CHARS LEFT
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea 
                  value={formData.notes || ''}
                  placeholder="Add any additional notes or discrepancies..."
                  maxLength={MAX_NOTES_LENGTH}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="min-h-[100px] resize-none"
                />
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t bg-background sticky bottom-0">
          <div className="flex gap-3 w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={onClose} 
              disabled={loading}
              className="flex-1 sm:flex-none"
            >
              <X className="w-4 h-4 mr-2" /> Cancel
            </Button>
            <Button 
              onClick={handleFormSubmit} 
              disabled={loading || !formData.poId || formData.items?.length === 0}
              className="flex-1 sm:flex-none"
            >
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? 'Update GRN' : 'Create GRN'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default GRNForm
