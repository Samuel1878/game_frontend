import { defineStore } from "pinia";
import api from "@/services/api";
import { initSocket, disconnectSocket } from "@/socket";
import type { userInfo } from "@/utils/types";
import router from "@/router";

import { useWallet } from "./wallet";
import { refreshAPI } from "@/services/authAPI";
// import { useFavoritesStore } from "./userFavoriteStore";
interface walletType {
  balance: number;
  currency: string;
}
export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: localStorage.getItem("access_token"),
    user: null as userInfo | null,
    initialized: false,
    initializing: null as Promise<void> | null,
  }),
  // getters: {
  //   isLoggedIn: (state) => !!state.user,
  //   hasFundPin: (state) => !!state.user?.set_pin,
  // },
  actions: {
    setToken(token: string) {
      localStorage.setItem("access_token", token);
      this.accessToken = token;
    },
    setUser({ user, wallet }: { user: userInfo; wallet: walletType }) {
      const walletStore = useWallet();
      this.user = user;
      walletStore.setWallet(wallet.balance, wallet.currency);
    },
    setFundPinStatus(status: boolean) {
      if (this.user) {
        this.user.set_pin = status;
      }
    },
    clearAuth() {
      this.accessToken = null;
      this.user = null;
      localStorage.removeItem("access_token");
      disconnectSocket();
    },
    async login(payload: {
      name: string;
      password: string;
      isPhoneNumber: boolean;
    }) {
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
        this.clearAuth();
        return {
          status: err?.response?.status || 500,
          message: err?.response?.data?.message || "something_went_wrong",
        };
      }
    },
    async fetchUser() {
      try {
        const res = await api.get("/user/profile");
        this.setUser(res.data);
        console.log("FETCHING USER PROFILE", res.data);
        // const favStore = useFavoritesStore();
        // favStore.syncFavorites();
        return true;
      } catch (error) {
        console.log("fetchUser failed", error);
        return false;
      }
    },
    async init() {
      if (this.initialized) return;
      if (this.initializing) {
        return this.initializing;
      }
      this.initializing = (async () => {
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
          this.clearAuth();
        } finally {
          this.initialized = true;
          this.initializing = null;
        }
      })();
      return this.initializing;
    },
    async register(payload: {
      name?: string | null;
      password: string;
      referral_code: string | null;
      phone: string;
    }) {
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
        } else {
          this.clearAuth();
          return {
            status: response.status,
            message: response.data?.message || "something_went_wrong",
          };
        }
      } catch (error:any) {
        console.log(error)
        this.clearAuth();
        return {
          status: 500,
          message: error?.response?.data?.message || "something_went_wrong",
        };
      }
    },
    async revalidate() {
      if (this.initializing) {
        return this.initializing;
      }
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          return;
        }
        await this.fetchUser();
        initSocket();
      } catch {
        try {
          const res = await refreshAPI();
          if (res?.accessToken) {
            this.setToken(res.accessToken);
            await this.fetchUser();
            initSocket();
          }
        } catch {
          await this.logout();
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
      // const favStore = useFavoritesStore();
      // favStore.favoriteKeys = new Set();
      router.replace("/");
    },
  },
});
