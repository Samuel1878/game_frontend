import { defineStore } from "pinia";
import type { supabaseUserRes } from "@/utils/types";
import api from "@/services/api";
import { toast } from "vue-sonner";
type authStoreType = {
  user:supabaseUserRes | null;
  token:string | null;
  isLoggedIn:boolean;
  url:string | null;
}
export const useAuthStore = defineStore("auth", {
  state: ():authStoreType => ({
    user: null,
    token: null,
    isLoggedIn: false,
    url: null,
  }),
  actions: {
    logout() {
      this.token = null;
      this.user = null;
      this.isLoggedIn = false;
      this.url = null;
    
    },
    async login(payload: {
      name?: string | null;
      password: string;
    }) {
      try {
         const response = await api.post('/api/v1/auth/login', payload)
        console.log("response", response) 
        if (response.status === 200 || response.status === 201) {   
          this.user = response.data.user;
          this.token = response.data.token;   
          this.isLoggedIn = true;
          this.url = response.data.url;
          return
        }
        this.logout()
      } catch (error) {
        this.logout()
        console.log("error", error)
        return; 
      }

    },

    async register(payload: { name?: string | null; password: string }) {

      try {
        const response = await api.post('/api/v1/auth/register', payload)
        console.log("response", response) 
        if (response.status === 200 || response.status === 201) {   
          // this.user = response.data.user;
          // this.token = response.data.token;
          // this.isLoggedIn = true;   
          // this.url = response.data.url;
          toast.success("Registration successful! Please log in.");
          
          
          return
        }
        console.log("registration failed", response?.data)
        // this.logout()
      } catch (error) {
        // this.logout()
        console.log("error", error)
      }
   
    },
  },
  // persist: {
  //   key:"auth",
  //   storage: sessionStorage,
  // },

},
 
);
