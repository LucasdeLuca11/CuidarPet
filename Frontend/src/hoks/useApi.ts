/**
 * Hook customizado para requisições de API
 * 
 * Responsável por:
 * - Gerenciar estado de loading, erro e dados
 * - Fazer requisições e tratar erros
 * - Fornecer interface consistente para componentes
 */

import { useState, useCallback } from 'react'
import { ApiError } from '@/types'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  immediate = true
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  })

  // Função para executar a requisição
  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null })
    try {
      const result = await apiCall()
      setState({ data: result, loading: false, error: null })
      return result
    } catch (error) {
      const apiError = error as ApiError
      setState({ data: null, loading: false, error: apiError })
      throw error
    }
  }, [apiCall])

  // Executar imediatamente se solicitado
  useState(() => {
    if (immediate) {
      execute()
    }
  })

  return {
    ...state,
    execute,
  }
}

/**
 * Hook para mutações (POST, PUT, DELETE)
 */
export function useMutation<T, P = void>(
  mutationFn: (params: P) => Promise<T>
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const mutate = useCallback(
    async (params: P) => {
      setState({ data: null, loading: true, error: null })
      try {
        const result = await mutationFn(params)
        setState({ data: result, loading: false, error: null })
        return result
      } catch (error) {
        const apiError = error as ApiError
        setState({ data: null, loading: false, error: apiError })
        throw error
      }
    },
    [mutationFn]
  )

  return {
    ...state,
    mutate,
  }
}