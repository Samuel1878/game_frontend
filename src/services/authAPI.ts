import type { BankAccountPros } from "@/utils/types";
import { refreshAuthSession } from "./api";
import { getCurrentPlayer } from "./userAPI";
import {
  createUserPaymentMethod,
  deactivateUserPaymentMethod,
  listUserPaymentMethods,
  toBankAccount,
  updateUserPaymentMethod,
} from "./paymentMethodsAPI";
import { changePasswordApi } from "./securityAPI";

export interface AuthPayload {
  username: string;
  password: string;
  referral_code?: string | null;
}
export interface ProfileResponse {
  id: number | string;
  name: string;
  email: string | null;
  phone: string | null;
  status: boolean | string;
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
  return refreshAuthSession();
};
export const getProfile = async (): Promise<ProfileResponse | null> => {
  try {
    const res = await getCurrentPlayer();
    const player = res.player;
    return {
      id: player.userId,
      name: player.username,
      email: null,
      phone: player.phone,
      status: player.status,
      role: player.role,
      level: res.level?.level ?? player.level ?? 0,
      created_at: "",
      uid: player.userId,
    };
  } catch (error) {
    return null;
  }
};
export const addBankAccountAPI = async (data: BankAccountPros) => {
  try {
    return toBankAccount(await createUserPaymentMethod(data));
  } catch (error) {
    return null;
  }
};
export const updateBankAccountAPI = async (
  id: number | string,
  data: BankAccountPros,
) => {
  try {
    return toBankAccount(await updateUserPaymentMethod(String(id), data));
  } catch (error) {
    return null;
  }
};
export const deleteBankAccountAPI = async (id: number | string) => {
  try {
    return toBankAccount(await deactivateUserPaymentMethod(String(id)));
  } catch (error) {
    return null;
  }
};

export const getUserBankAccountAPI = async () => {
  try {
    return (await listUserPaymentMethods()).map(toBankAccount);
  } catch (error) {
    return [];
  }
};

// api/auth.ts

export const requestOTP = async (phone: string) => {
  void phone;
  return null;
};

export const verifyOTP = async (phone: string, code: string) => {
  void phone;
  void code;
  return null;
};

export const resetPassword = (phone: string, newPassword: string) =>
  {
    void newPassword;
    return Promise.reject(
      new Error(
        `Password reset is not exposed by game_new_backend for phone ${phone}.`,
      ),
    );
  };

export const changePassword = async (data: any) => {
  return changePasswordApi(data);
};

export const bindPhone = (phone: string) =>
  Promise.reject(
    new Error(`Phone binding is not exposed by game_new_backend for ${phone}.`),
  );
