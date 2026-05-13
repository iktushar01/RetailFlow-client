import React from 'react'
import { Card, CardContent } from "@/Components/UI/card"
import { cn } from "@/lib/utils"

const MetricsCard = ({ 
  label, 
  value, 
  subtitle, 
  icon: Icon,
  color = 'primary', // Default to primary variable
  onClick,
  className = "" 
}) => {
  
  // Instead of hardcoded tailwind colors, we use functional semantic classes
  // that leverage the CSS variables in your index.css
  const colorVariants = {
    primary: "bg-primary/10 text-primary",
    green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    red: "bg-destructive/10 text-destructive",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  }

  return (
    <Card 
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden transition-all hover:shadow-md",
        "bg-card/70 backdrop-blur border-border",
        onClick && "cursor-pointer active:scale-[0.98]",
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            <p className="text-3xl font-bold tracking-tight text-foreground">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs font-medium text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>

          {/* Icon Badge */}
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
            colorVariants[color] || colorVariants.primary
          )}>
            {Icon && <Icon className="h-6 w-6" />}
          </div>
        </div>
        
        {/* Subtle hover effect bar at the bottom */}
        <div className={cn(
          "absolute bottom-0 left-0 h-1 w-0 transition-all group-hover:w-full",
          color === 'primary' ? 'bg-primary' : `bg-${color}-500`
        )} />
      </CardContent>
    </Card>
  )
}

export default MetricsCard

