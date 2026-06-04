import type { BankAccountPros } from "@/utils/types";
import api from "./api";

export interface AuthPayload {
  username: string;
  password: string;
  referral_code?: string | null;
}
export interface ProfileResponse {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  status: boolean;
  role: string | null;
  level: number;
  created_at: string;
  uid: string;
}
export interface AuthResponse {
  success?: number;
  message: string;
  accessToken?: string;
}

// export const login = async (data: AuthPayload):Promise<AuthResponse> => {
//   const res = await api.post('/auth/login', data)
//   return res.data
// }

// export const register = async (data: AuthPayload):Promise<AuthResponse> => {
//   const res = await api.post('/auth/register', data)
//   console.log("register response", res)
//   return res.data
// }
export const refreshAPI = async (): Promise<null | any> => {
  try {
    const res = await api.post("/auth/refresh");
    return res.data;
  } catch (error) {
    return null;
  }
};
export const getProfile = async (): Promise<ProfileResponse | null> => {
  try {
    const res = await api.get("/user/profile", { withCredentials: true });
    if (res.status === 200) return res.data;
    return null;
  } catch (error) {
    return null;
  }
};
export const addBankAccountAPI = async (data: BankAccountPros) => {
  try {
    const res = await api.post("/user/add_bank_account", data);
    if (res.status === 200) return res.data;
    return null;
  } catch (error) {
    return null;
  }
};
export const updateBankAccountAPI = async (
  id: number,
  data: BankAccountPros,
) => {
  try {
    const res = await api.put(`/user/update_bank_account/${id}`, data);
    if (res.status === 200) return res.data;
    return null;
  } catch (error) {
    return null;
  }
};
export const deleteBankAccountAPI = async (id: number) => {
  try {
    const res = await api.delete(`/user/delete_bank_account/${id}`);
    if (res.status === 200) return res.data;
    return null;
  } catch (error) {
    return null;
  }
};

export const getUserBankAccountAPI = async () => {
  try {
    const response = await api.get("/user/get_bank_accounts");
    if (response.status === 200) return response.data;
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// api/auth.ts

export const requestOTP = async (phone: string) => {
  try {
    const response = await api.post("/user/otp/request", { phone });
    return response.data;
  } catch (error) {
    console.log(error);
    return true;
  }
};

export const verifyOTP = async (phone: string, code: string) => {
  try {
    const response = await api.post("/user/otp/verify", { phone, code });
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const resetPassword = (phone: string, newPassword: string) =>
  api.post("/auth/password/reset", { phone, newPassword });

export const changePassword = async (data: any) => {
  try {
    const response = await api.post("/user/password/change", data);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const bindPhone = (phone: string) =>
  api.post("/user/phone/bind", { phone });
