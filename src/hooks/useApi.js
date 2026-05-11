import { useState, useCallback } from 'react'
import { notify } from '../utils/notifications'

/**
 * Custom hook for API calls with loading and error states
 * @param {Function} apiFunction - API function to call
 * @param {Object} options - Options for the hook
 */
export const useApi = (apiFunction, options = {}) => {
  const [data, setData] = useState(options.initialData || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(async (...params) => {
    setLoading(true)
    setError(null)

    try {
      const result = await apiFunction(...params)
      
      if (result.success) {
        setData(result.data)
        
        // Show success notification if provided
        if (options.onSuccess) {
          options.onSuccess(result.data)
        }
        
        return { success: true, data: result.data }
      } else {
        setError(result.error)
        
        // Show error notification if enabled
        if (options.showErrorNotification !== false) {
          notify.error('Error', result.error)
        }
        
        if (options.onError) {
          options.onError(result.error)
        }
        
        return { success: false, error: result.error }
      }
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred'
      setError(errorMessage)
      
      if (options.showErrorNotification !== false) {
        notify.error('Error', errorMessage)
      }
      
      if (options.onError) {
        options.onError(errorMessage)
      }
      
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [apiFunction, options])

  const reset = useCallback(() => {
    setData(options.initialData || null)
    setError(null)
    setLoading(false)
  }, [options.initialData])

  return {
    data,
    loading,
    error,
    execute,
    reset,
    setData
  }
}

export default useApi

