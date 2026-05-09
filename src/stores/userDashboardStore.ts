import {
  getAgentTransactionSummaryUidAPI,
} from "@/services/agentAPI";
import { toISOStringSafe } from "@/utils";
import { defineStore } from "pinia";
import { ref } from "vue";
import type { ReportSummaryType } from "@/utils/types";
import { getSummary } from "@/utils/help";

export const useUserDashboardStore = defineStore("userDashboardStore", () => {
  const loading = ref(false);
  const mode = ref<"today" | "this_month" | "custom">("today");
  const startDate = ref();
  const endDate = ref();
  const portfolio = ref("SeamlessGame");
  const betReport = ref<ReportSummaryType | null>(null);
  const transactionReport = ref({
    deposits: 0,
    withdraws: 0,
  });
  const setMode = (v: "today" | "this_month" | "custom", n: number) => {
    mode.value = v;
    if (v !== "custom") {
      fetchSummary(n);
    }
  };
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
  const fetchSummary = async (user_id: number) => {
    const dates = getDateRange();
    loading.value = true;

    try {
      const res = await getAgentTransactionSummaryUidAPI(user_id, {
        mode: mode.value,
        startDate: dates.startDate,
        endDate: dates.endDate,
        portfolio: portfolio.value,
      });
      console.log("ERERE", res?.betReport);
      if (res) {
        betReport.value = getSummary(res?.betReport);
        transactionReport.value = res?.transactionReport;
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
    betReport,
    startDate,
    endDate,
  };
});
