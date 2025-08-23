import React from 'react'
import { Navigate } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'
import { Loader2 } from 'lucide-react'

interface PublicRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

const PublicRoute: React.FC<PublicRouteProps> = ({ 
  children, 
  redirectTo = '/' 
}) => {
  const { isAuthenticated, isCheckingAuth } = useAuth()

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}

export default PublicRoute
