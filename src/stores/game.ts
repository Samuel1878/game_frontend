import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";
import router from "@/router";
import { DEFAULT_COUNTRY, DEFAULT_CURRENCY } from "@/config/env";
import {
  getFeaturedGames,
  getHotGames,
  getProviderGames,
  getProviders,
  getTopGames,
  launchDemoGame as launchDemoGameRequest,
  launchGame as launchGameRequest,
  normalizeGames,
  type BackendGame,
  type GameListFilters,
  type GamePagination,
  type GameProvider,
  type ProviderLaunchResponse,
} from "@/services/gameApi";
import type { gameType } from "@/utils/types";
import { useAuthStore } from "@/stores/auth";
import { useWallet } from "@/stores/wallet";

type CachedGames = {
  items: gameType[];
  pagination: GamePagination | null;
  fetchedAt: number;
};

const CACHE_TTL_MS = 2 * 60 * 1000;
const DEFAULT_PAGE_SIZE = 24;

const filterKey = (filters: GameListFilters = {}) =>
  JSON.stringify(
    Object.keys(filters)
      .sort()
      .reduce<Record<string, unknown>>((output, key) => {
        const value = filters[key as keyof GameListFilters];
        if (value !== undefined && value !== "") {
          output[key] = value;
        }
        return output;
      }, {}),
  );

const isFresh = (entry?: CachedGames | null) =>
  Boolean(entry && Date.now() - entry.fetchedAt < CACHE_TTL_MS);

const isHtmlLaunch = (value?: string | null) => {
  const trimmed = value?.trim();
  return Boolean(trimmed && (trimmed.startsWith("<") || /<html|<iframe|<script/i.test(trimmed)));
};

const backendMessageKey = (message: string) => {
  const normalized = message.toUpperCase();
  if (normalized.includes("INSUFFICIENT")) return "insufficient_balance";
  if (normalized.includes("PROVIDER") && normalized.includes("DISABLED")) return "provider_unavailable";
  if (normalized.includes("PROVIDER") && normalized.includes("MAINTENANCE")) return "provider_maintenance";
  if (normalized.includes("GAME") && normalized.includes("DISABLED")) return "game_unavailable";
  if (normalized.includes("SESSION")) return "invalid_session";
  return message || "launch_failed";
};

const providerCodeOf = (game: gameType) =>
  game.launch?.provider_code || game.provider_code || String(game.provider_id);

const gameCodeOf = (game: gameType) =>
  game.launch?.game_code || game.game_code || String(game.game_id);

export const useGameStore = defineStore("game", () => {
  const loading = ref(false);
  const launching = ref(false);
  const drawerOpen = ref(false);
  const error = ref<string | null>(null);
  const providers = ref<GameProvider[]>([]);
  const gamesByProvider = ref<Record<string, CachedGames>>({});
  const gamesByFilter = ref<Record<string, CachedGames>>({});
  const categoryGames = ref<Record<string, gameType[]>>({});
  const hotGames = ref<gameType[]>([]);
  const topGames = ref<gameType[]>([]);
  const featuredGames = ref<gameType[]>([]);
  const selectedGame = ref<gameType | null>(null);
  const launchUrl = ref<string | null>(null);
  const launchHtml = ref<string | null>(null);
  const launchToken = ref<string | null>(null);
  const closeTimer = ref<ReturnType<typeof setTimeout> | null>(null);
  const providersLoadedAt = ref(0);

  const authStore = useAuthStore();
  const wallet = useWallet();
  const { locale, t } = useI18n();

  const launchReady = computed(() => Boolean(launchUrl.value || launchHtml.value));

  const localeCode = () => {
    if (locale.value === "cn") return "zh-cn";
    if (locale.value === "mm") return "my-mm";
    return "en";
  };

  const openDrawer = () => {
    drawerOpen.value = true;
    if (closeTimer.value) {
      clearTimeout(closeTimer.value);
    }
    closeTimer.value = setTimeout(() => {
      drawerOpen.value = false;
      closeTimer.value = null;
    }, 20000);
  };

  const closeDrawer = () => {
    drawerOpen.value = false;

    if (closeTimer.value) {
      clearTimeout(closeTimer.value);
      closeTimer.value = null;
    }
  };

  const setLaunchPayload = (payload: ProviderLaunchResponse) => {
    launchToken.value = payload.token ?? null;
    if (payload.launchHtml || isHtmlLaunch(payload.launchUrl)) {
      launchHtml.value = payload.launchHtml ?? payload.launchUrl ?? null;
      launchUrl.value = null;
      return;
    }

    launchUrl.value = payload.launchUrl ?? null;
    launchHtml.value = null;
  };

  const fetchProviders = async (force = false): Promise<GameProvider[]> => {
    if (!force && providers.value.length && Date.now() - providersLoadedAt.value < CACHE_TTL_MS) {
      return providers.value;
    }

    loading.value = true;
    error.value = null;
    try {
      providers.value = await getProviders();
      providersLoadedAt.value = Date.now();
      return providers.value;
    } catch (err: any) {
      error.value = err?.response?.data?.message || "provider_unavailable";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchGames = async (
    filters: GameListFilters = {},
    force = false,
  ): Promise<CachedGames> => {
    const key = filterKey(filters);
    const cached = gamesByFilter.value[key];
    if (!force && cached && isFresh(cached)) return cached;

    loading.value = true;
    error.value = null;
    try {
      const response = await getProviderGames(filters.providerCode, {
        page: filters.page ?? 1,
        limit: filters.limit ?? DEFAULT_PAGE_SIZE,
        gameType: filters.gameType,
        search: filters.search,
      });
      const entry = {
        items: normalizeGames(response.items),
        pagination: response.pagination,
        fetchedAt: Date.now(),
      };
      gamesByFilter.value[key] = entry;
      return entry;
    } catch (err: any) {
      error.value = err?.response?.data?.message || "game_unavailable";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchGamesByProvider = async (
    providerCode: string,
    filters: GameListFilters = {},
    force = false,
  ): Promise<CachedGames> => {
    const key = `${providerCode}:${filterKey(filters)}`;
    const cached = gamesByProvider.value[key];
    if (!force && cached && isFresh(cached)) return cached;

    const entry = await fetchGames(
      {
        ...filters,
        providerCode,
      },
      force,
    );
    gamesByProvider.value[key] = entry;
    return entry;
  };

  const fetchCategoryGames = async (
    categoryKey: string,
    filters: GameListFilters,
    force = false,
  ): Promise<CachedGames> => {
    const entry = await fetchGames(filters, force);
    categoryGames.value[categoryKey] = entry.items;
    return entry;
  };

  const fetchCuratedGames = async (
    kind: "hot" | "top" | "featured",
    filters: GameListFilters = {},
    force = false,
  ): Promise<CachedGames> => {
    const key = `curated:${kind}:${filterKey(filters)}`;
    const cached = gamesByFilter.value[key];
    if (!force && cached && isFresh(cached)) return cached;

    loading.value = true;
    error.value = null;
    try {
      const request = kind === "hot"
        ? getHotGames
        : kind === "top"
          ? getTopGames
          : getFeaturedGames;
      const response = await request({
        page: filters.page ?? 1,
        limit: filters.limit ?? DEFAULT_PAGE_SIZE,
        providerCode: filters.providerCode,
        gameType: filters.gameType,
        search: filters.search,
      });
      const entry = {
        items: normalizeGames(response.items),
        pagination: response.pagination,
        fetchedAt: Date.now(),
      };
      gamesByFilter.value[key] = entry;
      return entry;
    } catch (err: any) {
      error.value = err?.response?.data?.message || "game_unavailable";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchHomeGameSections = async (force = false) => {
    loading.value = true;
    error.value = null;
    try {
      const [
        hot,
        top,
        featured,
        slots,
        buffalo,
        fishing,
        casino,
        arcade,
      ] = await Promise.all([
        getHotGames({ page: 1, limit: 18 }),
        getTopGames({ page: 1, limit: 18 }),
        getFeaturedGames({ page: 1, limit: 18 }),
        fetchCategoryGames("SLOT", { gameType: "SLOT", page: 1, limit: 18 }, force),
        fetchCategoryGames("BUFFALO", { search: "buffalo", page: 1, limit: 18 }, force),
        fetchCategoryGames("FISHING", { gameType: "FISHING", page: 1, limit: 18 }, force),
        fetchCategoryGames("LIVE_CASINO", { gameType: "LIVE_CASINO", page: 1, limit: 18 }, force),
        fetchCategoryGames("ARCADE", { gameType: "ARCADE", page: 1, limit: 18 }, force),
      ]);

      hotGames.value = normalizeGames(hot.items);
      topGames.value = normalizeGames(top.items);
      featuredGames.value = normalizeGames(featured.items);
      categoryGames.value.SLOT = slots.items;
      categoryGames.value.BUFFALO = buffalo.items;
      categoryGames.value.FISHING = fishing.items;
      categoryGames.value.LIVE_CASINO = casino.items;
      categoryGames.value.ARCADE = arcade.items;
      void fetchProviders(force);
    } catch (err: any) {
      error.value = err?.response?.data?.message || "game_unavailable";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const ensureAuthenticated = async () => {
    if (authStore.isLoggedIn) return true;

    await authStore.revalidate();
    if (authStore.isLoggedIn) return true;

    toast.warning(t("please_login"));
    await router.push({ path: "/auth", query: { mode: "login" } });
    return false;
  };

  const prepareGame = async (game: gameType | BackendGame) => {
    const normalizedGame = "provider_code" in game && "game_code" in game
      ? normalizeGames([game as BackendGame])[0]
      : game as gameType;

    if (!normalizedGame) return;
    if (!(await ensureAuthenticated())) return;

    selectedGame.value = normalizedGame;
    launchUrl.value = null;
    launchHtml.value = null;
    launchToken.value = null;
    openDrawer();
  };

  const launchSelectedGame = async (game: gameType, demo = false) => {
    if (!(await ensureAuthenticated())) return null;

    launching.value = true;
    loading.value = true;
    error.value = null;
    selectedGame.value = game;

    try {
      const providerCode = providerCodeOf(game);
      const gameCode = gameCodeOf(game);
      const request = demo ? launchDemoGameRequest : launchGameRequest;
      const payload = await request(providerCode, gameCode, {
        playerId: String(authStore.user?.uid ?? authStore.user?.id),
        currency: wallet.currency || game.currency || DEFAULT_CURRENCY,
        country: DEFAULT_COUNTRY,
        language: localeCode(),
        platform: "MOBILE",
        playMode: demo ? "DEMO" : "REAL",
        lobbyUrl: window.location.origin,
        cashierUrl: `${window.location.origin}/deposit`,
      });

      setLaunchPayload(payload);
      if (!launchReady.value) {
        throw new Error("launch_failed");
      }

      closeDrawer();
      await router.push({
        path: "/game/play",
        query: {
          provider: providerCode,
          game: gameCode,
          mode: demo ? "demo" : "real",
        },
      });

      return payload;
    } catch (err: any) {
      const message = backendMessageKey(
        err?.response?.data?.message || err?.response?.data?.error || err?.message,
      );
      error.value = message;
      toast.error(t(message));
      return null;
    } finally {
      launching.value = false;
      loading.value = false;
    }
  };

  const launchGame = async (game: gameType) => launchSelectedGame(game, false);
  const launchDemoGame = async (game: gameType) => launchSelectedGame(game, true);

  const enterGame = async () => {
    if (!selectedGame.value) return;
    await launchGame(selectedGame.value);
  };

  const clearLaunchState = () => {
    launchUrl.value = null;
    launchHtml.value = null;
    launchToken.value = null;
  };

  const resetGame = () => {
    clearLaunchState();
    selectedGame.value = null;
  };

  const refreshAfterGameExit = async () => {
    clearLaunchState();
    await Promise.allSettled([
      authStore.fetchUser(),
      wallet.fetchBalance(),
    ]);
  };

  return {
    loading,
    launching,
    drawerOpen,
    error,
    providers,
    gamesByProvider,
    gamesByFilter,
    categoryGames,
    hotGames,
    topGames,
    featuredGames,
    selectedGame,
    launchUrl,
    launchHtml,
    launchToken,
    launchReady,
    fetchProviders,
    fetchGames,
    fetchGamesByProvider,
    fetchCategoryGames,
    fetchCuratedGames,
    fetchHomeGameSections,
    prepareGame,
    launchGame,
    launchDemoGame,
    enterGame,
    clearLaunchState,
    refreshAfterGameExit,
    resetGame,
    closeDrawer,
  };
});
