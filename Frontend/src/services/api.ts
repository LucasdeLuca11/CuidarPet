/**
 * Serviço de API centralizado com Axios
 * 
 * Responsável por:
 * - Configurar base URL
 * - Adicionar token JWT automaticamente
 * - Tratar erros globalmente
 * - Redirecionar em caso de 401 (token expirado)
 */

import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios'
import { ApiError } from '@/types'

// Criar instância do Axios
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5014/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Interceptor de Requisição
 * Adiciona o token JWT no header Authorization de todas as requisições
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Interceptor de Resposta
 * Trata erros globalmente e redireciona em caso de 401
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Erro 401 - Token expirado ou inválido
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }

    // Erro 403 - Sem permissão
    if (error.response?.status === 403) {
      window.location.href = '/forbidden'
    }

    // Retornar erro formatado
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'Erro na requisição',
      status: error.response?.status || 500,
      errors: error.response?.data?.errors,
    }

    return Promise.reject(apiError)
  }
)

export default api