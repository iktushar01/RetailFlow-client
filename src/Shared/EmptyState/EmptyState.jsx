import React from 'react'
import { Button } from '../../Components/UI/Button'
import { cn } from "@/lib/utils"

/**
 * Shared EmptyState Component (Shadcn UI)
 * @param {JSX.Element} icon - Lucide or custom icon component
 * @param {string} title - Main headline
 * @param {string} message - Supporting description
 * @param {Object} action - Action config {label, onClick, icon, variant}
 */
const EmptyState = ({ 
  icon: Icon, 
  title, 
  message, 
  action,
  className 
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in zoom-in duration-300",
      className
    )}>
      {/* Icon Container */}
      {Icon && (
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
          <Icon className="h-10 w-10 text-muted-foreground/60" strokeWidth={1.5} />
        </div>
      )}

      {/* Text Content */}
      <h3 className="text-xl font-semibold tracking-tight text-foreground mb-2">
        {title}
      </h3>
      
      {message && (
        <p className="text-sm text-muted-foreground max-w-[420px] mb-8 leading-relaxed">
          {message}
        </p>
      )}

      {/* Action Button */}
      {action && (
        <Button
          variant={action.variant || "default"}
          size={action.size || "lg"}
          onClick={action.onClick}
          className="shadow-sm gap-2"
        >
          {action.icon && <action.icon className="h-4 w-4" />}
          {action.label}
        </Button>
      )}
    </div>
  )
}

export default EmptyState