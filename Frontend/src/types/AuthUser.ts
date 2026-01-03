import { UserRole } from '@/types'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
}
