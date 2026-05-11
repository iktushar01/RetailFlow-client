import React from 'react'
import { Loader2, Package, TrendingUp, AlertTriangle, CreditCard, ShoppingBag, FileText, BarChart3, PieChart, RefreshCw } from 'lucide-react'

const LoadingAnimation = ({ 
  message = "Loading...", 
  variant = "default",
  size = "default",
  fullScreen = false,
  icon = null,
  className = ""
}) => {
  // Icon variants
  const iconVariants = {
    default: Loader2,
    package: Package,
    trending: TrendingUp,
    alert: AlertTriangle,
    payment: CreditCard,
    sales: ShoppingBag,
    report: FileText,
    chart: BarChart3,
    pie: PieChart,
    refresh: RefreshCw
  }

  // Size variants
  const sizeVariants = {
    small: {
      icon: "w-6 h-6",
      text: "text-sm",
      container: "min-h-32"
    },
    default: {
      icon: "w-12 h-12",
      text: "text-base",
      container: "min-h-96"
    },
    large: {
      icon: "w-16 h-16",
      text: "text-lg",
      container: "min-h-[50vh]"
    }
  }

  // Color variants
  const colorVariants = {
    default: "text-blue-600",
    success: "text-emerald-600",
    warning: "text-amber-600",
    error: "text-red-600",
    info: "text-indigo-600"
  }

  const IconComponent = icon || iconVariants[variant] || Loader2
  const currentSize = sizeVariants[size] || sizeVariants.default
  const currentColor = colorVariants[variant] || colorVariants.default

  const containerClasses = fullScreen 
    ? "min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 to-white px-4 py-6"
    : "flex items-center justify-center"
  
  const contentClasses = fullScreen
    ? "max-w-7xl mx-auto flex items-center justify-center"
    : "flex items-center justify-center"

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className={contentClasses}>
        <div className={`${currentSize.container} flex items-center justify-center`}>
          <div className="text-center">
            <IconComponent 
              className={`${currentSize.icon} ${currentColor} mx-auto mb-4 animate-spin`} 
            />
            <p className={`${currentSize.text} text-gray-600`}>
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Predefined loading components for common use cases
export const DashboardLoading = ({ message = "Loading dashboard data..." }) => (
  <LoadingAnimation 
    message={message}
    variant="trending"
    size="default"
    fullScreen={true}
  />
)

export const InventoryLoading = ({ message = "Loading inventory data..." }) => (
  <LoadingAnimation 
    message={message}
    variant="package"
    size="default"
    fullScreen={true}
  />
)

export const SalesLoading = ({ message = "Loading sales data..." }) => (
  <LoadingAnimation 
    message={message}
    variant="sales"
    size="default"
    fullScreen={true}
  />
)

export const ReportLoading = ({ message = "Generating report..." }) => (
  <LoadingAnimation 
    message={message}
    variant="report"
    size="default"
    fullScreen={true}
  />
)

export const ChartLoading = ({ message = "Loading chart data..." }) => (
  <LoadingAnimation 
    message={message}
    variant="chart"
    size="default"
    fullScreen={false}
  />
)

export const SmallLoading = ({ message = "Loading...", variant = "default" }) => (
  <LoadingAnimation 
    message={message}
    variant={variant}
    size="small"
    fullScreen={false}
  />
)

export const ButtonLoading = ({ message = "Loading..." }) => (
  <LoadingAnimation 
    message={message}
    variant="refresh"
    size="small"
    fullScreen={false}
  />
)

export default LoadingAnimation
