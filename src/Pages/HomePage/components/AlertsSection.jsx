import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, CreditCard, Clock } from 'lucide-react'

const AlertsSection = ({ data }) => {
  const navigate = useNavigate()

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return AlertTriangle
      case 'info': return CreditCard
      case 'clock': return Clock
      default: return AlertTriangle
    }
  }

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-800 bg-red-50 ring-red-200'
      case 'medium': return 'text-amber-900 bg-amber-50 ring-amber-200'
      case 'low': return 'text-blue-800 bg-blue-50 ring-blue-200'
      default: return 'text-gray-800 bg-gray-50 ring-gray-200'
    }
  }

  const handleAlertClick = (alert) => {
    switch (alert.type) {
      case 'warning':
        if (alert.title.includes('Low Stock')) {
          navigate('/inventory/low-stock')
        } else if (alert.title.includes('Expiry')) {
          navigate('/warehouse/batch-tracking')
        }
        break
      case 'info':
        if (alert.title.includes('Payment')) {
          navigate('/suppliers/manage')
        }
        break
      default:
        break
    }
  }

  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur ring-1 ring-slate-200/70 p-5 shadow-sm lg:col-span-2">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="text-red-600" />
        <h2 className="font-semibold">Alerts & Notifications</h2>
      </div>
      <ul className="space-y-3">
        {data.alerts.length > 0 ? (
          data.alerts.slice(0, 3).map((alert, index) => {
            const IconComponent = getAlertIcon(alert.icon)
            const colorClasses = getAlertColor(alert.severity)
            
            return (
              <li 
                key={alert.id || index} 
                className={`flex items-start gap-3 text-sm rounded-xl p-3 ring-1 cursor-pointer hover:shadow-md transition ${colorClasses}`}
                onClick={() => handleAlertClick(alert)}
              >
                <IconComponent className="w-4 h-4 mt-0.5" />
                <div>
                  <p className="font-semibold">{alert.title}</p>
                  <p>{alert.message}</p>
                </div>
              </li>
            )
          })
        ) : (
          <li className="flex items-center gap-3 text-sm rounded-xl p-3 ring-1 ring-slate-200/60 bg-slate-50/60 text-slate-600">
            <AlertTriangle className="w-4 h-4" />
            <div>
              <p className="font-semibold">No Alerts</p>
              <p>All systems running smoothly</p>
            </div>
          </li>
        )}
      </ul>
    </div>
  )
}

export default AlertsSection
