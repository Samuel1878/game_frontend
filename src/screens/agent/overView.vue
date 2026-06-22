<script setup lang="ts">
import { computed, onActivated, onMounted } from "vue";
import { Headset, Network, Users } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { useAgentDashboardStore } from "@/stores/agentDashboardStore";
import { openChat } from "@/utils";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import LanguageBtn from "@/components/languageBtn.vue";
import AgentOptions from "@/components/layout/agentOptions.vue";
import AgentMoneyAmounts from "@/components/agent/AgentMoneyAmounts.vue";
import AgentPeriodFilter from "@/components/agent/AgentPeriodFilter.vue";
import AgentTotalsGrid from "@/components/agent/AgentTotalsGrid.vue";
import type { AgentDashboardPeriod } from "@/utils/types";

const { t } = useI18n();
const dashboard = useAgentDashboardStore();
const { loading, error, period, startDate, endDate, summary } = storeToRefs(dashboard);

const displayError = computed(() =>
  error.value === "custom_date_range_required" ? t("custom_date_range_required") : error.value,
);

const updatePeriod = (value: AgentDashboardPeriod) => {
  period.value = value;
  if (value !== "custom") {
    startDate.value = undefined;
    endDate.value = undefined;
  }
};

const fetchSummary = () => void dashboard.fetchSummary();

onMounted(fetchSummary);
onActivated(fetchSummary);
</script>

<template>
  <CustomNavBar title="agent_center" backTo="/user/profile">
    <template #right>
      <button type="button" @click="openChat"><Headset class="h-6 w-6 text-amber-300" /></button>
      <LanguageBtn />
    </template>
  </CustomNavBar>
  <AgentOptions current-page="summary" />

  <div class="space-y-5 p-4">
    <header class="flex items-start justify-between gap-4">
      <div>
        <h1 class="text-xl font-semibold">{{ t('agent_dashboard') }}</h1>
        <p class="mt-1 text-sm text-gray-400">{{ t('agent_dashboard_description') }}</p>
      </div>
      <span v-if="summary?.agent.code" class="rounded-xl border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-xs font-semibold text-amber-200">
        {{ summary.agent.code }}
      </span>
    </header>

    <AgentPeriodFilter
      :period="period"
      :start-date="startDate"
      :end-date="endDate"
      :loading="loading"
      @update:period="updatePeriod"
      @update:start-date="startDate = $event"
      @update:end-date="endDate = $event"
      @apply="fetchSummary"
    />

    <p v-if="displayError" class="rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">
      {{ displayError }}
    </p>

    <div v-if="loading" class="grid grid-cols-2 gap-3">
      <div v-for="item in 8" :key="item" class="h-32 animate-pulse rounded-2xl border border-white/5 bg-[#111827]" />
    </div>

    <template v-else-if="summary">
      <section class="grid grid-cols-3 gap-3">
        <div class="count-card">
          <Users class="h-5 w-5 text-violet-300" />
          <span>{{ t('total_players') }}</span>
          <strong>{{ summary.totalPlayerCount }}</strong>
        </div>
        <div class="count-card">
          <Network class="h-5 w-5 text-emerald-300" />
          <span>{{ t('direct_agents') }}</span>
          <strong>{{ summary.totalDirectAgentCount }}</strong>
        </div>
        <div class="count-card">
          <Network class="h-5 w-5 text-sky-300" />
          <span>{{ t('nested_agents') }}</span>
          <strong>{{ summary.totalNestedAgentCount }}</strong>
        </div>
      </section>

      <AgentTotalsGrid :title="t('downline_totals')" :totals="summary.downlineTotals" />

      <section class="rounded-2xl border border-amber-400/15 bg-linear-to-br from-[#161c2c] to-[#0f172a] p-4 space-y-4">
        <div>
          <h2 class="font-semibold text-amber-100">{{ t('dividend_estimate') }}</h2>
          <p class="mt-1 text-xs text-gray-400">{{ t('dividend_estimate_description') }}</p>
        </div>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div class="dividend-card">
            <span>{{ t('direct_dividend') }}</span>
            <AgentMoneyAmounts :amounts="summary.dividends.directDividendAmount" />
          </div>
          <div class="dividend-card">
            <span>{{ t('nested_override_dividend') }}</span>
            <AgentMoneyAmounts :amounts="summary.dividends.nestedOverrideDividendAmount" />
          </div>
          <div class="dividend-card">
            <span>{{ t('total_dividend_estimate') }}</span>
            <AgentMoneyAmounts :amounts="summary.dividends.totalDividendAmount" />
          </div>
        </div>
        <div v-if="summary.dividends.nestedOverrideBreakdown.length" class="overflow-x-auto rounded-xl border border-white/5">
          <table class="w-full min-w-[560px] text-left text-xs">
            <thead class="bg-white/5 text-gray-400">
              <tr>
                <th class="px-3 py-2">{{ t('agent') }}</th>
                <th class="px-3 py-2">{{ t('ggr') }}</th>
                <th class="px-3 py-2">{{ t('commission_rate') }}</th>
                <th class="px-3 py-2">{{ t('amount') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in summary.dividends.nestedOverrideBreakdown" :key="`${item.agentId}-${item.currency}`" class="border-t border-white/5">
                <td class="px-3 py-3">{{ item.agentName || '—' }}</td>
                <td class="px-3 py-3">{{ item.currency }} {{ item.totalGGR }}</td>
                <td class="px-3 py-3">{{ item.overrideRate }}%</td>
                <td class="px-3 py-3 font-semibold text-amber-200">{{ item.currency }} {{ item.dividendAmount }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <details class="group rounded-2xl border border-white/5 bg-[#0f172a] p-4" open>
        <summary class="cursor-pointer font-semibold text-amber-100">{{ t('direct_totals') }}</summary>
        <div class="mt-4"><AgentTotalsGrid :totals="summary.directTotals" /></div>
      </details>
      <details class="group rounded-2xl border border-white/5 bg-[#0f172a] p-4">
        <summary class="cursor-pointer font-semibold text-amber-100">{{ t('nested_totals') }}</summary>
        <div class="mt-4"><AgentTotalsGrid :totals="summary.nestedTotals" /></div>
      </details>
    </template>
  </div>
</template>

<style scoped>
.count-card {
  min-height: 7rem;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 1rem;
  padding: 0.85rem;
  background: #111827;
}
.count-card span, .dividend-card > span { font-size: 0.72rem; color: #9ca3af; }
.count-card strong { font-size: 1.35rem; color: white; }
.dividend-card { border: 1px solid rgba(250, 204, 21, 0.12); border-radius: 0.85rem; padding: 0.8rem; display: flex; flex-direction: column; gap: 0.45rem; }
</style>
