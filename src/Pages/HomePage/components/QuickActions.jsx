import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PlusCircle, Package, ShoppingBag, FileText, ArrowRight } from 'lucide-react'
import Button from '../../../Components/UI/Button'

const QuickActions = () => {
  const navigate = useNavigate()

  const handleQuickAction = (action) => {
    switch (action) {
      case 'Create Purchase Order':
        navigate('/suppliers/purchase-orders')
        break
      case 'Receive Goods (GRN)':
        navigate('/suppliers/grn')
        break
      case 'Open POS Terminal':
        navigate('/sales/pos-terminal')
        break
      case 'Generate Report':
        navigate('/inventory/sales-reports')
        break
      default:
        break
    }
  }

  const actions = [
    { icon: PlusCircle, label: 'Create Purchase Order' }, 
    { icon: Package, label: 'Receive Goods (GRN)' }, 
    { icon: ShoppingBag, label: 'Open POS Terminal' }, 
    { icon: FileText, label: 'Generate Report' }
  ]

  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur ring-1 ring-slate-200/70 p-5 shadow-sm">
      <h2 className="font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {actions.map(({ icon, label }) => (
          <Button
            key={label} 
            onClick={() => handleQuickAction(label)}
            variant="ghost"
            className="group text-left rounded-xl ring-1 ring-slate-200/70 p-4 hover:shadow-md transition h-auto flex-col items-start"
          >
            <div className="flex items-center gap-2 w-full">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-100 to-white flex items-center justify-center mb-2">
                {React.createElement(icon, { className: 'w-5 h-5 text-slate-700' })}
              </div>
              <div className="text-sm font-medium text-slate-700 flex items-center gap-1">
                {label}
                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition" />
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}

export default QuickActions
