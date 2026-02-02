// import { defineStore } from "pinia";
// import { ref, computed } from "vue";

// export const useAuthStore = defineStore("auth", () => {
//   const user = ref(null);
//   const token = ref(localStorage.getItem("token") || null);

//   const isAuthenticated = computed(() => !!token.value);

//   const login = (userData:any, accessToken:string) =>{
//     user.value = userData;
//     token.value = accessToken;
//     localStorage.setItem("token", accessToken);
//     localStorage.setItem("user", JSON.stringify(userData));
//   }

//   function loadFromStorage() {
//     const savedUser = localStorage.getItem("user");
//     const savedToken = localStorage.getItem("token");

//     if (savedUser && savedToken) {
//       user.value = JSON.parse(savedUser);
//       token.value = savedToken;
//     }
//   }

//   const logout = () => {
//     user.value = null;
//     token.value = null;
    
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//   }

//   return {
//     user,
//     token,
//     isAuthenticated,
//     login,
//     logout,
//     loadFromStorage,
//   };
// });
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<any>(null)
  const isLoggedIn = computed(() => !!token.value)

  const setAuth = (newToken: string, userData: any) => {
    token.value = newToken
    user.value = userData
    localStorage.setItem('token', newToken)
    api.defaults.headers.common.Authorization = `Bearer ${newToken}`
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    delete api.defaults.headers.common.Authorization
  }

  const login = async (payload: { email?: string; phone?: string; password: string }) => {
    const { data } = await api.post('/api/v1/login', payload)
    setAuth(data.token, data.user)
  }

  const register = async (payload: {
    username: string
    email?: string
    phone?: string
    password: string
  }) => {
    const { data } = await api.post('/api/v1/register', payload)
    setAuth(data.token, data.user) 
  }

  return {
    token,
    user,
    isLoggedIn,
    login,
    register,
    logout,
  }
})
