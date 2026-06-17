import { DEFAULT_CURRENCY } from "@/config/env";
import { normalizeMoneyForApi } from "@/utils/money";
import api from "./api";
import type { UserPaymentMethodResponse } from "./paymentMethodsAPI";
import { methodTypeToUiPaymentValue } from "./paymentMethodsAPI";

export type WithdrawalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "PAID"
  | "CANCELLED";

export type WithdrawalRecord = {
  id: string;
  userId: string;
  amount: string;
  fee: string;
  finalAmount: string;
  currency: string;
  userPaymentMethodId: string | null;
  status: WithdrawalStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  remark: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WithdrawalListFilters = {
  status?: string;
  currency?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
};

export type CreateWithdrawalRequest = {
  amount: string | number;
  currency?: string;
  userPaymentMethodId: string;
  fee?: string | number;
  remark?: string;
};

export const createWithdrawalRequest = async (
  payload: CreateWithdrawalRequest,
) => {
  const currency = payload.currency ?? DEFAULT_CURRENCY;
  const response = await api.post<WithdrawalRecord>("/api/wallet/withdrawals", {
    amount: normalizeMoneyForApi(payload.amount, currency),
    currency,
    userPaymentMethodId: payload.userPaymentMethodId,
    ...(payload.fee !== undefined
      ? { fee: normalizeMoneyForApi(payload.fee, currency) }
      : {}),
    ...(payload.remark?.trim() ? { remark: payload.remark.trim() } : {}),
  });
  return response.data;
};

export const listWithdrawals = async (params: WithdrawalListFilters) => {
  const response = await api.get<WithdrawalRecord[]>("/api/wallet/withdrawals", {
    params,
  });
  return response.data;
};

export const cancelWithdrawal = async (id: string) => {
  const response = await api.post<WithdrawalRecord>(
    `/api/wallet/withdrawals/${id}/cancel`,
  );
  return response.data;
};

export const toLegacyWithdrawal = (
  withdrawal: WithdrawalRecord,
  method?: UserPaymentMethodResponse,
) => ({
  id: withdrawal.id,
  user_id: withdrawal.userId,
  uuid: withdrawal.userId,
  amount: Number(withdrawal.amount),
  fee: Number(withdrawal.fee),
  final_amount: Number(withdrawal.finalAmount),
  currency: withdrawal.currency,
  payment_method: method
    ? methodTypeToUiPaymentValue(method.methodType)
    : withdrawal.userPaymentMethodId ?? undefined,
  status: withdrawal.status.toLowerCase(),
  created_at: withdrawal.createdAt,
  updated_at: withdrawal.updatedAt,
  withdraw_name: method?.accountName,
  withdraw_no: method?.walletAddress ?? method?.accountNumber ?? method?.phone ?? undefined,
  remark: withdrawal.remark ?? undefined,
  txn_id: withdrawal.id,
  is_completed: withdrawal.status === "PAID" || withdrawal.status === "APPROVED",
  user_payment_method_id: withdrawal.userPaymentMethodId ?? undefined,
  reviewed_at: withdrawal.reviewedAt ?? undefined,
});
