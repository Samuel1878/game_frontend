import Home from "./screens/Home.vue";
import Games from "./screens/Games.vue";
import { createRouter, createWebHistory } from 'vue-router'
import AuthView from './components/Auth.vue'
import Withdraw from "./screens/Withdraw.vue";
import Deposit from "./screens/Deposit.vue";
import { useAuthStore } from "./stores/auth";
import { useUIStore } from "./stores/ui";

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
