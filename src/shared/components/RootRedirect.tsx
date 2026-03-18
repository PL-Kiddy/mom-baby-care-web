import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoadingScreen from './LoadingScreen'

export default function RootRedirect() {
  const { user, isLoading } = useAuth()
  if (isLoading) return <LoadingScreen />
  if (!user)     return <Navigate to="/login" replace />

  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />
  if (user.role === 'staff') return <Navigate to="/staff/orders" replace />
  return <Navigate to="/" replace />
}
