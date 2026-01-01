import { Navigate } from 'react-router-dom'
import { useAuth } from '@contexts/AuthContext'
import { UserRole } from '@/types'

interface PrivateRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

export function PrivateRoute({
  children,
  allowedRoles,
}: PrivateRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth()

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  // Não autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Verificar permissões
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />
  }

  return <>{children}</>
}