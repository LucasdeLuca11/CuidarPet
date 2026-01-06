/**
 * Página: Meus Pets
 * 
 * Responsável por:
 * - Listar todos os pets do tutor
 * - Buscar e filtrar pets
 * - Acessar detalhes de um pet
 * - Criar novo pet
 * - Editar/deletar pet
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Trash2, Edit, Heart, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { petService } from '@services/petService'
// import { useAuth } from '@contexts/AuthContext'
import type { Pet } from '@/types'

export function MyPetsPage() {
  const navigate = useNavigate()
//   const { user } = useAuth()
  
  // Estados
  const [pets, setPets] = useState<Pet[]>([])
  const [filteredPets, setFilteredPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSpecies, setFilterSpecies] = useState('all')
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Carregar pets ao montar componente
  useEffect(() => {
    loadPets()
  }, [])

  // Filtrar pets quando search ou filtro mudam
  useEffect(() => {
    let filtered = pets

    // Filtrar por espécie
    if (filterSpecies !== 'all') {
      filtered = filtered.filter(pet => pet.species.toLowerCase() === filterSpecies.toLowerCase())
    }

    // Filtrar por busca
    if (searchTerm) {
      filtered = filtered.filter(pet =>
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.breed.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredPets(filtered)
  }, [pets, searchTerm, filterSpecies])

  /**
   * Carrega lista de pets do backend
   */
  const loadPets = async () => {
    try {
      setLoading(true)
      const data = await petService.listPets()
      setPets(data)
    } catch (error) {
      toast.error('Erro ao carregar pets')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Deleta um pet após confirmação
   */
  const handleDeletePet = async () => {
    if (!selectedPet) return

    try {
      await petService.deletePet(selectedPet.id)
      toast.success('Pet deletado com sucesso')
      setPets(pets.filter(p => p.id !== selectedPet.id))
      setShowDeleteConfirm(false)
      setSelectedPet(null)
    } catch (error) {
      toast.error('Erro ao deletar pet')
      console.error(error)
    }
  }

  /**
   * Navega para página de edição
   */
  const handleEditPet = (pet: Pet) => {
    navigate(`/pets/${pet.id}/edit`, { state: { pet } })
  }

  /**
   * Navega para detalhes do pet
   */
  const handleViewPet = (pet: Pet) => {
    navigate(`/pets/${pet.id}`, { state: { pet } })
  }

  // Espécies disponíveis
  const species = ['Cão', 'Gato', 'Coelho', 'Pássaro', 'Hamster', 'Outro']

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Meus Pets</h1>
            <p className="text-gray-600 mt-2">Gerencie seus animais de estimação</p>
          </div>
          <button
            onClick={() => navigate('/pets/create')}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-lg"
          >
            <Plus size={20} />
            Novo Pet
          </button>
        </div>

        {/* Filtros e Busca */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Busca */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por nome ou raça..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Filtro por Espécie */}
            <select
              value={filterSpecies}
              onChange={(e) => setFilterSpecies(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Todas as espécies</option>
              {species.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* Sem Pets */}
        {!loading && filteredPets.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Heart size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {pets.length === 0 ? 'Nenhum pet cadastrado' : 'Nenhum pet encontrado'}
            </h3>
            <p className="text-gray-600 mb-6">
              {pets.length === 0
                ? 'Comece adicionando seu primeiro pet!'
                : 'Tente ajustar seus filtros de busca'}
            </p>
            {pets.length === 0 && (
              <button
                onClick={() => navigate('/pets/create')}
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
              >
                <Plus size={20} />
                Criar Primeiro Pet
              </button>
            )}
          </div>
        )}

        {/* Grid de Pets */}
        {!loading && filteredPets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPets.map(pet => (
              <div
                key={pet.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleViewPet(pet)}
              >
                {/* Imagem */}
                <div className="h-48 bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center">
                  <Heart size={64} className="text-white opacity-30" />
                </div>

                {/* Conteúdo */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{pet.name}</h3>
                  
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <p><strong>Espécie:</strong> {pet.species}</p>
                    <p><strong>Raça:</strong> {pet.breed}</p>
                    <p><strong>Peso:</strong> {pet.weight} kg</p>
                    <p><strong>Data de Nascimento:</strong> {new Date(pet.dateOfBirth).toLocaleDateString('pt-BR')}</p>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditPet(pet)
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
                    >
                      <Edit size={16} />
                      Editar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedPet(pet)
                        setShowDeleteConfirm(true)
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold"
                    >
                      <Trash2 size={16} />
                      Deletar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de Confirmação de Deleção */}
        {showDeleteConfirm && selectedPet && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full mx-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-red-100 rounded-full p-3">
                  <AlertCircle className="text-red-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Deletar Pet?</h3>
              </div>

              <p className="text-gray-600 mb-6">
                Tem certeza que deseja deletar <strong>{selectedPet.name}</strong>? Esta ação não pode ser desfeita.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
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
    </div>
  )
}