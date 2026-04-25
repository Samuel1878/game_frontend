// // utils/interceptor.ts
// import api from "@/services/api";
// import { useAuthStore } from "@/stores/auth";
// import { reconnectSocket } from "@/socket";

// let isRefreshing = false;
// let queue: any[] = [];
// export const getAccessToken = () => {
//   const auth = useAuthStore();
//   console.log("Getting access token:", auth.accessToken);
//   console.log(auth.initialized)
//   return auth.accessToken;
// };
// const processQueue = (token: string | null) => {
//   queue.forEach((p) => (token ? p.resolve(token) : p.reject()));
//   queue = [];
// };

// api.interceptors.request.use(async (config) => {
//   const auth = useAuthStore();

//   if (!auth.accessToken) {
//     try {
//       const res = await api.post("/auth/refresh");
//       auth.setToken(res.data.accessToken);
//     } catch {
//         auth.clearAuth();
//             window.location.href = "/login";
//       // redirect to login
//     }
//   }

//   if (auth.accessToken) {
//     config.headers.Authorization = `Bearer ${auth.accessToken}`;
//   }

//   return config;
// });

// api.interceptors.response.use(
//   (res) => res,
//   async (err) => {
//     const auth = useAuthStore();
//     const original = err.config;

//     if (err.response?.status === 401 && !original._retry) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           queue.push({
//             resolve: (token: string) => {
//               original.headers.Authorization = `Bearer ${token}`;
//               resolve(api(original));
//             },
//             reject,
//           });
//         });
//       }

//       original._retry = true;
//       isRefreshing = true;

//       try {
//         const res = await api.post("/auth/refresh");
//         const newToken = res.data.accessToken;

//         auth.setToken(newToken);
//         processQueue(newToken);

//         reconnectSocket(); // 🔥 important

//         original.headers.Authorization = `Bearer ${newToken}`;
//         return api(original);
//       } catch (e) {
//         processQueue(null);
//         auth.clearAuth();
//         window.location.href = "/login";
//         return Promise.reject(e);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(err);
//   }
// );