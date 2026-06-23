import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { getApiErrorMessage } from "@/services/api";
import {
  getPlayerBetProviders,
  getPlayerBets,
  getPlayerRecordSummary,
} from "@/services/playerRecordsAPI";
import { useAuthStore } from "./auth";
import type {
  BetProviderOption,
  PeriodFilter,
  PlayerBetListParams,
  PlayerBetListResponse,
  PlayerRecordSummaryResponse,
  ProviderFilter,
} from "@/utils/types";

const DEFAULT_LIMIT = 50;

const emptyPagination = () => ({
  page: 1,
  limit: DEFAULT_LIMIT,
  total: 0,
  totalPages: 0,
});

export const useBetlistStore = defineStore("betListStore", () => {
  const authStore = useAuthStore();
  const loading = ref(false);
  const providerLoading = ref(false);
  const error = ref<string | null>(null);
  const period = ref<PeriodFilter>("today");
  const provider = ref<ProviderFilter>("all");
  const startDate = ref<string | undefined>();
  const endDate = ref<string | undefined>();
  const search = ref("");
  const page = ref(1);
  const limit = ref(DEFAULT_LIMIT);
  const betList = ref<PlayerBetListResponse | null>(null);
  const summary = ref<PlayerRecordSummaryResponse | null>(null);
  const providers = ref<BetProviderOption[]>([]);
  const providersLoaded = ref(false);

  const items = computed(() => betList.value?.items ?? []);
  const pagination = computed(() => betList.value?.pagination ?? emptyPagination());

  const buildParams = (): PlayerBetListParams => ({
    period: period.value,
    provider: provider.value,
    page: page.value,
    limit: limit.value,
    ...(period.value === "custom"
      ? {
          startDate: startDate.value,
          endDate: endDate.value,
        }
      : {}),
    ...(search.value.trim() ? { search: search.value.trim() } : {}),
  });

  const resetPage = () => {
    page.value = 1;
  };

  const fetchRecords = async () => {
    if (!authStore.isLoggedIn) return false;
    if (period.value === "custom" && (!startDate.value || !endDate.value)) {
      error.value = "custom_date_range_required";
      return false;
    }

    loading.value = true;
    error.value = null;
    try {
      const params = buildParams();
      const [nextBetList, nextSummary] = await Promise.all([
        getPlayerBets(params),
        getPlayerRecordSummary(params),
      ]);
      betList.value = nextBetList;
      summary.value = nextSummary;
      return true;
    } catch (err) {
      error.value = getApiErrorMessage(err);
      betList.value = null;
      summary.value = null;
      return false;
    } finally {
      loading.value = false;
    }
  };

  const fetchProviders = async () => {
    if (providerLoading.value || providersLoaded.value || !authStore.isLoggedIn) return;
    providerLoading.value = true;
    try {
      providers.value = (await getPlayerBetProviders()).filter(
        (item) => item.status?.toUpperCase() !== "DISABLED",
      );
      providersLoaded.value = true;
    } catch {
      // The all-provider option remains usable if provider filters cannot load.
      providers.value = [];
      providersLoaded.value = true;
    } finally {
      providerLoading.value = false;
    }
  };

  const initialize = async () => {
    await Promise.all([fetchProviders(), fetchRecords()]);
  };

  const setPeriod = (value: PeriodFilter) => {
    period.value = value;
    resetPage();
    if (value !== "custom") {
      startDate.value = undefined;
      endDate.value = undefined;
      void fetchRecords();
    }
  };

  const setProvider = (value: ProviderFilter) => {
    provider.value = value || "all";
    resetPage();
    void fetchRecords();
  };

  const setStartDate = (value?: string) => {
    startDate.value = value;
    resetPage();
  };

  const setEndDate = (value?: string) => {
    endDate.value = value;
    resetPage();
  };

  const setSearch = (value: string) => {
    search.value = value;
    resetPage();
    void fetchRecords();
  };

  const changePage = (value: number) => {
    if (loading.value || value < 1 || value > pagination.value.totalPages) return;
    page.value = value;
    void fetchRecords();
  };

  return {
    loading,
    providerLoading,
    error,
    period,
    provider,
    startDate,
    endDate,
    search,
    page,
    limit,
    items,
    pagination,
    summary,
    providers,
    buildParams,
    fetchRecords,
    fetchProviders,
    initialize,
    setPeriod,
    setProvider,
    setStartDate,
    setEndDate,
    setSearch,
    changePage,
  };
});
