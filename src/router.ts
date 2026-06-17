import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "./stores/auth";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const HomeView = () => import("@/screens/Home.vue");
const Profile = () => import("@/screens/User/Profile.vue");
const Deposit = () => import("@/screens/Deposit/Deposit.vue");
const Promotions = () => import("@/screens/promotions/index.vue");
const Slots = () => import("./screens/games/slots.vue");
const Buffalo = () => import("./screens/games/buffalo.vue");
const Fishing = () => import("./screens/games/fishing.vue");
const Casino = () => import("./screens/games/casino.vue");
const GameView = () => import("./gameView.vue");
const Auth = () => import("./screens/auth.vue");
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
const Faq = () => import("./screens/faq.vue");
const BetList = () => import("./screens/betList.vue");
const Store = () => import("./screens/Withdrawal/store.vue");
const TransactionDetail = () =>
  import("@/screens/transaction/transactionDetail.vue");

NProgress.configure({ showSpinner: false });
const routes = [
  {
    path: "/game/play",
    name: "game-play",
    component: GameView,
    meta: {
      hideNavbar: true,
      hideTopNav: true,
      requiresAuth: true,
      keepAlive: false,
    },
  },
  {
    path: "/game",
    redirect: (to: any) => ({
      path: "/game/play",
      query: to.query,
    }),
  },
  {
    path: "/auth",
    name: "auth",
    component: Auth,
    meta: {
      hideNavbar: true,
      hideTopNav: true,
      requiresAuth: false,
      guestOnly: true,
      keepAlive: false,
    },
  },
  {
    path: "/",
    component: HomeView,
    meta: { requiresAuth: false, keepAlive: true },
  },
  {
    path: "/slots",
    component: Slots,
    meta: { requiresAuth: false, keepAlive: true },
  },
  {
    path: "/buffalo",
    component: Buffalo,
    meta: { requiresAuth: false, keepAlive: true },
  },
  {
    path: "/fishing",
    component: Fishing,
    meta: { requiresAuth: false, keepAlive: true },
  },
  {
    path: "/casino",
    component: Casino,
    meta: { requiresAuth: false, keepAlive: true },
  },
  {
    path: "/arcade-games",
    component: Arcade,
    meta: { requiresAuth: false, keepAlive: true },
  },
  {
    path: "/promotions",
    meta: { requiresAuth: false, keepAlive: true },
    component: Promotions,
  },
  {
    path: "/deposit",
    meta: {
      hideNavbar: false,
      hideTopNav: false,
      requiresAuth: false,
      keepAlive: false,
    },
    component: Deposit,
  },
  {
    path: "/deposit/:payment_method",
    component: Payments,
    meta: {
      hideNavbar: true,
      hideTopNav: true,
      requiresAuth: true,
      keepAlive: false,
    },
  },
  {
    path: "/withdraw",
    meta: {
      requiresAuth: true,
      hideTopNav: false,
      hideNavbar: false,
      keepAlive: false,
    },
    component: Withdraw,
  },
  {
    path: "/withdraw/store",
    meta: {
      requiresAuth: true,
      hideTopNav: true,
      hideNavbar: true,
      keepAlive: true,
    },
    component: Store,
  },
  {
    path: "/user/profile",
    meta: { requiresAuth: true, keepAlive: true },
    component: Profile,
  },
  {
    path: "/user/transactions",
    component: Transactions,
    meta: {
      requiresAuth: true,
      hideTopNav: true,
      hideNavbar: true,
      keepAlive: false,
    },
  },
  {
    path: "/user/transactions/detail",
    component: TransactionDetail,
    meta: {
      requiresAuth: true,
      hideTopNav: true,
      hideNavbar: true,
      keepAlive: false,
    },
  },
  {
    path: "/user/deposit-history",
    component: DepositHistory,
    meta: {
      requiresAuth: true,
      hideTopNav: true,
      hideNavbar: true,
      keepAlive: false,
    },
  },
  {
    path: "/user/deposit-history/detail/:id",
    component: () => import("@/screens/transaction/depoHisDetail.vue"),
    meta: {
      requiresAuth: true,
      hideTopNav: true,
      hideNavbar: true,
      keepAlive: false,
    },
  },
  {
    path: "/user/withdraw-history",
    component: WithdrawHistory,
    meta: {
      requiresAuth: true,
      hideTopNav: true,
      hideNavbar: true,
      keepAlive: false,
    },
  },
  {
    path: "/user/withdraw-history/detail/:id",
    component: () => import("@/screens/transaction/withdrawHisDetail.vue"),
    meta: {
      requiresAuth: true,
      hideTopNav: true,
      hideNavbar: true,
      keepAlive: false,
    },
  },

  {
    path: "/user/security-center",
    component: () => import("@/screens/User/securityCenter.vue"),
    meta: {
      requiresAuth: true,
      hideTopNav: true,
      hideNavbar: true,
      keepAlive: true,
    },
  },
  {
    path: "/user/security-center/update-password",
    component: () => import("@/screens/User/updatePassword.vue"),
    meta: {
      requiresAuth: true,
      hideTopNav: true,
      hideNavbar: true,
      keepAlive: false,
    },
  },
  {
    path: "/user/security-center/fund-pin",
    component: () => import("@/screens/User/fundPin.vue"),
    meta: {
      requiresAuth: true,
      hideTopNav: true,
      hideNavbar: true,
      keepAlive: false,
    },
  },
  {
    path: "/user/bank-accounts",
    component: BankAccount,
    meta: {
      hideNavbar: true,
      hideTopNav: true,
      requiresAuth: true,
      keepAlive: false,
    },
  },
  {
    path: "/user/betlist",
    component: BetList,
    meta: {
      hideNavbar: true,
      hideTopNav: true,
      requiresAuth: true,
      keepAlive: false,
    },
  },
  {
    path: "/user/agent-center",
    component: () => import("@/components/layout/agentLayout.vue"),
    meta: {
      requiresAuth: true,
      hideTopNav: true,
      hideNavbar: true,
      keepAlive: false,
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
    meta: {
      requiresAuth: false,
      hideNavbar: true,
      hideTopNav: true,
      keepAlive: true,
    },
  },
  {
    path: "/help",
    component: Help,
    meta: {
      requiresAuth: false,
      hideTopNav: true,
      hideNavbar: true,
      keepAlive: true,
    },
  },
  {
    path: "/terms",
    component: Terms,
    meta: {
      requiresAuth: false,
      hideTopNav: true,
      hideNavbar: true,
      keepAlive: true,
    },
  },
  {
    path: "/privacy",
    component: Policy,
    meta: {
      requiresAuth: false,
      hideTopNav: true,
      hideNavbar: true,
      keepAlive: true,
    },
  },
  {
    path: "/responsible",
    component: Responsible,
    meta: {
      requiresAuth: false,
      hideTopNav: true,
      hideNavbar: true,
      keepAlive: true,
    },
  },
  {
    path: "/faq",
    component: Faq,
    meta: {
      requiresAuth: false,
      hideTopNav: true,
      hideNavbar: true,
      keepAlive: true,
    },
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
  if (!auth.initialized) {
    await auth.init();
  }

  if (to.meta.guestOnly && auth.isLoggedIn) {
    NProgress.done();
    return "/";
  }

  if (auth.isLoggedIn && auth.isBlocked) {
    auth.clearAuth();
    NProgress.done();
    return {
      path: "/auth",
      query: { mode: "login", reason: "account_disabled" },
    };
  }

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
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
