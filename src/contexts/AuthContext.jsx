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

  const refreshSession = useCallback(async () => {
    const stored = localStorage.getItem('retailflow_user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem('retailflow_user')
      }
    }

    if (DEV_BYPASS_AUTH) return

    try {
      const response = await authApi.getMe()
      const mapped = mapUser(response)
      if (mapped) {
        setUser(mapped)
        localStorage.setItem('retailflow_user', JSON.stringify(mapped))
      }
    } catch {
      setUser(null)
      localStorage.removeItem('retailflow_user')
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
      setUser(userData)
      localStorage.setItem('retailflow_user', JSON.stringify(userData))
      return { success: true, user: userData }
    }

    try {
      const response = await authApi.login(email, password)
      const mapped = mapUser(response)
      if (!mapped) {
        return { success: false, error: 'Invalid login response' }
      }
      setUser(mapped)
      localStorage.setItem('retailflow_user', JSON.stringify(mapped))
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
      // ignore logout errors in dev
    }
    setUser(null)
    localStorage.removeItem('retailflow_user')
  }

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('retailflow_user', JSON.stringify(updatedUser))
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
