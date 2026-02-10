

export interface GameInfo {
  language: string
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
  supportedCurrencies: string[]
  blockCountries: string[]

  isMaintain: boolean
  isEnabled: boolean
  isProvideCommission: boolean
  hasHedgeBet: boolean

  providerStatus: 'Online' | 'Offline' | string
  isProviderOnline: boolean
}
export interface gameListRespone {
      seamlessGameProviderGames:Game[]
}

export interface userInfo {
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
  inv_id:string;
  user_id:number | null;
  payment:string | null;
  request_amount:number | null;
  actual_amount?:number;
  uuid:string|null;
  completed:boolean;
  status:string;
  remark?:string;
  account_no:string | null;
  account_name:string | null;
  created_at?:string;
  updated_at?:string;
  tid:string;
  payment_account?:string | null;
  payment_number?:string | null;
    ref_no?:string|null;
}
export interface withdrawalInfo {    
  id:number;
  user_id:number;
  amount:number;
  payment_method:string;
  status:string;
  created_at:string;
  updated_at:string;
}
export interface wallet {
  balance:number;
  updated_at?:string;
  freezed_amount?:number;
}