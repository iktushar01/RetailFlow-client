import { useState, useEffect } from 'react'
import { api } from '../../../utils/api'
import { notify } from '../../../utils/notifications'

/**
 * Custom hook for stock transfer data management
 */
export const useStockTransferData = () => {
  const [inventory, setInventory] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [transfers, setTransfers] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch all data
  const fetchAllData = async () => {
    setLoading(true)
    try {
      const [invResult, warehouseResult, transferResult] = await Promise.all([
        api.inventory.getAll(),
        api.warehouses.getAll(),
        api.stockTransfers.getAll()
      ])

      if (invResult.success) setInventory(invResult.data)
      if (warehouseResult.success) setWarehouses(warehouseResult.data)
      if (transferResult.success) setTransfers(transferResult.data)

      // Fallback warehouses if none exist
      if (warehouseResult.success && warehouseResult.data.length === 0) {
        setWarehouses([
          { _id: '1', name: 'Main Warehouse', location: 'Building A' },
          { _id: '2', name: 'Secondary Warehouse', location: 'Building B' },
          { _id: '3', name: 'Cold Storage', location: 'Building C' }
        ])
      }
    } catch (error) {
      notify.error('Error', 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  // Create stock transfer
  const createTransfer = async (transferData) => {
    const result = await api.stockTransfers.create(transferData)
    if (result.success) {
      notify.success('Success', 'Stock transferred successfully')
      await fetchAllData()
      return true
    } else {
      notify.error('Error', result.error || 'Failed to transfer stock')
      return false
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  return {
    inventory,
    warehouses,
    transfers,
    loading,
    fetchAllData,
    createTransfer
  }
}

export default useStockTransferData

