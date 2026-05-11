import React from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, Package, AlertTriangle, CreditCard } from 'lucide-react'
import MetricsCard from './MetricsCard'

const MetricsGrid = ({ metrics, data }) => {
  const navigate = useNavigate()

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount)
  }

  // Calculate today's transaction count
  const getTodaySalesCount = () => {
    if (!data.sales || !Array.isArray(data.sales)) return 0
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return data.sales.filter(sale => {
      const saleDate = new Date(sale.createdAt || sale.date)
      saleDate.setHours(0, 0, 0, 0)
      return saleDate.getTime() === today.getTime()
    }).length
  }

  const todaySalesCount = getTodaySalesCount()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {/* Sales Today */}
      <MetricsCard
        label="Sales Today"
        value={formatCurrency(metrics.salesToday)}
        subtitle={todaySalesCount > 0 ? `${todaySalesCount} transaction${todaySalesCount !== 1 ? 's' : ''}` : 'No sales today'}
        icon={TrendingUp}
        color="emerald"
      />

      {/* Total Stock Items */}
      <MetricsCard
        label="Total Stock Items"
        value={metrics.totalStockItems.toLocaleString()}
        subtitle="SKU count across all categories"
        icon={Package}
        color="blue"
      />

      {/* Total Stock Value */}
      <MetricsCard
        label="Total Stock Value"
        value={formatCurrency(metrics.totalStockValue)}
        subtitle="Current inventory value"
        icon={TrendingUp}
        color="green"
      />

      {/* Low Stock Alerts */}
      <MetricsCard
        label="Low Stock Alerts"
        value={metrics.lowStockAlerts}
        subtitle="Reorder recommended"
        icon={AlertTriangle}
        color="red"
        onClick={() => navigate('/inventory/low-stock')}
      />

      {/* Pending Payments */}
      <MetricsCard
        label="Pending Payments"
        value={formatCurrency(metrics.pendingPayments)}
        subtitle="Due to suppliers"
        icon={CreditCard}
        color="amber"
        onClick={() => navigate('/suppliers/manage')}
      />
    </div>
  )
}

export default MetricsGrid
