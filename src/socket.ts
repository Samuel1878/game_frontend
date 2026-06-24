import type { Socket } from "socket.io-client";
import { toast } from "vue-sonner";

import { SOCKET_URL } from "@/config/env";
import { i18n } from "@/lib/i18n";
import { useAuthStore } from "@/stores/auth";
import { useWallet } from "@/stores/wallet";
import {
  isPlayerBalanceUpdatePayload,
  type PlayerBalanceUpdateReason,
} from "@/types/playerSocket";

type PlayerSocketServerEvents = {
  "player:balance:update": (payload: unknown) => void;
};

type PlayerSocketClientEvents = Record<string, never>;
type PlayerSocket = Socket<PlayerSocketServerEvents, PlayerSocketClientEvents>;

let socket: PlayerSocket | null = null;
let socketInit: Promise<PlayerSocket | null> | null = null;
let connectionGeneration = 0;

const balanceToastKey: Record<PlayerBalanceUpdateReason, string> = {
  deposit_approved: "balance_update_deposit_approved",
  withdrawal_created: "balance_update_withdrawal_created",
  withdrawal_paid: "balance_update_withdrawal_paid",
  withdrawal_rejected: "balance_update_withdrawal_rejected",
};

export const initSocket = async (): Promise<PlayerSocket | null> => {
  if (socket) return socket;
  if (socketInit) return socketInit;

  const auth = useAuthStore();
  if (!auth.isLoggedIn || !auth.accessToken) return null;

  const accessToken = auth.accessToken;
  const generation = connectionGeneration;
  const initPromise = import("socket.io-client")
    .then(({ io }) => {
      if (
        generation !== connectionGeneration ||
        !auth.isLoggedIn ||
        auth.accessToken !== accessToken
      ) {
        return null;
      }

      const playerSocket = io(
        SOCKET_URL,
        {
          withCredentials: true,
          auth: { token: accessToken },
          autoConnect: true,
          reconnection: true,
          transports: ["websocket", "polling"],
        },
      ) as PlayerSocket;
      socket = playerSocket;

      const wallet = useWallet();
      let hasConnected = false;

      playerSocket.on("connect", () => {
        if (hasConnected) {
          void wallet.fetchBalance();
        }
        hasConnected = true;
      });

      playerSocket.on("connect_error", (error) => {
        if (error.message !== "UNAUTHORIZED") return;

        if (socket === playerSocket) {
          socket = null;
        }
        playerSocket.removeAllListeners();
        playerSocket.disconnect();
        void auth.revalidate();
      });

      playerSocket.on("player:balance:update", (payload) => {
        if (!isPlayerBalanceUpdatePayload(payload)) return;
        if (!wallet.applyRealtimeBalanceUpdate(payload)) return;

        const reason = payload.reason as PlayerBalanceUpdateReason;
        toast.success(i18n.global.t(balanceToastKey[reason]));
      });

      return playerSocket;
    })
    .finally(() => {
      if (socketInit === initPromise) {
        socketInit = null;
      }
    });

  socketInit = initPromise;
  return initPromise;
};

export const getSocket = () => socket;

export const reconnectSocket = async () => {
  disconnectSocket();
  return initSocket();
};

export const disconnectSocket = () => {
  connectionGeneration += 1;
  socketInit = null;

  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};
