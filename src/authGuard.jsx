import { Navigate, useLocation } from 'react-router-dom'

const ACCESS_TOKEN_KEY = 'accessToken'
const ADMIN_FLAG_KEY = 'isAdmin'

const isAuthenticated = () => Boolean(localStorage.getItem(ACCESS_TOKEN_KEY))
const isAdminUser = () => localStorage.getItem(ADMIN_FLAG_KEY) === 'true'

const RequireAuth = ({ children, requireAdmin = false, requireUser = false }) => {
  const location = useLocation()

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requireAdmin && !isAdminUser()) {
    return <Navigate to="/dashboard" replace />
  }

  if (requireUser && isAdminUser()) {
    return <Navigate to="/admin" replace />
  }

  return children
}

export default RequireAuth
