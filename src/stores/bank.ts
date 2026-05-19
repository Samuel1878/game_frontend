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
  selectedPayment: "all" as string,
}),
getters: {
  filteredAccounts: (state) => {
    if (state.selectedPayment === "all") return state.accounts;

    return state.accounts.filter(
      (acc) => acc.value === state.selectedPayment
    );
  },
},
  actions: {
    async fetchAccounts() {
      this.loading = true;
      try {
        this.accounts = await getUserBankAccountAPI();
        // console.log(this.accounts)
      } finally {
        this.loading = false;
      }
    },
  setFilter(value: string) {
    // console.log(value)
    this.selectedPayment = value
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