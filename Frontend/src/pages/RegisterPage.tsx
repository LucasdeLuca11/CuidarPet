/**
 * Página de Registro
 * 
 * Responsável por:
 * - Registro de novo usuário
 * - Seleção de role (Tutor/Veterinário)
 * - Registro com Google OAuth
 * - Validação de formulário
 */

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@contexts/AuthContext'
import { Mail, Lock, User, AlertCircle, Loader2, Chrome, CheckCircle, Building2, FileText, Briefcase } from 'lucide-react'
import toast from 'react-hot-toast'
import { UserRole } from '@/types'

export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'role' | 'form'>('role')
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: selectedRole
  })


  // Obter URL de login do Google do backend
  const getGoogleLoginUrl = () => {
    const apiBaseUrl =
      import.meta.env.VITE_API_BASE_URL || 'http://localhost:5014/api'

    return `${apiBaseUrl}/auth/google`
  }


  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
    setStep('form')
  }

  const formatCNPJ = (value: string) => {
  return value
    .replace(/\D/g, '')               // remove tudo que não é número
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .slice(0, 18)                     // limita ao tamanho do CNPJ
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target

    let finalValue: any = value

    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validação básica
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Os campos Nome, email, senha e confirmação de senha são obrigatórios.')
      setLoading(false)
      return
    }


      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setError('Email inválido')
        setLoading(false)
        return
      }

      // Validar senha
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[^\s]{8,}$/

      if (!passwordRegex.test(formData.password)) {
        setError(
          'A senha deve ter no mínimo 8 caracteres, contendo letra maiúscula, minúscula, número e caractere especial'
        )
        setLoading(false)
        return
      }

      // Validar confirmação de senha
      if (formData.password !== formData.confirmPassword) {
        setError('As senhas não coincidem')
        setLoading(false)
        return
      }

      await register({
        ...formData,
        role: selectedRole || UserRole.Tutor,
      })


      toast.success('Conta criada com sucesso!')
      navigate('/dashboard')
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Erro ao criar conta'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    // Redirecionar para URL de login do Google
    window.location.href = getGoogleLoginUrl()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card Principal */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl mb-4">
              <span className="text-2xl font-bold text-white">🐾</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">CuidarPet</h1>
            <p className="text-gray-600 text-sm mt-2">Crie sua conta agora</p>
          </div>

          {/* Passo 1: Seleção de Role */}
          {step === 'role' && (
            <div className="space-y-4">
              <p className="text-center text-gray-700 font-medium mb-6">
                Qual é seu perfil?
              </p>

              {/* Tutor */}
              <button
                onClick={() => handleRoleSelect(UserRole.Tutor)}
                className="w-full p-6 border-2 border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                    <span className="text-2xl">🐕</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600">
                      Sou Tutor de Pets
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Tenho pets e quero agendar serviços veterinários
                    </p>
                  </div>
                </div>
              </button>

              {/* Veterinário */}
              <button
                onClick={() => handleRoleSelect(UserRole.Veterinarian)}
                className="w-full p-6 border-2 border-gray-300 rounded-lg hover:border-secondary-500 hover:bg-secondary-50 transition-all text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center group-hover:bg-secondary-200 transition-colors">
                    <span className="text-2xl">🏥</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-secondary-600">
                      Sou Veterinário/PetShop
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Tenho uma clínica e quero oferecer serviços
                    </p>
                  </div>
                </div>
              </button>

              {/* Link para Login */}
              <div className="text-center mt-6">
                <p className="text-gray-600 text-sm">
                  Já tem conta?{' '}
                  <Link
                    to="/login"
                    className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                  >
                    Fazer login
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* Passo 2: Formulário */}
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Breadcrumb */}
              <button
                type="button"
                onClick={() => setStep('role')}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium mb-4"
              >
                ← Voltar
              </button>

              {/* Tipo de Conta */}
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <span className="text-sm font-medium text-primary-700">
                  {selectedRole === UserRole.Tutor
                    ? 'Registrando como Tutor'
                    : 'Registrando como Veterinário'}
                </span>
              </div>

              {/* Nome */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Seu nome"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="seu@email.com"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Senha */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    disabled={loading}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">A senha deve ter no mínimo 8 caracteres, contendo letra maiúscula, minúscula, número e caractere especial</p>
              </div>

              {/* Confirmar Senha */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Divisor */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Ou continue com</span>
                </div>
              </div>

              {/* Botão Google */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-2"
              >
                <Chrome className="w-5 h-5" />
                Registrar com Google
              </button>

              {/* Erro */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Botão de Registro */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-500 to-secondary-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  'Criar Conta'
                )}
              </button>

              {/* Link para Login */}
              <div className="text-center mt-6">
                <p className="text-gray-600 text-sm">
                  Já tem conta?{' '}
                  <Link
                    to="/login"
                    className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                  >
                    Fazer login
                  </Link>
                </p>
              </div>
            </form>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
            <p>
              Ao se registrar, você concorda com nossos{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                Termos de Serviço
              </a>{' '}
              e{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                Política de Privacidade
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}