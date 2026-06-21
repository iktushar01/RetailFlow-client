/** @type {((options: ConfirmOptions) => Promise<boolean>) | null} */
let confirmHandler = null

/**
 * @typedef {Object} ConfirmOptions
 * @property {string} title
 * @property {string} [description]
 * @property {string} [confirmText]
 * @property {string} [cancelText]
 * @property {'default' | 'destructive'} [variant]
 */

export const setConfirmHandler = (handler) => {
  confirmHandler = handler
}

/**
 * Promise-based confirm dialog (shadcn AlertDialog).
 * @param {ConfirmOptions} options
 * @returns {Promise<boolean>}
 */
export const confirmDialog = (options) => {
  if (!confirmHandler) {
    console.warn('confirmDialog called before ConfirmDialogProvider mounted')
    return Promise.resolve(window.confirm(options.description || options.title))
  }
  return confirmHandler(options)
}
