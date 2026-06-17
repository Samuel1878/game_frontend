import { defineStore } from "pinia";
import api, { refreshAuthSession, type AuthSessionResponse } from "@/services/api";
import { initSocket, disconnectSocket } from "@/socket";
import type { userInfo } from "@/utils/types";
import router from "@/router";
import { ACCESS_TOKEN_STORAGE_KEY } from "@/config/env";
import { useWallet } from "./wallet";
import { getCurrentPlayer, type BackendPlayer, type CurrentPlayerResponse } from "@/services/userAPI";

type WalletPayload = {
  balance: number;
  currency: string;
};

type BackendAuthUser = AuthSessionResponse["user"];

const statusLabel = (status?: string) => {
  if (!status) return "Active";
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

const fundPinStatus = (user: Partial<BackendAuthUser & BackendPlayer>) => {
  if (typeof user.hasFundPin === "boolean") return user.hasFundPin;
  if (typeof user.has_fund_pin === "boolean") return user.has_fund_pin;
  if (typeof user.set_pin === "boolean") return user.set_pin;
  return null;
};

const normalizeUser = (
  user: BackendAuthUser,
  previous?: userInfo | null,
): userInfo => ({
  id: user.id,
  uid: user.id,
  name: user.username,
  phone: user.phone,
  email: previous?.email ?? null,
  role: user.role,
  status: statusLabel(user.status),
  raw_status: user.status,
  level: user.level ?? previous?.level ?? 0,
  created_at: previous?.created_at ?? "",
  agent_id: previous?.agent_id ?? null,
  is_oneline: true,
  last_seen: previous?.last_seen,
  set_pin: fundPinStatus(user) ?? previous?.set_pin ?? null,
  has_fund_pin: fundPinStatus(user) ?? previous?.has_fund_pin ?? null,
  referral_code: user.referralCode,
});

const normalizePlayer = (
  response: CurrentPlayerResponse,
  previous?: userInfo | null,
): userInfo => {
  const player = response.player;
  return {
    id: player.userId,
    uid: player.userId,
    name: player.username,
    phone: player.phone,
    email: previous?.email ?? null,
    role: player.role,
    status: statusLabel(player.status),
    raw_status: player.status,
    level: response.level?.level ?? player.level ?? previous?.level ?? 0,
    level_profile: response.level ?? previous?.level_profile ?? null,
    full_name: player.full_name ?? player.fullName ?? previous?.full_name ?? null,
    created_at: previous?.created_at ?? "",
    agent_id: previous?.agent_id ?? null,
    is_oneline: true,
    last_seen: previous?.last_seen,
    set_pin: fundPinStatus(player) ?? previous?.set_pin ?? null,
    has_fund_pin: fundPinStatus(player) ?? previous?.has_fund_pin ?? null,
    referral_code: player.referralCode ?? previous?.referral_code,
  };
};

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY),
    user: null as userInfo | null,
    initialized: false,
    initializing: null as Promise<void> | null,
  }),
  getters: {
    isLoggedIn: (state) => Boolean(state.user && state.accessToken),
    hasFundPin: (state) => Boolean(state.user?.set_pin),
    isBlocked: (state) => {
      const status = state.user?.raw_status ?? state.user?.status;
      return ["SUSPENDED", "BANNED", "DISABLED"].includes(status?.toUpperCase?.() ?? "");
    },
  },
  actions: {
    setToken(token: string) {
      localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
      this.accessToken = token;
    },
    applyAuthUser(user: BackendAuthUser) {
      this.user = normalizeUser(user, this.user);
    },
    setSession(session: AuthSessionResponse, wallet?: WalletPayload) {
      this.setToken(session.accessToken);
      this.applyAuthUser(session.user);

      if (wallet) {
        const walletStore = useWallet();
        walletStore.setWallet(wallet.balance, wallet.currency);
      }

      void useWallet().fetchBalance();
    },
    setUser({ user, wallet }: { user: userInfo; wallet?: WalletPayload }) {
      this.user = user;

      if (wallet) {
        const walletStore = useWallet();
        walletStore.setWallet(wallet.balance, wallet.currency);
      }
    },
    setFundPinStatus(status: boolean) {
      if (this.user) {
        this.user.set_pin = status;
      }
    },
    clearAuth() {
      this.accessToken = null;
      this.user = null;
      localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
      disconnectSocket();
    },
    async login(payload: {
      name: string;
      password: string;
      isPhoneNumber: boolean;
    }) {
      try {
        const body = payload.isPhoneNumber
          ? { phone: payload.name, password: payload.password }
          : { username: payload.name, password: payload.password };
        const response = await api.post<AuthSessionResponse>("/api/auth/login", body, {
          skipAuthRefresh: true,
        });

        this.setSession(response.data);
        void initSocket();

        return {
          status: 200,
          message: "Successfully logged in",
        };
      } catch (err: any) {
        this.clearAuth();
        return {
          status: err?.response?.status || 500,
          message: err?.response?.data?.message || "something_went_wrong",
        };
      }
    },
    async fetchUser() {
      if (!this.accessToken) return false;

      try {
        const response = await getCurrentPlayer();
        this.user = normalizePlayer(response, this.user);
        void useWallet().fetchBalance();

        return true;
      } catch {
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
          const localToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

          if (localToken) {
            this.setToken(localToken);
            const ok = await this.fetchUser();

            if (ok) {
              void initSocket();
              return;
            }
          }

          const session = await refreshAuthSession();
          if (!session?.accessToken) {
            throw new Error("No refresh token");
          }

          this.setSession(session);
          void initSocket();
        } catch {
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
        const response = await api.post<AuthSessionResponse>(
          "/api/auth/register",
          {
            username: payload.name,
            phone: payload.phone,
            password: payload.password,
            referralCode: payload.referral_code || undefined,
          },
          {
            skipAuthRefresh: true,
          },
        );

        this.setSession(response.data);
        void initSocket();

        return {
          status: 200,
          message: "Successfully logged in",
        };
      } catch (error: any) {
        this.clearAuth();
        return {
          status: error?.response?.status || 500,
          message: error?.response?.data?.message || "something_went_wrong",
        };
      }
    },
    async revalidate() {
      if (this.initializing) {
        return this.initializing;
      }

      if (this.accessToken && (await this.fetchUser())) {
        void initSocket();
        return;
      }

      const session = await refreshAuthSession();
      if (session?.accessToken) {
        this.setSession(session);
        void initSocket();
        return;
      }

      await this.logout();
    },
    async logout() {
      try {
        await api.post(
          "/api/auth/logout",
          undefined,
          {
            skipAuthRefresh: true,
          },
        );
      } catch {
        // Logout is still completed locally when the server session is already gone.
      }

      const walletStore = useWallet();
      walletStore.resetWallet();
      this.clearAuth();

      if (router.currentRoute.value.path !== "/") {
        await router.replace("/");
      }
    },
  },
});
