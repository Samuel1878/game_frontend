import type { Socket } from "socket.io-client";
import { SOCKET_URL } from "@/config/env";
import { useAuthStore } from "@/stores/auth";
import { useWallet } from "./stores/wallet";

let socket: Socket | null = null;
let socketInit: Promise<Socket | null> | null = null;

export const initSocket = async () => {
  if (socket) return socket;
  if (socketInit) return socketInit;

  const auth = useAuthStore();
  if (!auth.accessToken) return null;

  socketInit = import("socket.io-client")
    .then(({ io }) => {
      socket = io(SOCKET_URL, {
        withCredentials: true,
        auth: {
          token: auth.accessToken,
        },
        autoConnect: true,
        reconnection: true,
        transports: ["websocket", "polling"],
      });

      const wallet = useWallet();

      socket.on("connect", () => {
        if (auth.user?.uid) {
          socket?.emit("room:join", `player:${auth.user.uid}`);
        }
      });

      socket.on("connect_error", async (error) => {
        if (error.message === "UNAUTHORIZED") {
          await auth.revalidate();
          socket?.disconnect();
          socket = null;
        }
      });

      socket.on("deposit:update", () => {});
      socket.on("withdraw:update", () => {});
      socket.on("balance-update", (data) => {
        wallet.setWallet(
          data?.availableBalance ?? data?.balance ?? 0,
          data?.currency || "MMK",
          data?.lockedBalance ?? data?.locked_balance ?? 0,
          data?.updatedAt ?? data?.updated_at,
        );
      });
      socket.on("server:hello", () => {});

      return socket;
    })
    .finally(() => {
      socketInit = null;
    });

  return socketInit;
};

export const getSocket = () => socket;

export const reconnectSocket = async () => {
  disconnectSocket();
  return initSocket();
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
