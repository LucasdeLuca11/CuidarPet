/**
 * Página de Callback do Google OAuth
 * 
 * Responsável por:
 * - Receber o token do backend após autenticação Google
 * - Salvar token no contexto
 * - Redirecionar para dashboard
 */

import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@contexts/AuthContext'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export function GoogleCallbackPage() {
  const navigate = useNavigate()
  const { setToken } = useAuth()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')
    const error = searchParams.get('error')

    if (error) {
      toast.error(error)
      navigate('/login')
      return
    }

    if (token) {
      try {
        // Salvar token no contexto e localStorage
        setToken(token)
        localStorage.setItem('authToken', token)

        toast.success('Login com Google realizado com sucesso!')
        navigate('/dashboard')
      } catch (err) {
        toast.error('Erro ao processar login')
        navigate('/login')
      }
    } else {
      toast.error('Token não encontrado')
      navigate('/login')
    }
  }, [searchParams, navigate, setToken])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Processando login...</h1>
        <p className="text-gray-600">Você será redirecionado em breve</p>
      </div>
    </div>
  )
}