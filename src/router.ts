
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "./stores/auth";
import { useUIStore } from "./stores/ui";
import HomeView from "@/screens/Home.vue";
const Payments = () => import("./screens/Deposit/payments.vue");
const Profile = () => import("./screens/User/Profile.vue");
const Help = () => import("./screens/help.vue");
const Terms = () => import("./screens/terms.vue");
const Policy = () => import("./screens/policy.vue");
const Responsible = () => import("./screens/responsible.vue");
const Transactions = () => import("./screens/transaction/transactions.vue");
const BankAccount = () => import("./screens/User/bankAccount.vue");
const Slots = () => import("./screens/games/slots.vue");
const Buffalo = () => import("./screens/games/buffalo.vue");
const Download = () => import("./screens/download.vue");
const Fishing = () => import("./screens/games/fishing.vue");
const Casino = () => import("./screens/games/casino.vue");
const Arcade = () => import("./screens/games/arcade.vue");
const Promotions = () => import("@/screens/promotions/index.vue");
const UpdatePassword = () => import("./screens/User/updatePassword.vue");
const DepositHistory = () => import("./screens/transaction/depositHistory.vue");
const WithdrawHistory = () => import("./screens/transaction/withdrawHistory.vue");
const GameView = () => import("./gameView.vue");
const Faq = () => import("./screens/faq.vue");
const BetList = () => import("./screens/betList.vue");
const Store = () => import("./screens/Withdrawal/store.vue");
const routes = [
  {
    path:"/game",
    component : GameView,
    meta: { hideNavbar:true,hideTopNav:true, requiresAuth:true },
    
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
    path: "/download",
    component: Download,
    meta: { requiresAuth: false ,hideNavbar:true,hideTopNav:true},
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
    meta: { hideNavbar:false,hideTopNav:false, requiresAuth:false },
    component: import("@/screens/Deposit/Deposit.vue"),
  },
  {
    path: "/deposit/:payment_method",
    component: Payments,
    meta: { hideNavbar: true , hideTopNav:true, requiresAuth:true},
  },
  {
    path: "/withdraw",
    meta: { requiresAuth: true, hideTopNav:false, hideNavbar:false },
    component: () => import("@/screens/Withdrawal/index.vue"),
  },
    {
    path: "/withdraw/store",
    meta: { requiresAuth: true, hideTopNav:true, hideNavbar:true },
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
    meta: { requiresAuth: true ,hideTopNav:true, hideNavbar:true},
  },
    {
    path: "/user/deposit-history",
    component: DepositHistory,
    meta: { requiresAuth: true,hideTopNav:true, hideNavbar:true },
  },
      {
    path: "/user/withdraw-history",
    component: WithdrawHistory,
    meta: { requiresAuth: true,hideTopNav:true, hideNavbar:true },
  },
  {
    path: "/user/update-password",
    component: UpdatePassword,
    meta: { requiresAuth: true ,hideTopNav:true, hideNavbar:true},
  },
  {
    path: "/user/bank-accounts",
    component: BankAccount,
    meta: { hideNavbar: true, hideTopNav:true,requiresAuth: true  },
  },
    {
    path: "/user/betlist",
    component: BetList,
    meta: { hideNavbar: true, hideTopNav:true,requiresAuth: true  },
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
    path: "/help",
    component: Help,
    meta: { requiresAuth: false,hideTopNav:true,hideNavbar: true  },
  },
  {
    path: "/terms",
    component: Terms,
    meta: { requiresAuth: false ,hideTopNav:true,hideNavbar: true},
  },
  {
    path: "/privacy",
    component: Policy,
    meta: { requiresAuth: false ,hideTopNav:true,hideNavbar: true},
  },
  {
    path: "/responsible",
    component: Responsible,
    meta: { requiresAuth: false,hideTopNav:true,hideNavbar: true },
  },
  {
    path: "/faq",
    component: Faq,
    meta: { requiresAuth: false,hideTopNav:true,hideNavbar: true },
  },
  { path: '/:pathMatch(.*)*', redirect:"/" },


];

const router = createRouter({
  history: createWebHistory(),
  routes,
 
});
router.afterEach(() => {
  requestAnimationFrame(() => {
    window.scrollTo(0, 0);
  });
});

router.beforeEach(async (to,from) => {
  const auth = useAuthStore();
  const ui = useUIStore()
  if (to.meta.requiresAuth && !auth.accessToken) {
    ui.openAuthModal(to.fullPath);
    return { path: "/" };
  }
  if (from.name === "game") {
    auth.fetchUser();
  }

  return true;
});

export default router;
