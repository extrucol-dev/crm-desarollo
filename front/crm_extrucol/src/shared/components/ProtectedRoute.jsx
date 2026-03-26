import { Navigate } from 'react-router-dom'
import { authService } from '../../features/auth/services/authService'

export default function ProtectedRoute({ children, roles }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  if (roles?.length && !roles.includes(authService.getRol())) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}
