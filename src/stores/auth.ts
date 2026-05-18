import { defineStore } from "pinia";
import api from "@/services/api";
import { initSocket, disconnectSocket } from "@/socket";
import type { userInfo } from "@/utils/types";
import router from "@/router";

import { useWallet } from "./wallet";
import { refreshAPI } from "@/services/authAPI";
interface walletType{
  balance:number;
  currency:string;
};
export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: null as string | null,
    user: null as userInfo | null,
    initialized: false,
  }),
  actions: {
    setToken(token: string) {
      localStorage.setItem("access_token", token);
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
      localStorage.removeItem("access_token");
      disconnectSocket();
    },
    async login(payload: { name: string; password: string, isPhoneNumber:boolean }) {
      try {
        const res = await api.post("/auth/login", payload);
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
        this.setUser(res.data);
        return true
      } catch (error) {
        console.log("fetchUser failed", error);
        this.logout();
        return false
      }
    },
    async init() {
      try {
        const localToken = localStorage.getItem("access_token");

        if (localToken) {
          this.setToken(localToken);
          const ok = await this.fetchUser();
          if (ok) {
            initSocket();
            return;
          }
        }
        console.log("REFRESH API CALLED");
        const resData = await refreshAPI();
        if (!resData?.accessToken) {
          throw new Error("No refresh token");
        }
        this.setToken(resData.accessToken);
        const ok = await this.fetchUser();
        if (!ok) {
          throw new Error("User fetch failed");
        }
        initSocket();
      } catch (err) {
        console.log("Auth init failed:", err);
        this.clearAuth();
      } finally {
        this.initialized = true;
      }
    },
    // async init() {
    //   try {
    //     const localToken = localStorage.getItem("access_token");
    //     if (localToken) {
    //     this.setToken(localToken);
    //       try {
    //         await this.fetchUser();
    //         initSocket();
    //         return;
    //       } catch {
    //         console.log("FETCHING FROM LOCAL STORAGE HAS FAILED")
    //       }
    //     }
    //     console.log("RESFRESH API CALLED ")
    //     const resData = await refreshAPI();
    //     if (!resData?.accessToken) {
    //       throw new Error("No refresh token");
    //     }
    //     this.setToken(resData.accessToken);
    //     const ok = await this.fetchUser();
    //     if (!ok) {
    //       throw new Error("User fetch failed");
    //     }
    //   initSocket();
    //   } catch (err) {
    //     console.log("Auth init failed:", err);
    //     this.clearAuth();
    //   } finally {
    //     this.initialized = true;
    //   }
    // },
    async register(payload: { name?: string | null; password: string ; referral_code:string|null; phone:string}) {
      try {
        const response = await api.post("/auth/register", payload);
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
     localStorage.removeItem("access_token");
      try {
        await api.post("/auth/logout");
      } catch {
        console.log("logout failed");
      }
      const walletStore = useWallet();
      walletStore.resetWallet();
      this.clearAuth();
      router.replace("/");
    },
  },
});
