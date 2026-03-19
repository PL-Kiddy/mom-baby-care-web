import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoadingScreen from './LoadingScreen'

export default function MemberRoute() {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (user.role !== 'member') {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />
    if (user.role === 'staff') return <Navigate to="/staff/orders" replace />
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

