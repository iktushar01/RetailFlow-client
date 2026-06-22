import React, { useEffect, useState } from 'react'
import { X, Save, Info, MessageSquare } from 'lucide-react'
import { Button } from "@/Components/UI/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/UI/select"
import { Input } from "@/Components/UI/input"
import { Textarea } from "@/Components/UI/textarea"
import { Progress } from "@/Components/UI/progress"
import { Label } from "@/Components/UI/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/card"
import SharedModal from '../../../Shared/SharedModal/SharedModal'

import GRNItemsTable from './GRNItemsTable'
import {
  validateGRNForm,
  generateGRNNumber,
  MAX_NOTES_LENGTH,
  getRecordId,
} from '../utils/grnHelpers'
import { grnAPI } from '../services/grnService'
import { notify } from '../../../utils/notifications'
import { apiClient } from '../../../config/apiConfig'

const GRNForm = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  purchaseOrders = [],
  purchaseOrdersLoading = false,
  loading,
  onSubmit,
  isEditing
}) => {
  const [warehouses, setWarehouses] = useState([])
  const [warehousesLoading, setWarehousesLoading] = useState(false)

  useEffect(() => {
    const fetchWarehouses = async () => {
      if (!isOpen) return
      setWarehousesLoading(true)
      try {
        const response = await apiClient.get('/warehouses')
        setWarehouses(response.data || [])
      } catch (error) {
        console.error('Error fetching warehouses:', error)
        setWarehouses([])
        notify.error('Warehouse Error', 'Failed to load warehouses. Please try again.')
      } finally {
        setWarehousesLoading(false)
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
    const selectedPO = purchaseOrders.find(po => getRecordId(po) === poId)
    if (!selectedPO) return

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
      notify.error('PO Error', error.response?.data?.message || 'Failed to load PO items.')
    }
  }

  const handleFormSubmit = () => {
    const validation = validateGRNForm(formData)
    if (!validation.isValid) {
      notify.warning('Validation Error', validation.errors.join('\n• '))
      return
    }
    onSubmit(formData)
  }

  const totalOrdered = formData.items?.reduce((sum, item) => sum + (item.orderedQty || 0), 0) || 0
  const totalReceived = formData.items?.reduce((sum, item) => sum + (item.receivedQty || 0), 0) || 0
  const completionPercentage = totalOrdered > 0 ? Math.round((totalReceived / totalOrdered) * 100) : 0
  const remainingChars = MAX_NOTES_LENGTH - (formData.notes?.length || 0)

  const modalFooter = (
    <div className="flex gap-3 w-full sm:w-auto sm:ml-auto">
      <Button variant="outline" onClick={onClose} disabled={loading}>
        <X className="w-4 h-4 mr-2" /> Cancel
      </Button>
      <Button
        onClick={handleFormSubmit}
        disabled={loading || !formData.poId || formData.items?.length === 0}
      >
        <Save className="w-4 h-4 mr-2" />
        {loading ? 'Saving...' : isEditing ? 'Update GRN' : 'Create GRN'}
      </Button>
    </div>
  )

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Goods Receive Note' : 'Create New GRN'}
      size="full"
      closeOnOverlayClick={false}
      footer={modalFooter}
    >
      <div className="space-y-6 pb-4">
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
            </div>

            <div className="space-y-2">
              <Label>Purchase Order <span className="text-destructive">*</span></Label>
              <Select
                disabled={isEditing || purchaseOrdersLoading}
                value={formData.poId || undefined}
                onValueChange={handlePOChange}
              >
                <SelectTrigger className="w-full bg-background">
                  <SelectValue
                    placeholder={
                      purchaseOrdersLoading
                        ? 'Loading purchase orders...'
                        : purchaseOrders.length === 0
                          ? 'No sent POs available'
                          : 'Select PO'
                    }
                  />
                </SelectTrigger>
                <SelectContent className="z-[100]" position="popper">
                  {purchaseOrders.map(po => {
                    const poId = getRecordId(po)
                    return (
                      <SelectItem key={poId} value={poId}>
                        {po.poNumber} ({po.items?.length || 0} items)
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              {!purchaseOrdersLoading && purchaseOrders.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Send a purchase order first, then create a GRN against it.
                </p>
              )}
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
                value={formData.destinationWarehouse || undefined}
                onValueChange={(val) => setFormData({ ...formData, destinationWarehouse: val })}
                disabled={warehousesLoading}
              >
                <SelectTrigger className="w-full bg-background">
                  <SelectValue placeholder={warehousesLoading ? 'Loading...' : 'Select warehouse'} />
                </SelectTrigger>
                <SelectContent className="z-[100]" position="popper">
                  {warehouses.map(w => (
                    <SelectItem key={getRecordId(w)} value={w.name}>{w.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {formData.items?.length > 0 && (
          <Card className="bg-accent/50 border-primary/20">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Total Items</p>
                  <p className="text-2xl font-semibold">{formData.items.length}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Ordered</p>
                  <p className="text-2xl font-semibold">{totalOrdered}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Received</p>
                  <p className="text-2xl font-semibold text-primary">{totalReceived}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Completion</p>
                  <div className="flex items-center gap-2 justify-center">
                    <span className="font-semibold text-primary">{completionPercentage}%</span>
                    <Progress value={completionPercentage} className="h-2 flex-1 max-w-[120px]" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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

        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-md font-semibold flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                Notes (Optional)
              </CardTitle>
              <span className={`text-[10px] ${remainingChars < 50 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {remainingChars} chars left
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
    </SharedModal>
  )
}

export default GRNForm
