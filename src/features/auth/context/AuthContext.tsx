import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import type { AuthContextType, AuthUser, LoginCredentials } from '../../../shared/types'
import { loginApi, getMeApi, logoutApi, refreshAccessTokenApi } from '../services/authService'

const AuthContext = createContext<AuthContextType | null>(null)

const TOKEN_KEY = 'milkcare_token'
const REFRESH_TOKEN_KEY = 'milkcare_refresh_token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    const savedAccess = localStorage.getItem(TOKEN_KEY)
    const savedRefresh = localStorage.getItem(REFRESH_TOKEN_KEY)

    if (!savedAccess) {
      setLoading(false)
      return
    }

    const verify = async () => {
      try {
        const me = await getMeApi(savedAccess)
        setUser(me)
        setToken(savedAccess)
        setRefreshToken(savedRefresh)
      } catch {
        if (savedRefresh) {
          const newAccess = await refreshAccessTokenApi(savedRefresh)
          if (newAccess) {
            try {
              const me = await getMeApi(newAccess)
              localStorage.setItem(TOKEN_KEY, newAccess)
              setToken(newAccess)
              setRefreshToken(savedRefresh)
              setUser(me)
              setLoading(false)
              return
            } catch {
              // fall through
            }
          }
        }
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
        setUser(null)
        setToken(null)
        setRefreshToken(null)
      } finally {
        setLoading(false)
      }
    }

    verify()
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    const { user: u, token: t, refreshToken: rt } = await loginApi(credentials)
    localStorage.setItem(TOKEN_KEY, t)
    if (rt) {
      localStorage.setItem(REFRESH_TOKEN_KEY, rt)
    }
    setToken(t)
    setRefreshToken(rt ?? null)
    setUser(u)
  }, [])

  const logout = useCallback(() => {
    if (token) logoutApi(token)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    setToken(null)
    setRefreshToken(null)
    setUser(null)
  }, [token])

  const setUserFromProfile = useCallback((updated: Partial<AuthUser>) => {
    setUser((prev) =>
      prev
        ? {
            ...prev,
            ...updated,
          }
        : (updated as AuthUser),
    )
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        refreshToken,
        isLoading,
        login,
        logout,
        isAdmin: user?.role === 'admin',
        isStaff: user?.role === 'staff',
        // tiện ích cập nhật user sau khi chỉnh sửa profile
        // (không bắt buộc dùng ở nơi khác)
        // @ts-expect-error mở rộng tạm thời so với AuthContextType
        setUserFromProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
