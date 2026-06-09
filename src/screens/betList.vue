<script setup lang="ts">
import LanguageBtn from "@/components/languageBtn.vue";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import { useBetlistStore } from "@/stores/betListStore";
import { formatPrice, openChat } from "@/utils";
import { ClipboardX, Headset } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { computed, onActivated } from "vue";
import { useI18n } from "vue-i18n";
import DatePicker from "@/components/CalenderView.vue";
import { formatMyanmarTime } from "@/utils/date";

const store = useBetlistStore();
const {
  mode,
  startDate,
  endDate,
  loading,
  transactionReport,
  paginatedBetRecords,
  betPage,
  betTotal,
  betTotalPages,
  BetReportRecord,
} = storeToRefs(store);
const { t } = useI18n();
const getWinLoss = computed(() =>
  formatPrice(
    (transactionReport.value?.deposits || 0) -
      (transactionReport.value?.adjustment || 0) -
      ((transactionReport.value?.withdraws || 0) -
        (transactionReport.value?.refund || 0)),
  ),
);
onActivated(() => {
  store.fetchBetList();
});
</script>
<template>
  <CustomNavBar title="bet_list" backTo="/user/profile">
    <template #right>
      <button @click="openChat">
        <Headset class="w-6 h-6" />
      </button>
      <LanguageBtn />
    </template>
  </CustomNavBar>
  <div class="w-full bg-gray-900 p-2">
    <div
      class="w-full bg-gray-800/20 border border-gray-500/20 shadow-2xl p-2 rounded-lg"
    >
      <div class="flex gap-2 overflow-auto no-scrollbar">
        <button
          class="filter-btn"
          :class="mode === 'today' && 'active'"
          @click="store.setMode('today')"
        >
          {{ t("today") }}
        </button>

        <button
          class="filter-btn"
          :class="mode === 'this_month' && 'active'"
          @click="store.setMode('this_month')"
        >
          {{ t("this_month") }}
        </button>

        <button
          class="filter-btn"
          :class="mode === 'custom' && 'active'"
          @click="store.setMode('custom')"
        >
          {{ t("custom") }}
        </button>
      </div>

      <!-- CUSTOM DATE -->
      <div
        v-if="mode === 'custom'"
        class="rounded-2xl border border-gray-500/20 bg-gray-800/20 p-4 mt-2"
      >
        <div class="flex gap-2">
          <DatePicker v-model="startDate" placeholder="From Date" />

          <DatePicker v-model="endDate" placeholder="To Date" />
        </div>

        <button
          class="mt-3 w-full rounded-xl gold-bg py-3 text-sm font-medium"
          @click="store.fetchBetList"
        >
          {{ t("search") }}
        </button>
      </div>
    </div>
    <div class="grid grid-rows-1 grid-cols-3 items-center gap-2 py-2">
      <div
        class="p-2 rounded-lg bg-gray-800/20 border border-gray-500/20 flex items-center gap-2 justify-center"
      >
        <div class="text-sm text-gray-400 text-center">
          {{ t("turnover") }}
          <p class="dashboard-value text-white">
            {{
              formatPrice(
                (BetReportRecord?.turnover?.bonus || 0) +
                  (BetReportRecord?.turnover?.draw || 0) +
                  (BetReportRecord?.turnover?.won || 0) +
                  (BetReportRecord?.turnover?.lose || 0),
              )
            }}
          </p>
        </div>
      </div>
      <div
        class="p-2 rounded-lg bg-gray-800/20 border border-gray-500/20 flex items-center gap-2 justify-center"
      >
        <div class="text-sm text-gray-400 text-center">
          GGR
          <p
            class="dashboard-value"
            :class="
              (BetReportRecord?.winlose || 0) >= 0
                ? 'text-green-400'
                : 'text-red-400'
            "
          >
            {{ formatPrice(BetReportRecord?.winlose || 0) }}
          </p>
        </div>
      </div>
      <div
        class="p-2 rounded-lg bg-gray-800/20 border border-gray-500/20 flex items-center gap-2 justify-center"
      >
        <div class="text-sm text-gray-400 text-center">
          {{ t("bonus") }}
          <p class="dashboard-value text-white">
            {{
              formatPrice(
                (transactionReport?.bonus || 0) +
                  (transactionReport?.rebate || 0),
              )
            }}
          </p>
        </div>
      </div>
      <div
        class="p-2 rounded-lg bg-gray-800/20 border border-gray-500/20 flex items-center gap-2 justify-center"
      >
        <div class="text-sm text-gray-400 text-center">
          {{ t("win_loss") }}
          <p
            class="dashboard-value"
            :class="
              (Number(getWinLoss) || 0) >= 0 ? 'text-green-400' : 'text-red-400'
            "
          >
            {{ getWinLoss }}
          </p>
        </div>
      </div>
      <div
        class="p-2 rounded-lg bg-gray-800/20 border border-gray-500/20 flex items-center gap-2 justify-center"
      >
        <div class="text-sm text-gray-400 text-center">
          {{ t("deposit") }}
          <p class="dashboard-value text-white">
            {{
              formatPrice(
                (transactionReport?.deposits || 0) -
                  (transactionReport?.adjustment || 0),
              )
            }}
          </p>
        </div>
      </div>
      <div
        class="p-2 rounded-lg bg-gray-800/20 border border-gray-500/20 flex items-center gap-2 justify-center"
      >
        <div class="text-sm text-gray-400 text-center">
          {{ t("withdraw") }}
          <p class="dashboard-value text-white">
            {{
              formatPrice(
                (transactionReport?.withdraws || 0) -
                  (transactionReport?.refund || 0),
              )
            }}
          </p>
        </div>
      </div>
    </div>
    <!-- LOADING -->
    <div v-if="loading" class="p-4 space-y-3">
      <div
        v-for="i in 6"
        :key="i"
        class="animate-pulse flex justify-between p-4 bg-[#0f172a] rounded-xl"
      >
        <div class="space-y-2">
          <div class="h-3 w-24 bg-white/10 rounded"></div>
          <div class="h-2 w-16 bg-white/10 rounded"></div>
        </div>

        <div class="space-y-2 text-right">
          <div class="h-3 w-20 bg-white/10 rounded"></div>
          <div class="h-2 w-12 bg-white/10 rounded"></div>
        </div>
      </div>
    </div>

    <!-- EMPTY STATE -->
    <div
      v-else-if="!paginatedBetRecords?.length"
      class="flex flex-col items-center justify-center py-16 text-gray-500"
    >
      <div
        class="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4"
      >
        <ClipboardX class="w-8 h-8 opacity-50" />
      </div>
      <p class="text-sm">{{ t("no_record") }}</p>
    </div>

    <!-- TABLE -->
    <div
      v-else
      class="overflow-x-auto rounded-2xl border border-white/5 bg-[#0f172a] mt-2 glass-bg"
    >
      <table class="w-full text-sm">
        <thead class="bg-[#111827] border-b border-white/10">
          <tr class="text-left text-gray-400 text-xs uppercase tracking-wider">
            <th class="px-1 py-2">{{ t("game") }}</th>
            <th class="px-1 py-2">{{ t("stake") }}</th>
            <th class="px-1 py-2">{{ t("win_loss") }}</th>
            <th class="px-1 py-2">{{ t("status") }}</th>
            <th class="px-1 py-2">{{ t("date") }}</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="item in paginatedBetRecords"
            :key="item.refNo"
            class="border-b border-white/5 hover:bg-white/5 transition"
          >
            <!-- GAME -->
            <td class="px-1 py-2 text-gray-200 font-medium">
              {{ item.gameType || "-" }}
            </td>

            <!-- STAKE -->
            <td class="px-1 py-2 text-cyan-400 font-semibold">
              {{ formatPrice(item.stake) }}
            </td>

            <!-- WIN/LOSS -->
            <td
              class="px-1 py-2 font-semibold"
              :class="item.winLost >= 0 ? 'text-green-400' : 'text-red-400'"
            >
              {{ formatPrice(item.winLost) }}
            </td>

            <!-- STATUS -->
            <td class="px-1 py-2">
              <span
                class="px-3 py-1 rounded-full text-xs font-medium capitalize"
                :class="{
                  'bg-green-500/15 text-green-400': item.status === 'won',
                  'bg-red-500/15 text-red-400': item.status === 'lose',
                  'bg-yellow-500/15 text-yellow-400': item.status === 'draw',
                  'bg-blue-500/15 text-blue-300': item.status === 'Bonus',
                }"
              >
                {{ item.status || "-" }}
              </span>
            </td>

            <!-- TIME -->
            <td class="px-1 py-2 text-gray-500 text-xs">
              {{ formatMyanmarTime(item.orderTime) }}
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex items-center justify-between w-full py-2">
        <div class="text-sm text-gray-400">
          {{ t("total") }}:
          {{ betTotal }}
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="store.setBetPage(betPage - 1)"
            :disabled="betPage === 1"
            class="px-4 py-2 rounded-xl bg-[#0f172a] border border-white/10 text-white"
          >
            {{ t("prev") }}
          </button>

          <div class="px-4 py-2 rounded-xl bg-gray-600/50">
            {{ betPage }}
          </div>

          <button
            @click="store.setBetPage(betPage + 1)"
            :disabled="betPage >= betTotalPages"
            class="px-4 py-2 rounded-xl bg-[#0f172a] border border-white/10 text-white"
          >
            {{ t("next") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
