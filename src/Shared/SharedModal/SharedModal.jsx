import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../Components/UI/dialog"
import { cn } from "@/lib/utils"

const sharedModalSizeMap = {
  small: 'sm',
  medium: 'lg',
  large: 'xl',
  xl: '2xl',
  full: 'full',
}

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
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent
        size={sharedModalSizeMap[size] || 'lg'}
        onInteractOutside={(e) => {
          if (!closeOnOverlayClick) e.preventDefault();
        }}
        className={cn(
          "bg-background border-border shadow-2xl p-0 gap-0",
          className
        )}
      >
        {showHeader && (
          <DialogHeader className="shrink-0 px-4 py-4 sm:px-6 border-b border-border bg-card/50">
            <DialogTitle className="text-lg font-semibold leading-none tracking-tight pr-8">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-sm text-muted-foreground mt-1.5">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          {children}
        </div>

        {footer && (
          <DialogFooter className="shrink-0 px-4 py-4 sm:px-6 border-t border-border bg-muted/20">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default SharedModal
