<script setup lang="ts">
import { computed, onActivated, onMounted, ref } from "vue";
import { Headset, Search, Trophy } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { getAgentDashboardDividends } from "@/services/agentAPI";
import { getApiErrorMessage } from "@/services/api";
import { useAgentDashboardStore } from "@/stores/agentDashboardStore";
import type {
  AgentDashboardList,
  AgentDashboardPeriod,
  AgentDividendCalculation,
  AgentDividendPayout,
} from "@/utils/types";
import { openChat } from "@/utils";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import LanguageBtn from "@/components/languageBtn.vue";
import AgentOptions from "@/components/layout/agentOptions.vue";
import AgentPagination from "@/components/agent/AgentPagination.vue";
import AgentPeriodFilter from "@/components/agent/AgentPeriodFilter.vue";
import { formatMinorMoney } from "@/utils/money";

const { t } = useI18n();
const dashboard = useAgentDashboardStore();
const { period, startDate, endDate } = storeToRefs(dashboard);
const loading = ref(false);
const error = ref<string | null>(null);
const result = ref<AgentDashboardList<AgentDividendPayout> | null>(null);
const searchInput = ref("");
const search = ref("");
const page = ref(1);
const limit = 20;

const items = computed(() => result.value?.items ?? []);
const pagination = computed(() => result.value?.pagination ?? { page: page.value, limit, total: 0, totalPages: 0 });
const formatDate = (value: string) => new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
const formatAmount = (amount: string) => {
  const value = Number(amount);
  return Number.isFinite(value) ? new Intl.NumberFormat("en-US", { maximumFractionDigits: 8 }).format(value) : amount;
};
const formatMinorAmount = (amount: string, currency: string) => {
  try {
    return formatMinorMoney(amount, currency);
  } catch {
    return formatAmount(amount);
  }
};

const calculationDetails = (calculation: AgentDividendCalculation | null) => {
  if (!calculation) return [];

  const fields: Array<{
    key: keyof AgentDividendCalculation;
    label: string;
    isRate?: boolean;
  }> = [
    { key: "own_ggr_minor", label: "own_ggr" },
    { key: "matched_rate_percent", label: "matched_rate", isRate: true },
    { key: "own_dividend_amount_minor", label: "own_dividend" },
    { key: "nested_dividend_commission_amount_minor", label: "nested_commission_received" },
    { key: "parent_commission_amount_minor", label: "parent_commission_deducted" },
    { key: "total_dividend_amount_minor", label: "final_payable_dividend" },
  ];

  return fields.flatMap((field) => {
    const value = calculation[field.key];
    return typeof value === "string"
      ? [{ ...field, value }]
      : [];
  });
};

const updatePeriod = (value: AgentDashboardPeriod) => {
  period.value = value;
  if (value !== "custom") {
    startDate.value = undefined;
    endDate.value = undefined;
  }
  page.value = 1;
};

const fetchDividends = async () => {
  if (period.value === "custom" && (!startDate.value || !endDate.value)) {
    error.value = t("custom_date_range_required");
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    result.value = await getAgentDashboardDividends(
      dashboard.buildQuery({ page: page.value, limit, search: search.value || undefined }),
    );
  } catch (err) {
    error.value = getApiErrorMessage(err);
    result.value = null;
  } finally {
    loading.value = false;
  }
};

const submitSearch = () => {
  search.value = searchInput.value.trim();
  page.value = 1;
  void fetchDividends();
};

const changePage = (value: number) => {
  page.value = value;
  void fetchDividends();
};

onMounted(fetchDividends);
onActivated(fetchDividends);
</script>

<template>
  <CustomNavBar title="dividends" backTo="/user/agent-center/overview">
    <template #right>
      <button type="button" @click="openChat"><Headset class="h-6 w-6 text-amber-300" /></button>
      <LanguageBtn />
    </template>
  </CustomNavBar>
  <AgentOptions current-page="dividends" />

  <div class="space-y-4 p-4">
    <header class="flex items-center justify-between">
      <div><h1 class="text-xl font-semibold">{{ t('dividend_history') }}</h1><p class="mt-1 text-sm text-gray-400">{{ pagination.total }} {{ t('records') }}</p></div>
      <span class="rounded-2xl bg-amber-400/10 p-3 text-amber-300"><Trophy class="h-6 w-6" /></span>
    </header>

    <AgentPeriodFilter
      :period="period"
      :start-date="startDate"
      :end-date="endDate"
      :loading="loading"
      @update:period="updatePeriod"
      @update:start-date="startDate = $event"
      @update:end-date="endDate = $event"
      @apply="fetchDividends"
    />

    <form class="flex gap-2" @submit.prevent="submitSearch">
      <input v-model="searchInput" class="search-input" :placeholder="t('search_dividends')" maxlength="100" />
      <button type="submit" class="search-button" :disabled="loading"><Search class="h-5 w-5" /></button>
    </form>

    <p v-if="error" class="rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{{ error }}</p>

    <section class="overflow-hidden rounded-2xl border border-white/5 bg-[#0f172a]">
      <div v-if="loading" class="space-y-3 p-4"><div v-for="item in 6" :key="item" class="h-24 animate-pulse rounded-xl bg-white/5" /></div>
      <p v-else-if="!items.length" class="py-16 text-center text-sm text-gray-500">{{ t('no_record') }}</p>
      <article v-else v-for="item in items" :key="item.id" class="dividend-row">
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <strong class="text-base text-amber-200">{{ item.currency }} {{ formatAmount(item.amount) }}</strong>
            <span class="status-pill">{{ item.status }}</span>
          </div>
          <p class="mt-1 text-xs text-gray-400">{{ formatDate(item.date) }}</p>
          <p v-if="item.remark" class="mt-2 text-xs text-gray-300"><span class="text-gray-500">{{ t('remark') }}:</span> {{ item.remark }}</p>
        </div>
        <div class="shrink-0 text-right text-xs text-gray-400">
          <p v-if="item.percentage">{{ item.percentage }}%</p>
          <p class="mt-1">{{ formatDate(item.periodStart) }} — {{ formatDate(item.periodEnd) }}</p>
        </div>

        <details v-if="calculationDetails(item.calculation).length" class="col-span-2 mt-1 rounded-xl border border-white/5 bg-white/[0.02] p-3">
          <summary class="cursor-pointer text-xs font-semibold text-amber-100">{{ t('calculation_details') }}</summary>
          <div class="mt-3 grid grid-cols-2 gap-2">
            <div v-for="detail in calculationDetails(item.calculation)" :key="detail.key" class="calculation-card">
              <span>{{ t(detail.label) }}</span>
              <strong>
                {{ detail.isRate ? `${detail.value}%` : `${item.currency} ${formatMinorAmount(detail.value, item.currency)}` }}
              </strong>
            </div>
          </div>

          <details v-if="item.calculation?.nested_agents?.length" class="mt-3 rounded-lg border border-white/5 bg-black/15 p-2.5">
            <summary class="cursor-pointer text-xs font-semibold text-amber-100">
              {{ t('direct_child_breakdown') }} ({{ item.calculation.nested_agents.length }})
            </summary>
            <div class="mt-2 space-y-2">
              <div v-for="child in item.calculation.nested_agents" :key="child.child_agent_id" class="rounded-lg border border-white/5 p-2.5 text-xs">
                <div class="flex items-start justify-between gap-2">
                  <p class="font-semibold text-white">{{ child.child_agent_username || child.child_agent_code || '—' }}</p>
                  <span v-if="child.child_matched_rate_percent" class="text-amber-200">{{ child.child_matched_rate_percent }}%</span>
                </div>
                <div class="mt-2 grid grid-cols-2 gap-x-3 gap-y-2 text-gray-400">
                  <p v-if="child.child_own_ggr_minor">{{ t('child_own_ggr') }} <strong class="text-gray-200">{{ item.currency }} {{ formatMinorAmount(child.child_own_ggr_minor, item.currency) }}</strong></p>
                  <p v-if="child.child_dividend_amount_minor">{{ t('child_dividend') }} <strong class="text-gray-200">{{ item.currency }} {{ formatMinorAmount(child.child_dividend_amount_minor, item.currency) }}</strong></p>
                  <p v-if="child.parent_commission_amount_minor">{{ t('parent_commission') }} <strong class="text-amber-200">{{ child.parent_commission_rate_percent || 0 }}% · {{ item.currency }} {{ formatMinorAmount(child.parent_commission_amount_minor, item.currency) }}</strong></p>
                  <p v-if="child.child_final_dividend_amount_minor">{{ t('child_final_dividend') }} <strong class="text-emerald-200">{{ item.currency }} {{ formatMinorAmount(child.child_final_dividend_amount_minor, item.currency) }}</strong></p>
                </div>
              </div>
            </div>
          </details>
        </details>
      </article>
    </section>

    <AgentPagination :pagination="pagination" :loading="loading" @page="changePage" />
  </div>
</template>

<style scoped>
.search-input { min-width: 0; flex: 1; border: 1px solid rgba(255,255,255,.08); border-radius: .85rem; background: #111827; padding: .7rem .85rem; color: white; outline: none; }
.search-input:focus { border-color: rgba(250,204,21,.55); }
.search-button { display: grid; width: 2.9rem; place-items: center; border-radius: .85rem; background: #facc15; color: #111827; }
.search-button:disabled { opacity: .5; }
.dividend-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 1rem; border-bottom: 1px solid rgba(255,255,255,.05); padding: 1rem; }
.dividend-row:last-child { border-bottom: 0; }
.status-pill { border-radius: 999px; background: rgba(16,185,129,.14); padding: .2rem .45rem; font-size: .65rem; color: #6ee7b7; }
.calculation-card { border: 1px solid rgba(255,255,255,.05); border-radius: .65rem; padding: .6rem; display: flex; flex-direction: column; gap: .3rem; }
.calculation-card span { color: #9ca3af; font-size: .68rem; }
.calculation-card strong { color: #f3f4f6; font-size: .75rem; word-break: break-word; }
</style>
