import HomeView from "@/screens/Home.vue";
import { createRouter, createWebHistory } from "vue-router";
import Withdraw from "@/screens/Withdrawal/index.vue";
import Deposit from "@/screens/Deposit/Deposit.vue";
import { useAuthStore } from "./stores/auth";
import Payments from "./screens/Deposit/payments.vue";
import Profile from "./screens/User/Profile.vue";
import Help from "./screens/help.vue";
import Terms from "./screens/terms.vue";
import Policy from "./screens/policy.vue";
import Responsible from "./screens/responsible.vue";
import Transactions from "./screens/transaction/transactions.vue";
import BankAccount from "./screens/User/bankAccount.vue";
import Slots from "./screens/games/slots.vue";
import Buffalo from "./screens/games/buffalo.vue";
import Download from "./screens/download.vue";
import Fishing from "./screens/games/fishing.vue";
import Casino from "./screens/games/casino.vue";
import Arcade from "./screens/games/arcade.vue";
import Promotions from "@/screens/promotions/index.vue";
import { useUIStore } from "./stores/ui";
import UpdatePassword from "./screens/User/updatePassword.vue";
import DepositHistory from "./screens/transaction/depositHistory.vue";
import WithdrawHistory from "./screens/transaction/withdrawHistory.vue";
import GameView from "./gameView.vue";
import Faq from "./screens/faq.vue";
import BetList from "./screens/betList.vue";
import Store from "./screens/Withdrawal/store.vue";

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
    component: Deposit,
  },
  {
    path: "/deposit/:payment_method",
    component: Payments,
    meta: { hideNavbar: true , hideTopNav:true, requiresAuth:true},
  },
  {
    path: "/withdraw",
    meta: { requiresAuth: true, hideTopNav:false, hideNavbar:false },
    component: Withdraw,
  },
    {
    path: "/withdraw/store",
    meta: { requiresAuth: false, hideTopNav:true, hideNavbar:true },
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

router.beforeEach(async (to) => {
  const auth = useAuthStore();
  const ui = useUIStore()

  // if (!auth.initialized) {
  //   await auth.init(); // IMPORTANT
  // }

  if (to.meta.requiresAuth && !auth.accessToken) {
    ui.openAuthModal(to.fullPath);
    return { path: "/" };
  }
  // if (to.meta.isProtected && auth.user?.agent_id===0) {
  //   return { path: "/" };
  // }

  return true;
});
// router.beforeEach((to, from) => {
//   console.log("➡️ navigating:", from.fullPath, "→", to.fullPath);
//   return true;
// });

// router.afterEach((to) => {
//   console.log("✅ arrived at:", to.fullPath);
// });
export default router;
