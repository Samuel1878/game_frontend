
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
import { useAuthStore } from "./auth";
import { getBetListAPI } from "@/services/transactionAPI";
import { toISOStringSafe } from "@/utils/date";

export const useBetlistStore = defineStore(
  "betListStore",
  () => {
    const loading = ref(false);
    const portfolio = ref("SeamlessGame");
    const mode = ref<
      "today" |
      "this_month" |
      "custom" 
    >("today");
    const startDate = ref();
    const endDate = ref();
    const rawBetRecords = ref<BetListRecord[]>([]);
    const betPage = ref(1);
    const betLimit = ref(20);
      const authStore = useAuthStore();
    const setMode = (v:"today" |
      "this_month" |
      "custom" )=>{
        mode.value = v;
        if (v!=="custom"){

          fetchBetList();
        }
      }
   
    const fetchBetList =
      async () => {
        if (!authStore.user?.name)return
      try {

        loading.value = true;

        const response =
          await getBetListAPI({

            username:authStore.user?.name,
            mode:mode.value,
            portfolio:
              portfolio.value,

            startDate:
             startDate.value ? toISOStringSafe(startDate.value) : undefined,
            endDate:
             endDate.value ? toISOStringSafe(endDate.value) : undefined,
          });
          // console.log(response)
            rawBetRecords.value = response?.result;

      } catch (error) {

        console.error(error);

      } finally {

        loading.value = false;

      }
    };
    const paginatedBetRecords =
      computed(() => {
         rawBetRecords
      const start =
        (betPage.value - 1)
        *
        betLimit.value;

      const end =
        start + betLimit.value;

      return rawBetRecords && rawBetRecords.value
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