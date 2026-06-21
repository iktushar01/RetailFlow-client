import axios from 'axios'

/**
 * In dev, use same-origin (Vite proxy → localhost:5000) so httpOnly auth cookies
 * are set on localhost:5173 and survive page reloads.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL !== undefined && import.meta.env.VITE_API_BASE_URL !== ''
    ? import.meta.env.VITE_API_BASE_URL
    : import.meta.env.DEV
      ? ''
      : 'http://localhost:5000'

/** Shared axios client for RetailFlow API — sends cookies when auth is enabled. */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
})

const AUTH_SKIP_REFRESH = [
  '/api/v1/auth/login',
  '/api/v1/auth/refresh-token',
  '/api/v1/auth/register',
  '/api/v1/auth/logout',
]

let isRefreshing = false
let refreshWaitQueue = []

const flushRefreshQueue = (error) => {
  refreshWaitQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve()
  })
  refreshWaitQueue = []
}

const shouldSkipRefresh = (url = '') =>
  AUTH_SKIP_REFRESH.some((path) => url.includes(path))

apiClient.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    if (config.headers) {
      delete config.headers['Content-Type']
      delete config.headers['content-type']
    }
  } else if (config.headers && !config.headers['Content-Type'] && !config.headers['content-type']) {
    config.headers['Content-Type'] = 'application/json'
  }
  return config
})

/** On 401, refresh access token via httpOnly cookie and retry the original request once. */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status

    if (
      status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      shouldSkipRefresh(originalRequest.url)
    ) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshWaitQueue.push({ resolve, reject })
      }).then(() => apiClient(originalRequest))
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      await apiClient.post('/api/v1/auth/refresh-token')
      flushRefreshQueue(null)
      return apiClient(originalRequest)
    } catch (refreshError) {
      flushRefreshQueue(refreshError)
      localStorage.removeItem('retailflow_user')
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export default apiClient
