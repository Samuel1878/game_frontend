import api from "./api";

export type WalletBalanceResponse = {
  id: string;
  userId: string;
  currency: string;
  availableBalance: string;
  lockedBalance: string;
  totalBalance: string;
  updatedAt?: string;
};

export type WalletDirection = "IN" | "OUT" | "LOCK" | "UNLOCK" | "SETTLE";

export type WalletTransactionFilters = {
  transaction_type?: string;
  direction?: WalletDirection;
  currency?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
};

export type WalletTransactionResponse = {
  id: string;
  transaction_type: string;
  direction: WalletDirection;
  amount: string;
  currency: string;
  balance_before: string;
  balance_after: string;
  locked_before: string;
  locked_after: string;
  reference_type: string | null;
  reference_id: string | null;
  created_at: string;
};

export type PaginatedWalletTransactions = {
  items: WalletTransactionResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export const getWalletBalances = async () => {
  const response = await api.get<WalletBalanceResponse[]>("/api/wallet/balances");
  return response.data;
};

export const getWalletTransactions = async (
  params: WalletTransactionFilters,
) => {
  const response = await api.get<PaginatedWalletTransactions>(
    "/api/wallet/transactions",
    { params },
  );
  return response.data;
};
