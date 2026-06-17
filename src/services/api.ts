import axios, {
  type AxiosRequestConfig,
  AxiosHeaders,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { ACCESS_TOKEN_STORAGE_KEY, API_BASE_URL } from "@/config/env";
import router from "@/router";
import { useAuthStore } from "@/stores/auth";

type AuthUserResponse = {
  id: string;
  username: string;
  phone: string;
  fullName?: string | null;
  role: string;
  status: string;
  referralCode?: string;
  level?: number;
  set_pin?: boolean | null;
  has_fund_pin?: boolean | null;
  hasFundPin?: boolean | null;
};

export type AuthSessionResponse = {
  accessToken: string;
  expiresIn?: string;
  user: AuthUserResponse;
};

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  skipAuthRefresh?: boolean;
};

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuthRefresh?: boolean;
  }
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
    skipAuthRefresh?: boolean;
  }
}

const AUTH_REFRESH_PATH = "/api/auth/refresh";
const AUTH_PATHS_WITHOUT_REFRESH = [
  "/api/auth/login",
  "/api/auth/register",
  AUTH_REFRESH_PATH,
  "/api/auth/logout",
];

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let refreshRequest: Promise<AuthSessionResponse | null> | null = null;
let logoutInProgress = false;

const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

const setAuthorizationHeader = (config: InternalAxiosRequestConfig, token: string | null) => {
  const headers = AxiosHeaders.from(config.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  } else {
    headers.delete("Authorization");
  }

  config.headers = headers;
};

export const refreshAuthSession = async (): Promise<AuthSessionResponse | null> => {
  if (!refreshRequest) {
    refreshRequest = refreshClient
      .post<AuthSessionResponse>(AUTH_REFRESH_PATH, undefined, {
        skipAuthRefresh: true,
      } as AxiosRequestConfig)
      .then((response) => response.data)
      .catch(() => null)
      .finally(() => {
        refreshRequest = null;
      });
  }

  return refreshRequest;
};

export const getApiErrorMessage = (
  error: unknown,
  fallback = "something_went_wrong",
) => {
  const axiosError = error as AxiosError<{ message?: string; error?: string }>;
  const data = axiosError.response?.data;
  return data?.message || data?.error || (error as Error)?.message || fallback;
};

const shouldSkipRefresh = (config?: RetriableRequestConfig) => {
  if (!config || config.skipAuthRefresh) return true;

  const url = config.url ?? "";
  return AUTH_PATHS_WITHOUT_REFRESH.some((path) => url.includes(path));
};

const forceLocalLogout = async () => {
  if (logoutInProgress) return;
  logoutInProgress = true;

  const auth = useAuthStore();
  auth.clearAuth();

  if (router.currentRoute.value.path !== "/") {
    await router.replace("/");
  }

  logoutInProgress = false;
};

api.interceptors.request.use((config) => {
  setAuthorizationHeader(config, getAccessToken());
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;
    const status = error.response?.status;

    if (!originalRequest || status !== 401 || shouldSkipRefresh(originalRequest) || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const session = await refreshAuthSession();
    if (!session?.accessToken) {
      await forceLocalLogout();
      return Promise.reject(error);
    }

    const auth = useAuthStore();
    auth.setToken(session.accessToken);
    auth.applyAuthUser(session.user);
    setAuthorizationHeader(originalRequest, session.accessToken);

    return api(originalRequest);
  },
);

export default api;
