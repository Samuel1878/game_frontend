import { defineStore } from "pinia";
import { ref } from "vue";

export const useReferralStore = defineStore("referral", () => {
  const referralCode = ref(localStorage.getItem("referral_code") || "");

  const setReferral = (code: string) => {
    referralCode.value = code;
    localStorage.setItem("referral_code", code);
  };

  const clearReferral = () => {
    referralCode.value = "";
    localStorage.removeItem("referral_code");
  };

  return { referralCode, setReferral, clearReferral };
});