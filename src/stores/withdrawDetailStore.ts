import type {  withdrawalInfo } from "@/utils/types";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useWithdrawStore = defineStore('withdraw', () => {
  const selectedWithdrawal = ref<withdrawalInfo | null>(null);

  const setWithdrawal = (withdrawal: withdrawalInfo) => {
    selectedWithdrawal.value = withdrawal;
  };

  const clearWithdrawal = () => {
    selectedWithdrawal.value = null;
  };

  return {
    selectedWithdrawal,
    setWithdrawal,
    clearWithdrawal,
  };
});