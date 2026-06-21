import { useMemo } from 'react'
import { getPeriodLabel } from '../../../utils/unwrapApiData'

const calculatePendingPayments = (suppliers) => {
  if (!suppliers || !Array.isArray(suppliers)) return 0

  return suppliers.reduce((total, supplier) => {
    if (!supplier) return total
    const balance =
      supplier.outstandingBalance || supplier.balance || supplier.dueAmount || supplier.pendingAmount || 0
    return total + (typeof balance === 'number' ? balance : parseFloat(balance) || 0)
  }, 0)
}

export const useDashboardMetrics = (data, timeFilter = 'today') => {
  const metrics = useMemo(() => {
    const summary = data.summary || {}
    const inventory = data.enrichedInventory || data.inventory || []

    return {
      salesAmount: summary.totalAmount || 0,
      salesCount: summary.totalSales || 0,
      salesLabel: getPeriodLabel(timeFilter),
      totalStockItems: inventory.filter((item) => {
        const qty = parseFloat(item.stockQty) || 0
        if (qty > 0) return true
        if (Array.isArray(item.locations)) {
          return item.locations.some((loc) => (parseFloat(loc.quantity) || parseFloat(loc.stockQty) || 0) > 0)
        }
        return false
      }).length,
      totalStockValue: data.totalStockValue || 0,
      lowStockAlerts: data.lowStock?.length || 0,
      pendingPayments: calculatePendingPayments(data.suppliers),
    }
  }, [data, timeFilter])

  return metrics
}
