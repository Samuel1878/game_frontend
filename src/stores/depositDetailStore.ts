import type { depositFormData } from "@/utils/types";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useDepositStore = defineStore('deposit', () => {
  const selectedDeposit = ref<depositFormData | null>(null);

  const setDeposit = (deposit: depositFormData) => {
    selectedDeposit.value = deposit;
  };

  const clearDeposit = () => {
    selectedDeposit.value = null;
  };

  return {
    selectedDeposit,
    setDeposit,
    clearDeposit,
  };
});