/**
 * Página: Detalhes do Pet
 * 
 * Responsável por:
 * - Exibir informações completas do pet
 * - Mostrar histórico de agendamentos
 * - Permitir editar e agendar serviços
 * - Navegação intuitiva
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit2, Calendar, Trash2, Loader } from 'lucide-react'
import toast from 'react-hot-toast'

import { petService } from '@services/petService'
import { appointmentService } from '@services/appointmentService'

import { AppointmentView , AppointmentStatus } from '@/types'



interface Pet {
  id: string
  name: string
  species: string
  breed: string
  weight: number
  dateOfBirth: string
  // color: string
  userId: string
  createdAt: string
  updatedAt: string
}

// interface Appointment {
//   id: string
//   petId: string
//   clinicId: string
//   serviceId: string
//   appointmentDate: string
//   status: AppointmentStatus // 0 = Scheduled, 1 = Completed, 2 = Cancelled
//   createdAt: string
//   updatedAt: string
//   // Dados relacionados (do backend)
//   serviceName?: string
//   clinicName?: string
//   servicePrice?: number
// }

export function PetDetailsPage() {
  const { petId } = useParams<{ petId: string }>()
  const navigate = useNavigate()
  const [pet, setPet] = useState<Pet | null>(null)
  const [appointments, setAppointments] = useState<AppointmentView[]>([])
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  /**
   * Carrega dados do pet e agendamentos
   */
  useEffect(() => {
    loadPetDetails()
  }, [petId])

  /**
   * Busca informações do pet no backend
   */
  const loadPetDetails = async () => {
    try {
      setLoading(true)
      
      if (!petId) {
        toast.error('ID do pet inválido')
        navigate('/pets')
        return
      }

      // Buscar dados do pet
      const petData = await petService.getPetById((petId))
      setPet(petData)

      // Buscar agendamentos do pet
      // ✅ Agora funciona perfeitamente
      const appointmentsData = await appointmentService.getAppointmentsByPet((petId))
      setAppointments(appointmentsData) // ✅ Appointment[] = Appointment[]

    } catch (error) {
      console.error('Erro ao carregar detalhes do pet:', error)
      toast.error('Erro ao carregar detalhes do pet')
      navigate('/pets')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Calcula idade do pet em anos
   */
  const calculateAge = (dateOfBirth: string): number => {
    const birthDate = new Date(dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  /**
   * Retorna cor do badge baseado no status
   */
  const getStatusColor = (status: AppointmentStatus): string => {
    switch (status) {
      case 'Scheduled': // Scheduled
        return 'bg-blue-100 text-blue-800'
      case 'Completed': // Completed
        return 'bg-green-100 text-green-800'
      case 'Cancelled': // Cancelled
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  /**
   * Retorna texto do status
   */
  const getStatusText = (status: AppointmentStatus): string => {
    switch (status) {
      case 'Scheduled':
        return 'Agendado'
      case 'Completed':
        return 'Concluído'
      case 'Cancelled':
        return 'Cancelado'
      default:
        return 'Desconhecido'
    }
  }

  /**
   * Trata deleção do pet
   */
  const handleDeletePet = async () => {
    try {
      if (!pet) return

      await petService.deletePet(pet.id)
      toast.success('Pet deletado com sucesso')
      navigate('/pets')
    } catch (error) {
      console.error('Erro ao deletar pet:', error)
      toast.error('Erro ao deletar pet')
    } finally {
      setShowDeleteModal(false)
    }
  }

  /**
   * Formata data para exibição
   */
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando detalhes do pet...</p>
        </div>
      </div>
    )
  }

  if (!pet) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-800">Pet não encontrado</p>
          <button
            onClick={() => navigate('/pets')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Voltar para Pets
          </button>
        </div>
      </div>
    )
  }

  const age = calculateAge(pet.dateOfBirth)

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/pets')}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
        >
          <ArrowLeft size={20} />
          Voltar para Pets
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/pets/${pet.id}/edit`)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
          >
            <Edit2 size={18} />
            Editar
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            <Trash2 size={18} />
            Deletar
          </button>
        </div>
      </div>

      {/* Informações do Pet */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{pet.name}</h1>
            <p className="text-lg text-gray-600">
              {pet.species} • {pet.breed}
            </p>
          </div>
          {/* <div className="text-right">
            <p className="text-sm text-gray-600">Cor</p>
            <p className="text-lg font-semibold text-gray-900">{pet.color}</p>
          </div> */}
        </div>

        {/* Grid de Informações */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 pb-8 border-b border-gray-200">
          <div>
            <p className="text-sm text-gray-600 mb-1">Peso</p>
            <p className="text-2xl font-bold text-gray-900">{pet.weight} kg</p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Idade</p>
            <p className="text-2xl font-bold text-gray-900">{age} anos</p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Data de Nascimento</p>
            <p className="text-lg font-semibold text-gray-900">
              {new Date(pet.dateOfBirth).toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Cadastrado em</p>
            <p className="text-lg font-semibold text-gray-900">
              {new Date(pet.createdAt).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        {/* Botão de Ação */}
        <button
          onClick={() => navigate('/clinics')}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold w-full md:w-auto justify-center"
        >
          <Calendar size={20} />
          Agendar Serviço
        </button>
      </div>

      {/* Histórico de Agendamentos */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Histórico de Agendamentos</h2>

        {appointments.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">Nenhum agendamento encontrado</p>
            <button
              onClick={() => navigate('/clinics')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
            >
              Agendar Agora
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map(apt => (
              <div
                key={apt.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">
                      {apt.serviceName || 'Serviço'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {apt.clinicName || 'Clínica'}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      apt.status
                    )}`}
                  >
                    {getStatusText(apt.status)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    {formatDate(apt.appointmentDate)}
                  </p>
                  {apt.servicePrice && (
                    <p className="font-semibold text-gray-900">
                      R$ {apt.servicePrice.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Confirmação de Deleção */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Deletar Pet?</h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja deletar {pet.name}? Esta ação não pode ser desfeita.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
              >
                Cancelar
              </button>

              <button
                onClick={handleDeletePet}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}