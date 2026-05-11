import { useState, useEffect } from 'react'
import { api } from '../../../utils/api'
import { notify } from '../../../utils/notifications'

/**
 * Custom hook for warehouse data management
 */
export const useWarehouseData = () => {
  const [warehouses, setWarehouses] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch warehouses
  const fetchWarehouses = async () => {
    setLoading(true)
    try {
      const result = await api.warehouses.getAll()
      if (result.success) {
        setWarehouses(result.data)
      } else {
        notify.error('Error', 'Failed to fetch warehouses')
      }
    } catch (error) {
      notify.error('Error', 'Failed to fetch warehouses')
    } finally {
      setLoading(false)
    }
  }

  // Create warehouse
  const createWarehouse = async (warehouseData) => {
    const result = await api.warehouses.create(warehouseData)
    if (result.success) {
      notify.success('Success', 'Warehouse created successfully')
      await fetchWarehouses()
      return true
    } else {
      notify.error('Error', result.error || 'Failed to create warehouse')
      return false
    }
  }

  // Update warehouse
  const updateWarehouse = async (id, warehouseData) => {
    const result = await api.warehouses.update(id, warehouseData)
    if (result.success) {
      notify.success('Success', 'Warehouse updated successfully')
      await fetchWarehouses()
      return true
    } else {
      notify.error('Error', result.error || 'Failed to update warehouse')
      return false
    }
  }

  // Delete warehouse
  const deleteWarehouse = async (id, name) => {
    const confirmed = await notify.confirmDelete(name)
    if (!confirmed) return false

    const result = await api.warehouses.delete(id)
    if (result.success) {
      notify.success('Success', 'Warehouse deleted successfully')
      await fetchWarehouses()
      return true
    } else {
      notify.error('Error', result.error || 'Failed to delete warehouse')
      return false
    }
  }

  useEffect(() => {
    fetchWarehouses()
  }, [])

  return {
    warehouses,
    loading,
    fetchWarehouses,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse
  }
}

export default useWarehouseData

