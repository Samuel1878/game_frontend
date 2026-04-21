import { defineStore } from "pinia";
import api from "@/services/api";
import { initSocket, disconnectSocket } from "@/socket";
import type { userInfo } from "@/utils/types";
import router from "@/router";
import { refreshAPI } from "@/services/authAPI";
import { useWallet } from "./wallet";
interface walletType{
  balance:number;
  currency:string;
};
export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: null as string | null,
    user: null as userInfo | null,
    initialized: false,
    // wallet: null as walletType | null
  }),
  actions: {
    setToken(token: string) {
      this.accessToken = token;
    },
    setUser({user, wallet}: {user:userInfo,wallet:walletType}) {
      const walletStore = useWallet();
      this.user = user;
      walletStore.setWallet(wallet.balance, wallet.currency)
    },
    clearAuth() {
      this.accessToken = null;
      this.user = null;
      disconnectSocket();
    },
    async login(payload: { name: string; password: string, isPhoneNumber:boolean }) {
      try {
        const res = await api.post("/auth/login", payload);
        console.log("response", res);
        this.setToken(res.data.accessToken);
        await this.fetchUser();
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
            err?.response?.data?.message || "Invalid username or password",
        };
      }
    },
    async fetchUser() {
      try {
        const res = await api.get("/user/profile");
        console.log("Fetched user profile:", res.data);
        this.setUser(res.data);
        return true
      } catch (error) {
        return false
      }
    },
    async init() {
      try {
        const resData = await refreshAPI();
        if (resData){
        this.setToken(resData?.accessToken);
        await this.fetchUser();
        initSocket(); // reconnect socket on reload
        }
      } catch {
        this.clearAuth();
      } finally {
        this.initialized = true;
      }
    },
    async register(payload: { name?: string | null; password: string ; referral_code:string|null; phone:string}) {
      try {
        const response = await api.post("/auth/register", payload);
        console.log("response", response);
        if (response.status === 200 || response.status === 201) {
          this.user = response.data;
        this.setToken(response.data.accessToken);
        await this.fetchUser();
        initSocket();
          return {
            status: 200,
            message: "Successfully logged in",
          };
        } else if (response.status === 203) {
          return {
            status: 203,
            message: response.data?.message || "User already exit",
          };
        }
        this.logout();
      } catch (error) {
        this.logout();
        return {
          status:500,
          message:"Something went wrong"
        }
      } 
    },

    async logout() {
      try {
        await api.post("/auth/logout");
      } catch {
        console.log("logout failed");
      }

      this.clearAuth();
      router.replace("/");
    },
  },
});
