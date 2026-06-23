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

const formatAmount = (amount: string) => {
  const value = Number(amount);
  return Number.isFinite(value)
    ? new Intl.NumberFormat("en-US", { maximumFractionDigits: 8 }).format(value)
    : amount;
};

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
        <div v-if="summary.dividends.items.length" class="space-y-3">
          <article
            v-for="item in summary.dividends.items"
            :key="`${item.agentId}-${item.currency}`"
            class="rounded-xl border border-white/5 bg-black/15 p-3"
          >
            <header class="flex items-start justify-between gap-3">
              <div>
                <p class="font-semibold text-white">{{ item.currency }}</p>
                <p class="text-xs text-gray-400">{{ item.agentUsername }} · {{ item.agentCode }}</p>
              </div>
              <span class="rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-1 text-xs font-bold text-amber-200">
                {{ t('matched_rate') }} {{ item.matchedRatePercent }}%
              </span>
            </header>

            <div class="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div class="breakdown-card">
                <span>{{ t('own_ggr') }}</span>
                <strong>{{ item.currency }} {{ formatAmount(item.ownGgr) }}</strong>
              </div>
              <div class="breakdown-card">
                <span>{{ t('own_dividend') }}</span>
                <strong>{{ item.currency }} {{ formatAmount(item.ownDividendAmount) }}</strong>
              </div>
              <div class="breakdown-card">
                <span>{{ t('nested_commission_received') }}</span>
                <strong>{{ item.currency }} {{ formatAmount(item.nestedDividendCommissionAmount) }}</strong>
              </div>
              <div class="breakdown-card">
                <span>{{ t('parent_commission_deducted') }}</span>
                <strong>{{ item.currency }} {{ formatAmount(item.parentCommissionAmount) }}</strong>
              </div>
              <div class="breakdown-card col-span-2 border-amber-400/25 bg-amber-400/[0.06]">
                <span>{{ t('final_payable_dividend') }}</span>
                <strong class="text-amber-200">{{ item.currency }} {{ formatAmount(item.totalDividendAmount) }}</strong>
              </div>
            </div>

            <details v-if="item.nestedAgents.length" class="mt-3 rounded-lg border border-white/5 bg-white/[0.02] p-3">
              <summary class="cursor-pointer text-xs font-semibold text-amber-100">
                {{ t('direct_child_breakdown') }} ({{ item.nestedAgents.length }})
              </summary>
              <div class="mt-3 space-y-2">
                <div v-for="child in item.nestedAgents" :key="child.childAgentId" class="rounded-lg border border-white/5 bg-black/15 p-2.5 text-xs">
                  <div class="flex items-start justify-between gap-2">
                    <p class="font-semibold text-white">{{ child.childAgentUsername }}</p>
                    <span class="text-amber-200">{{ child.childMatchedRatePercent }}%</span>
                  </div>
                  <p class="mt-0.5 text-gray-500">{{ child.childAgentCode || '—' }}</p>
                  <div class="mt-2 grid grid-cols-2 gap-x-3 gap-y-2 text-gray-400">
                    <p>{{ t('child_own_ggr') }} <strong class="text-gray-200">{{ item.currency }} {{ formatAmount(child.childOwnGgr) }}</strong></p>
                    <p>{{ t('child_dividend') }} <strong class="text-gray-200">{{ item.currency }} {{ formatAmount(child.childDividendAmount) }}</strong></p>
                    <p>{{ t('parent_commission') }} <strong class="text-amber-200">{{ child.parentCommissionRatePercent }}% · {{ item.currency }} {{ formatAmount(child.parentCommissionAmount) }}</strong></p>
                    <p>{{ t('child_final_dividend') }} <strong class="text-emerald-200">{{ item.currency }} {{ formatAmount(child.childFinalDividendAmount) }}</strong></p>
                  </div>
                </div>
              </div>
            </details>
          </article>
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
.breakdown-card { border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 0.65rem; padding: 0.65rem; display: flex; flex-direction: column; gap: 0.3rem; background: rgba(255, 255, 255, 0.02); }
.breakdown-card > span { color: #9ca3af; }
.breakdown-card > strong { color: #f3f4f6; font-size: 0.78rem; word-break: break-word; }
</style>
