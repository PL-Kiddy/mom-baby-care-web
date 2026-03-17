import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

interface AuthContextType {
  isAuthenticated: boolean
  accessToken: string | null
  login: (accessToken: string, refreshToken: string) => void
  logout: () => void
  getAccessToken: () => string | null
  getRefreshToken: () => string | null
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    localStorage.getItem(ACCESS_TOKEN_KEY)
  )

  const login = useCallback((access: string, refresh: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, access)
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
    setAccessToken(access)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    setAccessToken(null)
  }, [])

  const getAccessToken = useCallback(() => localStorage.getItem(ACCESS_TOKEN_KEY), [])
  const getRefreshToken = useCallback(() => localStorage.getItem(REFRESH_TOKEN_KEY), [])

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY)
    setAccessToken(token)
  }, [])

  const value: AuthContextType = {
    isAuthenticated: !!accessToken,
    accessToken,
    login,
    logout,
    getAccessToken,
    getRefreshToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
