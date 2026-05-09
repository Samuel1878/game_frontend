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
    withdraws:0
  });
  const total_players = ref(0)
  const authStore = useAuthStore();
  const setMode = (v:"today" | "this_month" | "custom") => {
    mode.value = v
    if (v!=="custom"){
        fetchSummary();
    }
  }
  const getDateRange = () => {
    const now = new Date();

    switch (mode.value) {
      case "today": {
        const start = new Date();

        start.setHours(0, 0, 0, 0);

        return {
          startDate: start.toISOString(),
          endDate: now.toISOString(),
        };
      }

      case "this_month": {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);

        return {
          startDate: start.toISOString(),
          endDate: now.toISOString(),
        };
      }

      case "custom":
        return {
          startDate: toISOStringSafe(startDate.value),

          endDate: toISOStringSafe(endDate.value),
        };
      default:
        return {
          startDate: now.toISOString(),
          endDate: now.toISOString(),
        };
    }
  };
const fetchSummary = async () => {
  if (!authStore.user?.agent_id) return;
     const dates =
          getDateRange();
  loading.value = true;

  try {
    const res = await getAgentTransactionSummaryAPI(authStore.user.agent_id, {
      mode: mode.value,
      startDate: dates.startDate,
      endDate: dates.endDate,
      portfolio:portfolio.value
    });
    console.log("ERERE" , res?.betReport)
    if (res){
      betReport.value = getSummary(res?.betReport);
      transactionReport.value = res?.transactionReport;
      total_players.value = res?.total_players
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
