import api from "./api";

export type BackendUserStatus = "ACTIVE" | "SUSPENDED" | "BANNED" | string;

export type BackendPlayer = {
  userId: string;
  username: string;
  phone: string;
  role: string;
  status: BackendUserStatus;
  tokenVersion?: number;
  level?: number;
  referralCode?: string;
  full_name?: string | null;
  fullName?: string | null;
  fund_pin_set?: boolean | null;
  has_fund_pin?: boolean | null;
  hasFundPin?: boolean | null;
};

export type PlayerLevelProfile = {
  level: number;
  next_level?: number | null;
  current_level_min_deposit?: string;
  next_level_min_deposit?: string | null;
  total_approved_deposit?: string;
  remaining_deposit_to_next_level?: string;
  currency?: string;
};

export type CurrentPlayerResponse = {
  player: BackendPlayer;
  level?: PlayerLevelProfile;
  wallet?: unknown;
};

export const getCurrentPlayer = async () => {
  const response = await api.get<CurrentPlayerResponse>("/api/player/me");
  return response.data;
};
