import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoadingScreen from './LoadingScreen'

interface Props { allowedRole: 'admin' | 'staff' }

export default function ProtectedRoute({ allowedRole }: Props) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (user.role !== allowedRole) {
    return <Navigate to={user.role === 'admin' ? '/dashboard' : '/staff/orders'} replace />
  }
  return <Outlet />
}
