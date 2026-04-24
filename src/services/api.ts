import { useAuthStore } from "@/stores/auth";
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
export default api;