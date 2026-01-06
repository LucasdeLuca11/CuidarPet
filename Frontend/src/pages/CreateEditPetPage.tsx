/**
 * Página: Criar/Editar Pet
 * 
 * Responsável por:
 * - Formulário para criar novo pet
 * - Formulário para editar pet existente
 * - Validação de dados
 * - Envio para backend
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Save, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { petService } from '@services/petService'
import type { Pet } from '@/types'

interface FormData {
  name: string
  species: string
  breed: string
  weight: number | ''
  dateOfBirth: string
//   color: string
}

interface FormErrors {
  [key: string]: string
}

export function CreateEditPetPage() {
  const { petId } = useParams<{ petId: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  // Estados
  const [formData, setFormData] = useState<FormData>({
    name: '',
    species: 'Cão',
    breed: '',
    weight: '',
    dateOfBirth: ''
    // color: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Carregar dados ao montar
  useEffect(() => {
    if (petId && location.state?.pet) {
      const pet = location.state.pet as Pet
      setFormData({
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        weight: pet.weight,
        dateOfBirth: pet.dateOfBirth.split('T')[0], // Formatar para YYYY-MM-DD
        // color: pet.color || ''
      })
      setIsEditing(true)
    }
  }, [petId, location.state])

  /**
   * Valida formulário
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }

    if (!formData.species) {
      newErrors.species = 'Espécie é obrigatória'
    }

    if (!formData.breed.trim()) {
      newErrors.breed = 'Raça é obrigatória'
    }

    if (!formData.weight || formData.weight <= 0) {
      newErrors.weight = 'Peso deve ser maior que 0'
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Data de nascimento é obrigatória'
    }

    // Validar data de nascimento
    const birthDate = new Date(formData.dateOfBirth)
    if (birthDate > new Date()) {
      newErrors.dateOfBirth = 'Data de nascimento não pode ser no futuro'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Trata mudanças no formulário
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'weight' ? (value ? parseFloat(value) : '') : value
    }))
    // Limpar erro do campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  /**
   * Trata envio do formulário
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Por favor, corrija os erros do formulário')
      return
    }

    try {
      setLoading(true)

      if (isEditing && petId) {
        // Editar pet existente
        await petService.updatePet((petId), {
          name: formData.name,
          species: formData.species,
          breed: formData.breed,
          weight: formData.weight as number,
          dateOfBirth: formData.dateOfBirth
        //   color: formData.color
        })
        toast.success('Pet atualizado com sucesso!')
        navigate(`/pets/${petId}`)
      } else {
        // Criar novo pet
        const newPet = await petService.createPet({
          name: formData.name,
          species: formData.species,
          breed: formData.breed,
          weight: formData.weight as number,
          dateOfBirth: formData.dateOfBirth
        //   color: formData.color
        })
        toast.success('Pet criado com sucesso!')
        navigate(`/pets/${newPet.id}`)
      }
    } catch (error) {
      toast.error(isEditing ? 'Erro ao atualizar pet' : 'Erro ao criar pet')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const species = ['Cão', 'Gato', 'Coelho', 'Pássaro', 'Hamster', 'Outro']

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Botão Voltar */}
        <button
          onClick={() => navigate('/pets')}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-8 font-semibold"
        >
          <ArrowLeft size={20} />
          Voltar
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            {isEditing ? 'Editar Pet' : 'Criar Novo Pet'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditing ? 'Atualize as informações do seu pet' : 'Adicione um novo pet à sua família'}
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
          {/* Nome */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nome do Pet *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Rex, Miau, etc"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.name
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-indigo-500'
              }`}
            />
            {errors.name && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                <AlertCircle size={16} />
                {errors.name}
              </div>
            )}
          </div>

          {/* Espécie */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Espécie *
            </label>
            <select
              name="species"
              value={formData.species}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.species
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-indigo-500'
              }`}
            >
              {species.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.species && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                <AlertCircle size={16} />
                {errors.species}
              </div>
            )}
          </div>

          {/* Raça */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Raça *
            </label>
            <input
              type="text"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              placeholder="Ex: Labrador, Persa, etc"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.breed
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-indigo-500'
              }`}
            />
            {errors.breed && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                <AlertCircle size={16} />
                {errors.breed}
              </div>
            )}
          </div>

          {/* Peso */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Peso (kg) *
            </label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="Ex: 25.5"
              step="0.1"
              min="0"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.weight
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-indigo-500'
              }`}
            />
            {errors.weight && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                <AlertCircle size={16} />
                {errors.weight}
              </div>
            )}
          </div>

          {/* Data de Nascimento */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Data de Nascimento *
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.dateOfBirth
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-indigo-500'
              }`}
            />
            {errors.dateOfBirth && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                <AlertCircle size={16} />
                {errors.dateOfBirth}
              </div>
            )}
          </div>

          {/* Cor/Marcas */}
          {/* <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cor/Marcas Distintivas
            </label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="Ex: Preto e branco, com mancha no olho"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div> */}

          {/* Botões */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/pets')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}