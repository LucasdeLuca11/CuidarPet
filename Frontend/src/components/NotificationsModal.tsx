/**
 * Modal de Notificações
 * 
 * Responsável por:
 * - Exibir notificações em tempo real
 * - Marcar como lida
 * - Deletar notificações
 * - Link para página de perfil
 */

import { useState } from 'react'
import { X, Bell, Trash2, Check, Clock, AlertCircle } from 'lucide-react'

interface Notification {
  id: number
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  timestamp: string
  isRead: boolean
  icon?: React.ReactNode
}

interface NotificationsModalProps {
  isOpen: boolean
  onClose: () => void
  notifications?: Notification[]
}

// Notificações de exemplo
const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'success',
    title: 'Agendamento Confirmado',
    message: 'Seu agendamento com a Clínica Pet Care foi confirmado para amanhã às 10:00',
    timestamp: 'Há 5 minutos',
    isRead: false,
  },
  {
    id: 2,
    type: 'info',
    title: 'Novo Serviço Disponível',
    message: 'A Clínica Pet Care adicionou um novo serviço: Banho e Tosa Premium',
    timestamp: 'Há 1 hora',
    isRead: false,
  },
  {
    id: 3,
    type: 'warning',
    title: 'Lembrete de Vacinação',
    message: 'Rex precisa tomar sua próxima vacina em 7 dias',
    timestamp: 'Há 2 horas',
    isRead: true,
  },
  {
    id: 4,
    type: 'success',
    title: 'Avaliação Recebida',
    message: 'Você recebeu uma avaliação 5 estrelas da Clínica Pet Care',
    timestamp: 'Há 1 dia',
    isRead: true,
  },
  {
    id: 5,
    type: 'info',
    title: 'Promoção Especial',
    message: 'Aproveite 20% de desconto em serviços de banho e tosa',
    timestamp: 'Há 2 dias',
    isRead: true,
  },
]

export function NotificationsModal({
  isOpen,
  onClose,
  notifications = mockNotifications,
}: NotificationsModalProps) {
  const [notificationsList, setNotificationsList] = useState<Notification[]>(notifications)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const filteredNotifications = notificationsList.filter((notif) => {
    if (filter === 'unread') return !notif.isRead
    return true
  })

  const unreadCount = notificationsList.filter((n) => !n.isRead).length

  const handleMarkAsRead = (id: number) => {
    setNotificationsList((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
    )
  }

  const handleMarkAllAsRead = () => {
    setNotificationsList((prev) => prev.map((notif) => ({ ...notif, isRead: true })))
  }

  const handleDelete = (id: number) => {
    setNotificationsList((prev) => prev.filter((notif) => notif.id !== id))
  }

  const handleClearAll = () => {
    setNotificationsList([])
  }

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-700'
      case 'warning':
        return 'bg-yellow-100 text-yellow-700'
      case 'error':
        return 'bg-red-100 text-red-700'
      case 'info':
      default:
        return 'bg-blue-100 text-blue-700'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <Check className="w-5 h-5" />
      case 'warning':
        return <AlertCircle className="w-5 h-5" />
      case 'error':
        return <AlertCircle className="w-5 h-5" />
      case 'info':
      default:
        return <Bell className="w-5 h-5" />
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed right-4 top-20 w-96 max-h-[600px] bg-white rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            <h2 className="font-bold text-lg">Notificações</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filtros */}
        <div className="border-b border-gray-200 px-4 py-3 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas ({notificationsList.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'unread'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Não Lidas ({unreadCount})
          </button>
        </div>

        {/* Lista de Notificações */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    {/* Ícone */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getTypeStyles(
                        notification.type
                      )}`}
                    >
                      {getTypeIcon(notification.type)}
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-1 text-gray-500 text-xs mt-2">
                        <Clock className="w-3 h-3" />
                        {notification.timestamp}
                      </div>
                    </div>

                    {/* Botão Deletar */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(notification.id)
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <Bell className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-600">Nenhuma notificação</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {notificationsList.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 flex gap-2">
            <button
              onClick={handleMarkAllAsRead}
              className="flex-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Marcar tudo como lido
            </button>
            <button
              onClick={handleClearAll}
              className="flex-1 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Limpar tudo
            </button>
          </div>
        )}
      </div>
    </>
  )
}