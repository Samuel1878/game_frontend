import { DEFAULT_CURRENCY } from "@/config/env";
import { normalizeMoneyForApi } from "@/utils/money";
import api from "./api";
import {
  listCompanyPaymentAccounts,
  toCompanyPaymentMethod,
  type CompanyPaymentAccountResponse,
} from "./paymentMethodsAPI";

export type DepositStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export type DepositRecord = {
  id: string;
  userId: string;
  amount: string;
  currency: string;
  paymentMethod: string | null;
  paymentAccountId: string | null;
  proofUrl: string | null;
  status: DepositStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  remark: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DepositListFilters = {
  status?: string;
  currency?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
};

export type CreateDepositRequest = {
  amount: string | number;
  currency?: string;
  paymentAccountId: string;
  proofUrl?: string;
};

export const getCompanyDepositAccounts = listCompanyPaymentAccounts;

export const createDepositRequest = async (payload: CreateDepositRequest) => {
  const currency = payload.currency ?? DEFAULT_CURRENCY;
  const response = await api.post<DepositRecord>("/api/wallet/deposits", {
    amount: normalizeMoneyForApi(payload.amount, currency),
    currency,
    paymentAccountId: payload.paymentAccountId,
    ...(payload.proofUrl?.trim() ? { proofUrl: payload.proofUrl.trim() } : {}),
  });
  return response.data;
};

export const listDeposits = async (params: DepositListFilters) => {
  const response = await api.get<DepositRecord[]>("/api/wallet/deposits", {
    params,
  });
  return response.data;
};

export const toLegacyDeposit = (
  deposit: DepositRecord,
  account?: CompanyPaymentAccountResponse,
) => ({
  id: deposit.id,
  inv_id: deposit.id,
  user_id: deposit.userId,
  payment: account
    ? toCompanyPaymentMethod(account).value
    : deposit.paymentMethod?.toLowerCase() ?? null,
  request_amount: Number(deposit.amount),
  actual_amount: Number(deposit.amount),
  uuid: deposit.userId,
  completed: deposit.status === "APPROVED",
  status: deposit.status.toLowerCase(),
  remark: deposit.remark ?? undefined,
  account_no: account?.walletAddress ?? account?.accountNumber ?? account?.phone ?? null,
  account_name: account?.accountName ?? null,
  created_at: deposit.createdAt,
  updated_at: deposit.updatedAt,
  tid: deposit.proofUrl ?? undefined,
  payment_account: account?.accountName ?? deposit.paymentMethod ?? null,
  payment_number: account?.walletAddress ?? account?.accountNumber ?? account?.phone ?? null,
  ref_no: deposit.proofUrl ?? undefined,
  payment_account_id: deposit.paymentAccountId ?? undefined,
  currency: deposit.currency,
  proof_url: deposit.proofUrl ?? undefined,
  reviewed_at: deposit.reviewedAt ?? undefined,
});
