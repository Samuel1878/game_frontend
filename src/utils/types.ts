import type { st } from "vue-router/dist/router-CWoNjPRp.mjs"

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