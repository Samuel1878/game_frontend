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
import Help from "./screens/help.vue";
import Terms from "./screens/terms.vue";
import Policy from "./screens/policy.vue";
import Responsible from "./screens/responsible.vue";
import Transactions from "./screens/Transactions.vue";

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
    meta:{requiresAuth:true}
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
  {
    path:"/profile",
  component:Profile,
  meta:{requiresAuth:true}
},
{
 path:"/transactions",
  component:Transactions,
  meta:{requiresAuth:true}
},
 {
    path:"/help",
    component:Help,
    meta:{requiresAuth:false}
  },
   {
    path:"/terms",
    component:Terms,
    meta:{requiresAuth:false}
  },
   {
    path:"/privacy",
    component:Policy,
    meta:{requiresAuth:false}
  },
   {
    path:"/responsible",
    component:Responsible,
    meta:{requiresAuth:false}
  },
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
