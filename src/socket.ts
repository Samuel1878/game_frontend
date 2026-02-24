import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/stores/auth";
import { useWallet } from "./stores/wallet";

let socket: Socket | null = null;

export const initSocket = () => {
  if (socket) return socket;

  socket = io("http://localhost:3000", {
    withCredentials: true, // ✅ send session cookie
    autoConnect: true,
    reconnection: true,
  });

  const wallet = useWallet();
  socket.on("connect", () => {
    console.log("Socket connected:", socket?.id);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
    wallet.resetWallet();

  });

  socket.on("balance-update", (data) => {
    console.log(data)
    wallet.setWallet(  data?.balance, data?.currency)
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};