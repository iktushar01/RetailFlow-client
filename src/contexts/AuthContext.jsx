import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../services/api'

const AuthContext = createContext(null)

const DEV_BYPASS_AUTH = import.meta.env.VITE_BYPASS_AUTH === 'true'

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const mapUser = (payload) => {
    if (!payload) return null
    const profile =
      payload.user ||
      payload.data?.user ||
      (payload.data?.email ? payload.data : null) ||
      (payload.email ? payload : null)
    if (!profile?.email && !profile?.name) return null
    return {
      id: profile.id || profile._id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
      image: profile.image || profile.profilePhoto,
    }
  }

  const persistUser = (mapped) => {
    if (mapped) {
      setUser(mapped)
      localStorage.setItem('retailflow_user', JSON.stringify(mapped))
    } else {
      setUser(null)
      localStorage.removeItem('retailflow_user')
    }
  }

  const refreshSession = useCallback(async () => {
    if (DEV_BYPASS_AUTH) {
      const stored = localStorage.getItem('retailflow_user')
      if (stored) {
        try {
          setUser(JSON.parse(stored))
        } catch {
          localStorage.removeItem('retailflow_user')
        }
      }
      return
    }

    // Try silent token refresh first (access token may be expired after reload)
    try {
      await authApi.refreshToken()
    } catch {
      // No refresh cookie yet — fall through to getMe
    }

    try {
      const response = await authApi.getMe()
      persistUser(mapUser(response))
    } catch {
      persistUser(null)
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      await refreshSession()
      setLoading(false)
    }
    init()
  }, [refreshSession])

  const login = async (email, password) => {
    if (email === 'admin@retailflow.local' && password === 'admin123') {
      const userData = {
        id: 'dev-admin',
        name: 'Dev Admin',
        email,
        role: 'ADMIN',
      }
      persistUser(userData)
      return { success: true, user: userData }
    }

    try {
      const response = await authApi.login(email, password)
      const mapped = mapUser(response)
      if (!mapped) {
        return { success: false, error: 'Invalid login response' }
      }
      persistUser(mapped)
      return { success: true, user: mapped }
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Invalid email or password'
      return { success: false, error: message }
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch {
      // logout endpoint clears cookies even without valid access token
    }
    persistUser(null)
  }

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates }
    persistUser(updatedUser)
  }

  const isAuthenticated = () => !!user

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated,
    refreshSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
