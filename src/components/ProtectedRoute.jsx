import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { canAccessRoute } from '../utils/routeHelpers'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!canAccessRoute(user.role, location.pathname)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}
