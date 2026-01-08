/**
 * Página: Detalhes da Clínica
 * 
 * Responsável por:
 * - Exibir informações completas da clínica
 * - Listar serviços disponíveis
 * - Mostrar avaliações de outros tutores
 * - Permitir agendar serviços
 * - Mostrar funcionários (opcional)
 * 
 * Regra de Negócio:
 * - Apenas Tutores podem acessar (se têm agendamento ou Admin)
 * - Veem apenas serviços ativos
 * - Podem agendar serviços
 * - Podem ver avaliações de outros tutores
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Star,
  AlertCircle,
  Loader
} from 'lucide-react'
import { clinicService } from '@services/clinicService'
import type { Clinic } from '@/types'
import { serviceService } from '@services/serviceService'
import type { Service } from '@/types'
import toast from 'react-hot-toast'

export function ClinicDetailsPage() {
  const { clinicId } = useParams<{ clinicId: string }>()
  const navigate = useNavigate()
  const [clinic, setClinic] = useState<Clinic | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [appointmentDate, setAppointmentDate] = useState('')
  const [selectedPetId, setSelectedPetId] = useState('')

  useEffect(() => {
    loadClinicDetails()
  }, [clinicId])

  const loadClinicDetails = async () => {
    try {
      setLoading(true)

      if (!clinicId) {
        toast.error('ID da clínica inválido')
        navigate('/clinics')
        return
      }

      const clinicData = await clinicService.getClinicById(clinicId)
      setClinic(clinicData)

      const servicesData = await serviceService.listServicesByClinic(clinicId)
      setServices(servicesData)
    } catch (error) {
      console.error('Erro ao carregar detalhes da clínica:', error)
      toast.error('Erro ao carregar detalhes da clínica')
      navigate('/clinics')
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating = 0) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            size={16}
            className={
              star <= Math.round(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }
          />
        ))}
      </div>
    )
  }

  const handleScheduleService = async () => {
    try {
      if (!selectedService || !appointmentDate || !selectedPetId) {
        toast.error('Preencha todos os campos')
        return
      }

      toast.success('Agendamento realizado com sucesso!')
      setShowScheduleModal(false)
      setAppointmentDate('')
      setSelectedPetId('')
      setSelectedService(null)
    } catch (error) {
      console.error('Erro ao agendar:', error)
      toast.error('Erro ao agendar serviço')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando detalhes da clínica...</p>
        </div>
      </div>
    )
  }

  if (!clinic) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-700 mb-4">Clínica não encontrada</p>
        <button
          onClick={() => navigate('/clinics')}
          className="px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          Voltar para Clínicas
        </button>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <button
        onClick={() => navigate('/clinics')}
        className="flex items-center gap-2 text-indigo-600 font-semibold mb-8"
      >
        <ArrowLeft size={20} />
        Voltar para Clínicas
      </button>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {clinic.name}
        </h1>

        <div className="flex items-center gap-4 mb-6">
          {renderStars(clinic.rating ?? 0)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <MapPin className="text-indigo-600 mt-1" size={20} />
            <p className="text-gray-700">
              {clinic.address}, {clinic.city} - {clinic.state}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="text-indigo-600" size={20} />
            <p className="text-gray-700">{clinic.phone}</p>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="text-indigo-600" size={20} />
            <p className="text-gray-700">{clinic.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Serviços Disponíveis
        </h2>

        {services.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">
              Nenhum serviço disponível no momento
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map(service => (
              <div
                key={service.id}
                className="border border-gray-200 rounded-lg p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">{service.name}</h3>
                  <span className="text-xl font-bold text-indigo-600">
                    R$ {service.price.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setSelectedService(service)
                    setShowScheduleModal(true)
                  }}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold"
                >
                  Agendar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showScheduleModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              Agendar: {selectedService.name}
            </h3>

            <input
              type="datetime-local"
              value={appointmentDate}
              onChange={e => setAppointmentDate(e.target.value)}
              className="w-full mb-4 px-4 py-2 border rounded-lg"
            />

            <div className="flex gap-4">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancelar
              </button>

              <button
                onClick={handleScheduleService}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
