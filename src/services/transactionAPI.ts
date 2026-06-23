import type {
  depositFormData,
  paramType,
  transactionsParamsType,
  withdrawalInfo,
  withdrawParamType,
} from "@/utils/types";
import { DEFAULT_CURRENCY } from "@/config/env";
import { moneyToNumber } from "@/utils/money";
import {
  createDepositRequest,
  getCompanyDepositAccounts,
  listDeposits,
  toLegacyDeposit,
} from "./depositAPI";
import {
  listCompanyPaymentAccounts,
  listUserPaymentMethods,
  toCompanyPaymentMethod,
} from "./paymentMethodsAPI";
import { createWithdrawalRequest, listWithdrawals, toLegacyWithdrawal } from "./withdrawalAPI";
import { getWalletBalances, getWalletTransactions, type WalletDirection } from "./walletAPI";

export const depositHandlerAPI = async (
  data: depositFormData,
  param: paramType,
) => {
  void param;
  try {
    if (!data.payment_account_id) return null;
    const deposit = await createDepositRequest({
      amount: data.request_amount ?? data.actual_amount ?? 0,
      currency: data.currency ?? DEFAULT_CURRENCY,
      paymentAccountId: data.payment_account_id,
      proofUrl: data.proof_url ?? data.tid,
    });
    const accounts = await getCompanyDepositAccounts();
    const account = accounts.find((item) => item.id === deposit.paymentAccountId);
    return toLegacyDeposit(deposit, account);
  } catch (error) {
    return null;
  }
};

export const withdrawalHandlerAPI = async (
  data: withdrawalInfo,
  param: withdrawParamType,
) => {
  void param;
  try {
    if (!data.user_payment_method_id) {
      return {
        data: null,
        message: "choose_account",
      };
    }
    const withdrawal = await createWithdrawalRequest({
      amount: data.amount ?? 0,
      currency: data.currency ?? DEFAULT_CURRENCY,
      userPaymentMethodId: data.user_payment_method_id,
      remark: data.remark,
    });

    const methods = await listUserPaymentMethods();
    const method = methods.find((item) => item.id === withdrawal.userPaymentMethodId);
    return {
      data: toLegacyWithdrawal(withdrawal, method),
      message: "success",
    };
  } catch (error: any) {
    return {
      data: null,
      message: error?.response?.data?.message || "something_went_wrong",
    };
  }
};

export const getUserBalance = async (name: string) => {
  void name;
  try {
    const balances = await getWalletBalances();
    const selected =
      balances.find((wallet) => wallet.currency === DEFAULT_CURRENCY) ?? balances[0];
    return selected
      ? {
          balance: moneyToNumber(selected.availableBalance),
          freezed_amount: moneyToNumber(selected.lockedBalance),
          locked_balance: moneyToNumber(selected.lockedBalance),
          currency: selected.currency,
          updated_at: selected.updatedAt,
        }
      : null;
  } catch (error) {
    return null;
  }
};

export const getDepositById = async (param: {
  page: number;
  limit: number;
  search?: string;
  from?: string;
  to?: string;
  status?: string;
}) => {
  try {
    const [deposits, accounts] = await Promise.all([
      listDeposits({
        page: param.page,
        limit: param.limit,
        status: param.status,
        dateFrom: param.from,
        dateTo: param.to,
      }),
      listCompanyPaymentAccounts(),
    ]);
    const data = deposits.map((deposit) =>
      toLegacyDeposit(
        deposit,
        accounts.find((account) => account.id === deposit.paymentAccountId),
      ),
    );

    return {
      data,
      pagination: paginationFromPartialList(param.page, param.limit, data.length),
      totalPages: paginationFromPartialList(param.page, param.limit, data.length).totalPages,
      total: data.length,
    };
  } catch (error) {
    return null;
  }
};
export const getDepositByInvAPI = async (param: { inv_id: string }) => {
  try {
    const [deposits, accounts] = await Promise.all([
      listDeposits({ page: 1, limit: 100 }),
      listCompanyPaymentAccounts(),
    ]);
    const deposit = deposits.find((item) => item.id === param.inv_id);
    if (!deposit) return null;
    return toLegacyDeposit(
      deposit,
      accounts.find((account) => account.id === deposit.paymentAccountId),
    );
  } catch (error) {
    return null;
  }
};
export const getWithdrawalByInvAPI = async (param: { inv_id: string }) => {
  try {
    const [withdrawals, methods] = await Promise.all([
      listWithdrawals({ page: 1, limit: 100 }),
      listUserPaymentMethods(),
    ]);
    const withdrawal = withdrawals.find((item) => item.id === param.inv_id);
    if (!withdrawal) return null;
    return toLegacyWithdrawal(
      withdrawal,
      methods.find((method) => method.id === withdrawal.userPaymentMethodId),
    );
  } catch (error) {
    return null;
  }
};
export const getWithdrawalsById = async (param: {
  page: number;
  limit: number;
  from?: string;
  to?: string;
  status?: string;
}) => {
  try {
    const [withdrawals, methods] = await Promise.all([
      listWithdrawals({
        page: param.page,
        limit: param.limit,
        status: param.status,
        dateFrom: param.from,
        dateTo: param.to,
      }),
      listUserPaymentMethods(),
    ]);
    const data = withdrawals.map((withdrawal) =>
      toLegacyWithdrawal(
        withdrawal,
        methods.find((method) => method.id === withdrawal.userPaymentMethodId),
      ),
    );

    return {
      data,
      pagination: paginationFromPartialList(param.page, param.limit, data.length),
      totalPages: paginationFromPartialList(param.page, param.limit, data.length).totalPages,
      total: data.length,
    };
  } catch (error) {
    return null;
  }
};

export const getPaymentMethodsByType = async (
  type: string,
  is_available: boolean,
) => {
  try {
    const accounts = await listCompanyPaymentAccounts();
    const data = accounts
      .filter((account) => toCompanyPaymentMethod(account).value === type)
      .filter((account) => !is_available || account.isActive)
      .map(toCompanyPaymentMethod)
      .sort((a, b) => Number(a.priority) - Number(b.priority));

    return data;
  } catch (error) {
    return null;
  }
};

export const getAllTransactionsByUserId = async (
  param: transactionsParamsType,
) => {
  try {
    const response = await getWalletTransactions({
      page: param.page,
      limit: param.limit,
      ...toWalletTransactionFilter(param.type),
      start_date: param.startDate,
      end_date: param.endDate,
    });

    return {
      data: response.items.map((tx) => ({
        id: tx.id,
        user_id: param.user_id ?? "",
        type: toLegacyTransactionType(tx.transaction_type, tx.direction),
        amount: moneyToNumber(tx.amount),
        currency: tx.currency,
        direction: tx.direction,
        balance_before: moneyToNumber(tx.balance_before),
        balance_after: moneyToNumber(tx.balance_after),
        locked_before: moneyToNumber(tx.locked_before),
        locked_after: moneyToNumber(tx.locked_after),
        reference_type: tx.reference_type,
        payment_method: tx.reference_type ?? undefined,
        txn_id: tx.id,
        created_at: tx.created_at,
      })),
      pagination: response.pagination,
      totalPages: response.pagination.totalPages,
      total: response.pagination.total,
    };
  } catch (error) {
    return null;
  }
};

const paginationFromPartialList = (page: number, limit: number, count: number) => ({
  page,
  limit,
  total: count,
  totalPages: Math.max(page, count === limit ? page + 1 : page),
});

const toWalletTransactionFilter = (
  type?: string,
): { transaction_type?: string; direction?: WalletDirection } => {
  switch (type) {
    case "deposit":
      return { transaction_type: "DEPOSIT_APPROVED" };
    case "withdraw":
      return { transaction_type: "WITHDRAWAL_LOCK" };
    case "bonus":
      return { transaction_type: "BONUS_ACTIVATED" };
    case "adjustment":
      return { transaction_type: "ADMIN_ADJUSTMENT" };
    case "rebate":
      return { transaction_type: "REBATE_PAID" };
    case "dividend":
      return { transaction_type: "DIVIDEND_PAID" };
    case "refund":
      return { direction: "UNLOCK" };
    default:
      return {};
  }
};

const toLegacyTransactionType = (type: string, direction: WalletDirection) => {
  if (type.includes("DEPOSIT")) return "deposit";
  if (type.includes("WITHDRAWAL")) return "withdraw";
  if (type.includes("BONUS")) return "bonus";
  if (type.includes("REBATE")) return "rebate";
  if (type.includes("DIVIDEND")) return "dividend";
  if (type.includes("ADJUSTMENT")) return "adjustment";
  if (direction === "UNLOCK") return "refund";
  return type.toLowerCase();
};
