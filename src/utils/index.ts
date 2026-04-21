import kbzLogo from "@/assets/image/kbzpay.svg";
import wavePayLogo from "@/assets/image/wavepay.jpeg";
import ayaPayLogo from "@/assets/image/ayaPay.jpeg"
import usdtLogo from "@/assets/image/USDT.png";
import VA_Gaming from "@/assets/image/va-white.webp";
import PG_Soft from "@/assets/image/PG-WHITE.png";
import Fast_Spin from "@/assets/image/fast_spin.png";
import Jili from "@/assets/image/JL-WHITE.png";
import FaChai from "@/assets/image/FC-WHITE.png";
import KA_Gaming from "@/assets/image/KA-WHITE.png";
import Pragmatic_Play from "@/assets/image/PP-WHITE.png";
import Advantplay from "@/assets/image/advant_play.png";

import banner_1 from "@/assets/image/slider_1.svg";
import banner_2 from "@/assets/image/slider_2.svg";
import banner_3 from "@/assets/image/slider_3.svg";
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
import logo from "@/assets/Logo.png"
export {
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

export function getGameIcon(game: Game): string | undefined {
  const en = game.gameInfos[0];
  if (en?.gameIconUrl) return en.gameIconUrl

  const zh = game.gameInfos[1];
  return zh?.gameIconUrl
}