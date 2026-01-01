/**
 * Serviço de Pets
 * 
 * Responsável por:
 * - Listar todos os pets do usuário
 * - Obter detalhes de um pet
 * - Criar novo pet
 * - Atualizar pet
 * - Deletar pet
 */

import api from './api'
import { Pet, CreatePetRequest, UpdatePetRequest } from '@/types'

export const petService = {
  /**
   * Listar todos os pets do usuário autenticado
   * @returns Lista de pets
   */
  listPets: async (): Promise<Pet[]> => {
    const response = await api.get<Pet[]>('/pets')
    return response.data
  },

  /**
   * Obter detalhes de um pet específico
   * @param petId ID do pet
   * @returns Dados do pet
   */
  getPetById: async (petId: string): Promise<Pet> => {
    const response = await api.get<Pet>(`/pets/${petId}`)
    return response.data
  },

  /**
   * Criar novo pet
   * @param data Dados do novo pet
   * @returns Pet criado
   */
  createPet: async (data: CreatePetRequest): Promise<Pet> => {
    const response = await api.post<Pet>('/pets', data)
    return response.data
  },

  /**
   * Atualizar pet existente
   * @param petId ID do pet
   * @param data Dados atualizados
   * @returns Pet atualizado
   */
  updatePet: async (petId: string, data: UpdatePetRequest): Promise<Pet> => {
    const response = await api.put<Pet>(`/pets/${petId}`, data)
    return response.data
  },

  /**
   * Deletar pet
   * @param petId ID do pet
   */
  deletePet: async (petId: string): Promise<void> => {
    await api.delete(`/pets/${petId}`)
  },
}