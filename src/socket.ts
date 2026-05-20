const { io }= await import("socket.io-client");
import type { Socket } from "socket.io-client";
import { useAuthStore } from "@/stores/auth";
import { useWallet } from "./stores/wallet";
import { BASE_API_URL } from "./utils";
let socket:Socket  | null = null;
export const initSocket = () => {
  if (socket) return socket;
  const auth = useAuthStore();
  if (!auth.accessToken) return;
   socket = io(BASE_API_URL, 
    {
      withCredentials: true, 
      auth: {
        token: auth.accessToken,
        },
      autoConnect: true,
      reconnection: true,
      transports: ["websocket", "polling"]
  });
  const wallet = useWallet();
  socket.on("connect", () => {
    // console.log("Socket connected:", socket?.id);
  });
  socket.emit("join", auth.user?.uid);
  socket.on("deposit:update", () => {
    // console.log("Deposit update:", data);
  });
  socket.on("withdraw:update", () => {
    // console.log("Withdraw update: ", data);
  });
  socket.on("balance-update", (data) => {
    // console.log("balance-updated",data)
    wallet.setWallet( data?.balance, data?.currency || "MMK")
  });
  socket.on("disconnect", () => {
    // console.log("Socket disconnected");
  });
  return socket;
};
export const getSocket = () => socket;
export const reconnectSocket = () => {
  disconnectSocket();
  initSocket();
};
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};