import api from "./api";

export type FundPinSetupResponse = {
  ok: boolean;
  message: string;
};

export type FundPinVerificationResponse = {
  verified: true;
};

type FundPinApiError = {
  response?: {
    status?: number;
    data?: {
      error?: string;
      message?: string;
    };
  };
};

export const setupFundPin = async (fundPin: string, confirmFundPin: string) => {
  const response = await api.post<FundPinSetupResponse>("/api/player/setup-fund-pin", {
    fund_pin: fundPin,
    confirm_fund_pin: confirmFundPin,
  });
  return response.data;
};

export const verifyFundPin = async (fundPin: string) => {
  const response = await api.post<FundPinVerificationResponse>(
    "/api/player/verify-fund-pin",
    { fund_pin: fundPin },
    // A 401 here means a wrong PIN, not an expired player session. Retrying would
    // submit the sensitive value twice after the global auth-refresh interceptor.
    { skipAuthRefresh: true },
  );
  return response.data;
};

export const getFundPinErrorStatus = (error: unknown) =>
  (error as FundPinApiError)?.response?.status;

export const getFundPinErrorCode = (error: unknown) =>
  (error as FundPinApiError)?.response?.data?.error;

export const getFundPinErrorTranslationKey = (error: unknown) => {
  const code = getFundPinErrorCode(error);
  const message = (error as FundPinApiError)?.response?.data?.message?.toLowerCase() ?? "";

  if (code === "INVALID_CREDENTIALS") return "incorrect_fund_pin";
  if (code === "FUND_PIN_NOT_SET") return "fund_pin_not_configured";
  if (code === "FUND_PIN_ALREADY_SET") return "fund_pin_already_set";
  if (message.includes("too easy")) return "fund_pin_too_easy";
  if (message.includes("confirmation")) return "fund_pin_confirmation_mismatch";
  if (message.includes("4-6 digits")) return "fund_pin_must_be_4_to_6_digits";

  return "something_went_wrong";
};
