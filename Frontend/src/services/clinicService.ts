/**
 * Serviço de Clínicas
 * 
 * Responsável por:
 * - Listar todas as clínicas
 * - Obter detalhes de uma clínica
 * - Criar nova clínica (apenas veterinário)
 * - Atualizar clínica
 * - Deletar clínica
 */

import api from './api'
import { Clinic, CreateClinicRequest, UpdateClinicRequest } from '@/types'

export const clinicService = {
  /**
   * Listar todas as clínicas
   * @returns Lista de clínicas
   */
  listClinics: async (): Promise<Clinic[]> => {
    const response = await api.get<Clinic[]>('/clinics')
    return response.data
  },

  /**
   * Obter detalhes de uma clínica específica
   * @param clinicId ID da clínica
   * @returns Dados da clínica
   */
  getClinicById: async (clinicId: string): Promise<Clinic> => {
    const response = await api.get<Clinic>(`/clinics/${clinicId}`)
    return response.data
  },

  /**
   * Criar nova clínica (apenas veterinário)
   * @param data Dados da nova clínica
   * @returns Clínica criada
   */
  createClinic: async (data: CreateClinicRequest): Promise<Clinic> => {
    const response = await api.post<Clinic>('/clinics', data)
    return response.data
  },

  /**
   * Atualizar clínica existente
   * @param clinicId ID da clínica
   * @param data Dados atualizados
   * @returns Clínica atualizada
   */
  updateClinic: async (clinicId: string, data: UpdateClinicRequest): Promise<Clinic> => {
    const response = await api.put<Clinic>(`/clinics/${clinicId}`, data)
    return response.data
  },

  /**
   * Deletar clínica
   * @param clinicId ID da clínica
   */
  deleteClinic: async (clinicId: string): Promise<void> => {
    await api.delete(`/clinics/${clinicId}`)
  },
}