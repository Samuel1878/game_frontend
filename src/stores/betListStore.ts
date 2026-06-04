import { defineStore } from "pinia";
import { ref, computed } from "vue";
// import {
//   getBetListAPI
// } from "@/api/transactionAPI";
import type { BetListRecord, ReportSummaryType } from "@/utils/types";
import { useAuthStore } from "./auth";
import { getBetListAPI } from "@/services/transactionAPI";
import { toISOStringSafe } from "@/utils/date";

export const useBetlistStore = defineStore("betListStore", () => {
  const loading = ref(false);
  const portfolio = ref("SeamlessGame");
  const mode = ref<"today" | "this_month" | "custom">("today");
  const startDate = ref();
  const endDate = ref();
  const rawBetRecords = ref<BetListRecord[]>([]);
  const transactionReport = ref({
    deposits: 0,
    withdraws: 0,
    refund: 0,
    bonus: 0,
    rebate: 0,
    adjustment: 0,
  });
  const BetReportRecord = ref<ReportSummaryType | null>(null);
  const betPage = ref(1);
  const betLimit = ref(20);
  const authStore = useAuthStore();
  const setMode = (v: "today" | "this_month" | "custom") => {
    mode.value = v;
    if (v !== "custom") {
      fetchBetList();
    }
  };

  const fetchBetList = async () => {
    if (!authStore.user?.name) return;
    try {
      loading.value = true;

      const response = await getBetListAPI({
        username: authStore.user?.name,
        mode: mode.value,
        portfolio: portfolio.value,
        startDate: startDate.value
          ? toISOStringSafe(startDate.value)
          : undefined,
        endDate: endDate.value ? toISOStringSafe(endDate.value) : undefined,
      });
      rawBetRecords.value = response?.betlist?.result || [];
      BetReportRecord.value = response?.report[0] || null;
      transactionReport.value = {
        deposits: Number(response?.transaction?.deposits) || 0,
        withdraws: Number(response?.transaction?.withdraws) || 0,
        refund: Number(response?.transaction?.refund) || 0,
        bonus: Number(response?.transaction?.bonus) || 0,
        adjustment: Number(response?.transaction?.adjustment) || 0,
        rebate: Number(response?.transaction?.rebate) || 0,
      };
      console.log(response);
    } catch (error) {
      rawBetRecords.value = [];
      BetReportRecord.value = null;
      transactionReport.value = {
        deposits: 0,
        withdraws: 0,
        refund: 0,
        bonus: 0,
        rebate: 0,
        adjustment: 0,
      };
      console.error(error);
    } finally {
      loading.value = false;
    }
  };
  const paginatedBetRecords = computed(() => {
    if (!rawBetRecords.value.length) return [];

    const start = (betPage.value - 1) * betLimit.value;

    const end = start + betLimit.value;

    return rawBetRecords && rawBetRecords.value.slice(start, end);
  });
  const betTotal = computed(() => {
    return rawBetRecords.value.length;
  });
  const betTotalPages = computed(() => {
    return Math.ceil(betTotal.value / betLimit.value);
  });

  const setBetPage = (page: number) => {
    if (page < 1 || page > betTotalPages.value) return;
    betPage.value = page;
  };
  return {
    BetReportRecord,
    loading,
    portfolio,
    mode,
    startDate,
    endDate,
    rawBetRecords,
    paginatedBetRecords,
    fetchBetList,
    transactionReport,
    betPage,
    betLimit,
    betTotal,
    betTotalPages,
    setBetPage,
    setMode,
  };
});
