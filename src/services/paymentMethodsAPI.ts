import api from "./api";
import type { BankAccount, BankAccountPros, PaymentMethod } from "@/utils/types";

export type PaymentMethodType =
  | "KBZPAY"
  | "WAVEPAY"
  | "AYAPAY"
  | "CBPAY"
  | "USDT"
  | "BANK";

export type UserPaymentMethodResponse = {
  id: string;
  userId: string;
  methodType: PaymentMethodType;
  accountName: string;
  accountNumber: string | null;
  phone: string | null;
  bankName: string | null;
  walletAddress: string | null;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CompanyPaymentAccountResponse = {
  id: string;
  methodType: PaymentMethodType;
  accountName: string;
  accountNumber: string | null;
  phone: string | null;
  bankName: string | null;
  walletAddress: string | null;
  qrImageUrl: string | null;
  minAmount: string;
  maxAmount: string | null;
  currency: string;
  priority: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type PaymentMethodPayload = {
  methodType: PaymentMethodType;
  accountName: string;
  accountNumber?: string;
  phone?: string;
  bankName?: string;
  walletAddress?: string;
  isDefault?: boolean;
  isActive?: boolean;
};

const METHOD_TO_UI: Record<PaymentMethodType, string> = {
  KBZPAY: "kbzPay",
  WAVEPAY: "wavePay",
  AYAPAY: "ayaPay",
  CBPAY: "cbPay",
  USDT: "usdt",
  BANK: "kbzBank",
};

const UI_TO_METHOD: Record<string, PaymentMethodType> = {
  kbzPay: "KBZPAY",
  wavePay: "WAVEPAY",
  ayaPay: "AYAPAY",
  cbPay: "CBPAY",
  usdt: "USDT",
  kbzBank: "BANK",
  kbzBanking: "BANK",
  bank: "BANK",
};

const METHOD_LABEL: Record<PaymentMethodType, string> = {
  KBZPAY: "KBZ Pay",
  WAVEPAY: "Wave Pay",
  AYAPAY: "AYA Pay",
  CBPAY: "CB Pay",
  USDT: "USDT",
  BANK: "Bank",
};

export const uiPaymentValueToMethodType = (value: string): PaymentMethodType =>
  UI_TO_METHOD[value] ?? "BANK";

export const methodTypeToUiPaymentValue = (methodType: PaymentMethodType): string =>
  METHOD_TO_UI[methodType] ?? "kbzBank";

export const paymentMethodLabel = (methodType: PaymentMethodType): string =>
  METHOD_LABEL[methodType] ?? methodType;

export const listUserPaymentMethods = async () => {
  const response = await api.get<UserPaymentMethodResponse[]>("/api/wallet/payment-methods");
  return response.data;
};

export const createUserPaymentMethod = async (data: BankAccountPros) => {
  const response = await api.post<UserPaymentMethodResponse>(
    "/api/wallet/payment-methods",
    toPaymentMethodPayload(data),
  );
  return response.data;
};

export const updateUserPaymentMethod = async (
  id: string,
  data: BankAccountPros,
) => {
  const response = await api.patch<UserPaymentMethodResponse>(
    `/api/wallet/payment-methods/${id}`,
    toPaymentMethodPayload(data),
  );
  return response.data;
};

export const deactivateUserPaymentMethod = async (id: string) => {
  const response = await api.delete<UserPaymentMethodResponse>(
    `/api/wallet/payment-methods/${id}`,
  );
  return response.data;
};

export const listCompanyPaymentAccounts = async (params?: { currency?: string }) => {
  const response = await api.get<CompanyPaymentAccountResponse[]>(
    "/api/wallet/company-payment-accounts",
    { params },
  );
  return response.data;
};

export const toBankAccount = (method: UserPaymentMethodResponse): BankAccount => {
  const value = methodTypeToUiPaymentValue(method.methodType);
  const accountNumber =
    method.walletAddress ?? method.accountNumber ?? method.phone ?? "";

  return {
    id: method.id,
    user_id: method.userId,
    account_name: method.accountName,
    account_number: accountNumber,
    label: paymentMethodLabel(method.methodType),
    value,
    created_at: method.createdAt,
    updated_at: method.updatedAt,
    is_available: method.isActive,
    is_active: method.isActive,
    is_default: method.isDefault,
    tag: method.isDefault ? 1 : 0,
    method_type: method.methodType,
    bank_name: method.bankName ?? undefined,
    wallet_address: method.walletAddress ?? undefined,
    phone: method.phone ?? undefined,
  };
};

export const toCompanyPaymentMethod = (
  account: CompanyPaymentAccountResponse,
): PaymentMethod => ({
  account_balance: 0,
  account_name: account.accountName,
  account_number: account.walletAddress ?? account.accountNumber ?? account.phone ?? "",
  created_at: account.createdAt,
  id: account.id,
  is_available: account.isActive,
  label: paymentMethodLabel(account.methodType),
  max: account.maxAmount ?? "",
  max_per_transaction: account.maxAmount ?? "",
  min: account.minAmount,
  priority: account.priority,
  remark: account.bankName,
  value: methodTypeToUiPaymentValue(account.methodType),
  method_type: account.methodType,
  currency: account.currency,
  qr_image_url: account.qrImageUrl ?? undefined,
  bank_name: account.bankName ?? undefined,
  wallet_address: account.walletAddress ?? undefined,
  phone: account.phone ?? undefined,
});

const clean = (value?: string | null) => {
  const normalized = value?.trim();
  return normalized || undefined;
};

const toPaymentMethodPayload = (data: BankAccountPros): PaymentMethodPayload => {
  const methodType = data.method_type ?? uiPaymentValueToMethodType(data.value);
  const accountNumber = clean(data.account_number);
  const phone = clean(data.phone);
  const walletAddress = clean(data.wallet_address);
  const bankName = clean(data.bank_name);

  return {
    methodType,
    accountName: data.account_name.trim(),
    ...(methodType === "USDT"
      ? { walletAddress: walletAddress ?? accountNumber, accountNumber }
      : { accountNumber }),
    ...(methodType === "BANK" ? { bankName: bankName ?? data.label ?? "Bank" } : {}),
    ...(methodType !== "BANK" && methodType !== "USDT" ? { phone: phone ?? accountNumber } : phone ? { phone } : {}),
    isDefault: data.is_default ?? data.tag === 1,
    isActive: data.is_active ?? data.is_available ?? true,
  };
};
