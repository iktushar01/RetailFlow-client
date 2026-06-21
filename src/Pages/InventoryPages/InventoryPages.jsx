import React from 'react'
import { BarChart3, AlertTriangle, RotateCcw, Calculator, TrendingUp, PieChart, Activity } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '../../Components/UI/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../Components/UI/card'
import { cn } from '@/lib/utils'

const InventoryPages = () => {
  const location = useLocation()

  const inventoryPages = [
    {
      id: 'stock-dashboard',
      title: 'Real-time Stock Dashboard',
      description: 'Monitor warehouse stock in real-time with live updates',
      icon: BarChart3,
      path: '/inventory/stock-dashboard',
      features: ['Live stock monitoring', 'Warehouse filtering', 'Status indicators', 'Quick graphs']
    },
    {
      id: 'low-stock',
      title: 'Low Stock Alerts',
      description: 'Get alerts for products below minimum threshold',
      icon: AlertTriangle,
      path: '/inventory/low-stock',
      features: ['Threshold alerts', 'Category filtering', 'Auto reorder', 'Supplier integration']
    },
    {
      id: 'reorder',
      title: 'Auto Reorder Suggestions',
      description: 'System-generated suggestions for product reordering',
      icon: RotateCcw,
      path: '/inventory/reorder',
      features: ['Smart suggestions', 'Sales analysis', 'Supplier matching', 'Bulk actions']
    },
    {
      id: 'valuation',
      title: 'Inventory Valuation',
      description: 'Track total stock value and cost-based valuation',
      icon: Calculator,
      path: '/inventory/valuation',
      features: ['Cost tracking', 'Value calculation', 'Category breakdown', 'Margin analysis']
    },
    {
      id: 'sales-reports',
      title: 'Sales Reports',
      description: 'Comprehensive sales reporting and analytics',
      icon: TrendingUp,
      path: '/inventory/sales-reports',
      features: ['Date range filtering', 'Product analysis', 'Customer insights', 'Trend charts']
    },
    {
      id: 'profit-loss',
      title: 'Profit & Loss Reports',
      description: 'Business profit and loss analysis',
      icon: PieChart,
      path: '/inventory/profit-loss',
      features: ['P&L statements', 'Expense tracking', 'Profit trends', 'Financial insights']
    },
    {
      id: 'stock-analysis',
      title: 'Fast-moving & Dead Stock',
      description: 'Analyze product movement and identify slow-moving items',
      icon: Activity,
      path: '/inventory/stock-analysis',
      features: ['Movement analysis', 'Dead stock detection', 'Performance metrics', 'Optimization tips']
    }
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Inventory & Reports</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Access inventory tools and business analytics from one place
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inventoryPages.map((page) => {
          const Icon = page.icon
          const isActive = location.pathname === page.path

          return (
            <Link key={page.id} to={page.path} className="group block">
              <Card className={cn(
                "h-full border shadow-none transition-colors hover:bg-muted/30",
                isActive && "border-primary bg-primary/5"
              )}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    {isActive && (
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <CardTitle className="text-base">{page.title}</CardTitle>
                  <CardDescription>{page.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-1.5">
                    {page.features.map((feature, index) => (
                      <li key={index} className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-muted-foreground/60 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    className="w-full"
                    tabIndex={-1}
                  >
                    {isActive ? 'Currently viewing' : 'Open module'}
                  </Button>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <Card className="border shadow-none">
        <CardHeader>
          <CardTitle className="text-base">Quick overview</CardTitle>
          <CardDescription>Summary of available report modules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-lg border bg-muted/30 p-4 text-center">
              <div className="text-2xl font-semibold text-foreground">7</div>
              <div className="text-sm text-muted-foreground">Report modules</div>
            </div>
            <div className="rounded-lg border bg-muted/30 p-4 text-center">
              <div className="text-2xl font-semibold text-foreground">Live</div>
              <div className="text-sm text-muted-foreground">Real-time updates</div>
            </div>
            <div className="rounded-lg border bg-muted/30 p-4 text-center">
              <div className="text-2xl font-semibold text-foreground">Auto</div>
              <div className="text-sm text-muted-foreground">Smart alerts</div>
            </div>
            <div className="rounded-lg border bg-muted/30 p-4 text-center">
              <div className="text-2xl font-semibold text-foreground">360°</div>
              <div className="text-sm text-muted-foreground">Full analysis</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default InventoryPages
