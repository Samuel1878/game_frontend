import { defineStore } from "pinia";
import {
  getUserBankAccountAPI,
  addBankAccountAPI,
  updateBankAccountAPI,
  deleteBankAccountAPI,
} from "@/services/authAPI";
import type { BankAccount, BankAccountPros } from "@/utils/types";

export const useBankStore = defineStore("bank", {
  state: () => ({
    accounts: [] as BankAccount[],
    loading: false,
  }),

  actions: {
    async fetchAccounts() {
      this.loading = true;
      try {
        this.accounts = await getUserBankAccountAPI();
      } finally {
        this.loading = false;
      }
    },

    async addAccount(data:BankAccountPros ) {
      const res = await addBankAccountAPI(data);
      this.accounts.push(res);
    },

    async updateAccount(id: number, data: BankAccountPros) {
      const res = await updateBankAccountAPI(id, data);
      const index = this.accounts.findIndex(a => a.id === id);
      if (index !== -1) this.accounts[index] = res;
    },
    async deleteAccount(id: number) {
      await deleteBankAccountAPI(id);
      this.accounts = this.accounts.filter(a => a.id !== id);
    },
  },
});