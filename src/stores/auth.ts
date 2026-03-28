
import { defineStore } from "pinia";
import api from "@/services/api";
import { initSocket, disconnectSocket } from "@/socket";
import { toast } from "vue-sonner";
import type { userInfo } from "@/utils/types";
import router from "@/router";


export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as userInfo | null,
    isLoggedIn: false,
    loading: true,
  }),

  actions: {

    // async login(payload: { name: string; password: string }) {
    //   try {
    //     const res = await api.post("/auth/login", payload);
    //     this.user = res.data;
    //     this.isLoggedIn = true;

    //     initSocket();
    //     return {status:200 , message:"Successfully logged in"}
    //   } catch (err:apiError) {
    //     console.log(err);
    //     this.logout();
    //     return {status:err?.status}
    //   }
    // },
async login(payload: { name: string; password: string }) {
  try {
    const res = await api.post("/auth/login", payload);

    // ✅ store user
    this.user = res.data.user;

    // ✅ store token (if exists)
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
    }

    this.isLoggedIn = true;

    // ✅ init socket after login
    initSocket();

    return {
      status: 200,
      message: "Successfully logged in",
    };

  } catch (err: any) {
    console.error("Login error:", err);

    this.logout();

    return {
      status: err?.response?.status || 500,
      message:
        err?.response?.data?.message ||
        "Invalid username or password",
    };
  }
},
    async autoLogin() {
      try {
        const res = await api.get("/user/profile");

        this.user = res.data;
        this.isLoggedIn = true;

        initSocket(); // connect socket after session verified
      } catch {
        this.user = null;
        this.isLoggedIn = false;
      } finally {
        this.loading = false;
      }
    },

      async register(payload: { name?: string | null; password: string }) {

      try {
        const response = await api.post('/auth/register', payload)
        console.log("response", response) 
        if (response.status === 200 || response.status === 201) { 
          this.user = response.data;
          this.isLoggedIn = true;
          initSocket();
          this.loading = false
          toast.success("Registration successful.");
          return 
        }
        else if (response.status ===203){
          toast.warning(response.data?.message);
          return 
        }
        console.log("registration failed", response?.data)
        this.logout()
      } catch (error) {
        this.logout()
        toast.warning("registration failed")
        console.log("error", error)
      }
    },

    async logout() {
      try {
        await api.post("/auth/logout");
      } catch {
        console.log("logout failed")
      }

      this.user = null;
      this.isLoggedIn = false;
      disconnectSocket();
      router.replace("/")
    },
  },
});
