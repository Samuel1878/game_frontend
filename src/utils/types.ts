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