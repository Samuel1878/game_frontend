import Home from "./screens/Home.vue";
import Games from "./screens/Games.vue";
import { createRouter, createWebHistory } from 'vue-router'
import Withdraw from "@/screens/Withdrawal/index.vue";
import Deposit from "./screens/Deposit/Deposit.vue";
import { useAuthStore } from "./stores/auth";
import { useUIStore } from "./stores/ui";
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
import Email from "./screens/User/email.vue";
import Slots from "./screens/games/slots.vue";
import Buffalo from "./screens/games/buffalo.vue";
import Download from "./screens/download.vue";
import Fishing from "./screens/games/fishing.vue";
import Casino from "./screens/games/casino.vue";
import Arcade from "./screens/games/arcade.vue";
import Promotions from "./screens/promotions/index.vue";
import PromotionDetail from "./screens/promotions/detail.vue";

const routes = [
  {
    path: '/',
    component: Home,
    meta: { requiresAuth: false },
  },
    {
    path: '/slots',
    component: Slots,
    meta: { requiresAuth: false },
  },
  {
    path:"/games",
    component:Games,
    meta:{requiresAuth:false}
  },
    {
    path:"/download",
    component:Download,
    meta:{requiresAuth:false}
  },
    {
    path:"/buffalo",
    component:Buffalo,
    meta:{requiresAuth:false}
  },
  {
    path:"/fishing",
    component:Fishing,
    meta:{requiresAuth:false}
  },
    {
    path:"/casino",
    component:Casino,
    meta:{requiresAuth:false}
  },
      {
    path:"/arcade-games",
    component:Arcade,
    meta:{requiresAuth:false}
  },

{
  path: '/promotions',
  meta: { requiresAuth: false },
  children: [
    {
      path: '',
      component: Promotions,
    },
    {
      path: ':id',
      component: PromotionDetail,
      meta:{ hideNavbar: true}
    }
  ]
},

{
  path: '/deposit',
  meta: { requiresAuth: true },
  children: [
    {
      path: '',
      component: Deposit,
    },
    {
      path: ':payment_method',
      component: Payments,
      meta:{ hideNavbar: true}
    }
  ]
},
{
  path: '/withdraw',
  meta: { requiresAuth: true },
  children: [
    {
      path: '',
      component: Withdraw,
    },
    {
      path: ':payment_method',
      component: PaymentsWithdraw,
        meta:{ hideNavbar: true}
    }
  ]
},
{
  path: '/user',
  meta: { requiresAuth: true },
  children: [
    {
      path: 'profile',
      component: Profile,
    },
    {
 path:"/transactions",
  component:Transactions,
  meta:{requiresAuth:true}
},
    {
      path: 'bank-accounts',
      component: BankAccount,
        meta:{ hideNavbar: true}
    },
    {
      path: 'kyc-verification',
      children: [
        {
          path: 'mobile-phone',
          component: PhoneNumber,
            meta:{ hideNavbar: true}
        },
        {
          path: 'email',
          component: Email,
            meta:{ hideNavbar: true}
        },
      ]
    }
  ]
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
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, _, next) => {
  const auth = useAuthStore()
  const ui = useUIStore()
  if (!auth.initialized) {
    // await auth.init();
  }
  if (to.meta.requiresAuth && !auth.accessToken) {
    ui.openAuthModal(to.fullPath) 
    return false 
  }
  next()
})

export default router
