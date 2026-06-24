export const PLAYER_BALANCE_UPDATE_REASONS = [
  "deposit_approved",
  "withdrawal_created",
  "withdrawal_paid",
  "withdrawal_rejected",
] as const;

export type PlayerBalanceUpdateReason =
  (typeof PLAYER_BALANCE_UPDATE_REASONS)[number];

/**
 * Kept permissive for forward-compatible socket payload validation. Unsupported
 * reasons are intentionally ignored by the wallet store.
 */
export type PlayerBalanceUpdatePayload = {
  balance: string;
  locked_balance?: string;
  currency?: string;
  reason: string;
  updated_at: string;
};

export const isPlayerBalanceUpdateReason = (
  reason: string,
): reason is PlayerBalanceUpdateReason =>
  PLAYER_BALANCE_UPDATE_REASONS.includes(reason as PlayerBalanceUpdateReason);

export const isPlayerBalanceUpdatePayload = (
  value: unknown,
): value is PlayerBalanceUpdatePayload => {
  if (!value || typeof value !== "object") return false;

  const payload = value as Partial<PlayerBalanceUpdatePayload>;
  return (
    typeof payload.balance === "string" &&
    isDecimalAmount(payload.balance) &&
    (payload.locked_balance === undefined ||
      (typeof payload.locked_balance === "string" && isDecimalAmount(payload.locked_balance))) &&
    (payload.currency === undefined || typeof payload.currency === "string") &&
    typeof payload.reason === "string" &&
    typeof payload.updated_at === "string"
  );
};

const isDecimalAmount = (value: string) => /^\d+(?:\.\d+)?$/.test(value.trim());
