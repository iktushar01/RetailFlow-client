import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

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

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('xenuser')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('xenuser')
      }
    }
    setLoading(false)
  }, [])

  const login = (username, password) => {
    // Check credentials
    if (username === 'xenuser' && password === 'xenuser123') {
      const userData = {
        username: 'xenuser',
        name: 'Admin User',
        email: 'admin@store-xen.com',
        role: 'Administrator',
        loginTime: new Date().toISOString()
      }
      setUser(userData)
      localStorage.setItem('xenuser', JSON.stringify(userData))
      return { success: true, user: userData }
    }
    return { success: false, error: 'Invalid username or password' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('xenuser')
  }

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('xenuser', JSON.stringify(updatedUser))
  }

  const isAuthenticated = () => {
    return !!user
  }

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

