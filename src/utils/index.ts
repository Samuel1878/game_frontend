import type { Game } from "./types";
import { API_BASE_URL } from "@/config/env";

export function formatPrice(value: number) {
  return new Intl.NumberFormat('en-US').format(value)
}

export const formattedAmount = (amount:number) =>
  amount
    ? amount.toLocaleString() + " MMK"
    : "-";
export function getGameIcon(game: Game): string {
  const icon =
    game.gameInfos?.[1]?.gameIconUrl ||
    game.gameInfos?.[0]?.gameIconUrl;

  return icon || "";
}

// useTawk.ts
declare global {
  interface Window {
    Tawk_API?: {
      maximize: () => void;
    };
  }
}

export const openChat = () => {
  if (window.Tawk_API) {
    window.Tawk_API.maximize();
  }
};
export const bankThemes: Record<string, string> = {
    kbzPay: "from-white/50 via-blue-500 to-blue-400/40",
    wavePay: "from-yellow-500/90 via-yellow-500/80 to-yellow-400/100",
    ayaPay: "from-orange-600/40 via-red-500 to-red-400/10",
    cbPay: "from-red-600 via-rose-500 to-pink-500",
    usdt: "from-emerald-700 via-teal-600 to-emerald-400/60",
    kbzBank: "from-white/50 via-blue-400 to-gray-400/30",
    kbzBanking: "from-white/50 via-blue-400 to-gray-400/30",
};
export const openViber = () => {

  const phone = "09690960382"
  const cleanPhone = phone.replace(/\D/g, "");

  window.open(`viber://chat?number=%2B${cleanPhone}`, "_blank");
};
export const openTelegram = () => window.open('https://t.me/tz99x', '_blank');
export const openDiscord = () => window.open('https://discord.gg/your_invite', '_blank');
export const baseURL =  "https://tz99x.com";
export const versionNo = "2.0.7"
export const BASE_API_URL = API_BASE_URL;
export const SUPABASE_URL = ""
export const hideTawk = () => {
  if (
    typeof window !== "undefined" &&
    window.Tawk_API &&
    typeof (window as any).Tawk_API.hideWidget === "function"
  ) {
   ( window as any).Tawk_API.hideWidget();
  } else {
    console.warn("Tawk not ready yet");
  }
};

export const showTawk = () => {
  if (typeof window !== "undefined" &&
    window.Tawk_API &&
    typeof (window as any).Tawk_API.showWidget==='function') {
    (window as any).Tawk_API.showWidget();
  }
};

export const goFacebook = () => {
  window.open('https://facebook.com', '_blank');
};
