import type {  Transaction } from "@/utils/types";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useTransactionDetail = defineStore('transactionDetail', () => {
  const selectedTransaction = ref<Transaction | null>(null);

  const setTransaction = (transaction: Transaction) => {
    selectedTransaction.value = transaction;
  };

  const clearTransaction = () => {
    selectedTransaction.value = null;
  };

  return {
    selectedTransaction,
    setTransaction,
    clearTransaction,
  };
});