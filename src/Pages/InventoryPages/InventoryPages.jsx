import React from 'react'
import { BarChart3, AlertTriangle, RotateCcw, Calculator, TrendingUp, PieChart, Activity } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import Button from '../../Components/UI/Button'
import InfoCard from '../../Shared/InfoCard/InfoCard'

const InventoryPages = () => {
  const location = useLocation()
  
  const inventoryPages = [
    {
      id: 'stock-dashboard',
      title: 'Real-time Stock Dashboard',
      description: 'Monitor warehouse stock in real-time with live updates',
      icon: BarChart3,
      path: '/inventory/stock-dashboard',
      color: 'blue',
      features: ['Live stock monitoring', 'Warehouse filtering', 'Status indicators', 'Quick graphs']
    },
    {
      id: 'low-stock',
      title: 'Low Stock Alerts',
      description: 'Get alerts for products below minimum threshold',
      icon: AlertTriangle,
      path: '/inventory/low-stock',
      color: 'red',
      features: ['Threshold alerts', 'Category filtering', 'Auto reorder', 'Supplier integration']
    },
    {
      id: 'reorder',
      title: 'Auto Reorder Suggestions',
      description: 'System-generated suggestions for product reordering',
      icon: RotateCcw,
      path: '/inventory/reorder',
      color: 'purple',
      features: ['Smart suggestions', 'Sales analysis', 'Supplier matching', 'Bulk actions']
    },
    {
      id: 'valuation',
      title: 'Inventory Valuation',
      description: 'Track total stock value and cost-based valuation',
      icon: Calculator,
      path: '/inventory/valuation',
      color: 'green',
      features: ['Cost tracking', 'Value calculation', 'Category breakdown', 'Margin analysis']
    },
    {
      id: 'sales-reports',
      title: 'Sales Reports',
      description: 'Comprehensive sales reporting and analytics',
      icon: TrendingUp,
      path: '/inventory/sales-reports',
      color: 'blue',
      features: ['Date range filtering', 'Product analysis', 'Customer insights', 'Trend charts']
    },
    {
      id: 'profit-loss',
      title: 'Profit & Loss Reports',
      description: 'Business profit and loss analysis',
      icon: PieChart,
      path: '/inventory/profit-loss',
      color: 'yellow',
      features: ['P&L statements', 'Expense tracking', 'Profit trends', 'Financial insights']
    },
    {
      id: 'stock-analysis',
      title: 'Fast-moving & Dead Stock',
      description: 'Analyze product movement and identify slow-moving items',
      icon: Activity,
      path: '/inventory/stock-analysis',
      color: 'gray',
      features: ['Movement analysis', 'Dead stock detection', 'Performance metrics', 'Optimization tips']
    }
  ]

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-900',
      red: 'bg-red-50 border-red-200 text-red-900',
      purple: 'bg-purple-50 border-purple-200 text-purple-900',
      green: 'bg-green-50 border-green-200 text-green-900',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-900',
      gray: 'bg-gray-50 border-gray-200 text-gray-900'
    }
    return colors[color] || colors.blue
  }

  const getIconColor = (color) => {
    const colors = {
      blue: 'text-blue-600',
      red: 'text-red-600',
      purple: 'text-purple-600',
      green: 'text-green-600',
      yellow: 'text-yellow-600',
      gray: 'text-gray-600'
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-blue-600" />
              Inventory & Reports
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Comprehensive inventory management and business analytics</p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <InfoCard
        type="info"
        title="Inventory Management Hub"
        message="Access all inventory-related tools and reports from this central dashboard. Monitor stock levels, analyze sales performance, and optimize your inventory management strategy."
        icon={BarChart3}
      />

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventoryPages.map((page) => {
          const Icon = page.icon
          const isActive = location.pathname === page.path
          
          return (
            <Link
              key={page.id}
              to={page.path}
              className={`block p-6 rounded-lg border-2 transition-all duration-200 hover:shadow-lg ${
                isActive 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${getColorClasses(page.color)} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${getIconColor(page.color)}`} />
                </div>
                {isActive && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {page.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4">
                {page.description}
              </p>
              
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Key Features
                </h4>
                <ul className="space-y-1">
                  {page.features.map((feature, index) => (
                    <li key={index} className="text-xs text-gray-600 flex items-center">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Button
                  variant={isActive ? "primary" : "ghost"}
                  size="sm"
                  className="w-full"
                >
                  <div className="flex items-center justify-center">
                    {isActive ? 'Currently Viewing' : 'Open Module'}
                  </div>
                </Button>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Stats */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">7</div>
            <div className="text-sm text-blue-800">Report Modules</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">Real-time</div>
            <div className="text-sm text-green-800">Live Updates</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">Auto</div>
            <div className="text-sm text-purple-800">Smart Alerts</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">360°</div>
            <div className="text-sm text-yellow-800">Full Analysis</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InventoryPages
