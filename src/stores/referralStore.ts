import { defineStore } from "pinia";
import { ref } from "vue";

export const useReferralStore = defineStore("referral", () => {
  const referralCode = ref(localStorage.getItem("referral_code") || "");
  const fromRid = ref(false);
  const setReferral = (code: string) => {
    referralCode.value = code;
    localStorage.setItem("referral_code", code);
    fromRid.value = true
  };

  const clearReferral = () => {
    referralCode.value = "";
    localStorage.removeItem("referral_code");
    fromRid.value = false
  };

  return { referralCode, setReferral, clearReferral, fromRid };
});