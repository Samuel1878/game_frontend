import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/stores/auth";
import { useWallet } from "./stores/wallet";
let socket: Socket | null = null;
export const initSocket = () => {
  if (socket) return socket;
  const auth = useAuthStore();
  if (!auth.accessToken) return;
  // socket = io("https://api.96betx.com", 
   socket = io("http://localhost:3000", 
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
    console.log("Socket connected:", socket?.id);
  });
  socket.emit("join", auth.user?.uid);
  socket.on("deposit:update", (data) => {
    console.log("Deposit update:", data);
  });
  socket.on("withdraw:update", (data) => {
    console.log("Withdraw update: ", data);
  });
  socket.on("balance-update", (data) => {
    console.log("balance-updated",data)
    wallet.setWallet(  data?.balance, data?.currency || "MMK")
  });
  socket.on("disconnect", () => {
    console.log("Socket disconnected");
    // wallet.resetWallet();
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