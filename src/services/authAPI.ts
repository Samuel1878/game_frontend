
import api from './api'

export interface AuthPayload {
  username: string
  password: string
}
export interface AuthResponse {
  user: {
    id: number
    name: string
    email: string | null
    phone: string | null
    status: boolean
    role: string | null
    level: number
    created_at: string
    uid: string
  }
  token: string
} 
export const login = async (data: AuthPayload):Promise<AuthResponse> => {
  const res = await api.post('/api/v1/auth/login', data)
  return res.data // { token: string }
}

export const register = async (data: AuthPayload):Promise<AuthResponse> => {
  const res = await api.post('/api/v1/auth/register', data)
  console.log("register response", res)
  return res.data
}
