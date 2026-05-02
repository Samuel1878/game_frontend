// import { useAuthStore } from "@/stores/auth";
// // import { useUIStore } from "@/stores/ui";
// import axios from "axios";

// const api = axios.create({
//   // baseURL: "https://api.96betx.com/api/v1",
//   baseURL:"http://localhost:3000/api/v1",
//   withCredentials:true,
// })
// api.interceptors.request.use((config) => {
//   const auth = useAuthStore();
//   console.log("Attaching token to request:", auth.accessToken);
//   if (auth.accessToken) {
//     config.headers.Authorization = `Bearer ${auth.accessToken}`;
//   }
//   return config;
// });

// export default api;

import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { refreshAPI } from "@/services/authAPI";
import { BASE_API_URL } from "@/utils";
import router from "@/router";

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


// 🔥 Refresh control
let isRefreshing = false;
let queue: any[] = [];

const processQueue = (token: string | null) => {
  queue.forEach((cb) => cb(token));
  queue = [];
};


// 🔹 Response interceptor
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const auth = useAuthStore();
    const originalRequest = error.config;

    const status = error.response?.status;
    const code = error.response?.data?.code;

    // ❌ If refresh endpoint itself fails → logout
    if (originalRequest.url?.includes("/auth/refresh")) {
      auth.logout();
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
        return new Promise((resolve) => {
          queue.push((token: string) => {
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
        auth.logout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;