/**
 * Página: Buscar Clínicas
 * 
 * Responsável por:
 * - Listar todas as clínicas disponíveis
 * - Buscar clínicas por nome
 * - Filtrar por cidade/estado
 * - Visualizar detalhes da clínica
 * - Agendar serviços
 * 
 * Regra de Negócio:
 * - Apenas Tutores podem acessar
 * - Veem clínicas onde têm agendamentos + todas as clínicas ativas
 * - Podem visualizar serviços de cada clínica
 * - Podem agendar serviços
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Phone, Mail, Star, Loader, AlertCircle } from 'lucide-react'
import { clinicService } from '@services/clinicService'
import toast from 'react-hot-toast'
import type { Clinic } from '@/types'

export function SearchClinicsPage() {
  const navigate = useNavigate()
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [filteredClinics, setFilteredClinics] = useState<Clinic[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedState, setSelectedState] = useState('')

  const [cities, setCities] = useState<string[]>([])
  const [states, setStates] = useState<string[]>([])

  useEffect(() => {
    loadClinics()
  }, [])

  useEffect(() => {
    filterClinics()
  }, [clinics, searchTerm, selectedCity, selectedState])

  const loadClinics = async () => {
    try {
      setLoading(true)
      const data = await clinicService.getAvailableClinics()
      setClinics(data)

      const uniqueCities = [...new Set(data.map(c => c.city))]
      const uniqueStates = [...new Set(data.map(c => c.state))]

      setCities(uniqueCities.sort())
      setStates(uniqueStates.sort())
    } catch (error) {
      console.error('Erro ao carregar clínicas:', error)
      toast.error('Erro ao carregar clínicas')
    } finally {
      setLoading(false)
    }
  }

  const filterClinics = () => {
    let filtered = clinics

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        c =>
          c.name.toLowerCase().includes(term) ||
          c.city.toLowerCase().includes(term)
      )
    }

    if (selectedCity) {
      filtered = filtered.filter(c => c.city === selectedCity)
    }

    if (selectedState) {
      filtered = filtered.filter(c => c.state === selectedState)
    }

    setFilteredClinics(filtered)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando clínicas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Buscar Clínicas</h1>
        <p className="text-gray-600">
          Encontre clínicas veterinárias e agende serviços para seus pets
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nome ou cidade..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={selectedState}
            onChange={e => setSelectedState(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
          >
            <option value="">Todos os Estados</option>
            {states.map(state => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>

          <select
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
            disabled={!selectedState}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
          >
            <option value="">Todas as Cidades</option>
            {cities
              .filter(city =>
                clinics.some(c => c.city === city && c.state === selectedState)
              )
              .map(city => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
          </select>
        </div>
      </div>

      {filteredClinics.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">
            Nenhuma clínica encontrada
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClinics.map(clinic => (
            <div
              key={clinic.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/clinics/${clinic.id}`)}
            >
              <div className="bg-indigo-600 p-4 text-white">
                <h3 className="text-xl font-bold">{clinic.name}</h3>
              </div>

              <div className="p-4">
                <div className="mb-4">
                  {renderStars(clinic.rating ?? 0)}
                </div>

                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <MapPin size={16} />
                    <span>{clinic.address}, {clinic.city} - {clinic.state}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone size={16} />
                    <span>{clinic.phone}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    <span>{clinic.email}</span>
                  </div>
                </div>

                <button
                  onClick={e => {
                    e.stopPropagation()
                    navigate(`/clinics/${clinic.id}`)
                  }}
                  className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
                >
                  Ver Detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
