import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../Components/UI/Dialog"
import { cn } from "@/lib/utils"

/**
 * SharedModal Component built with Shadcn UI
 * Theme-aware using OKLCH variables from index.css
 */
const SharedModal = ({
  isOpen,
  onClose,
  title,
  description, // Added for accessibility
  children,
  size = 'medium',
  showCloseButton = true, // Handled by Shadcn's DialogContent internally
  closeOnOverlayClick = true,
  showHeader = true,
  footer,
  className = '',
}) => {
  // Size configurations mapped to Shadcn/Tailwind
  const sizeConfig = {
    small: 'sm:max-w-[425px]',
    medium: 'sm:max-w-[600px]',
    large: 'sm:max-w-[800px]',
    full: 'sm:max-w-[95vw] h-[95vh]',
  }

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent 
        // Pointer events control overlay click closing
        onInteractOutside={(e) => {
          if (!closeOnOverlayClick) e.preventDefault();
        }}
        className={cn(
          "bg-card text-card-foreground border-border shadow-xl p-0 overflow-hidden flex flex-col",
          sizeConfig[size],
          className
        )}
      >
        {/* Header Section */}
        {showHeader && (
          <DialogHeader className="p-6 border-b border-border bg-card">
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-muted-foreground">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}

        {/* Body Section */}
        <div className={cn(
          "p-6 overflow-y-auto",
          size === 'full' ? "flex-1" : "max-h-[70vh]"
        )}>
          {children}
        </div>

        {/* Footer Section */}
        {footer && (
          <DialogFooter className="p-4 border-t border-border bg-muted/30">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default SharedModal