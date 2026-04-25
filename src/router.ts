import HomeView from "@/screens/Home.vue";
import { createRouter, createWebHistory } from "vue-router";
import Withdraw from "@/screens/Withdrawal/index.vue";
import Deposit from "@/screens/Deposit/Deposit.vue";
import { useAuthStore } from "./stores/auth";
// import { useUIStore } from "./stores/ui";
import Payments from "./screens/Deposit/payments.vue";
import Profile from "./screens/User/Profile.vue";
import PaymentsWithdraw from "@/screens/Withdrawal/payment.vue";
import Help from "./screens/help.vue";
import Terms from "./screens/terms.vue";
import Policy from "./screens/policy.vue";
import Responsible from "./screens/responsible.vue";
import Transactions from "./screens/Transactions.vue";
import BankAccount from "./screens/User/bankAccount.vue";
import PhoneNumber from "./screens/User/phoneNumber.vue";
import Slots from "./screens/games/slots.vue";
import Buffalo from "./screens/games/buffalo.vue";
import Download from "./screens/download.vue";
import Fishing from "./screens/games/fishing.vue";
import Casino from "./screens/games/casino.vue";
import Arcade from "./screens/games/arcade.vue";
import Promotions from "@/screens/promotions/index.vue";
import PromotionDetail from "./screens/promotions/detail.vue";
import { useUIStore } from "./stores/ui";


const routes = [
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
    path: "/promotions/:id",
    component: PromotionDetail,
    meta: { requiresAuth: false },
  },
  {
    path: "/deposit",
    meta: { requiresAuth: true },
    component: Deposit,
  },
  {
    path: "/deposit/:payment_method",
    component: Payments,
    meta: { hideNavbar: true },
  },
  {
    path: "/withdraw",
    meta: { requiresAuth: true },
    component: Withdraw,
  },

  {
    path: "/withdraw/:payment_method",
    component: PaymentsWithdraw,
    meta: { hideNavbar: true },
  },
  {
    path: "/user/profile",
    meta: { requiresAuth: true },
    component: Profile,
  },
  {
    path: "/user/mobile-phone",
    component: PhoneNumber,
    meta: { hideNavbar: true },
  },
  {
    path: "/user/transactions",
    component: Transactions,
    meta: { requiresAuth: true },
  },
  {
    path: "/user/bank-accounts",
    component: BankAccount,
    meta: { hideNavbar: true },
  },
  {
    path: "/help",
    component: Help,
    meta: { requiresAuth: false },
  },
  {
    path: "/terms",
    component: Terms,
    meta: { requiresAuth: false },
  },
  {
    path: "/privacy",
    component: Policy,
    meta: { requiresAuth: false },
  },
  {
    path: "/responsible",
    component: Responsible,
    meta: { requiresAuth: false },
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

  if (!auth.initialized) {
    // await auth.init(); // IMPORTANT
  }

  if (to.meta.requiresAuth && !auth.accessToken) {
    ui.openAuthModal(to.fullPath);
    return { path: "/" };
  }

  return true;
});
router.beforeEach((to, from) => {
  console.log("➡️ navigating:", from.fullPath, "→", to.fullPath);
  return true;
});

router.afterEach((to) => {
  console.log("✅ arrived at:", to.fullPath);
});
export default router;
