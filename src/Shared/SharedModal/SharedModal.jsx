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

const SharedModal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'medium',
  closeOnOverlayClick = true,
  showHeader = true,
  footer,
  className = '',
}) => {

  // Revised size mapping for Dashboard layouts
  const sizeConfig = {
    small: 'sm:max-w-[480px]',
    medium: 'sm:max-w-[720px]',
    large: 'sm:max-w-[1024px]', // Fits large tables/grids
    xl: 'sm:max-w-[1400px]',    // Extra wide for complex dashboards
    full: 'sm:max-w-[96vw] h-[96vh]',
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent
        onInteractOutside={(e) => {
          if (!closeOnOverlayClick) e.preventDefault();
        }}
        // Removed default padding to allow sections to control their own spacing
        className={cn(
          "bg-background border-border shadow-2xl p-0 overflow-hidden flex flex-col gap-0",
          sizeConfig[size],
          className
        )}
      >
        {showHeader && (
          <DialogHeader className="px-6 py-4 border-b border-border bg-card/50">
            <DialogTitle className="text-lg font-semibold leading-none tracking-tight">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-sm text-muted-foreground mt-1.5">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}

        <div className={cn(
          "p-6 overflow-y-auto custom-scrollbar",
          size === 'full' ? "flex-1" : "max-h-[85vh]"
        )}>
          {children}
        </div>

        {footer && (
          <DialogFooter className="px-6 py-4 border-t border-border bg-muted/20">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default SharedModal