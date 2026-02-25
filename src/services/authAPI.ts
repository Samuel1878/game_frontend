
import api from './api'

export interface AuthPayload {
  username: string
  password: string
}
export interface AuthResponse {
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
export const login = async (data: AuthPayload):Promise<AuthResponse> => {
  const res = await api.post('/auth/login', data)
  return res.data 
}

export const register = async (data: AuthPayload):Promise<AuthResponse> => {
  const res = await api.post('/auth/register', data)
  console.log("register response", res)
  return res.data
}

export const getProfile = async ():Promise<AuthResponse | null >=> {
  try {
    const res = await api.get("/user/profile", { withCredentials: true });
    if (res.status === 200) return res.data;
    return null
  } catch (error) {
    return null;
  }
}