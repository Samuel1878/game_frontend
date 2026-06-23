<script setup lang="ts">
import { computed, onActivated, onMounted, ref } from "vue";
import { parseDate, type DateValue } from "@internationalized/date";
import { ChevronLeft, ChevronRight, ClipboardX, Headset, RefreshCw, Search } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import LanguageBtn from "@/components/languageBtn.vue";
import DatePicker from "@/components/CalenderView.vue";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { useBetlistStore } from "@/stores/betListStore";
import { formatYangonDateTime } from "@/utils/date";
import { formatDecimalMoney } from "@/utils/money";
import { openChat } from "@/utils";
import type { PeriodFilter, PlayerRecordSummary } from "@/utils/types";

const store = useBetlistStore();
const {
  loading,
  providerLoading,
  error,
  period,
  provider,
  startDate,
  endDate,
  items,
  pagination,
  summary,
  providers,
} = storeToRefs(store);
const { t } = useI18n();
const searchInput = ref("");
const periodOptions: PeriodFilter[] = ["today", "this_month", "custom"];

const zeroSummary: PlayerRecordSummary = {
  totalDepositAmount: "0",
  totalWithdrawalAmount: "0",
  totalTurnover: "0",
  totalWinAmount: "0",
  totalLossAmount: "0",
  totalGgr: "0",
};

const recordSummary = computed(() => summary.value?.summary ?? zeroSummary);
const displayError = computed(() =>
  error.value === "custom_date_range_required" ? t("custom_date_range_required") : error.value,
);
const totalPages = computed(() => Math.max(pagination.value.totalPages, 1));

const asDateValue = (value?: string): DateValue | undefined => {
  if (!value) return undefined;
  try {
    return parseDate(value);
  } catch {
    return undefined;
  }
};

const setPeriod = (value: PeriodFilter) => store.setPeriod(value);
const setStartDate = (value?: DateValue) => store.setStartDate(value?.toString());
const setEndDate = (value?: DateValue) => store.setEndDate(value?.toString());
const submitSearch = () => store.setSearch(searchInput.value.trim());
const applyCustomRange = () => void store.fetchRecords();
const retry = () => void store.fetchRecords();

const money = (value: string | number | null | undefined) =>
  formatDecimalMoney(value ?? "0");
const betMoney = (value: string | number, currency?: string | null) =>
  `${money(value)}${currency ? ` ${currency}` : ""}`;

const statusClass = (status: string) =>
  status.toUpperCase() === "COMPLETED" || status.toUpperCase() === "SETTLED"
    ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-300"
    : "border-amber-400/25 bg-amber-400/10 text-amber-200";

onMounted(() => {
  void store.initialize();
});

onActivated(() => {
  void store.fetchRecords();
});
</script>

<template>
  <CustomNavBar title="bet_list" back-to="/user/profile">
    <template #right>
      <button type="button" @click="openChat">
        <Headset class="h-6 w-6 text-amber-300" />
      </button>
      <LanguageBtn />
    </template>
  </CustomNavBar>

  <main class="min-h-screen w-full bg-gray-900 p-3 pb-8 sm:p-4">
    <div class="mx-auto max-w-6xl space-y-4">
      <header class="flex items-center justify-between gap-3">
        <div>
          <h1 class="text-xl font-semibold text-white">{{ t("bet_list") }}</h1>
          <p class="mt-1 text-sm text-gray-400">{{ t("record_summary") }}</p>
        </div>
        <span class="rounded-xl border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-xs font-semibold text-amber-200">
          {{ pagination.total }} {{ t("records") }}
        </span>
      </header>

      <section class="filter-panel">
        <div class="flex gap-2 overflow-x-auto no-scrollbar">
          <button
            v-for="option in periodOptions"
            :key="option"
            type="button"
            class="filter-btn"
            :class="period === option && 'active-filter'"
            :disabled="loading"
            @click="setPeriod(option)"
          >
            {{ t(option) }}
          </button>
        </div>

        <div class="grid gap-2 sm:grid-cols-2">
          <label class="filter-field">
            <span>{{ t("provider") }}</span>
            <NativeSelect
              :model-value="provider"
              class="w-full border-white/10 bg-[#111827] text-white"
              :disabled="loading || providerLoading"
              @update:model-value="store.setProvider(String($event))"
            >
              <NativeSelectOption value="all">{{ t("all_providers") }}</NativeSelectOption>
              <NativeSelectOption
                v-for="item in providers"
                :key="item.providerCode"
                :value="item.providerCode"
              >
                {{ item.providerName }} ({{ item.providerCode }})
              </NativeSelectOption>
            </NativeSelect>
          </label>

          <form class="filter-field" @submit.prevent="submitSearch">
            <span>{{ t("search") }}</span>
            <div class="relative">
              <input
                v-model="searchInput"
                class="search-input pr-10"
                :placeholder="t('search_bets')"
                maxlength="100"
              />
              <button type="submit" class="absolute inset-y-0 right-0 px-3 text-amber-300" :disabled="loading">
                <Search class="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>

        <template v-if="period === 'custom'">
          <div class="flex gap-2">
            <DatePicker
              :model-value="asDateValue(startDate)"
              :placeholder="t('start_date')"
              @update:model-value="setStartDate($event as DateValue | undefined)"
            />
            <DatePicker
              :model-value="asDateValue(endDate)"
              :placeholder="t('end_date')"
              @update:model-value="setEndDate($event as DateValue | undefined)"
            />
          </div>
          <button
            type="button"
            class="gold-action w-full"
            :disabled="loading || !startDate || !endDate"
            @click="applyCustomRange"
          >
            {{ t("search") }}
          </button>
        </template>
      </section>

      <section>
        <div v-if="loading" class="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div v-for="index in 6" :key="index" class="h-28 animate-pulse rounded-2xl border border-white/5 bg-white/3" />
        </div>
        <div v-else class="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <article class="summary-card">
            <span>{{ t("total_deposit") }}</span>
            <strong>{{ money(recordSummary.totalDepositAmount) }}</strong>
          </article>
          <article class="summary-card">
            <span>{{ t("total_withdraw") }}</span>
            <strong>{{ money(recordSummary.totalWithdrawalAmount) }}</strong>
          </article>
          <article class="summary-card">
            <span>{{ t("turnover") }}</span>
            <strong>{{ money(recordSummary.totalTurnover) }}</strong>
          </article>
          <article class="summary-card">
            <span>{{ t("total_win") }}</span>
            <strong class="text-emerald-300">{{ money(recordSummary.totalWinAmount) }}</strong>
          </article>
          <article class="summary-card">
            <span>{{ t("total_loss") }}</span>
            <strong class="text-rose-300">{{ money(recordSummary.totalLossAmount) }}</strong>
          </article>
          <article class="summary-card">
            <span>{{ t("ggr") }}</span>
            <strong class="text-amber-200">{{ money(recordSummary.totalGgr) }}</strong>
          </article>
        </div>
      </section>

      <section v-if="displayError" class="rounded-2xl border border-rose-400/20 bg-rose-400/8 p-4 text-center">
        <p class="text-sm text-rose-100">{{ t("records_load_failed") }}</p>
        <p class="mt-1 text-xs text-rose-200/70">{{ displayError }}</p>
        <button type="button" class="mt-3 inline-flex items-center gap-2 rounded-lg border border-amber-400/30 px-4 py-2 text-sm font-semibold text-amber-200" @click="retry">
          <RefreshCw class="h-4 w-4" />
          {{ t("retry") }}
        </button>
      </section>

      <section class="overflow-hidden rounded-2xl border border-white/5 bg-[#0f172a]">
        <div v-if="loading" class="space-y-3 p-4">
          <div v-for="index in 6" :key="index" class="h-24 animate-pulse rounded-xl bg-white/4" />
        </div>

        <div v-else-if="!items.length" class="flex min-h-72 flex-col items-center justify-center px-6 text-center text-gray-500">
          <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
            <ClipboardX class="h-7 w-7" />
          </div>
          <p class="text-sm">{{ t("no_bets") }}</p>
        </div>

        <template v-else>
          <div class="space-y-3 p-3 md:hidden">
            <article v-for="item in items" :key="item.id" class="bet-card">
              <header class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="truncate text-sm font-semibold text-white">{{ item.providerName || item.providerCode }}</p>
                  <p class="mt-0.5 truncate text-xs text-gray-400">{{ item.gameName || item.gameCode || '—' }}</p>
                </div>
                <span class="status-pill" :class="statusClass(item.status)">{{ item.status }}</span>
              </header>
              <p class="mt-3 break-all text-xs text-gray-500">{{ t("round_id") }}: {{ item.roundId || '—' }}</p>
              <div class="mt-3 grid grid-cols-2 gap-2 text-xs">
                <p>{{ t("bet_amount") }} <strong>{{ betMoney(item.betAmount, item.currency) }}</strong></p>
                <p>{{ t("win_amount") }} <strong class="text-emerald-300">{{ betMoney(item.winAmount, item.currency) }}</strong></p>
                <p>{{ t("loss_amount") }} <strong class="text-rose-300">{{ betMoney(item.lossAmount, item.currency) }}</strong></p>
                <p>{{ t("turnover") }} <strong>{{ betMoney(item.turnover, item.currency) }}</strong></p>
                <p class="col-span-2">{{ t("ggr") }} <strong class="text-amber-200">{{ betMoney(item.ggr, item.currency) }}</strong></p>
              </div>
              <div class="mt-3 border-t border-white/5 pt-2 text-[11px] text-gray-500">
                <p>{{ t("bet_at") }}: {{ formatYangonDateTime(item.betAt) }}</p>
                <p class="mt-1">{{ t("settled_at") }}: {{ formatYangonDateTime(item.settledAt) }}</p>
                <p class="mt-1">{{ t("created_at") }}: {{ formatYangonDateTime(item.createdAt) }}</p>
              </div>
            </article>
          </div>

          <div class="hidden overflow-x-auto md:block">
            <table class="w-full min-w-275 text-left text-sm">
              <thead class="border-b border-white/10 bg-white/3 text-xs uppercase tracking-wider text-gray-400">
                <tr>
                  <th class="px-4 py-3">{{ t("provider") }}</th>
                  <th class="px-4 py-3">{{ t("game") }}</th>
                  <th class="px-4 py-3">{{ t("round_id") }}</th>
                  <th class="px-4 py-3">{{ t("bet_amount") }}</th>
                  <th class="px-4 py-3">{{ t("win_amount") }}</th>
                  <th class="px-4 py-3">{{ t("loss_amount") }}</th>
                  <th class="px-4 py-3">{{ t("turnover") }}</th>
                  <th class="px-4 py-3">{{ t("ggr") }}</th>
                  <th class="px-4 py-3">{{ t("status") }}</th>
                  <th class="px-4 py-3">{{ t("created_at") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in items" :key="item.id" class="border-b border-white/5 last:border-0 hover:bg-white/3">
                  <td class="px-4 py-3 text-gray-200">{{ item.providerName || item.providerCode }}</td>
                  <td class="px-4 py-3"><p class="text-gray-100">{{ item.gameName || item.gameCode || '—' }}</p><p class="text-xs text-gray-500">{{ item.gameCode || '—' }}</p></td>
                  <td class="max-w-48 truncate px-4 py-3 text-xs text-gray-400">{{ item.roundId || '—' }}</td>
                  <td class="px-4 py-3 text-gray-100">{{ betMoney(item.betAmount, item.currency) }}</td>
                  <td class="px-4 py-3 text-emerald-300">{{ betMoney(item.winAmount, item.currency) }}</td>
                  <td class="px-4 py-3 text-rose-300">{{ betMoney(item.lossAmount, item.currency) }}</td>
                  <td class="px-4 py-3 text-gray-100">{{ betMoney(item.turnover, item.currency) }}</td>
                  <td class="px-4 py-3 font-semibold text-amber-200">{{ betMoney(item.ggr, item.currency) }}</td>
                  <td class="px-4 py-3"><span class="status-pill" :class="statusClass(item.status)">{{ item.status }}</span></td>
                  <td class="px-4 py-3 text-xs text-gray-500">{{ formatYangonDateTime(item.createdAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <footer class="flex items-center justify-between border-t border-white/5 px-4 py-3 text-sm text-gray-400">
            <span>{{ t("page") }} {{ pagination.page }} / {{ totalPages }}</span>
            <div class="flex gap-2">
              <button type="button" class="page-button" :disabled="loading || pagination.page <= 1" @click="store.changePage(pagination.page - 1)">
                <ChevronLeft class="h-4 w-4" />
              </button>
              <button type="button" class="page-button" :disabled="loading || pagination.page >= totalPages" @click="store.changePage(pagination.page + 1)">
                <ChevronRight class="h-4 w-4" />
              </button>
            </div>
          </footer>
        </template>
      </section>
    </div>
  </main>
</template>

<style scoped>
.filter-panel { display: flex; flex-direction: column; gap: .75rem; border: 1px solid rgba(250, 204, 21, .12); border-radius: 1rem; background: linear-gradient(145deg, rgba(17, 24, 39, .94), rgba(15, 23, 42, .94)); padding: .85rem; }
.filter-btn { flex: none; border: 1px solid rgba(255,255,255,.08); border-radius: .75rem; background: rgba(255,255,255,.03); color: #d1d5db; padding: .55rem .85rem; font-size: .875rem; white-space: nowrap; }
.filter-btn:disabled, .gold-action:disabled, .page-button:disabled { cursor: not-allowed; opacity: .45; }
.active-filter { border-color: rgba(250,204,21,.4); background: rgba(250,204,21,.12); color: #facc15; }
.filter-field { display: flex; flex-direction: column; gap: .35rem; color: #9ca3af; font-size: .75rem; }
.search-input { width: 100%; height: 2.25rem; border: 1px solid rgba(255,255,255,.1); border-radius: .45rem; background: #111827; color: white; padding-left: .75rem; outline: none; }
.search-input:focus { border-color: rgba(250,204,21,.55); }
.gold-action { height: 2.7rem; border-radius: .85rem; background: linear-gradient(135deg, #facc15, #d97706); color: #111827; font-weight: 700; }
.summary-card { min-height: 6.8rem; display: flex; flex-direction: column; justify-content: space-between; border: 1px solid rgba(255,255,255,.06); border-radius: 1rem; background: rgba(15,23,42,.8); padding: .85rem; }
.summary-card span { color: #9ca3af; font-size: .72rem; }
.summary-card strong { overflow-wrap: anywhere; color: #f3f4f6; font-size: 1rem; }
.bet-card { border: 1px solid rgba(255,255,255,.06); border-radius: 1rem; background: rgba(255,255,255,.02); padding: .85rem; }
.bet-card strong { display: block; margin-top: .2rem; color: #f3f4f6; font-size: .78rem; overflow-wrap: anywhere; }
.status-pill { display: inline-flex; flex: none; align-items: center; border: 1px solid; border-radius: 999px; padding: .2rem .45rem; font-size: .65rem; font-weight: 700; }
.page-button { display: inline-flex; height: 2rem; width: 2rem; align-items: center; justify-content: center; border-radius: .75rem; background: rgba(255,255,255,.06); color: white; }
</style>
