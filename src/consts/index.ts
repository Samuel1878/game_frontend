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
    label: "KBZ Bank",
    value: "kbzBank",
    icon: kbzBank,
  },
  {
    id: 5,
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
    label: "USDT",
    value: "usdt",
  },
  {
    id: 6,
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

export const slotGameProviders = [
  {
    id: 1,
    name: "Pragmatic Play",
    GpId: 3,
    icon: "/providers/PP-WHITE.webp",
  },
  {
    id: 2,
    name: "PG Soft",
    GpId: 35,
    icon: "/providers/PG-WHITE.webp",
  },
  {
    id: 3,
    name: "JILI",
    GpId: 1020,
    icon: "/providers/JL-WHITE.webp",
  },

  {
    id: 4,
    name: "FaChoi",
    GpId: 1046,
    icon: "/providers/FC-WHITE.webp",
  },
  {
    id: 5,
    name: "Fastspin",
    GpId: 1079,
    icon: "/providers/fast_spin.webp",
  },

  {
    id: 6,
    name: "KA Gaming",
    GpId: 1042,
    icon: "/providers/KA-WHITE.webp",
  },
  {
    id: 7,
    name: "Advantplay",
    GpId: 1034,
    icon: "/providers/advant_play.webp",
  },
  {
    id: 8,
    name: "VA Gaming",
    GpId: 1085,
    icon: "/providers/va-white.webp",
  },

  {
    id: 10,
    name: "SBO games",
    GpId: 14,
    icon: "/providers/sbo.webp",
  },
  {
    id: 11,
    name: "568Win Games",
    GpId: 1029,
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
