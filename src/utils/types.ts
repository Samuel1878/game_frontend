export interface gameType {
  id: number | string;
  provider_id: number | string;
  provider_code?: string;
  provider_name?: string;
  game_id: number | string;
  game_code?: string;
  rtp: string | number | null;
  volatility?: string | null;
  game_rank?: number;
  name: string;
  icon_url: string;
  cn_icon_url?: string;
  cn_name?: string;
  name_mm?: string;
  display_name?: string;
  category?: string | null;
  game_type?: string | null;
  currency?: string | null;
  banner_url?: string | null;
  supports_demo?: boolean;
  supports_mobile?: boolean;
  supports_desktop?: boolean;
  is_hot?: boolean;
  is_top_pick?: boolean;
  is_high_rtp?: boolean;
  launch?: {
    provider_code: string;
    game_code: string;
  };
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
  raw_status?: string;
  id: number | string;
  role?: string | null;
  level?: number;
  level_profile?: Record<string, unknown> | null;
  full_name?: string | null;
  created_at: string;
  uid: string;
  agent_id?: number | string | null;
  is_oneline?: boolean;
  last_seen?: string;
  set_pin?: boolean | null;
  has_fund_pin?: boolean | null;
  referral_code?: string;
 
}
export interface userInfoResponse {
  user: userInfo;
  token: string;
  url: string | null;
}
export interface depositFormData {
  id?: number | string;
  inv_id?: string;
  user_id: number | string | null;
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
  payment_account_id?: string;
  proof_url?: string;
  currency?: string;
  reviewed_at?: string;
}
export interface paramType {
  user_id: number | string | null;
  uuid: string | null;
}
export interface withdrawalInfo {
  id?: number | string;
  user_id?: number | string;
  uuid?: string;
  amount?: number;
  fee?: number;
  final_amount?: number;
  currency?: string;
  payment_method?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  withdraw_name?: string;
  withdraw_no?: string;
  remark?: string;
  txn_id?: string;
  is_completed?: boolean;
  fund_pin?: string;
  user_payment_method_id?: string;
  reviewed_at?: string;
}
export interface withdrawParamType {
  user_id: number | string;
  uuid: string;
}
export interface wallet {
  balance: number;
  updated_at?: string;
  freezed_amount?: number;
  locked_balance?: number;
  currency?: string;
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
  min?: number | string;
  priority: number | string;
  remark: string | null;
  value: string;
  method_type?: string;
  currency?: string;
  qr_image_url?: string;
  bank_name?: string;
  wallet_address?: string;
  phone?: string;
};

export interface BankAccount {
  id: number | string;
  user_id: number | string;
  account_name: string;
  account_number: string;
  label: string;
  value: string;
  created_at?: string;
  updated_at?: string;
  is_available?: boolean;
  is_active?: boolean;
  is_default?: boolean;
  tag: number | 1 | 0;
  method_type?: string;
  bank_name?: string;
  wallet_address?: string;
  phone?: string;
}
export interface BankAccountPros {
  account_name: string;
  account_number: string;
  label: string;
  value: string;
  is_available?: boolean;
  is_active?: boolean;
  is_default?: boolean;
  tag: number | 1 | 0;
  method_type?: "KBZPAY" | "WAVEPAY" | "AYAPAY" | "CBPAY" | "USDT" | "BANK";
  bank_name?: string;
  wallet_address?: string;
  phone?: string;
}

export interface transactionsParamsType {
  page: number;
  limit: number;
  type: string | undefined;
  user_id?: number | string | undefined;
  startDate?: string;
  endDate?: string | undefined;
  agent_id?: number | string;
}

export interface Transaction {
  id?: number | string;
  user_id: number | string;
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
  currency?: string;
  direction?: string;
  balance_before?: number;
  balance_after?: number;
  locked_before?: number;
  locked_after?: number;
  reference_type?: string | null;
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

export type PeriodFilter = "today" | "this_month" | "custom";
export type ProviderFilter = "all" | string;

export type PlayerBetListParams = {
  period?: PeriodFilter;
  startDate?: string;
  endDate?: string;
  provider?: ProviderFilter;
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
};

export type PlayerBetItem = {
  id: string;
  providerCode: string;
  providerName?: string | null;
  gameCode?: string | null;
  gameName?: string | null;
  roundId?: string | null;
  betAmount: string | number;
  winAmount: string | number;
  lossAmount: string | number;
  turnover: string | number;
  ggr: string | number;
  currency?: string | null;
  status: string;
  betAt?: string | null;
  settledAt?: string | null;
  createdAt: string;
};

export type PlayerBetPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PlayerRecordFilters = {
  period: PeriodFilter;
  provider: ProviderFilter;
  startDate?: string;
  endDate?: string;
};

export type PlayerBetListResponse = {
  items: PlayerBetItem[];
  pagination: PlayerBetPagination;
  filters?: PlayerRecordFilters;
};

export type PlayerRecordSummary = {
  totalDepositAmount: string | number;
  totalWithdrawalAmount: string | number;
  totalTurnover: string | number;
  totalWinAmount: string | number;
  totalLossAmount: string | number;
  totalGgr: string | number;
};

export type PlayerRecordSummaryResponse = PlayerRecordFilters & {
  summary: PlayerRecordSummary;
};

export type BetProviderOption = {
  providerCode: string;
  providerName: string;
  status?: "ACTIVE" | "DISABLED" | string;
};

export interface FavoriteGames {
  provider_id : number;
  game_id:number;
}

export type AgentDashboardPeriod = "today" | "this_month" | "custom";

export type AgentDashboardQuery = {
  period?: AgentDashboardPeriod;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
  search?: string;
};

/** Amounts are deliberately separated by currency by the backend. */
export type AgentMoneyAmount = {
  currency: string;
  amount: string;
};

export type AgentTotals = {
  totalDeposits: AgentMoneyAmount[];
  totalWithdrawals: AgentMoneyAmount[];
  totalTurnover: AgentMoneyAmount[];
  totalGGR: AgentMoneyAmount[];
  totalPlayerCount: number;
};

export type AgentDashboardAgent = {
  id: string;
  userId: string;
  parentAgentId: string | null;
  username: string;
  phone: string;
  name: string;
  code: string;
  status: "ACTIVE" | "SUSPENDED" | string;
  commissionRate: string;
  createdAt: string;
  updatedAt: string;
};

export type AgentDashboardPlayer = {
  id: string;
  username: string;
  phone: string;
  fullName: string | null;
  status: string;
  createdAt: string;
  assignedAgentId: string;
  isDirect: boolean;
  totals: Omit<AgentTotals, "totalPlayerCount">;
  totalDeposits: AgentMoneyAmount[];
  totalWithdrawals: AgentMoneyAmount[];
  totalTurnover: AgentMoneyAmount[];
  totalGGR: AgentMoneyAmount[];
};

export type AgentDashboardPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type AgentDashboardPeriodResponse = {
  period: AgentDashboardPeriod | "all";
  startDate?: string;
  endDate?: string;
  timezone: string;
};

export type AgentDividendChildBreakdown = {
  childAgentId: string;
  childAgentUsername: string;
  childAgentCode?: string;
  childOwnGgr: string;
  childMatchedRatePercent: string;
  childDividendAmount: string;
  childFinalDividendAmount: string;
  parentCommissionRatePercent: string;
  parentCommissionAmount: string;
};

export type AgentDividendCandidate = {
  agentId: string;
  agentUsername: string;
  agentCode: string;
  currency: string;
  ownGgr: string;
  matchedRatePercent: string;
  ownDividendAmount: string;
  nestedDividendCommissionAmount: string;
  parentCommissionAmount: string;
  totalDividendAmount: string;
  nestedAgents: AgentDividendChildBreakdown[];
};

export type AgentDividendEstimate = {
  items: AgentDividendCandidate[];
  directDividendAmount: AgentMoneyAmount[];
  nestedOverrideDividendAmount: AgentMoneyAmount[];
  totalDividendAmount: AgentMoneyAmount[];
};

export type AgentDashboardSummary = {
  agent: AgentDashboardAgent;
  period: AgentDashboardPeriodResponse;
  directTotals: AgentTotals;
  nestedTotals: AgentTotals;
  downlineTotals: AgentTotals;
  dividends: AgentDividendEstimate;
  totalDeposits: AgentMoneyAmount[];
  totalWithdrawals: AgentMoneyAmount[];
  totalTurnover: AgentMoneyAmount[];
  totalGGR: AgentMoneyAmount[];
  totalPlayerCount: number;
  totalDirectAgentCount: number;
  totalNestedAgentCount: number;
};

export type AgentDashboardList<T> = {
  items: T[];
  pagination: AgentDashboardPagination;
  period: AgentDashboardPeriodResponse;
};

export type AgentDashboardAgentListItem = AgentDashboardAgent & {
  directTotals: AgentTotals;
  nestedTotals: AgentTotals;
  downlineTotals: AgentTotals;
};

export type AgentDashboardPlayerDetail = {
  player: AgentDashboardPlayer;
  totals: Omit<AgentTotals, "totalPlayerCount">;
};

export type AgentDashboardAgentDetail = {
  agent: AgentDashboardAgent;
  period: AgentDashboardPeriodResponse;
  directPlayers: AgentDashboardList<AgentDashboardPlayer>;
  directAgents: AgentDashboardList<AgentDashboardAgentListItem>;
  directTotals: AgentTotals;
  nestedTotals: AgentTotals;
  downlineTotals: AgentTotals;
};

export type AgentDividendCalculationChild = {
  child_agent_id?: string;
  child_agent_username?: string;
  child_agent_code?: string;
  child_own_ggr_minor?: string;
  child_matched_rate_percent?: string;
  child_dividend_amount_minor?: string;
  child_final_dividend_amount_minor?: string;
  parent_commission_rate_percent?: string;
  parent_commission_amount_minor?: string;
};

export type AgentDividendCalculation = {
  kind?: string;
  calculation_version?: number;
  own_ggr_minor?: string;
  matched_rate_percent?: string;
  own_dividend_amount_minor?: string;
  nested_dividend_commission_amount_minor?: string;
  parent_commission_amount_minor?: string;
  total_dividend_amount_minor?: string;
  nested_agents?: AgentDividendCalculationChild[];
};

export type AgentDividendPayout = {
  id: string;
  amount: string;
  currency: string;
  profitBase: string | null;
  percentage: string | null;
  status: string;
  date: string;
  periodStart: string;
  periodEnd: string;
  remark: string | null;
  calculation: AgentDividendCalculation | null;
};

export type CreateDownlineAgentPayload = {
  username: string;
  phone: string;
  password: string;
  name?: string;
  commission_rate?: number | string;
};
