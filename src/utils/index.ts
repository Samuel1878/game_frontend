import kbzLogo from "@/assets/image/kbzpay.svg";
import wavePayLogo from "@/assets/image/wavepay.jpeg";
import ayaPayLogo from "@/assets/image/ayabanking.png"
import usdtLogo from "@/assets/image/USDT.png";
import VA_Gaming from "@/assets/image/va-white.webp";
import PG_Soft from "@/assets/image/PG-WHITE.png";
import Fast_Spin from "@/assets/image/fast_spin.png";
import Jili from "@/assets/image/JL-WHITE.png";
import FaChai from "@/assets/image/FC-WHITE.png";
import KA_Gaming from "@/assets/image/KA-WHITE.png";
import Pragmatic_Play from "@/assets/image/PP-WHITE.png";
import Advantplay from "@/assets/image/advant_play.png";

import banner_1 from "@/assets/image/slider_1.jpg";
import banner_2 from "@/assets/image/slider_2.jpg";
import banner_3 from "@/assets/image/slider_3.jpg";
import banner_4 from "@/assets/image/slider_4.jpg";
import en from "@/assets/localization/en.json";
import mm from "@/assets/localization/mm.json";
import cn from "@/assets/localization/cn.json";
import menu from "@/assets/icon/menu.svg";

import _18_plus from "@/assets/image/18plus.svg";
import askgamblers from "@/assets/image/askgamblers.svg";
import bank_transfer from "@/assets/image/bank_transfer.svg";
import discord from "@/assets/image/discord.svg";
import download_white from "@/assets/image/download_white.svg";
import drops_wins from "@/assets/image/drops_wins.svg";
import facebook from "@/assets/image/facebook.svg";
import facebook_black from "@/assets/image/facebook_black.svg";
import ga from "@/assets/image/ga.svg";
import gambling_therapy from "@/assets/image/gambling_therapy.svg";
import gamcare from "@/assets/image/gamcare.svg";
import golds_box from "@/assets/image/golds_box.svg";
import hot from "@/assets/image/hot.svg";

import new_svg from "@/assets/image/new.svg";
// import pg_white from "@/assets/image/pg_white.svg";
// import pp_white from "@/assets/image/pp_white.svg";
import spin_svg from "@/assets/image/spin.svg";
import star_svg from "@/assets/image/star.svg";
import telegram from "@/assets/image/telegram.svg";
import telegram_black from "@/assets/image/telegram_black.svg";
import trust from "@/assets/image/trust.svg";
import viber from "@/assets/image/viber.svg";
import viber_black from "@/assets/image/viber_black.svg";
import hot_icon from "@/assets/icon/hot_icon.svg";
import hot_rtp_icon from "@/assets/icon/hot_rtp_icon.svg";
import top_icon from "@/assets/icon/top_icon.svg";
import hot_rtp from "@/assets/image/hot_rtp.svg";

import paysafe from "@/assets/image/paysafe.svg";
import softswiss from "@/assets/image/softswiss.svg";
import ssl_icon from "@/assets/image/ssl_icon.svg";
import discord_black from "@/assets/image/discord_black.svg";
import type { Game } from "./types";
import phone from "@/assets/image/phone.svg";
import profile from "@/assets/image/profile.png";
import cn_flag from "@/assets/image/cn.png";
import en_flag from "@/assets/image/eng.png";
import mm_flag from "@/assets/image/mm.png";
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
import logo from "@/assets/Logo.png";
import kbzBanking from "@/assets/image/kbzbanking-new.png"
import accountCenter from "@/assets/icon/account-center.png"
import depositHistoryIcon from "@/assets/icon/deposit-yellow.png";
import withdrawHistoryIcon from "@/assets/icon/withdraw-yellow.png";
import helpCenter  from "@/assets/icon/help-center.svg"
import download from "@/assets/icon/download.png";
import transaction from "@/assets/icon/money-statement.png";
import share from "@/assets/icon/invite-code.png";
import logout from "@/assets/icon/logout.svg"
import sbo from "@/assets/image/sbo.png";
import _568 from "@/assets/image/568.png";

export {
  sbo,
  _568,
  logout,
  helpCenter,
  share,
  download,
  transaction,
  accountCenter,
  depositHistoryIcon,
  withdrawHistoryIcon,
  kbzBanking,
  logo,
  fish,
  casino,
  chess,
  slot,
  paysafe,
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
  profile,
  phone,
  discord_black,
  ssl_icon,
  softswiss,
  hot_rtp,
  hot_icon,
  hot_rtp_icon,
  top_icon,
  _18_plus,
  askgamblers,
  bank_transfer,
  discord,
  download_white,
  drops_wins,
  facebook,
  facebook_black,
  ga,
  gambling_therapy,
  gamcare,
  golds_box,
  hot,
  new_svg,

  spin_svg,
  star_svg,
  telegram,
  telegram_black,
  trust,
  viber,
  viber_black,

banner_4,
    kbzLogo,
    ayaPayLogo,
    wavePayLogo,
    usdtLogo,
    VA_Gaming,
    PG_Soft,
    FaChai,
    Fast_Spin,
    Jili,
    KA_Gaming,
    Pragmatic_Play,
    Advantplay,
    banner_1,
    banner_2,
    banner_3,
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

  return icon || logo;
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
export const openViber = () => window.open('https://viber.com', '_blank');
export const openTelegram = () => window.open('https://t.me/samuelalalax', '_blank');
export const openDiscord = () => window.open('https://discord.gg/your_invite', '_blank');

export const formatRandomRange = (value: number) => {
  const base = Number((value * 100).toFixed(3));

  const offset = 8 + Math.random() * 2; // 8 → 10

  const min = base;
  const max = base + offset;

  return `${min.toFixed(3)} - ${max.toFixed(3)}`;
};


export const baseURL =  "https://96betx.com";