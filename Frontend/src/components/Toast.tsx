/**
 * Componente Toast
 * 
 * Responsável por:
 * - Exibir notificações de sucesso, erro, aviso
 * - Usar react-hot-toast para gerenciar toasts
 */

import toast from 'react-hot-toast'
import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react'

export const showToast = {
  /**
   * Mostrar notificação de sucesso
   */
  success: (message: string) => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4 flex items-center">
          <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
          <p className="text-sm font-medium text-gray-900">{message}</p>
        </div>
      </div>
    ))
  },

  /**
   * Mostrar notificação de erro
   */
  error: (message: string) => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4 flex items-center">
          <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
          <p className="text-sm font-medium text-gray-900">{message}</p>
        </div>
      </div>
    ))
  },

  /**
   * Mostrar notificação de aviso
   */
  warning: (message: string) => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4 flex items-center">
          <AlertTriangle className="w-6 h-6 text-yellow-500 mr-3" />
          <p className="text-sm font-medium text-gray-900">{message}</p>
        </div>
      </div>
    ))
  },

  /**
   * Mostrar notificação de informação
   */
  info: (message: string) => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4 flex items-center">
          <Info className="w-6 h-6 text-blue-500 mr-3" />
          <p className="text-sm font-medium text-gray-900">{message}</p>
        </div>
      </div>
    ))
  },
}