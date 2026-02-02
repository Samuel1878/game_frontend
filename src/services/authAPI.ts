
import api from './api'

export interface AuthPayload {
  username: string
  password: string
}

export const login = async (data: AuthPayload) => {
  const res = await api.post('/auth/login', data)
  return res.data // { token: string }
}

export const register = async (data: AuthPayload) => {
  const res = await api.post('/auth/register', data)
  return res.data
}
