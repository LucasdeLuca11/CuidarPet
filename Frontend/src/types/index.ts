/**
 * Tipos e interfaces da aplicação CuidarPet
 */

// ============================================
// Enums
// ============================================

export enum UserRole {
  Tutor = 0,
  Veterinarian = 1,
  Admin = 2,
}

export enum AppointmentStatus {
  Scheduled = 'Scheduled',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

export enum CompanyType {
  Clinica = 1,
  PetShop = 2,
  ConsultorioVeterinario = 3,
  Grooming = 4,
  HospitalVeterinario = 5,
  CrechePet = 6
}

// ============================================
// Usuários
// ============================================

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: UserRole
  companyName?: string
  companyDocument?: string
  companyType?: CompanyType
  companyDescription?: string
}


// ============================================
// Pets
// ============================================

export interface Pet {
  id: string
  name: string
  species: string
  breed: string
  weight: number
  dateOfBirth: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CreatePetRequest {
  name: string
  species: string
  breed: string
  weight: number
  dateOfBirth: string
}

export interface UpdatePetRequest extends CreatePetRequest {}

// ============================================
// Clínicas
// ============================================

export interface Clinic {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  email: string
  rating?: number
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CreateClinicRequest {
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  email: string
}

export interface UpdateClinicRequest extends CreateClinicRequest {}

// ============================================
// Serviços
// ============================================

export interface Service {
  id: string
  name: string
  description?: string
  price: number
  duration: number
  clinicId: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateServiceRequest {
  name: string
  description?: string
  price: number
  duration: number
}

export interface UpdateServiceRequest extends CreateServiceRequest {}

// ============================================
// Agendamentos
// ============================================

export interface Appointment {
  id: string
  petId: string
  clinicId: string
  serviceId: string
  appointmentDate: string
  status: AppointmentStatus
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateAppointmentRequest {
  petId: string
  clinicId: string
  serviceId: string
  appointmentDate: string
  notes?: string
}

export interface UpdateAppointmentStatusRequest {
  status: AppointmentStatus
}

// ============================================
// Respostas de API
// ============================================

export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ============================================
// Contexto de Autenticação
// ============================================

import { AuthUser } from './AuthUser'
export interface AuthContextType {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  setToken: (token: string) => void
}
export * from './AuthUser'


// export type AuthUser = {
//   id: string
//   name: string
//   email: string
//   role: UserRole
// }