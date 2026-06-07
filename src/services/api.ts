import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { BASE_API_URL } from "@/utils";
import router from "@/router";
import { refreshAPI } from "@/lib/axios";
declare module "axios" {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}
const api = axios.create({
  baseURL: `${BASE_API_URL}/api/v1`,
  withCredentials: true,
});
api.interceptors.request.use((config) => {
  
  const token = localStorage.getItem("access_token");
  config.headers = config.headers ?? {};
  if (token) {
     config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  else {
    delete config.headers.Authorization;
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
  router.push("/");
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
      return Promise.reject(error);
    }
    if (status === 401) {
      if (code!== "TOKEN_EXPIRED"){
      // if (code === "INVALID_TOKEN" || code === "INVALID_PAYLOAD" || code==="MISSING_TOKEN") {
        console.warn(`Security violation (${code}). Forcing logout.`);
        await triggerLogout();
        return Promise.reject(error);
      }
      if ((code === "TOKEN_EXPIRED") && !originalRequest._retry) {
        originalRequest._retry = true;
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
          if (!res || !res.accessToken) {
            throw new Error("Invalid token payload returned from refresh API");
          }
          auth.setToken(res.accessToken);
          processQueue(res.accessToken);
          originalRequest.headers.Authorization = `Bearer ${res.accessToken}`;
          return api(originalRequest); // 🔄 Retry original call with fresh token
        } catch (err) {
          processQueue(null);
          await triggerLogout();
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }
    }
    return Promise.reject(error);
  },
);
export default api;


// import axios from "axios";
// import { useAuthStore } from "@/stores/auth";
// import { BASE_API_URL } from "@/utils";
// import router from "@/router";
// import { refreshAPI } from "@/lib/axios";

// const api = axios.create({
//   baseURL: `${BASE_API_URL}/api/v1`,
//   withCredentials: true,
// });
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("access_token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// let isLoggingOut = false;
// let isRefreshing = false;
// let queue: any[] = [];

// const processQueue = (token: string | null) => {
//   queue.forEach((cb) => cb(token));
//   queue = [];
// };
// async function triggerLogout() {
//   if (isLoggingOut) return;
//   isLoggingOut = true;
//   const auth = useAuthStore();
//   await auth.logout();
//   router.push("/");
// }
// // 🔹 Response interceptor
// api.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const auth = useAuthStore();
//     const originalRequest = error.config;
//     const status = error.response?.status;
//     const code = error.response?.data?.code;
//     if (originalRequest.url?.includes("/auth/refresh")) {
//       return Promise.reject(error);
//     }
//     if (status===401){
//       if (code === "INVALID_TOKEN" || code === "INVALID_PAYLOAD") {
//         console.warn(`Security violation (${code}). Forcing logout.`);
//         triggerLogout();
//         return Promise.reject(error);
//       }
//     }
//     if (code == "TOKEN_MISSING") {
//       originalRequest.headers.Authorization = `Bearer ${localStorage.getItem("access_token")}`;
//       return Promise.reject(error);
//     }
//     if (code === "TOKEN_EXPIRED" && !originalRequest._retry) {
//       originalRequest._retry = true;
//       // 🟡 If already refreshing → queue request
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           queue.push((token: string | null) => {
//             if (!token) {
//               reject(error);
//               return;
//             }

//             originalRequest.headers.Authorization = `Bearer ${token}`;
//             resolve(api(originalRequest));
//           });
//         });
//       }
//       isRefreshing = true;
//       try {
//         const res = await refreshAPI();
//         auth.setToken(res.accessToken);
//         processQueue(res.accessToken);
//         originalRequest.headers.Authorization = `Bearer ${res.accessToken}`;
//         return api(originalRequest);
//       } catch (err) {
//         processQueue(null);
//         triggerLogout();
//         return Promise.reject(err);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   },
// );
// export default api;
