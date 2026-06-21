import { toast } from 'sonner'
import { confirmDialog } from './confirmDialog'

/**
 * Centralized notification utility using shadcn/sonner toasts and AlertDialog confirms.
 */
export const notify = {
  success: (title, message, options = {}) => {
    toast.success(title, {
      description: message,
      duration: options.timer || 2000,
      ...options,
    })
  },

  error: (title, message, options = {}) => {
    toast.error(title, {
      description: message,
      ...options,
    })
  },

  warning: (title, message, options = {}) => {
    toast.warning(title, {
      description: message,
      ...options,
    })
  },

  info: (title, message, options = {}) => {
    toast.info(title, {
      description: message,
      duration: options.timer || 3000,
      ...options,
    })
  },

  confirm: async (title, message, options = {}) => {
    return confirmDialog({
      title,
      description: message,
      confirmText: options.confirmText || 'Yes, confirm',
      cancelText: options.cancelText || 'Cancel',
      variant: options.variant,
    })
  },

  confirmDelete: async (itemName) => {
    return confirmDialog({
      title: 'Are you sure?',
      description: `You are about to delete ${itemName}. This action cannot be undone.`,
      confirmText: 'Yes, delete it',
      cancelText: 'Cancel',
      variant: 'destructive',
    })
  },

  loading: (title = 'Processing...', message = 'Please wait') => {
    return toast.loading(title, { description: message })
  },

  close: (toastId) => {
    if (toastId) toast.dismiss(toastId)
    else toast.dismiss()
  },
}

/** Shorthand for Swal.fire('Title', 'text', 'icon') migration */
export const alertToast = (title, text, icon = 'info') => {
  const opts = { description: text }
  switch (icon) {
    case 'success':
      toast.success(title, opts)
      break
    case 'error':
      toast.error(title, opts)
      break
    case 'warning':
      toast.warning(title, opts)
      break
    default:
      toast.info(title, opts)
  }
}

export default notify
