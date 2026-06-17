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
    mutationLoading: false,
    error: null as string | null,
    selectedPayment: "all" as string,
  }),
  getters: {
    filteredAccounts: (state) => {
      if (state.selectedPayment === "all") return state.accounts;

      return state.accounts.filter(
        (acc) => acc.value === state.selectedPayment,
      );
    },
  },
  actions: {
    async fetchAccounts() {
      this.loading = true;
      this.error = null;
      try {
        this.accounts = await getUserBankAccountAPI();
      } catch (error: any) {
        this.error = error?.message || "Failed to fetch payment methods";
        this.accounts = [];
      } finally {
        this.loading = false;
      }
    },
    setFilter(value: string) {
      // console.log(value)
      this.selectedPayment = value;
    },
    async addAccount(data: BankAccountPros) {
      this.mutationLoading = true;
      this.error = null;
      try {
        const res = await addBankAccountAPI(data);
        if (res) {
          await this.fetchAccounts();
        }
        return res;
      } catch (error: any) {
        this.error = error?.message || "Failed to add payment method";
        return null;
      } finally {
        this.mutationLoading = false;
      }
    },

    async updateAccount(id: number | string, data: BankAccountPros) {
      this.mutationLoading = true;
      this.error = null;
      try {
        const res = await updateBankAccountAPI(id, data);
        if (res) {
          const index = this.accounts.findIndex((a) => a.id === id);
          if (index !== -1) this.accounts[index] = res;
        }
        return res;
      } catch (error: any) {
        this.error = error?.message || "Failed to update payment method";
        return null;
      } finally {
        this.mutationLoading = false;
      }
    },
    async deleteAccount(id: number | string) {
      this.mutationLoading = true;
      this.error = null;
      try {
        await deleteBankAccountAPI(id);
        this.accounts = this.accounts.filter((a) => a.id !== id);
      } catch (error: any) {
        this.error = error?.message || "Failed to delete payment method";
      } finally {
        this.mutationLoading = false;
      }
    },
  },
});
