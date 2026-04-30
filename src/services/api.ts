import { useAuthStore } from "@/stores/auth";
// import { useUIStore } from "@/stores/ui";
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.96betx.com/api/v1",
  // baseURL:"http://localhost:3000/api/v1",
  withCredentials:true,
})
api.interceptors.request.use((config) => {
  const auth = useAuthStore();
  console.log("Attaching token to request:", auth.accessToken);
  if (auth.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`;
  }
  return config;
});


// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const auth = useAuthStore();
//     const ui = useUIStore()
//     if (error.response?.status === 401) {
//       console.log("401 detected → logging out");

//       // clear auth state
//       auth.logout();

//       // optional: redirect to login
//       window.location.href = "/";
//       ui.openAuthModal();

//     }

//     return Promise.reject(error);
//   }
// );
export default api;