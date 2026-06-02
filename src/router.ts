import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "./stores/auth";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

import HomeView from "@/screens/Home.vue";
import Profile from "@/screens/User/Profile.vue";
import Deposit from "@/screens/Deposit/Deposit.vue";
import Promotions from "@/screens/promotions/index.vue";
import Slots from "./screens/games/slots.vue";
import Buffalo from "./screens/games/buffalo.vue";
import Fishing from "./screens/games/fishing.vue";
import Casino from "./screens/games/casino.vue";
import GameView from "./gameView.vue";

const Withdraw = () => import("@/screens/Withdrawal/index.vue");
const Payments = () => import("./screens/Deposit/payments.vue");
const Help = () => import("./screens/help.vue");
const Terms = () => import("./screens/terms.vue");
const Policy = () => import("./screens/policy.vue");
const Responsible = () => import("./screens/responsible.vue");
const Transactions = () => import("./screens/transaction/transactions.vue");
const BankAccount = () => import("./screens/User/bankAccount.vue");
const Download = () => import("./screens/download.vue");
const Arcade = () => import("./screens/games/arcade.vue");
const DepositHistory = () => import("./screens/transaction/depositHistory.vue");
const WithdrawHistory = () =>
  import("./screens/transaction/withdrawHistory.vue");
// const GameView = () => import("./gameView.vue");
const Faq = () => import("./screens/faq.vue");
const BetList = () => import("./screens/betList.vue");
const Store = () => import("./screens/Withdrawal/store.vue");

NProgress.configure({ showSpinner: false });
const routes = [
  {
    path: "/game",
    component: GameView,
    meta: { hideNavbar: true, hideTopNav: true, requiresAuth: true },
  },
  {
    path: "/auth",
    name: "auth",
    component: () => import("@/screens/auth.vue"),
    meta: { hideNavbar: true, hideTopNav: true, requiresAuth: false },
  },
  {
    path: "/",
    component: HomeView,
    meta: { requiresAuth: false },
  },
  {
    path: "/slots",
    component: Slots,
    meta: { requiresAuth: false },
  },
  {
    path: "/buffalo",
    component: Buffalo,
    meta: { requiresAuth: false },
  },
  {
    path: "/fishing",
    component: Fishing,
    meta: { requiresAuth: false },
  },
  {
    path: "/casino",
    component: Casino,
    meta: { requiresAuth: false },
  },
  {
    path: "/arcade-games",
    component: Arcade,
    meta: { requiresAuth: false },
  },
  {
    path: "/promotions",
    meta: { requiresAuth: false },
    component: Promotions,
  },
  {
    path: "/deposit",
    meta: { hideNavbar: false, hideTopNav: false, requiresAuth: false },
    component: Deposit,
  },
  {
    path: "/deposit/:payment_method",
    component: Payments,
    meta: { hideNavbar: true, hideTopNav: true, requiresAuth: true },
  },
  {
    path: "/withdraw",
    meta: { requiresAuth: true, hideTopNav: false, hideNavbar: false },
    component: Withdraw,
  },
  {
    path: "/withdraw/store",
    meta: { requiresAuth: true, hideTopNav: true, hideNavbar: true },
    component: Store,
  },
  {
    path: "/user/profile",
    meta: { requiresAuth: false },
    component: Profile,
  },
  {
    path: "/user/transactions",
    component: Transactions,
    meta: { requiresAuth: true, hideTopNav: true, hideNavbar: true },
  },
  {
    path: "/user/deposit-history",
    component: DepositHistory,
    meta: { requiresAuth: true, hideTopNav: true, hideNavbar: true },
  },
  {
    path: "/user/deposit-history/detail/:id",
    component: () => import("@/screens/transaction/depoHisDetail.vue"),
    meta: { requiresAuth: true, hideTopNav: true, hideNavbar: true },
  },
  {
    path: "/user/withdraw-history",
    component: WithdrawHistory,
    meta: { requiresAuth: true, hideTopNav: true, hideNavbar: true },
  },
  {
    path: "/user/withdraw-history/detail/:id",
    component: () => import("@/screens/transaction/withdrawHisDetail.vue"),
    meta: { requiresAuth: true, hideTopNav: true, hideNavbar: true },
  },

  {
    path: "/user/security-center",
    component: () => import("@/screens/User/securityCenter.vue"),
    meta: { requiresAuth: true, hideTopNav: true, hideNavbar: true },
  },
  {
    path: "/user/security-center/update-password",
    component: () => import("@/screens/User/updatePassword.vue"),
    meta: { requiresAuth: true, hideTopNav: true, hideNavbar: true },
  },
  {
    path: "/user/security-center/fund-pin",
    component: () => import("@/screens/User/fundPin.vue"),
    meta: { requiresAuth: true, hideTopNav: true, hideNavbar: true },
  },
  {
    path: "/user/bank-accounts",
    component: BankAccount,
    meta: { hideNavbar: true, hideTopNav: true, requiresAuth: true },
  },
  {
    path: "/user/betlist",
    component: BetList,
    meta: { hideNavbar: true, hideTopNav: true, requiresAuth: true },
  },
  {
    path: "/user/agent-center",
    component: () => import("@/components/layout/agentLayout.vue"),
    meta: {
      requiresAuth: true,
      hideTopNav: true,
      hideNavbar: true,
      // isProtected: true,
    },
    children: [
      {
        path: "overview",
        component: () => import("@/screens/agent/overView.vue"),
      },
      {
        path: "users",
        component: () => import("@/screens/agent/users.vue"),
      },
      {
        path: "users/detail/:id",
        component: () => import("@/screens/agent/userDetail.vue"),
      },
      {
        path: "transactions",
        component: () => import("@/screens/agent/transactionView.vue"),
      },
      {
        path: "rewards",
        component: () => import("./screens/agent/rewards.vue"),
      },
    ],
  },
  {
    path: "/download",
    component: Download,
    meta: { requiresAuth: false, hideNavbar: true, hideTopNav: true },
  },
  {
    path: "/help",
    component: Help,
    meta: { requiresAuth: false, hideTopNav: true, hideNavbar: true },
  },
  {
    path: "/terms",
    component: Terms,
    meta: { requiresAuth: false, hideTopNav: true, hideNavbar: true },
  },
  {
    path: "/privacy",
    component: Policy,
    meta: { requiresAuth: false, hideTopNav: true, hideNavbar: true },
  },
  {
    path: "/responsible",
    component: Responsible,
    meta: { requiresAuth: false, hideTopNav: true, hideNavbar: true },
  },
  {
    path: "/faq",
    component: Faq,
    meta: { requiresAuth: false, hideTopNav: true, hideNavbar: true },
  },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: "smooth" };
  },
});
router.beforeEach(async (to, from) => {
  if (to.path !== from.path) {
    NProgress.start();
  }
  const auth = useAuthStore();
  // Guard Clause: Redirect unauthenticated requests to login
  if (to.meta.requiresAuth && !auth.accessToken) {
    NProgress.done();
    return {
      path: "/auth",
      query: { mode: "login" },
    };
  }
  return true;
});
router.afterEach(() => {
  NProgress.done();
});
router.onError((error) => {
  NProgress.done();
  const targetErrors = [
    "Failed to fetch dynamically imported module",
    "Loading chunk",
    "Dynamic import failed",
  ];
  const isChunkError = targetErrors.some((msg) => error.message?.includes(msg));
  if (!isChunkError) return;
  const reloaded = sessionStorage.getItem("chunk-reload");
  if (!reloaded) {
    sessionStorage.setItem("chunk-reload", "true");
    window.location.reload();
  }
});
export default router;
