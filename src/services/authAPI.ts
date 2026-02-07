
import api from './api'

export interface AuthPayload {
  username: string
  password: string
}

export const login = async (data: AuthPayload) => {
  const res = await api.post('/api/v1/auth/login', data)
  return res.data // { token: string }
}

export const register = async (data: AuthPayload) => {
  const res = await api.post('/api/v1/auth/register', data)
  return res.data
}
