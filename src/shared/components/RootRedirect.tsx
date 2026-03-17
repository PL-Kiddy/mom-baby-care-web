import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoadingScreen from './LoadingScreen'

export default function RootRedirect() {
  const { user, isLoading } = useAuth()
  if (isLoading) return <LoadingScreen />
  if (!user)     return <Navigate to="/login" replace />
  return <Navigate to={user.role === 'admin' ? '/dashboard' : '/staff/orders'} replace />
}
