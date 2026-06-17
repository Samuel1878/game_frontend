import {
  slot,
  buffalo,
  fish,
  casino,
  chess,
  home,
  kbzPay,
  wavePay,
  ayaPay,
  kbzBank,
  usdt,
} from "@/utils/assets";
import { baseURL, openChat } from "@/utils";
import type { Game } from "@/utils/types";
import router from "@/router";
import { useAuthStore } from "@/stores/auth";
import {
  AtSign,
  BanknoteArrowDown,
  CalendarArrowDown,
  CalendarArrowUp,
  CircleQuestionMark,
  ClipboardClock,
  Handshake,
  HatGlasses,
  Headset,
  Landmark,
  MonitorDown,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Spade,
  SquareArrowRight,
  Store,
  UserPlus,
  Wallet,
  type LucideIcon,
} from "lucide-vue-next";
import type { Component } from "vue";
import { toast } from "vue-sonner";
export const usdtRateToMMK = 4000;
export interface paymentTypes {
  id: number;
  label: string;
  value: string;
  icon: string;
}
export interface providersType {
  id: number;
  GpId: number;
  providerName: string;
  game: Game[];
}
export const amounts = [
  10000, 20000, 30000, 50000, 100000, 200000, 500000, 1000000,
];
export const paymentMethod: paymentTypes[] = [
  {
    id: 1,
    label: "KBZ Pay",
    value: "kbzPay",
    icon: kbzPay,
  },
  {
    id: 2,
    label: "Wave Pay",
    value: "wavePay",
    icon: wavePay,
  },
  {
    id: 3,
    label: "AYA Pay",
    value: "ayaPay",
    icon: ayaPay,
  },
  {
    id: 4,
    label: "CB Pay",
    value: "cbPay",
    icon: kbzPay,
  },
  {
    id: 5,
    label: "KBZ Bank",
    value: "kbzBank",
    icon: kbzBank,
  },
  {
    id: 6,
    label: "USDT",
    value: "usdt",
    icon: usdt,
  },
];
export const paymentMethodOption = [
  {
    id: 1,
    label: "all",
    value: "all",
  },
  {
    id: 2,
    label: "KBZ Pay",
    value: "kbzPay",
  },
  {
    id: 3,
    label: "Wave Pay",
    value: "wavePay",
  },
  {
    id: 4,
    label: "AYA Pay",
    value: "ayaPay",
  },
  {
    id: 5,
    label: "CB Pay",
    value: "cbPay",
  },
  {
    id: 6,
    label: "USDT",
    value: "usdt",
  },
  {
    id: 7,
    label: "KBZ Bank",
    value: "kbzBank",
  },
];
export const homeSlide = [
  {
    id: 1,
    image: "/images/slider_1.webp",
    cn_image: "/images/slider_1_cn.webp",
    title: "title_one",
    description: "description_one",
    button: "button_one",
    action: "",
  },
  {
    id: 2,
    image: "/images/slider_2.webp",
    cn_image: "/images/slider_2_cn.webp",
    title: "title_two",
    description: "description_two",
    button: "button_two",
    action: "",
  },
  {
    id: 3,
    image: "/images/slider_3.webp",
    cn_image: "/images/slider_3_cn.webp",
    title: "title_three",
    description: "description_three",
    button: "button_three",
    action: "",
  },
  {
    id: 4,
    image: "/images/slider_4.webp",
    cn_image: "/images/slider_4_cn.webp",
    title: "title_one",
    description: "description_one",
    button: "button_one",
    action: "",
  },
];
export const gameOptions = [
  {
    id: 1,
    path: "/",
    label: "lobby",
    image: home,
  },

  {
    id: 2,
    path: "/slots",
    label: "slots",
    image: slot,
  },
  {
    id: 3,
    path: "/buffalo",
    label: "buffalo",
    image: buffalo,
  },
  {
    id: 4,
    path: "/fishing",
    label: "fishing",
    image: fish,
  },
  {
    id: 5,
    path: "/casino",
    label: "casino",
    image: casino,
  },
  {
    id: 6,
    path: "/arcade-games",
    label: "arcade_games",
    image: chess,
  },
];
export const providerNames: Record<string | number, string> = {
  3: "PP",
  35: "PG",
  1020: "JILI",
  1046: "FC",
  1079: "Fastspin",
  1042: "KA",
  1034: "AP",
  1085: "VA",
  14: "SBO",
  1029: "568win",
  1094: "AFB",
  PRAGMATIC_PLAY: "Pragmatic Play",
  PG: "PG Soft",
  JILI: "JILI",
  FACHAI: "FaChai",
  CQ9: "CQ9",
  JDB: "JDB",
};
export const slotGameProviders = [
  {
    id: 1,
    name: "Pragmatic Play",
    GpId: "PRAGMATIC_PLAY",
    icon: "/providers/PP-WHITE.webp",
  },
  {
    id: 2,
    name: "PG Soft",
    GpId: "PG",
    icon: "/providers/PG-WHITE.webp",
  },
  {
    id: 3,
    name: "JILI",
    GpId: "JILI",
    icon: "/providers/JL-WHITE.webp",
  },

  {
    id: 4,
    name: "FaChai",
    GpId: "FACHAI",
    icon: "/providers/FC-WHITE.webp",
  },
  {
    id: 5,
    name: "CQ9",
    GpId: "CQ9",
    icon: "/providers/KA-WHITE.webp",
  },
  {
    id: 6,
    name: "JDB",
    GpId: "JDB",
    icon: "/providers/568.webp",
  },
];
export const UserAction = [
  {
    id: 1,
    label: "deposit",
    path: "/deposit",
    image: Wallet,
  },
  {
    id: 2,
    label: "withdraw",
    path: "/withdraw",
    image: BanknoteArrowDown,
  },
  {
    id: 3,
    label: "bank",
    path: "/user/bank-accounts",
    image: Landmark,
  },
];

interface MembershipType {
  id: number;
  label: string;
  action: () => void;
  image?: string; // image URL or asset path
  icon?: LucideIcon | Component; // Lucide icon component

  isComingSoon?: boolean;
}

export const MembershipCenter: MembershipType[] = [
  {
    id: 1,
    label: "security_center",
    action: () => {
      router.push("/user/security-center");
    },
    icon: ShieldCheck,
  },
  {
    id: 2,
    label: "deposit_history",
    action: () => {
      router.push("/user/deposit-history");
    },
    icon: CalendarArrowUp,
  },
  {
    id: 3,
    label: "withdraw_history",
    action: () => {
      router.push("/user/withdraw-history");
    },
    icon: CalendarArrowDown,
  },

  {
    id: 4,
    label: "transaction",
    action: () => {
      router.push("/user/transactions");
    },
    icon: ClipboardClock,
  },
  {
    id: 5,
    label: "agent_center",
    action: () => {
      router.push("/user/agent-center/overview");
    },
    icon: UserPlus,
  },

  {
    id: 6,
    label: "partnership",
    action: () => {
      router.push("/withdraw/store");
    },
    icon: Store,
  },

  {
    id: 7,
    label: "bet_list",
    action: () => {
      router.push("/user/betlist");
    },
    isComingSoon: true,
    icon: Spade,
  },
  {
    id: 8,
    label: "customer_service",
    action: () => {
      openChat();
    },
    icon: Headset,
  },
  {
    id: 9,
    label: "share",
    action: async() => {
        await navigator.clipboard.writeText(baseURL);
        toast.success(baseURL)
    },
    isComingSoon: true,
    icon: Share2,
  },

  {
    id: 10,
    label: "download_app",
    action: () => {
      router.push("/download");
    },
    icon: MonitorDown,
    // image:download
  },
  {
    id: 11,
    label: "help_center",
    action: () => {
      router.push("/help");
    },
    icon: AtSign,
  },

  {
    id: 12,
    label: "terms_and_conditions",
    action: () => {
      router.push("/terms");
    },
    icon: Handshake,
  },
  {
    id: 13,
    label: "policy_and_privacy",
    action: () => {
      router.push("/privacy");
    },
    icon: HatGlasses,
  },
  {
    id: 14,
    label: "responsible_gaming",
    action: () => {
      router.push("/responsible");
    },
    icon: ShieldAlert,
  },
  {
    id: 15,
    label: "faq",
    action: () => {
      router.push("/faq");
    },
    icon: CircleQuestionMark,
  },
  {
    id: 16,
    label: "logout",
    action: () => {
      const auth = useAuthStore();
      auth.logout();
    },
    icon: SquareArrowRight,
  },
];
