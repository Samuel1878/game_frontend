import api from "./api";
import type {
  BetProviderOption,
  PlayerBetListParams,
  PlayerBetListResponse,
  PlayerRecordFilters,
  PlayerRecordSummary,
  PlayerRecordSummaryResponse,
} from "@/utils/types";

type PlayerRecordSummaryApiResponse = PlayerRecordSummary & {
  filters: PlayerRecordFilters;
};

type BetProviderListResponse = {
  items: BetProviderOption[];
};

export const getPlayerBets = async (params: PlayerBetListParams) => {
  const response = await api.get<PlayerBetListResponse>("/api/player/bets", {
    params,
  });
  return response.data;
};

export const getPlayerRecordSummary = async (params: PlayerBetListParams) => {
  const { page: _page, limit: _limit, ...summaryParams } = params;
  const response = await api.get<PlayerRecordSummaryApiResponse>(
    "/api/player/records/summary",
    { params: summaryParams },
  );
  const { filters, ...summary } = response.data;

  return {
    period: filters.period,
    provider: filters.provider,
    startDate: filters.startDate,
    endDate: filters.endDate,
    summary,
  } satisfies PlayerRecordSummaryResponse;
};

export const getPlayerBetProviders = async () => {
  const response = await api.get<BetProviderListResponse>(
    "/api/player/bets/providers",
  );
  return response.data.items;
};
