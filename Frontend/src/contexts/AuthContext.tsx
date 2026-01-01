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
import {
  User,
  AuthContextType,
  // LoginRequest,
  RegisterRequest,
  // UserRole,
} from '@/types'

// Criar contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
const [token, setTokenState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Carregar usuário do localStorage ao montar
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (savedToken && savedUser) {
      try {
        // Verificar se token não expirou
        const decoded = jwtDecode<{ exp: number }>(savedToken)
        const now = Date.now() / 1000

        if (decoded.exp > now) {
          setTokenState(savedToken)
          setUser(JSON.parse(savedUser))
        } else {
          // Token expirado
          authService.logout()
        }
      } catch (error) {
        console.error('Erro ao decodificar token:', error)
        authService.logout()
      }
    }

    setIsLoading(false)
  }, [])

  // Função de login
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await authService.login({ email, password })
      setTokenState(response.token)
      setUser(response.user)
    } finally {
      setIsLoading(false)
    }
  }

  // Função de registro
  const register = async (data: RegisterRequest) => {
    setIsLoading(true)
    try {
      const response = await authService.register(data)
      setTokenState(response.token)
      setUser(response.user)
    } finally {
      setIsLoading(false)
    }
  }

  // Função de logout
  const logout = () => {
    authService.logout()
    setTokenState(null)
    setUser(null)
  }

  const setToken = (token: string) => {
    setUser(null) // Será preenchido após decodificar o token
    setTokenState(token)
    localStorage.setItem('authToken', token)
  }

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    logout,
    register,
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