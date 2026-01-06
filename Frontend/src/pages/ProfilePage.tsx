/**
 * Página de Perfil do Usuário
 * 
 * Responsável por:
 * - Exibir informações do usuário
 * - Editar dados pessoais
 * - Gerenciar segurança
 * - Preferências
 */

import { useState } from 'react'
import { useAuth } from '@contexts/AuthContext'
import { User, Mail, Phone, MapPin, Lock, Eye, EyeOff, Save, X } from 'lucide-react'

export function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'preferences'>('personal')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // Dados do formulário
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+55 (11) 98765-4321',
    address: 'Rua das Flores, 123',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    bio: 'Amante de pets e cuidados veterinários',
  })

  // Dados de segurança
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Preferências
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
    newsletter: true,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSecurityData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePreferenceChange = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      // TODO: Chamar API para salvar dados
      console.log('Salvando perfil:', formData)
      alert('Perfil atualizado com sucesso!')
      setIsEditing(false)
    } catch (error) {
      alert('Erro ao atualizar perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      alert('As senhas não coincidem')
      return
    }

    setLoading(true)
    try {
      // TODO: Chamar API para mudar senha
      console.log('Mudando senha')
      alert('Senha alterada com sucesso!')
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      alert('Erro ao alterar senha')
    } finally {
      setLoading(false)
    }
  }

  const handleSavePreferences = async () => {
    setLoading(true)
    try {
      // TODO: Chamar API para salvar preferências
      console.log('Salvando preferências:', preferences)
      alert('Preferências atualizadas com sucesso!')
    } catch (error) {
      alert('Erro ao atualizar preferências')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Meu Perfil</h1>
          <p className="text-gray-600">Gerencie suas informações pessoais e preferências</p>
        </div>

        {/* Card Principal */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Seção de Avatar */}
          <div className="bg-gradient-to-r from-primary-500 to-secondary-600 px-8 py-12">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-primary-600" />
              </div>
              <div className="text-white">
                <h2 className="text-3xl font-bold">{user?.name || 'Usuário'}</h2>
                <p className="text-white/80">{user?.email}</p>
                <p className="text-white/60 text-sm mt-1">
                  Membro desde Janeiro de 2025
                </p>
              </div>
            </div>
          </div>

          {/* Abas */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('personal')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'personal'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Informações Pessoais
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'security'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Segurança
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'preferences'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Preferências
              </button>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="p-8">
            {/* Aba: Informações Pessoais */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                {!isEditing ? (
                  <>
                    {/* Visualização */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Nome Completo</label>
                        <p className="text-lg text-gray-900 mt-1">{formData.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Email</label>
                        <p className="text-lg text-gray-900 mt-1 flex items-center gap-2">
                          <Mail className="w-4 h-4" /> {formData.email}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Telefone</label>
                        <p className="text-lg text-gray-900 mt-1 flex items-center gap-2">
                          <Phone className="w-4 h-4" /> {formData.phone}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Endereço</label>
                        <p className="text-lg text-gray-900 mt-1 flex items-center gap-2">
                          <MapPin className="w-4 h-4" /> {formData.address}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Cidade</label>
                        <p className="text-lg text-gray-900 mt-1">{formData.city}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Estado</label>
                        <p className="text-lg text-gray-900 mt-1">{formData.state}</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-600">Bio</label>
                      <p className="text-gray-700 mt-1">{formData.bio}</p>
                    </div>

                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                    >
                      Editar Perfil
                    </button>
                  </>
                ) : (
                  <>
                    {/* Edição */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-2">
                          Nome Completo
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-2">
                          Telefone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-2">
                          Endereço
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-2">
                          Cidade
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-2">
                          Estado
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" /> Salvar
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors flex items-center gap-2"
                      >
                        <X className="w-4 h-4" /> Cancelar
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Aba: Segurança */}
            {activeTab === 'security' && (
              <div className="space-y-6 max-w-md">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-700">
                    Para sua segurança, recomendamos alterar sua senha regularmente.
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Senha Atual
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="currentPassword"
                      value={securityData.currentPassword}
                      onChange={handleSecurityChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-500"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={securityData.newPassword}
                    onChange={handleSecurityChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Confirmar Nova Senha
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={securityData.confirmPassword}
                    onChange={handleSecurityChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <button
                  onClick={handleChangePassword}
                  disabled={loading}
                  className="w-full bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" /> Alterar Senha
                </button>
              </div>
            )}

            {/* Aba: Preferências */}
            {activeTab === 'preferences' && (
              <div className="space-y-6 max-w-md">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Notificações</h3>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.emailNotifications}
                      onChange={() => handlePreferenceChange('emailNotifications')}
                      className="w-5 h-5 text-primary-600 rounded"
                    />
                    <span className="text-gray-700">Notificações por Email</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.smsNotifications}
                      onChange={() => handlePreferenceChange('smsNotifications')}
                      className="w-5 h-5 text-primary-600 rounded"
                    />
                    <span className="text-gray-700">Notificações por SMS</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.pushNotifications}
                      onChange={() => handlePreferenceChange('pushNotifications')}
                      className="w-5 h-5 text-primary-600 rounded"
                    />
                    <span className="text-gray-700">Notificações Push</span>
                  </label>
                </div>

                <hr />

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Marketing</h3>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.marketingEmails}
                      onChange={() => handlePreferenceChange('marketingEmails')}
                      className="w-5 h-5 text-primary-600 rounded"
                    />
                    <span className="text-gray-700">Emails de Marketing</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.newsletter}
                      onChange={() => handlePreferenceChange('newsletter')}
                      className="w-5 h-5 text-primary-600 rounded"
                    />
                    <span className="text-gray-700">Newsletter Semanal</span>
                  </label>
                </div>

                <button
                  onClick={handleSavePreferences}
                  disabled={loading}
                  className="w-full bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> Salvar Preferências
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
