<script setup lang="ts">
import { ArrowDownCircle, ArrowUpCircle, BarChart3, Trophy, Users } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import AgentMoneyAmounts from "./AgentMoneyAmounts.vue";
import type { AgentTotals } from "@/utils/types";

const props = withDefaults(
  defineProps<{
    totals: AgentTotals;
    title?: string;
    showPlayerCount?: boolean;
  }>(),
  { title: undefined, showPlayerCount: true },
);

const { t } = useI18n();
</script>

<template>
  <section class="space-y-3">
    <h2 v-if="props.title" class="px-1 text-base font-semibold text-amber-100">
      {{ props.title }}
    </h2>
    <div class="grid grid-cols-2 gap-3">
      <div class="metric-card">
        <ArrowDownCircle class="metric-icon text-emerald-400" />
        <span class="metric-label">{{ t('total_deposit') }}</span>
        <AgentMoneyAmounts :amounts="props.totals.totalDeposits" />
      </div>
      <div class="metric-card">
        <ArrowUpCircle class="metric-icon text-rose-400" />
        <span class="metric-label">{{ t('total_withdraw') }}</span>
        <AgentMoneyAmounts :amounts="props.totals.totalWithdrawals" />
      </div>
      <div class="metric-card">
        <BarChart3 class="metric-icon text-sky-400" />
        <span class="metric-label">{{ t('turnover') }}</span>
        <AgentMoneyAmounts :amounts="props.totals.totalTurnover" />
      </div>
      <div class="metric-card">
        <Trophy class="metric-icon text-amber-300" />
        <span class="metric-label">{{ t('ggr') }}</span>
        <AgentMoneyAmounts :amounts="props.totals.totalGGR" />
      </div>
      <div v-if="props.showPlayerCount" class="metric-card col-span-2">
        <Users class="metric-icon text-violet-400" />
        <span class="metric-label">{{ t('total_players') }}</span>
        <strong class="text-lg text-white">{{ props.totals.totalPlayerCount }}</strong>
      </div>
    </div>
  </section>
</template>

<style scoped>
.metric-card {
  min-height: 8.1rem;
  padding: 0.9rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: linear-gradient(145deg, rgba(17, 24, 39, 0.94), rgba(15, 23, 42, 0.94));
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.metric-icon { width: 1.25rem; height: 1.25rem; }
.metric-label { color: #9ca3af; font-size: 0.75rem; }
</style>
