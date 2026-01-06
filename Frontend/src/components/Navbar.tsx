/**
 * Componente: Navbar
 * 
 * Responsável por:
 * - Navegação principal
 * - Menu de notificações
 * - Menu de perfil
 * - Responsividade mobile
 */

import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Bell, LogOut, User, Home, Heart, Calendar, Stethoscope, Settings } from 'lucide-react'
import { useAuth } from '@contexts/AuthContext'
import { NotificationsModal } from './NotificationsModal'

export function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  /**
   * Determina os links de navegação baseado no role do usuário
   */
  const getMenuItems = () => {
    const baseItems = [
      { label: 'Home', icon: Home, href: '/dashboard' }
    ]

    // Menu para Tutor
    if (user?.role === 0) {
      return [
        ...baseItems,
        { label: 'Meus Pets', icon: Heart, href: '/pets' },
        { label: 'Clínicas', icon: Stethoscope, href: '/clinics' },
        { label: 'Agendamentos', icon: Calendar, href: '/appointments' }
      ]
    }

    // Menu para Veterinário
    if (user?.role === 1) {
      return [
        ...baseItems,
        { label: 'Minha Clínica', icon: Stethoscope, href: '/clinic' },
        { label: 'Serviços', icon: Settings, href: '/services' },
        { label: 'Agendamentos', icon: Calendar, href: '/clinic-appointments' }
      ]
    }

    // Menu para Admin
    if (user?.role === 2) {
      return [
        ...baseItems,
        { label: 'Meus Pets', icon: Heart, href: '/pets' },
        { label: 'Clínicas', icon: Stethoscope, href: '/clinics' },
        { label: 'Agendamentos', icon: Calendar, href: '/appointments' }
      ]
    }

    return baseItems
  }

  const menuItems = getMenuItems()

  /**
   * Verifica se um link está ativo
   */
  const isActive = (href: string) => location.pathname === href

  /**
   * Trata logout
   */
  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  /**
   * Navega e fecha menus
   */
  const handleNavigate = (href: string) => {
    navigate(href)
    setMobileMenuOpen(false)
    setProfileMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => handleNavigate('/dashboard')}
              className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              🐾 CuidarPet
            </button>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map(item => (
              <button
                key={item.href}
                onClick={() => handleNavigate(item.href)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium ${
                  isActive(item.href)
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon size={18} />
                <span className="hidden lg:inline">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Ações Direita */}
          <div className="flex items-center gap-4">
            {/* Notificações */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              <NotificationsModal
                isOpen={notificationsOpen}
                onClose={() => setNotificationsOpen(false)}
              />
            </div>

            {/* Menu Perfil */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:inline font-medium">{user?.name?.split(' ')[0]}</span>
              </button>

              {/* Dropdown Menu Perfil */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-600">{user?.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      handleNavigate('/profile')
                      setProfileMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors text-sm"
                  >
                    <User size={16} />
                    Meu Perfil
                  </button>

                  <button
                    onClick={() => {
                      handleLogout()
                      setProfileMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors text-sm border-t border-gray-200"
                  >
                    <LogOut size={16} />
                    Sair
                  </button>
                </div>
              )}
            </div>

            {/* Menu Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menu Mobile Expandido */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
            {menuItems.map(item => (
              <button
                key={item.href}
                onClick={() => handleNavigate(item.href)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors font-medium ${
                  isActive(item.href)
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
