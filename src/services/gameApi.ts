import api from "./api";
import type { gameListRespone, gameType } from "@/utils/types";
import { DEFAULT_COUNTRY, DEFAULT_CURRENCY } from "@/config/env";

export type ProviderGameType =
  | "SLOT"
  | "LIVE_CASINO"
  | "SPORTS"
  | "FISHING"
  | "TABLE"
  | "ARCADE"
  | "LOTTERY"
  | "OTHER";

export type GameProvider = {
  provider_code: string;
  display_name: string;
  status: "ACTIVE" | "DISABLED" | string;
  created_at?: string;
  updated_at?: string;
};

export type BackendGame = {
  id: string;
  provider_code: string;
  game_code: string;
  display_name: string;
  category: string | null;
  game_type: ProviderGameType;
  currency: string | null;
  name_en: string | null;
  name_cn: string | null;
  name_mm: string | null;
  icon_url: string | null;
  icon_url_cn: string | null;
  banner_url: string | null;
  rtp: string | number | null;
  volatility: string | null;
  supports_demo: boolean;
  supports_mobile: boolean;
  supports_desktop: boolean;
  is_hot: boolean;
  is_top_pick: boolean;
  is_high_rtp: boolean;
  sort_order: number;
  launch: {
    provider_code: string;
    game_code: string;
  };
};

export type GameListFilters = {
  providerCode?: string;
  gameType?: ProviderGameType | string;
  search?: string;
  page?: number;
  limit?: number;
};

export type GamePagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type GameListResponse = {
  items: BackendGame[];
  pagination: GamePagination;
};

export type LaunchGameOptions = {
  playerId: string;
  currency?: string;
  country?: string;
  language?: string;
  platform?: "WEB" | "MOBILE" | string;
  playMode?: "REAL" | "DEMO" | string;
  cashierUrl?: string;
  lobbyUrl?: string;
  promoAvailable?: boolean;
};

export type ProviderLaunchResponse = {
  providerCode: string;
  launchUrl?: string;
  launchHtml?: string;
  token?: string;
};

export class UnsupportedGameApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnsupportedGameApiError";
  }
}

const providerCodeByLegacyId: Record<string, string> = {
  "3": "PRAGMATIC_PLAY",
  "35": "PG",
  "1020": "JILI",
  "1046": "FACHAI",
  "1029": "JDB",
  "1042": "CQ9",
};

const gameTypeByLegacyType: Record<string, ProviderGameType> = {
  "201": "SLOT",
  "202": "ARCADE",
  "203": "FISHING",
  "204": "LIVE_CASINO",
  "101": "LIVE_CASINO",
  "102": "LIVE_CASINO",
  "103": "LIVE_CASINO",
  "104": "LIVE_CASINO",
  "105": "TABLE",
  "107": "TABLE",
  "108": "TABLE",
};

const toProviderCode = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === "" || Number(value) === 0) {
    return undefined;
  }

  const key = String(value);
  return providerCodeByLegacyId[key] ?? key.toUpperCase();
};

const toGameType = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === "") return undefined;
  const first = String(value).split(",")[0]?.trim();
  if (!first) return undefined;
  return gameTypeByLegacyType[first] ?? first.toUpperCase();
};

const toQueryParams = (filters: GameListFilters = {}) => ({
  ...(filters.page ? { page: filters.page } : {}),
  ...(filters.limit ? { limit: filters.limit } : {}),
  ...(filters.providerCode ? { provider_code: filters.providerCode } : {}),
  ...(filters.gameType ? { game_type: filters.gameType } : {}),
  ...(filters.search ? { search: filters.search } : {}),
});

const readItems = (response: GameListResponse | BackendGame[] | null | undefined) => {
  if (!response) return [];
  return Array.isArray(response) ? response : response.items ?? [];
};

export const normalizeGame = (game: BackendGame): gameType => ({
  id: game.id,
  provider_id: game.provider_code,
  provider_code: game.provider_code,
  provider_name: game.provider_code,
  game_id: game.game_code,
  game_code: game.game_code,
  rtp: game.rtp,
  volatility: game.volatility,
  game_rank: game.sort_order,
  name: game.name_en || game.display_name || game.game_code,
  name_mm: game.name_mm ?? undefined,
  icon_url: game.icon_url || game.icon_url_cn || "/logo.webp",
  cn_icon_url: game.icon_url_cn || game.icon_url || "/logo.webp",
  cn_name: game.name_cn || game.display_name || game.game_code,
  display_name: game.display_name,
  category: game.category,
  game_type: game.game_type,
  currency: game.currency,
  banner_url: game.banner_url,
  supports_demo: game.supports_demo,
  supports_mobile: game.supports_mobile,
  supports_desktop: game.supports_desktop,
  is_hot: game.is_hot,
  is_top_pick: game.is_top_pick,
  is_high_rtp: game.is_high_rtp,
  launch: game.launch,
});

export const normalizeGames = (games: BackendGame[]) => games.map(normalizeGame);

export const getProviders = async () => {
  const response = await api.get<GameProvider[]>("/api/games/providers");
  return response.data;
};

export const getProviderGames = async (
  providerCode?: string,
  filters: GameListFilters = {},
) => {
  const response = await api.get<GameListResponse>("/api/games", {
    params: toQueryParams({
      ...filters,
      providerCode: providerCode || filters.providerCode,
    }),
  });

  return response.data;
};

export const getHotGames = async (filters: GameListFilters = {}) => {
  const response = await api.get<GameListResponse>("/api/games/hot", {
    params: toQueryParams(filters),
  });
  return response.data;
};

export const getTopGames = async (filters: GameListFilters = {}) => {
  const response = await api.get<GameListResponse>("/api/games/top-picks", {
    params: toQueryParams(filters),
  });
  return response.data;
};

export const getFeaturedGames = async (filters: GameListFilters = {}) => {
  const response = await api.get<GameListResponse>("/api/games/high-rtp", {
    params: toQueryParams(filters),
  });
  return response.data;
};

export const getGameDetail = async (providerCode: string, gameCode: string) => {
  const response = await getProviderGames(providerCode, {
    search: gameCode,
    page: 1,
    limit: 100,
  });
  const game = response.items.find((item) => item.game_code === gameCode);

  if (!game) {
    throw new UnsupportedGameApiError("Game detail route is not available and catalog lookup did not find this game.");
  }

  return game;
};

export const prepareGame = async (providerCode: string, gameCode: string) => {
  return getGameDetail(providerCode, gameCode);
};

export const launchGame = async (
  providerCode: string,
  gameCode: string,
  options: LaunchGameOptions,
) => {
  const response = await api.post<ProviderLaunchResponse>(
    `/api/providers/${providerCode}/launch`,
    {
      playerId: options.playerId,
      gameCode,
      currency: options.currency ?? DEFAULT_CURRENCY,
      country: options.country ?? DEFAULT_COUNTRY,
      language: options.language ?? "en",
      platform: options.platform ?? "MOBILE",
      playMode: options.playMode ?? "REAL",
      cashierUrl: options.cashierUrl,
      lobbyUrl: options.lobbyUrl,
      promoAvailable: options.promoAvailable,
    },
  );

  return response.data;
};

export const launchDemoGame = async (
  providerCode: string,
  gameCode: string,
  options: LaunchGameOptions,
) => launchGame(providerCode, gameCode, { ...options, playMode: "DEMO" });

export const getFavoriteGames = async () => {
  const response = await api.get<{ favorites: BackendGame[] }>("/api/player/favorites");
  return response.data.favorites ?? [];
};

export const toggleFavoriteGame = async () => {
  throw new UnsupportedGameApiError("Favorite toggle is not exposed by game_new_backend.");
};

export async function getGameListAPI(): Promise<gameListRespone | null> {
  const response = await getProviderGames(undefined, { page: 1, limit: 100 });
  return {
    seamlessGameProviderGames: response.items.map((game) => ({
      gameProviderId: Number.NaN,
      gameID: Number.NaN,
      gameType: 0,
      newGameType: 0,
      rank: game.sort_order,
      device: game.supports_mobile ? "mobile" : "desktop",
      platform: "backend",
      provider: game.provider_code,
      rtp: Number(game.rtp ?? 0),
      rows: 0,
      reels: 0,
      lines: 0,
      gameInfos: [
        {
          language: "en",
          gameName: game.name_en || game.display_name,
          gameIconUrl: game.icon_url || "",
        },
      ],
      isMaintain: false,
      isEnabled: true,
      isProvideCommission: false,
      hasHedgeBet: false,
      providerStatus: "Online",
      isProviderOnline: true,
    })),
  };
}

export async function getGameByGpId(gpid: number | string) {
  return getProviderGames(toProviderCode(gpid), { page: 1, limit: 100 });
}

export const enterGameAPI = async (data: {
  lang: string;
  gpId: number | string;
  gameId: number | string;
  playerId: string;
  currency: string;
  country: string;
  platform?: string;
  playMode?: string;
  cashierUrl?: string;
  lobbyUrl?: string;
}) => {
  const providerCode = toProviderCode(data.gpId);
  if (!providerCode) return null;

  const response = await launchGame(providerCode, String(data.gameId), {
    playerId: data.playerId,
    currency: data.currency,
    country: data.country,
    language: data.lang,
    platform: data.platform,
    playMode: data.playMode,
    cashierUrl: data.cashierUrl,
    lobbyUrl: data.lobbyUrl,
  });

  return {
    ...response,
    url: response.launchUrl,
  };
};

export const getGamesByProviderAPI = async ({
  providerId,
  limit = 20,
  offset = 0,
  newGameType = 201,
  search = "",
  top = false,
}: {
  providerId: number | string;
  limit?: number;
  offset?: number;
  lang?: string;
  newGameType?: string | number;
  search?: string;
  sortBy?: string;
  top?: boolean;
}) => {
  const filters = {
    providerCode: toProviderCode(providerId),
    gameType: toGameType(newGameType),
    search,
    page: Math.floor(offset / limit) + 1,
    limit,
  };
  const response = top ? await getTopGames(filters) : await getProviderGames(filters.providerCode, filters);

  return {
    data: normalizeGames(readItems(response)),
    pagination: response.pagination,
  };
};
