/**
 * Página de Acesso Negado (403)
 * 
 * Responsável por:
 * - Exibir mensagem de acesso negado
 * - Oferecer opções de navegação
 */

import { useNavigate } from 'react-router-dom'
import { useAuth } from '@contexts/AuthContext'
import { AlertCircle, ArrowLeft, Home, LogOut } from 'lucide-react'

export function ForbiddenPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
          {/* Ícone */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>

          {/* Título */}
          <h1 className="text-4xl font-bold text-gray-900 mb-2">403</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Acesso Negado
          </h2>

          {/* Mensagem */}
          <p className="text-gray-600 mb-6">
            Você não tem permissão para acessar esta página.
          </p>

          {/* Informação de Role */}
          {user && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-700">
                <strong>Seu perfil:</strong> {user.role}
              </p>
              <p className="text-sm text-red-600 mt-2">
                Esta página requer um perfil diferente para acessar.
              </p>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gradient-to-r from-primary-500 to-secondary-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Ir para Dashboard
            </button>

            <button
              onClick={() => navigate(-1)}
              className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>

            <button
              onClick={handleLogout}
              className="w-full bg-red-100 text-red-700 py-3 rounded-lg font-semibold hover:bg-red-200 transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Fazer Logout
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              Se você acredita que isso é um erro, entre em contato com o suporte.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}