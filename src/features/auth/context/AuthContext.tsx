import {
  createContext, useContext, useState, useEffect, useCallback,
  type ReactNode,
} from 'react'
import type { AuthContextType, AuthUser, LoginCredentials } from '../../../shared/types'
import { loginApi, getMeApi, logoutApi } from '../services/authService'


const AuthContext = createContext<AuthContextType | null>(null)
const TOKEN_KEY = 'milkcare_token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]         = useState<AuthUser | null>(null)
  const [token, setToken]       = useState<string | null>(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY)
    if (!saved) { setLoading(false); return }

    const verify = async () => {
      try {
        const me = await getMeApi(saved)
        setUser(me); setToken(saved)
      } catch {
        localStorage.removeItem(TOKEN_KEY)
      } finally {
        setLoading(false)
      }
    }
    verify()
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    const { user: u, token: t } = await loginApi(credentials)
    localStorage.setItem(TOKEN_KEY, t)
    setToken(t); setUser(u)
  }, [])


  const logout = useCallback(() => {
    if (token) logoutApi(token)
    localStorage.removeItem(TOKEN_KEY)
    setToken(null); setUser(null)
  }, [token])

  return (
    <AuthContext.Provider value={{
      user, token, isLoading, login, logout,
      isAdmin: user?.role === 'admin',
      isStaff: user?.role === 'staff',
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
