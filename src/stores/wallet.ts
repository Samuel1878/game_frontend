
import { defineStore } from "pinia";
import { ref } from "vue";

export const useWallet = defineStore('wallet', () => {
  const balance = ref<number>(0);
  const currency = ref<string>("");

  const setWallet = (b:number, c:string) => {
    balance.value = b;
    currency.value = c;
  };
  const resetWallet = () => {
    balance.value = 0;
    currency.value = "";
  }
  return {
    balance,
    currency,
    setWallet,
    resetWallet
  }
})