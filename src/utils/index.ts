
import en from "@/assets/localization/en.json";
import mm from "@/assets/localization/mm.json";
import cn from "@/assets/localization/cn.json";
import menu from "@/assets/icon/menu.svg";
import hot from "@/assets/icon/hot.svg";
import hot_icon from "@/assets/icon/hot_icon.svg";
import hot_rtp_icon from "@/assets/icon/hot_rtp_icon.svg";
import top_icon from "@/assets/icon/top_icon.svg";
import type { Game } from "./types";
import cn_flag from "@/assets/flags/cn.png";
import en_flag from "@/assets/flags/eng.png";
import mm_flag from "@/assets/flags/mm.png";
import bank_ico from "@/assets/icon/ico-bank.svg";
import clipboard_ico from "@/assets/icon/ico-clipboard.svg";
import receipt_icon from "@/assets/icon/ico-receipt.svg";
import wallet_icon from "@/assets/icon/ico-wallet.svg";
import in_icon from "@/assets/icon/icon-in.svg"
import home from "@/assets/icon/home.png";
import buffalo from "@/assets/icon/buffalo.png";
import slot from "@/assets/icon/slot.png";
import fish from "@/assets/icon/fish.png";
import casino from "@/assets/icon/livecasino.png";
import chess from "@/assets/icon/chess.png";
import accountCenter from "@/assets/icon/account-center.png"
import depositHistoryIcon from "@/assets/icon/deposit-yellow.png";
import withdrawHistoryIcon from "@/assets/icon/withdraw-yellow.png";
import helpCenter  from "@/assets/icon/help-center.svg"
import transaction from "@/assets/icon/money-statement.png";
import share from "@/assets/icon/invite-code.png";
import services from "@/assets/icon/24-7.png";
import moment from "moment-timezone"
export {
  helpCenter,
  share,
  transaction,
  accountCenter,
  depositHistoryIcon,
  withdrawHistoryIcon,
  fish,
  casino,
  chess,
  slot,
  services,
  buffalo,
  home,
  cn_flag,
  en_flag,
  mm_flag, 
  bank_ico,
  clipboard_ico,
  receipt_icon,
  wallet_icon,
  in_icon
}
export {
  hot_icon,
  hot_rtp_icon,
  top_icon,
  hot,
    en,
    mm,
    cn,
    menu
}

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
export const versionNo = "1.0.2"
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

export const toISOStringSafe = (
  value?: string | Date
) => {

  if (!value) return "";

  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString();
};

export const formatMyanmarTime =(date?: string) => {
  if (!date) return "-";

  return moment.tz(date, "America/New_York")
    .tz("Asia/Yangon")
    .format("YYYY-MM-DD HH:mm:ss");
};