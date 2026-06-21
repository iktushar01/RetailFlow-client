import React from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, Package, AlertTriangle, CreditCard, Banknote } from 'lucide-react'
import MetricsCard from './MetricsCard'

const MetricsGrid = ({ metrics }) => {
  const navigate = useNavigate()

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const transactionLabel =
    metrics.salesCount > 0
      ? `${metrics.salesCount} transaction${metrics.salesCount !== 1 ? 's' : ''}`
      : 'No sales in this period'

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <MetricsCard
        label={metrics.salesLabel}
        value={formatCurrency(metrics.salesAmount)}
        subtitle={transactionLabel}
        icon={TrendingUp}
        color="green"
      />

      <MetricsCard
        label="Total Stock Items"
        value={metrics.totalStockItems.toLocaleString()}
        subtitle="SKUs in warehouse"
        icon={Package}
        color="blue"
      />

      <MetricsCard
        label="Total Stock Value"
        value={formatCurrency(metrics.totalStockValue)}
        subtitle="Current asset value"
        icon={Banknote}
        color="primary"
      />

      <MetricsCard
        label="Low Stock Alerts"
        value={metrics.lowStockAlerts}
        subtitle="Requires attention"
        icon={AlertTriangle}
        color="red"
        onClick={() => navigate('/inventory/low-stock')}
      />

      <MetricsCard
        label="Pending Payments"
        value={formatCurrency(metrics.pendingPayments)}
        subtitle="Owed to suppliers"
        icon={CreditCard}
        color="amber"
        onClick={() => navigate('/suppliers/manage')}
      />
    </div>
  )
}

export default MetricsGrid
