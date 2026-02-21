import Home from "./screens/Home.vue";
import Games from "./screens/Games.vue";
import { createRouter, createWebHistory } from 'vue-router'
import Withdraw from "@/screens/Withdrawal/index.vue";
import Deposit from "./screens/Deposit/Deposit.vue";
import { useAuthStore } from "./stores/auth";
import { useUIStore } from "./stores/ui";
import Payments from "./screens/Deposit/payments.vue";
import Profile from "./screens/Profile.vue";
import PaymentsWithdraw from "@/screens/Withdrawal/payment.vue";

const routes = [
  {
    path: '/',
    component: Home,
    meta: { requiresAuth: false },
  },
  {
    path:"/games",
    component:Games,
    meta:{requiresAuth:false}
  },
  {
    path:"/withdrawal",
    component:Withdraw,
    meta:{requiresAuth:true}
  },
  {
    path:"/deposit",
    component:Deposit,
    meta:{requiresAuth:false}
  },
  {
    path:"/deposit/:payment_method",
    component:Payments,
    meta:{requiresAuth:true}
  },

  {
    path:"/withdraw/:payment_method",
    component:PaymentsWithdraw,
    meta:{requiresAuth:true}
  },
  {path:"/profile",
  component:Profile,
  meta:{requiresAuth:true}
}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  const ui = useUIStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    ui.openAuthModal(to.fullPath) 
    return false 
  }
})

export default router
