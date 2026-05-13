import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PlusCircle, Package, ShoppingBag, FileText, ArrowRight } from 'lucide-react'
import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"

const QuickActions = () => {
  const navigate = useNavigate()

  const handleQuickAction = (action) => {
    const routes = {
      'Create Purchase Order': '/suppliers/purchase-orders',
      'Receive Goods (GRN)': '/suppliers/grn',
      'Open POS Terminal': '/sales/pos-terminal',
      'Generate Report': '/inventory/sales-reports',
    }
    if (routes[action]) navigate(routes[action])
  }

  const actions = [
    { icon: PlusCircle, label: 'Create Purchase Order' }, 
    { icon: Package, label: 'Receive Goods (GRN)' }, 
    { icon: ShoppingBag, label: 'Open POS Terminal' }, 
    { icon: FileText, label: 'Generate Report' }
  ]

  return (
    <Card className="bg-card/70 backdrop-blur border-border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {actions.map(({ icon: Icon, label }) => (
            <Button
              key={label} 
              onClick={() => handleQuickAction(label)}
              variant="outline"
              className="group flex h-auto flex-col items-start justify-start gap-3 rounded-xl p-4 transition-all hover:bg-accent hover:text-accent-foreground hover:shadow-md"
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
              </div>
              
              <span className="text-sm font-semibold tracking-tight">
                {label}
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default QuickActions
