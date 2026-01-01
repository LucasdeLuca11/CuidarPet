/**
 * Serviço de Autenticação
 * 
 * Responsável por:
 * - Login com email e senha
 * - Registro de novo usuário
 * - Logout
 * - Gerenciar token JWT
 */

import api from './api'
import { AuthResponse, LoginRequest, RegisterRequest } from '@/types'

export const authService = {
  /**
   * Fazer login com email e senha
   * @param credentials Email e senha do usuário
   * @returns Token JWT e dados do usuário
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials)
    
    // Salvar token e usuário no localStorage
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    
    return response.data
  },

  /**
   * Registrar novo usuário
   * @param data Dados do novo usuário
   * @returns Token JWT e dados do usuário
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data)
    
    // Salvar token e usuário no localStorage
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    
    return response.data
  },

  /**
   * Fazer logout
   */
  logout: (): void => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  /**
   * Obter token salvo
   */
  getToken: (): string | null => {
    return localStorage.getItem('token')
  },

  /**
   * Verificar se está autenticado
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token')
  },
}