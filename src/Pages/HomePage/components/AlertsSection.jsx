import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, CreditCard, Clock, Bell } from 'lucide-react'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/Components/ui/card"
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from "@/Components/ui/alert"

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

  // Maps severity to Shadcn Alert variants or custom color logic
  const getAlertVariant = (severity) => {
    switch (severity) {
      case 'high': return "destructive" // Shadcn default destructive
      default: return "default"
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
    <Card className="lg:col-span-2 shadow-sm border-border bg-card/70 backdrop-blur">
      <CardHeader className="flex flex-row items-center gap-2 pb-4">
        <Bell className="w-5 h-5 text-primary" />
        <CardTitle className="text-lg font-semibold">Alerts & Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.alerts && data.alerts.length > 0 ? (
            data.alerts.slice(0, 3).map((alert, index) => {
              const IconComponent = getAlertIcon(alert.icon)
              const variant = getAlertVariant(alert.severity)
              
              return (
                <Alert 
                  key={alert.id || index} 
                  variant={variant}
                  className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                  onClick={() => handleAlertClick(alert)}
                >
                  <IconComponent className="h-4 w-4" />
                  <AlertTitle className="font-semibold">{alert.title}</AlertTitle>
                  <AlertDescription>
                    {alert.message}
                  </AlertDescription>
                </Alert>
              )
            })
          ) : (
            <Alert variant="outline" className="border-dashed">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>No Alerts</AlertTitle>
              <AlertDescription>
                All systems running smoothly
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default AlertsSection
