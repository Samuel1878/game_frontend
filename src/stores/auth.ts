import { defineStore } from "pinia";
import { supabase } from "@/utils/supabase";
import type { supabaseUserRes } from "@/utils/types";
type authStoreType = {
  user:supabaseUserRes | null;
  token:string | null;
  isLoggedIn:boolean
}
export const useAuthStore = defineStore("auth", {
  state: ():authStoreType => ({
    user: null,
    token: null,
    isLoggedIn: false,
  }),
  actions: {
    logout() {
      this.token = null;
      this.user = null;
      this.isLoggedIn = false;
    },
    async login(payload: {
      // email?: string | null;
      // phone?: string | null;
      name?: string | null;
      // identidier?:string;
      password: string;
    }) {
      const { data, error } = await supabase
        .from("user")
        .select("*")
        .eq("name", payload.name)
        .eq("password", payload.password);
      if (error) {
        console.log(error);
        return;
      }
      console.log(data);
      this.user = data[0];
      this.token = data[0]?.uid;
      this.isLoggedIn = true;
      console.log("Auth", this.isLoggedIn)
    },

    async register(payload: { name?: string | null; password: string }) {
      const { data, error } = await supabase
        .from("user")
        .select("*")
        .eq("name", payload.name)
        .eq("password", payload.password);
      if (error) {
        console.log(error);
        return;
      }
      console.log(data);
      this.user = data[0];
      this.token = data[0]?.uid;
      this.isLoggedIn = true;
    },
  },

});
