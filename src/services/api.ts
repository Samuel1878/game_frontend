
import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { BASE_API_URL } from "@/utils";
import router from "@/router";
import { refreshAPI } from "@/lib/axios";

const api = axios.create({
  baseURL: `${BASE_API_URL}/api/v1`,
  withCredentials: true,
});

// 🔹 Attach access token
api.interceptors.request.use((config) => {
  const auth = useAuthStore();

  if (auth.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`;
  }

  return config;
});


let isLoggingOut = false;
let isRefreshing = false;
let queue: any[] = [];

const processQueue = (token: string | null) => {
  queue.forEach((cb) => cb(token));
  queue = [];
};
async function triggerLogout() {
  if (isLoggingOut) return;
  isLoggingOut = true;
  const auth = useAuthStore();
  await auth.logout();
  router.push("/")
}
// 🔹 Response interceptor
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const auth = useAuthStore();
    const originalRequest = error.config;

    const status = error.response?.status;
    const code = error.response?.data?.code;

    if (originalRequest.url?.includes("/auth/refresh")) {
      triggerLogout()
      return Promise.reject(error);
    }
    if (status === 401 && code !== "TOKEN_EXPIRED") {
      triggerLogout();
      return Promise.reject(error);
    }
    // ✅ Only handle expired token
    if (
      status === 401 &&
      code === "TOKEN_EXPIRED" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // 🟡 If already refreshing → queue request
      if (isRefreshing) {
          return new Promise((resolve, reject) => {
          queue.push((token: string | null) => {
            if (!token) {
              reject(error);
              return;
            }

            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const res = await refreshAPI();

        auth.setToken(res.accessToken);

        processQueue(res.accessToken);

        originalRequest.headers.Authorization =
          `Bearer ${res.accessToken}`;

        return api(originalRequest);
      } catch (err) {
        processQueue(null);
        triggerLogout()
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;