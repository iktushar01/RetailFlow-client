import React from 'react'
import { Card, CardContent } from "../../Components/UI/card"
import { cn } from "@/lib/utils"

/**
 * Reusable Statistics Card Component (Shadcn + OKLCH)
 */
const StatsCard = ({ label, value, icon: Icon, variant = 'default', trend, className }) => {
  
  // Mapping variants to semantic Shadcn/Tailwind classes
  const variantStyles = {
    default: 'text-primary bg-primary/10',
    blue: 'text-blue-500 bg-blue-500/10',
    green: 'text-green-500 bg-green-500/10',
    purple: 'text-purple-500 bg-purple-500/10',
    yellow: 'text-yellow-500 bg-yellow-500/10',
    red: 'text-destructive bg-destructive/10',
    gray: 'text-muted-foreground bg-muted',
  }

  const iconStyle = variantStyles[variant] || variantStyles.default

  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-md border-border bg-card", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium text-muted-foreground leading-none">
              {label}
            </p>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {value}
            </div>
            {trend && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {trend}
              </p>
            )}
          </div>
          
          {Icon && (
            <div className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
              iconStyle
            )}>
              <Icon className="h-6 w-6" strokeWidth={2.5} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default StatsCard
