import Swal from 'sweetalert2'

/**
 * Centralized Notification Utility
 * Consistent notification handling across the app
 */

const defaultConfig = {
  confirmButtonColor: '#3B82F6',
  cancelButtonColor: '#6B7280'
}

export const notify = {
  // Success notification
  success: (title, message, options = {}) => {
    return Swal.fire({
      icon: 'success',
      title,
      text: message,
      timer: options.timer || 2000,
      ...defaultConfig,
      ...options
    })
  },

  // Error notification
  error: (title, message, options = {}) => {
    return Swal.fire({
      icon: 'error',
      title,
      text: message,
      ...defaultConfig,
      ...options
    })
  },

  // Warning notification
  warning: (title, message, options = {}) => {
    return Swal.fire({
      icon: 'warning',
      title,
      text: message,
      ...defaultConfig,
      ...options
    })
  },

  // Info notification
  info: (title, message, options = {}) => {
    return Swal.fire({
      icon: 'info',
      title,
      text: message,
      ...defaultConfig,
      ...options
    })
  },

  // Confirmation dialog
  confirm: async (title, message, options = {}) => {
    const result = await Swal.fire({
      title,
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: options.confirmText || 'Yes, confirm',
      cancelButtonText: options.cancelText || 'Cancel',
      ...defaultConfig,
      ...options
    })
    return result.isConfirmed
  },

  // Custom HTML dialog
  custom: (options = {}) => {
    return Swal.fire({
      ...defaultConfig,
      ...options
    })
  },

  // Delete confirmation
  confirmDelete: async (itemName) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      html: `You are about to delete <strong>${itemName}</strong>. This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#EF4444',
      ...defaultConfig
    })
    return result.isConfirmed
  },

  // Loading/Processing
  loading: (title = 'Processing...', message = 'Please wait') => {
    return Swal.fire({
      title,
      text: message,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })
  },

  // Close any open notification
  close: () => {
    Swal.close()
  }
}

export default notify

