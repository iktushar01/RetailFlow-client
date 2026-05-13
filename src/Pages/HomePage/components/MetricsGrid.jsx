import React from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, Package, AlertTriangle, CreditCard, Banknote } from 'lucide-react'
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
    if (!data?.sales || !Array.isArray(data.sales)) return 0
    
    const today = new Date().toDateString();
    
    return data.sales.filter(sale => {
      const saleDate = new Date(sale.createdAt || sale.date).toDateString();
      return saleDate === today;
    }).length
  }

  const todaySalesCount = getTodaySalesCount()

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {/* Sales Today */}
      <MetricsCard
        label="Sales Today"
        value={formatCurrency(metrics.salesToday)}
        subtitle={todaySalesCount > 0 ? `${todaySalesCount} transaction${todaySalesCount !== 1 ? 's' : ''}` : 'No sales today'}
        icon={TrendingUp}
        color="green" 
      />

      {/* Total Stock Items */}
      <MetricsCard
        label="Total Stock Items"
        value={metrics.totalStockItems.toLocaleString()}
        subtitle="SKUs in warehouse"
        icon={Package}
        color="blue"
      />

      {/* Total Stock Value */}
      <MetricsCard
        label="Total Stock Value"
        value={formatCurrency(metrics.totalStockValue)}
        subtitle="Current asset value"
        icon={Banknote}
        color="primary"
      />

      {/* Low Stock Alerts */}
      <MetricsCard
        label="Low Stock Alerts"
        value={metrics.lowStockAlerts}
        subtitle="Requires attention"
        icon={AlertTriangle}
        color="red"
        onClick={() => navigate('/inventory/low-stock')}
      />

      {/* Pending Payments */}
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
