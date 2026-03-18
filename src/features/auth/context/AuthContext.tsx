import {
  createContext, useContext, useState, useEffect, useCallback,
  type ReactNode,
} from 'react'
import type { AuthContextType, AuthUser, LoginCredentials } from '../../../shared/types'
import { mockLogin, getMeApi, logoutApi } from '../services/authService'

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
        if (saved.startsWith('mock-admin')) {
          setUser({ id: '1', name: 'Admin MilkCare', email: 'admin@gmail.com', role: 'admin' })
          setToken(saved)
        } else if (saved.startsWith('mock-staff')) {
          setUser({ id: '2', name: 'Nhân viên A', email: 'staff@gmail.com', role: 'staff' })
          setToken(saved)
        } else if (saved.startsWith('mock-member')) {
          setUser({ id: '3', name: 'Mẹ Demo', email: 'member@gmail.com', role: 'member' })
          setToken(saved)
        } else {
          const me = await getMeApi(saved)
          setUser(me); setToken(saved)
        }
      } catch {
        localStorage.removeItem(TOKEN_KEY)
      } finally {
        setLoading(false)
      }
    }
    verify()
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    // TODO: đổi mockLogin → loginApi khi có BE
    const { user: u, token: t } = await mockLogin(credentials)
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
