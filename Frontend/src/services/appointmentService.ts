/**
 * Serviço de Agendamentos
 * 
 * Responsável por:
 * - Obter detalhes de um agendamento
 * - Criar novo agendamento
 * - Atualizar status do agendamento
 * - Deletar agendamento
 */

import api from './api'
import { Appointment, CreateAppointmentRequest, UpdateAppointmentStatusRequest } from '@/types'

export const appointmentService = {
  /**
   * Obter detalhes de um agendamento específico
   * @param appointmentId ID do agendamento
   * @returns Dados do agendamento
   */
  getAppointmentById: async (appointmentId: string): Promise<Appointment> => {
    const response = await api.get<Appointment>(`/appointments/${appointmentId}`)
    return response.data
  },

  /**
   * Criar novo agendamento
   * @param data Dados do novo agendamento
   * @returns Agendamento criado
   */
  createAppointment: async (data: CreateAppointmentRequest): Promise<Appointment> => {
    const response = await api.post<Appointment>('/appointments', data)
    return response.data
  },

  /**
   * Atualizar status do agendamento
   * @param appointmentId ID do agendamento
   * @param data Novo status
   * @returns Agendamento atualizado
   */
  updateAppointmentStatus: async (
    appointmentId: string,
    data: UpdateAppointmentStatusRequest
  ): Promise<Appointment> => {
    const response = await api.put<Appointment>(
      `/appointments/${appointmentId}/status`,
      data
    )
    return response.data
  },

  /**
   * Deletar agendamento
   * @param appointmentId ID do agendamento
   */
  deleteAppointment: async (appointmentId: string): Promise<void> => {
    await api.delete(`/appointments/${appointmentId}`)
  },
}