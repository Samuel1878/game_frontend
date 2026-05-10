import { getAgentTransactionSummaryAPI } from "@/services/agentAPI";
import { toISOStringSafe } from "@/utils";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./auth";
import type { ReportSummaryType } from "@/utils/types";
import { getSummary } from "@/utils/help";


export const useAgentDashboardStore = defineStore("dashboardStore", () => {
  const loading = ref(false);
  const mode = ref<"today" | "this_month" | "custom">("today");
  const startDate = ref();
  const endDate = ref();
  const portfolio = ref("SeamlessGame")
  const betReport = ref<ReportSummaryType | null>(null);
  const transactionReport = ref({
    deposits:0,
    withdraws:0,
    rebate:0,
    bonus:0
  });
  const total_players = ref(0)
  const authStore = useAuthStore();
  const setMode = (v:"today" | "this_month" | "custom") => {
    mode.value = v
    if (v!=="custom"){
        fetchSummary();
    }
  }

const fetchSummary = async () => {
  if (!authStore.user?.agent_id) return;

  loading.value = true;

  try {
    const res = await getAgentTransactionSummaryAPI(
      authStore.user.agent_id,
      {
        mode: mode.value,
        startDate: startDate.value ? toISOStringSafe(startDate.value) : undefined,
        endDate: endDate.value ? toISOStringSafe(endDate.value) : undefined,
        portfolio: portfolio.value,
      }
    );

    if (res) {
      betReport.value = getSummary(res?.betReport);
      transactionReport.value = res?.transactionReport;
      total_players.value = res?.total_players;
    }
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};


  return {
    loading,
    // FILTERS
    fetchSummary,
    portfolio,
    setMode,
    mode,
    transactionReport,
    total_players,
    betReport,
    startDate,
    endDate,
  };
});
