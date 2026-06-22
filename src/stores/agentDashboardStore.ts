import { getAgentDashboardSummary } from "@/services/agentAPI";
import { getApiErrorMessage } from "@/services/api";
import type {
  AgentDashboardPeriod,
  AgentDashboardQuery,
  AgentDashboardSummary,
} from "@/utils/types";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAgentDashboardStore = defineStore("agentDashboardStore", () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const period = ref<AgentDashboardPeriod>("today");
  const startDate = ref<string | undefined>();
  const endDate = ref<string | undefined>();
  const summary = ref<AgentDashboardSummary | null>(null);

  const buildQuery = (overrides: Partial<AgentDashboardQuery> = {}): AgentDashboardQuery => {
    const selectedPeriod = overrides.period ?? period.value;
    return {
      period: selectedPeriod,
      ...(selectedPeriod === "custom"
        ? {
            start_date: overrides.start_date ?? startDate.value,
            end_date: overrides.end_date ?? endDate.value,
          }
        : {}),
      ...overrides,
    };
  };

  const fetchSummary = async () => {
    if (period.value === "custom" && (!startDate.value || !endDate.value)) {
      error.value = "custom_date_range_required";
      return;
    }

    loading.value = true;
    error.value = null;
    try {
      summary.value = await getAgentDashboardSummary(buildQuery());
    } catch (err) {
      error.value = getApiErrorMessage(err);
      summary.value = null;
    } finally {
      loading.value = false;
    }
  };

  const setPeriod = (value: AgentDashboardPeriod) => {
    period.value = value;
    if (value !== "custom") {
      startDate.value = undefined;
      endDate.value = undefined;
      void fetchSummary();
    }
  };

  return {
    loading,
    error,
    period,
    startDate,
    endDate,
    summary,
    buildQuery,
    fetchSummary,
    setPeriod,
  };
});
