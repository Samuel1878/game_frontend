
export interface gameType {
    id: number,
            provider_id: number,
            game_id: number,
            rtp: string,
            game_rank: number,
            name: string,
            icon_url: string,
            is_hot?:boolean,
            is_hot_rtp?:boolean,
            is_drop_win?:boolean
}
export interface GameInfo {
  language?: string
  gameName: string
  gameIconUrl: string
}
export interface Game {
  gameProviderId: number
  gameID: number
  gameType: number
  newGameType: number
  rank: number
  device: string
  platform: string
  provider: string
  rtp: number
  rows: number
  reels: number
  lines: number
  gameInfos: GameInfo[]
  supportedCurrencies?: string[]
  blockCountries?: string[]
  isMaintain: boolean
  isEnabled: boolean
  isProvideCommission: boolean
  hasHedgeBet: boolean
  providerStatus: 'Online' | 'Offline' | string
  isProviderOnline: boolean,
  badge?:string;
  badge_1?:string;
}
export interface gameListRespone {
  seamlessGameProviderGames:Game[]
}
export interface userInfo {
  name?:string;
  phone?:string | null;
  email?:string | null;
  password?:string;
  status?:string;
  id:number;
  role?:string | null;
  level?:number ;
  created_at:string;
  uid:string;
  agent_id?:number | null;
  
}
export interface userInfoResponse {
  user:userInfo;
  token:string;
  url:string | null;
}   
export interface supabaseUserRes {
  name?:string;
  phone?:string | null;
  email?:string | null;
  password?:string;
  status:boolean;
  id:number;
  token?:string| null;
  balance?:number;
  role?:string | null;
  level?:number ;
  created_at:string;
  uid:string
}
export interface depositFormData {    
  id?:number;
  inv_id?:string;
  user_id:number | null;
  payment?:string | null;
  request_amount?:number | null;
  actual_amount?:number;
  uuid?:string|null;
  completed?:boolean;
  status?:string;
  remark?:string;
  account_no?:string | null;
  account_name?:string | null;
  created_at?:string;
  updated_at?:string;
  tid?:string;
  payment_account?:string | null;
  payment_number?:string | null;
  ref_no?:string|null;
}
export interface paramType {
  user_id:number|null;
  uuid:string | null
}
export interface withdrawalInfo {    
  id?:number;
  user_id?:number;
  uuid?:string;
  amount?:number;
  payment_method?:string;
  status?:string;
  created_at?:string;
  updated_at?:string;
  withdraw_name?:string;
  withdraw_no?:string;
  remark?:string;
  txn_id?:string;
  is_completed?:boolean;
}
export interface withdrawParamType {
  user_id:number;
  uuid:string;
}
export interface wallet {
  balance:number;
  updated_at?:string;
  freezed_amount?:number;
}

export type PaymentMethod = {
  account_balance: number|string;
  account_name: string;
  account_number: string;
  created_at: string;
  id: number|string;
  is_available: boolean;
  label: string;
  max: number|string;
  max_per_transaction: number|string;
  priority: number|string;
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
};
export interface BankAccountPros  {
  account_name: string;
  account_number: string;
  label: string;
  value: string;
  is_available?: boolean;
  tag: number | 1 | 0;
};



export interface transactionsParamsType {
    page: number,
    limit:number,
    type: string | undefined,
    user_id?:string | undefined,
    startDate?:string;
    endDate?:string | undefined;
    agent_id?:number
}
// export interface GameInfo {
//   language: string;
//   gameName: string;
//   gameIconUrl: string;
// }

// export type DeviceType = "d/m" | "d" | "m" | string; // you can expand later if needed

// export type ProviderStatus = "Online" | "Offline" | string;

// export interface GameType {
//   gameProviderId: number;
//   gameID: number;
//   gameType: number;
//   newGameType: number;
//   rank: number;
//   device: DeviceType;
//   platform: string; // e.g. "HTML5"
//   provider: string; // e.g. "KAGaming"
//   rtp: number;
//   rows: number;
//   reels: number;
//   lines: number;

//   gameInfos: GameInfo[];
//   supportedCurrencies: string[];
//   blockCountries: string[];

//   isMaintain: boolean;
//   isEnabled: boolean;
//   isProvideCommission: boolean;
//   hasHedgeBet: boolean;

//   providerStatus: ProviderStatus;
//   isProviderOnline: boolean;
// }
