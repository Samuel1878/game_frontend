
import { defineStore } from "pinia";
import {
  ref,
  computed,
} from "vue";
// import {
//   getBetListAPI
// } from "@/api/transactionAPI";
import type {
    BetListRecord,
} from "@/utils/types";
import { toISOStringSafe } from "@/utils";
import { useAuthStore } from "./auth";
import { getBetListAPI } from "@/services/transactionAPI";

export const useBetlistStore = defineStore(
  "betListStore",
  () => {
    const loading = ref(false);
    const portfolio = ref("SeamlessGame");
    const mode = ref<
      "today" |
      "this_month" |
      "custom" |
      "all"
    >("today");
    const startDate = ref();
    const endDate = ref();
    const rawBetRecords = ref<BetListRecord[]>([]);
    const betPage = ref(1);
    const betLimit = ref(20);
      const authStore = useAuthStore();
    const setMode = (v:"today" |
      "this_month" |
      "custom" |
      "all")=>{
        mode.value = v;
        if (v!=="custom"){

          fetchBetList();
        }
      }
    const getDateRange = () => {
    const now = new Date();
  
    
    switch (mode.value) {

    case "today": {

      const start = new Date();

      start.setHours(0,0,0,0);

      return {
        startDate: start.toISOString(),
        endDate: now.toISOString(),
      };
    }

    case "this_month": {

      const start = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );

      return {
        startDate: start.toISOString(),
        endDate: now.toISOString(),
      };
    }

    case "custom":

      return {
        startDate:
          toISOStringSafe(
            startDate.value
          ),

        endDate:
          toISOStringSafe(
            endDate.value
          ),
      };

    case "all":

      return {
        startDate:
          new Date("2000-01-01")
            .toISOString(),

        endDate:
          now.toISOString(),
      };

    default:

      return {
        startDate: now.toISOString(),
        endDate: now.toISOString(),
      };
    }
};
    const fetchBetList =
      async () => {
        if (!authStore.user?.name)return
      try {

        loading.value = true;

        const dates =
          getDateRange();

        const response =
          await getBetListAPI({

            username:authStore.user?.name,

            portfolio:
              portfolio.value,

            startDate:
              dates.startDate,

            endDate:
              dates.endDate,
          });
          console.log(response)
        rawBetRecords.value =
          response.result;
           console.log(response)

      } catch (error) {

        console.error(error);

      } finally {

        loading.value = false;

      }
    };
    const paginatedBetRecords =
      computed(() => {

      const start =
        (betPage.value - 1)
        *
        betLimit.value;

      const end =
        start + betLimit.value;

      return rawBetRecords.value
        .slice(start, end);

    });
    const betTotal = computed(() => {
      return rawBetRecords
        .value.length;
    });
    const betTotalPages =
      computed(() => {
      return Math.ceil(
        betTotal.value
        /
        betLimit.value
      );
    });
    
    const setBetPage =
      (page: number) => {
      if (
        page < 1 ||
        page > betTotalPages.value
      ) return;
      betPage.value = page;
    };
    return {
      loading,
      portfolio,
      mode,
      startDate,
      endDate,
      rawBetRecords,
      paginatedBetRecords,
      fetchBetList,
      betPage,
      betLimit,
      betTotal,
      betTotalPages,
      setBetPage,
      setMode
    };
  }
);