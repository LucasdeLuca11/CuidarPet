/**
 * Serviço de Serviços (Services)
 * 
 * Responsável por:
 * - Listar serviços de uma clínica
 * - Obter detalhes de um serviço
 * - Criar novo serviço (apenas veterinário)
 * - Atualizar serviço
 * - Deletar serviço
 */

import api from './api'
import { Service, CreateServiceRequest, UpdateServiceRequest } from '@/types'

export const serviceService = {
  /**
   * Listar serviços de uma clínica específica
   * @param clinicId ID da clínica
   * @returns Lista de serviços
   */
  listServicesByClinic: async (clinicId: string): Promise<Service[]> => {
    const response = await api.get<Service[]>(`/services/clinic/${clinicId}`)
    return response.data
  },

  /**
   * Obter detalhes de um serviço específico
   * @param serviceId ID do serviço
   * @returns Dados do serviço
   */
  getServiceById: async (serviceId: string): Promise<Service> => {
    const response = await api.get<Service>(`/services/${serviceId}`)
    return response.data
  },

  /**
   * Criar novo serviço em uma clínica (apenas veterinário)
   * @param clinicId ID da clínica
   * @param data Dados do novo serviço
   * @returns Serviço criado
   */
  createService: async (clinicId: string, data: CreateServiceRequest): Promise<Service> => {
    const response = await api.post<Service>(`/services/clinic/${clinicId}`, data)
    return response.data
  },

  /**
   * Atualizar serviço existente
   * @param serviceId ID do serviço
   * @param data Dados atualizados
   * @returns Serviço atualizado
   */
  updateService: async (serviceId: string, data: UpdateServiceRequest): Promise<Service> => {
    const response = await api.put<Service>(`/services/${serviceId}`, data)
    return response.data
  },

  /**
   * Deletar serviço
   * @param serviceId ID do serviço
   */
  deleteService: async (serviceId: string): Promise<void> => {
    await api.delete(`/services/${serviceId}`)
  },
}