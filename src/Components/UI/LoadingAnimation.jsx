import React from 'react'
import { 
  Loader2, Package, TrendingUp, AlertTriangle, 
  CreditCard, ShoppingBag, FileText, BarChart3, 
  PieChart, RefreshCw 
} from 'lucide-react'
import { cn } from "@/lib/utils"

const LoadingAnimation = ({ 
  message = "Loading...", 
  variant = "default",
  size = "default",
  fullScreen = false,
  icon: CustomIcon = null,
  className = ""
}) => {
  // Icon variants mapping
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

  // Size configurations using shadcn-consistent scaling
  const sizeVariants = {
    small: {
      icon: "h-5 w-5",
      text: "text-xs",
      container: "min-h-[80px]"
    },
    default: {
      icon: "h-10 w-10",
      text: "text-sm",
      container: "min-h-[300px]"
    },
    large: {
      icon: "h-14 w-14",
      text: "text-base",
      container: "min-h-[50vh]"
    }
  }

  // Color variants using shadcn semantic tokens (OKLCH compatible)
  const colorVariants = {
    default: "text-primary",
    success: "text-emerald-500", // Custom status colors
    warning: "text-amber-500",
    error: "text-destructive",
    info: "text-blue-500"
  }

  const IconComponent = CustomIcon || iconVariants[variant] || Loader2
  const currentSize = sizeVariants[size] || sizeVariants.default
  const currentColor = colorVariants[variant] || colorVariants.default

  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center transition-all duration-300",
        fullScreen ? "fixed inset-0 z-50 h-screen w-screen bg-background/80 backdrop-blur-sm" : "w-full",
        currentSize.container,
        className
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          {/* Subtle glow effect using theme primary */}
          <div className={cn("absolute inset-0 rounded-full blur-xl opacity-20 animate-pulse", currentColor)} />
          
          <IconComponent 
            className={cn(
              "animate-spin relative z-10", 
              currentSize.icon, 
              currentColor
            )} 
          />
        </div>
        
        {message && (
          <p className={cn(
            "font-medium animate-pulse",
            currentSize.text,
            "text-muted-foreground"
          )}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

// --- Predefined variants ---

export const DashboardLoading = (props) => (
  <LoadingAnimation 
    message="Syncing dashboard data..." 
    variant="trending" 
    fullScreen 
    {...props} 
  />
)

export const InventoryLoading = (props) => (
  <LoadingAnimation 
    message="Loading stock levels..." 
    variant="package" 
    fullScreen 
    {...props} 
  />
)

export const SalesLoading = (props) => (
  <LoadingAnimation 
    message="Fetching sales history..." 
    variant="sales" 
    fullScreen 
    {...props} 
  />
)

export const ChartLoading = (props) => (
  <LoadingAnimation 
    message="Visualizing data..." 
    variant="chart" 
    size="default" 
    {...props} 
  />
)

export const SmallLoading = (props) => (
  <LoadingAnimation 
    size="small" 
    {...props} 
  />
)

export const ReportLoading = (props) => (
  <LoadingAnimation 
    variant="report" 
    fullScreen 
    {...props} 
  />
)

export default LoadingAnimation