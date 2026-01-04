/**
 * Página 404 - Não Encontrado
 * 
 * Responsável por:
 * - Mostrar erro 404
 * - Oferecer navegação alternativa
 * - Design amigável
 */

import { useNavigate } from 'react-router-dom'
import { AlertCircle, Home, ArrowLeft, Search } from 'lucide-react'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        {/* Ícone */}
        <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-8">
          <AlertCircle className="w-12 h-12 text-red-600" />
        </div>

        {/* Código de Erro */}
        <div className="mb-4">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
            404
          </h1>
        </div>

        {/* Mensagem */}
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Página Não Encontrada</h2>
        <p className="text-gray-600 text-lg mb-8">
          Desculpe, a página que você está procurando não existe ou foi movida.
        </p>

        {/* Ilustração */}
        <div className="mb-8">
          <div className="inline-block">
            <div className="text-6xl">🐾</div>
            <p className="text-sm text-gray-500 mt-2">Parece que o pet se perdeu!</p>
          </div>
        </div>

        {/* Sugestões */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
          <h3 className="font-semibold text-blue-900 mb-3">O que você pode fazer:</h3>
          <ul className="text-sm text-blue-700 space-y-2">
            <li>✓ Voltar para a página anterior</li>
            <li>✓ Ir para a página inicial</li>
            <li>✓ Usar a busca para encontrar o que procura</li>
            <li>✓ Entrar em contato com o suporte</li>
          </ul>
        </div>

        {/* Botões */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gradient-to-r from-primary-500 to-secondary-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Ir para Home
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>

          <button
            onClick={() => navigate('/help')}
            className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            Precisa de Ajuda?
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">
            Se o problema persistir, entre em contato com nosso suporte
          </p>
          <a
            href="mailto:suporte@cuidarpet.com"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            suporte@cuidarpet.com
          </a>
        </div>
      </div>
    </div>
  )
}
