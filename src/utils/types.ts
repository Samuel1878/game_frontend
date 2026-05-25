export interface gameType {
  id: number;
  provider_id: number;
  game_id: number;
  rtp: string;
  game_rank: number;
  name: string;
  icon_url: string;
  is_hot?: boolean;
  is_hot_rtp?: boolean;
  is_drop_win?: boolean;
  cn_icon_url?: string;
  cn_name?: string;
}
export interface GameInfo {
  language?: string;
  gameName: string;
  gameIconUrl: string;
}
export interface Game {
  gameProviderId: number;
  gameID: number;
  gameType: number;
  newGameType: number;
  rank: number;
  device: string;
  platform: string;
  provider: string;
  rtp: number;
  rows: number;
  reels: number;
  lines: number;
  gameInfos: GameInfo[];
  supportedCurrencies?: string[];
  blockCountries?: string[];
  isMaintain: boolean;
  isEnabled: boolean;
  isProvideCommission: boolean;
  hasHedgeBet: boolean;
  providerStatus: "Online" | "Offline" | string;
  isProviderOnline: boolean;
  badge?: string;
  badge_1?: string;
}
export interface gameListRespone {
  seamlessGameProviderGames: Game[];
}
export interface userInfo {
  name?: string;
  phone?: string | null;
  email?: string | null;
  password?: string;
  status?: string;
  id: number;
  role?: string | null;
  level?: number;
  created_at: string;
  uid: string;
  agent_id?: number | null;
  is_oneline?: boolean;
  last_seen?: string;
}
export interface userInfoResponse {
  user: userInfo;
  token: string;
  url: string | null;
}
export interface depositFormData {
  id?: number;
  inv_id?: string;
  user_id: number | null;
  payment?: string | null;
  request_amount?: number | null;
  actual_amount?: number;
  uuid?: string | null;
  completed?: boolean;
  status?: string;
  remark?: string;
  account_no?: string | null;
  account_name?: string | null;
  created_at?: string;
  updated_at?: string;
  tid?: string;
  payment_account?: string | null;
  payment_number?: string | null;
  ref_no?: string | null;
}
export interface paramType {
  user_id: number | null;
  uuid: string | null;
}
export interface withdrawalInfo {
  id?: number;
  user_id?: number;
  uuid?: string;
  amount?: number;
  payment_method?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  withdraw_name?: string;
  withdraw_no?: string;
  remark?: string;
  txn_id?: string;
  is_completed?: boolean;
}
export interface withdrawParamType {
  user_id: number;
  uuid: string;
}
export interface wallet {
  balance: number;
  updated_at?: string;
  freezed_amount?: number;
}

export type PaymentMethod = {
  account_balance: number | string;
  account_name: string;
  account_number: string;
  created_at: string;
  id: number | string;
  is_available: boolean;
  label: string;
  max: number | string;
  max_per_transaction: number | string;
  priority: number | string;
  remark: string | null;
  value: string;
};

export interface BankAccount {
  id: number;
  user_id: number;
  account_name: string;
  account_number: string;
  label: string;
  value: string;
  created_at?: string;
  updated_at?: string;
  is_available?: boolean;
  tag: number | 1 | 0;
}
export interface BankAccountPros {
  account_name: string;
  account_number: string;
  label: string;
  value: string;
  is_available?: boolean;
  tag: number | 1 | 0;
}

export interface transactionsParamsType {
  page: number;
  limit: number;
  type: string | undefined;
  user_id?: number | undefined;
  startDate?: string;
  endDate?: string | undefined;
  agent_id?: number;
}

export interface Transaction {
  id?: number;
  user_id: number;
  type:
    | "deposit"
    | "withdraw"
    | "bonus"
    | "adjustment"
    | "refund"
    | "rebate"
    | "dividend"
    | string;
  amount: number;
  payment_method?: string;
  txn_id?: string;
  created_by?: string;
  remark?: string;
  created_at?: string;
  updated_at?: string;
  agent?: string;
}
export type DateFilter = "today" | "this_month" | "custom";

export interface CReportReqParams {
  username: string;
  portfolio?: string | "SeamlessGame";
  filter: string;
  startDate?: string;
  endDate?: string;
}
type BetCount = {
  bonus?: number;
  draw?: number;
  lose?: number;
  won?: number;
};

type Turnover = {
  bonus?: number;
  draw?: number;
  lose?: number;
  won?: number;
};

export type ReportItem = {
  username: string;
  betCount: BetCount;
  turnover: Turnover;
  winlose: number;
  commission: number;
  totalDeposit: number;
  totalWithdrawal: number;
};

type ApiError = {
  id: number;
  msg: string;
};

export type ReportResponse = {
  result: ReportItem[] | null;
  serverId: string;
  error: ApiError;
};

export type ReportSummaryType = {
  betCount: {
    bonus: number;
    draw: number;
    lose: number;
    won: number;
  };
  turnover: {
    bonus: number;
    draw: number;
    lose: number;
    won: number;
  };
  winlose: number;
  commission: number;
  totalDeposit: number;
  totalWithdrawal: number;
};
export interface BetListRecord {
  mainBetRef: string | null;
  gamePeriodId: string | null;
  gameRoundId: string | null;
  gameType: string | null;
  turnoverStake: number;
  orderDetail: string | null;
  gameResult: string | null;
  gameId: number;
  gpId: number;
  isGameProviderPromotion: boolean;
  orderTime: string;
  modifyDate: string;
  settleTime: string;
  winLostDate: string;
  refNo: string;
  username: string;
  currency: string;
  stake: number;
  winLost: number;
  status: string;
  topDownline: string | null;
  newGameType: number;
}

export interface FavoriteGames {
  provider_id : number;
  game_id:number;
}