/**
 * Página de Dashboard
 * 
 * Responsável por:
 * - Exibir resumo do usuário
 * - Mostrar estatísticas
 * - Links rápidos para principais funcionalidades
 */

import { useAuth } from '@contexts/AuthContext'
import { useApi } from '@/hoks/useApi'
import { petService } from '@services/petService'
import { clinicService } from '@services/clinicService'
// import { appointmentService } from '@services/appointmentService'
import { Heart, Stethoscope, Calendar, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { UserRole } from '@/types'

export function DashboardPage() {
  const { user } = useAuth()
  const { data: pets } = useApi(() => petService.listPets(), true)
  const { data: clinics } = useApi(() => clinicService.listClinics(), true)

  const isTutor = user?.role === UserRole.Tutor
  const isVeterinarian = user?.role === UserRole.Veterinarian

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Bem-vindo, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          {isTutor && 'Gerencie seus pets e agendamentos'}
          {isVeterinarian && 'Gerencie sua clínica e serviços'}
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isTutor && (
          <>
            {/* Pets */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-primary-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Meus Pets</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {pets?.length || 0}
                  </p>
                </div>
                <Heart className="w-12 h-12 text-primary-500 opacity-20" />
              </div>
            </div>

            {/* Clínicas */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-secondary-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Clínicas Disponíveis</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {clinics?.length || 0}
                  </p>
                </div>
                <Stethoscope className="w-12 h-12 text-secondary-500 opacity-20" />
              </div>
            </div>

            {/* Agendamentos */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-accent-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Agendamentos</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
                </div>
                <Calendar className="w-12 h-12 text-accent-500 opacity-20" />
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg shadow p-6 border border-primary-200">
              <p className="text-gray-600 text-sm font-medium mb-4">Ações Rápidas</p>
              <div className="space-y-2">
                <Link
                  to="/pets"
                  className="block text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  → Meus Pets
                </Link>
                <Link
                  to="/clinics"
                  className="block text-secondary-600 hover:text-secondary-700 text-sm font-medium"
                >
                  → Encontrar Clínica
                </Link>
                <Link
                  to="/appointments"
                  className="block text-accent-600 hover:text-accent-700 text-sm font-medium"
                >
                  → Meus Agendamentos
                </Link>
              </div>
            </div>
          </>
        )}

        {isVeterinarian && (
          <>
            {/* Clínica */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-primary-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Minha Clínica</p>
                  <p className="text-lg font-bold text-gray-900 mt-2">
                    Clínica Veterinária
                  </p>
                </div>
                <Stethoscope className="w-12 h-12 text-primary-500 opacity-20" />
              </div>
            </div>

            {/* Serviços */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-secondary-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Serviços Oferecidos</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
                </div>
                <Heart className="w-12 h-12 text-secondary-500 opacity-20" />
              </div>
            </div>

            {/* Agendamentos */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-accent-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Agendamentos Hoje</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
                </div>
                <Calendar className="w-12 h-12 text-accent-500 opacity-20" />
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg shadow p-6 border border-primary-200">
              <p className="text-gray-600 text-sm font-medium mb-4">Ações Rápidas</p>
              <div className="space-y-2">
                <Link
                  to="/clinic"
                  className="block text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  → Minha Clínica
                </Link>
                <Link
                  to="/services"
                  className="block text-secondary-600 hover:text-secondary-700 text-sm font-medium"
                >
                  → Gerenciar Serviços
                </Link>
                <Link
                  to="/clinic-appointments"
                  className="block text-accent-600 hover:text-accent-700 text-sm font-medium"
                >
                  → Agendamentos
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Dicas */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 flex gap-4">
        <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-semibold text-blue-900 mb-2">Dica</h3>
          <p className="text-blue-800 text-sm">
            {isTutor
              ? 'Comece criando um perfil para seu pet para poder agendar serviços nas clínicas.'
              : 'Configure sua clínica e adicione os serviços que oferece para começar a receber agendamentos.'}
          </p>
        </div>
      </div>
    </div>
  )
}