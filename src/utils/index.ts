import type { Game } from "./types";




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
    kbzBanking: "from-white/50 via-blue-400 to-gray-400/30",
};
export const openViber = () => {

  const phone = "09690960382"
  const cleanPhone = phone.replace(/\D/g, "");

  window.open(`viber://chat?number=%2B${cleanPhone}`, "_blank");
};
export const openTelegram = () => window.open('https://t.me/tz99x', '_blank');
export const openDiscord = () => window.open('https://discord.gg/your_invite', '_blank');

export const formatRandomRange = (value: number) => {
  const base = Number((value * 100).toFixed(3));

  const offset = 8 + Math.random() * 2; // 8 → 10

  const min = base;
  const max = base + offset;

  return `${min.toFixed(3)} - ${max.toFixed(3)}`;
};

export const baseURL =  "https://tz99x.com";
export const versionNo = "2.0.0"
// export const BASE_API_URL = "https://api.96betx.com"; ////PROD
// export const BASE_API_URL = "http://localhost:3000"; ////DEV
export const BASE_API_URL = "https://uat-api.tz99x.com" ////UAT
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

