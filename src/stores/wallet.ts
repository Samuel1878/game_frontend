
import { defineStore } from "pinia";
import { ref } from "vue";
import { DEFAULT_CURRENCY } from "@/config/env";
import { moneyToNumber } from "@/utils/money";
import {
  getWalletBalances,
  type WalletBalanceResponse,
} from "@/services/walletAPI";

export const useWallet = defineStore('wallet', () => {
  const balance = ref<number>(0);
  const lockedBalance = ref<number>(0);
  const currency = ref<string>(DEFAULT_CURRENCY);
  const updatedAt = ref<string | undefined>();
  const balances = ref<WalletBalanceResponse[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const setWallet = (
    b: number | string,
    c?: string,
    locked?: number | string,
    updated?: string,
  ) => {
    balance.value = moneyToNumber(b);
    lockedBalance.value = moneyToNumber(locked ?? 0);
    currency.value = c || DEFAULT_CURRENCY;
    updatedAt.value = updated;
  };
  const resetWallet = () => {
    balance.value = 0;
    lockedBalance.value = 0;
    currency.value = DEFAULT_CURRENCY;
    updatedAt.value = undefined;
    balances.value = [];
    error.value = null;
  }

  const fetchBalance = async (preferredCurrency = DEFAULT_CURRENCY) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await getWalletBalances();
      balances.value = response;
      const selected =
        response.find((wallet) => wallet.currency === preferredCurrency) ??
        response[0];

      if (selected) {
        setWallet(
          selected.availableBalance,
          selected.currency,
          selected.lockedBalance,
          selected.updatedAt,
        );
      } else {
        setWallet(0, preferredCurrency, 0);
      }

      return selected ?? null;
    } catch (err: any) {
      error.value = err?.response?.data?.message || "Failed to fetch balance";
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    balance,
    lockedBalance,
    currency,
    updatedAt,
    balances,
    loading,
    error,
    setWallet,
    resetWallet,
    fetchBalance,
  }
})
