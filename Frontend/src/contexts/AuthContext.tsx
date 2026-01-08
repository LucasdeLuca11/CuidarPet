/**
 * Contexto de Autenticação
 * 
 * Responsável por:
 * - Gerenciar estado de autenticação global
 * - Persistir sessão do usuário
 * - Fornecer funções de login, logout e registro
 * - Decodificar e validar token JWT
 */

import React, { createContext, useContext, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { authService } from '@services/authService'
import { AuthUser, AuthContextType, RegisterRequest, UserRole } from '@/types'


// Criar contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Tipagem mínima do JWT
interface JwtPayload {
  exp: number
  sub?: string
  role?: number

  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"?: string
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"?: string
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string
}


const mapRoleFromToken = (role?: number): UserRole => {
  switch (role) {
    case 0:
      return UserRole.Tutor
    case 1:
      return UserRole.Veterinarian
    case 2:
      return UserRole.Admin
    default:
      return UserRole.Tutor
  }
}

// Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null) 
  const [token, setTokenState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 🔁 Carregar sessão salva
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (savedToken) {
      try {
        const decoded = jwtDecode<JwtPayload>(savedToken)
        const now = Date.now() / 1000

        if (decoded.exp > now) {
          setTokenState(savedToken)

          if (savedUser) {
            setUser(JSON.parse(savedUser))
          } else {
            hydrateUserFromToken(savedToken)
          }
        } else {
          logout()
        }
      } catch (err) {
        console.error('Erro ao restaurar sessão:', err)
        logout()
      }
    }

    setIsLoading(false)
  }, [])

  // 🔐 Decodifica JWT e cria usuário
  const hydrateUserFromToken = (jwt: string) => {
  const decoded = jwtDecode<JwtPayload>(jwt)

  const userFromToken: AuthUser = {
  id:
    decoded.sub ||
    decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
    '',
  name:
    decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || '',
  email:
    decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || '',
  role: mapRoleFromToken(decoded.role),
  }

  setUser(userFromToken)
  localStorage.setItem('user', JSON.stringify(userFromToken))
  }

  // 🔑 Login normal
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await authService.login({ email, password })
      setToken(response.token)
      setUser(response.user)
      localStorage.setItem('user', JSON.stringify(response.user))
    } finally {
      setIsLoading(false)
    }
  }

  // 📝 Registro
  const register = async (data: RegisterRequest) => {
    setIsLoading(true)
    try {
      const response = await authService.register(data)
      setToken(response.token)
      setUser(response.user)
      localStorage.setItem('user', JSON.stringify(response.user))
    } finally {
      setIsLoading(false)
    }
  }

  // 🚪 Logout
  const logout = () => {
    authService.logout()
    setTokenState(null)
    setUser(null)
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  }

  const setToken = (token: string) => {
    const decoded = jwtDecode<JwtPayload>(token)

    const userFromToken: AuthUser = {
      id:
        decoded.sub ||
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
        '',
      name:
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || '',
      email:
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || '',
      role: mapRoleFromToken(decoded.role),
    }

    setTokenState(token)
    setUser(userFromToken)

    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userFromToken))
  }


  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
    setToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook para usar o contexto
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}
