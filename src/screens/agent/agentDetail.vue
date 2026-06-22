<script setup lang="ts">
import { computed, onActivated, onMounted, ref } from "vue";
import { Headset, Network, Users } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { getAgentDashboardAgent } from "@/services/agentAPI";
import { getApiErrorMessage } from "@/services/api";
import { useAgentDashboardStore } from "@/stores/agentDashboardStore";
import type { AgentDashboardAgentDetail, AgentDashboardPeriod } from "@/utils/types";
import { openChat } from "@/utils";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import LanguageBtn from "@/components/languageBtn.vue";
import AgentMoneyAmounts from "@/components/agent/AgentMoneyAmounts.vue";
import AgentPagination from "@/components/agent/AgentPagination.vue";
import AgentPeriodFilter from "@/components/agent/AgentPeriodFilter.vue";
import AgentTotalsGrid from "@/components/agent/AgentTotalsGrid.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const dashboard = useAgentDashboardStore();
const { period, startDate, endDate } = storeToRefs(dashboard);
const loading = ref(false);
const error = ref<string | null>(null);
const detail = ref<AgentDashboardAgentDetail | null>(null);
const page = ref(1);
const limit = 20;
const agentId = computed(() => String(route.params.agentId));
const pagination = computed(() =>
  detail.value?.directPlayers.pagination ?? { page: page.value, limit, total: 0, totalPages: 0 },
);
const formatDate = (value: string) => new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));

const updatePeriod = (value: AgentDashboardPeriod) => {
  period.value = value;
  if (value !== "custom") {
    startDate.value = undefined;
    endDate.value = undefined;
  }
  page.value = 1;
};

const fetchDetail = async () => {
  if (period.value === "custom" && (!startDate.value || !endDate.value)) {
    error.value = t("custom_date_range_required");
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    detail.value = await getAgentDashboardAgent(agentId.value, dashboard.buildQuery({ page: page.value, limit }));
  } catch (err) {
    error.value = getApiErrorMessage(err);
    detail.value = null;
  } finally {
    loading.value = false;
  }
};

const changePage = (value: number) => {
  page.value = value;
  void fetchDetail();
};

onMounted(fetchDetail);
onActivated(fetchDetail);
</script>

<template>
  <CustomNavBar title="agent_detail" backTo="/user/agent-center/agents">
    <template #right>
      <button type="button" @click="openChat"><Headset class="h-6 w-6 text-amber-300" /></button>
      <LanguageBtn />
    </template>
  </CustomNavBar>

  <div class="space-y-4 p-4">
    <AgentPeriodFilter
      :period="period"
      :start-date="startDate"
      :end-date="endDate"
      :loading="loading"
      @update:period="updatePeriod"
      @update:start-date="startDate = $event"
      @update:end-date="endDate = $event"
      @apply="fetchDetail"
    />

    <p v-if="error" class="rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{{ error }}</p>
    <div v-if="loading" class="space-y-3"><div class="h-36 animate-pulse rounded-3xl bg-white/5" /><div class="h-64 animate-pulse rounded-3xl bg-white/5" /></div>

    <template v-else-if="detail">
      <section class="rounded-3xl border border-amber-400/15 bg-linear-to-br from-[#161c2c] to-[#0f172a] p-5">
        <div class="flex items-start gap-4">
          <span class="avatar"><Network class="h-7 w-7" /></span>
          <div class="min-w-0">
            <h1 class="truncate text-xl font-bold">{{ detail.agent.name || detail.agent.username }}</h1>
            <p class="mt-1 text-sm text-gray-400">{{ detail.agent.username }} · {{ detail.agent.phone }}</p>
            <div class="mt-3 flex flex-wrap gap-2 text-xs">
              <span class="tag">{{ detail.agent.status }}</span>
              <span class="tag">{{ t('commission_rate') }}: {{ detail.agent.commissionRate }}%</span>
              <span class="tag">{{ t('joined') }}: {{ formatDate(detail.agent.createdAt) }}</span>
            </div>
          </div>
        </div>
      </section>

      <AgentTotalsGrid :title="t('downline_totals')" :totals="detail.downlineTotals" />
      <details class="rounded-2xl border border-white/5 bg-[#0f172a] p-4" open>
        <summary class="cursor-pointer font-semibold text-amber-100">{{ t('direct_totals') }}</summary>
        <div class="mt-4"><AgentTotalsGrid :totals="detail.directTotals" /></div>
      </details>
      <details class="rounded-2xl border border-white/5 bg-[#0f172a] p-4">
        <summary class="cursor-pointer font-semibold text-amber-100">{{ t('nested_totals') }}</summary>
        <div class="mt-4"><AgentTotalsGrid :totals="detail.nestedTotals" /></div>
      </details>

      <section class="overflow-hidden rounded-2xl border border-white/5 bg-[#0f172a]">
        <header class="flex items-center justify-between border-b border-white/5 px-4 py-3">
          <span class="flex items-center gap-2 font-semibold"><Users class="h-4 w-4 text-violet-300" />{{ t('direct_players') }}</span>
          <span class="text-xs text-gray-400">{{ detail.directPlayers.pagination.total }}</span>
        </header>
        <button
          v-for="player in detail.directPlayers.items"
          :key="player.id"
          type="button"
          class="list-row"
          @click="router.push({ name: 'agent-dashboard-player-detail', params: { playerId: player.id } })"
        >
          <span class="min-w-0 text-left"><strong class="block truncate">{{ player.username }}</strong><small>{{ player.phone }}</small></span>
          <AgentMoneyAmounts compact :amounts="player.totalGGR" />
        </button>
        <p v-if="!detail.directPlayers.items.length" class="py-8 text-center text-sm text-gray-500">{{ t('no_record') }}</p>
      </section>

      <section class="overflow-hidden rounded-2xl border border-white/5 bg-[#0f172a]">
        <header class="flex items-center justify-between border-b border-white/5 px-4 py-3">
          <span class="flex items-center gap-2 font-semibold"><Network class="h-4 w-4 text-emerald-300" />{{ t('child_agents') }}</span>
          <span class="text-xs text-gray-400">{{ detail.directAgents.pagination.total }}</span>
        </header>
        <button
          v-for="child in detail.directAgents.items"
          :key="child.id"
          type="button"
          class="list-row"
          @click="router.push({ name: 'agent-dashboard-agent-detail', params: { agentId: child.id } })"
        >
          <span class="min-w-0 text-left"><strong class="block truncate">{{ child.name || child.username }}</strong><small>{{ child.username }} · {{ child.downlineTotals.totalPlayerCount }} {{ t('players') }}</small></span>
          <AgentMoneyAmounts compact :amounts="child.downlineTotals.totalGGR" />
        </button>
        <p v-if="!detail.directAgents.items.length" class="py-8 text-center text-sm text-gray-500">{{ t('no_record') }}</p>
      </section>

      <AgentPagination :pagination="pagination" :loading="loading" @page="changePage" />
    </template>
  </div>
</template>

<style scoped>
.avatar { display: grid; height: 3.5rem; width: 3.5rem; flex: none; place-items: center; border-radius: 1rem; background: rgba(250,204,21,.13); color: #facc15; }
.tag { border: 1px solid rgba(255,255,255,.08); border-radius: .65rem; background: rgba(255,255,255,.04); padding: .3rem .5rem; color: #d1d5db; }
.list-row { display: flex; width: 100%; align-items: center; justify-content: space-between; gap: 1rem; border-bottom: 1px solid rgba(255,255,255,.05); padding: .85rem 1rem; transition: background .2s; }
.list-row:last-of-type { border-bottom: 0; }
.list-row:hover { background: rgba(255,255,255,.04); }
.list-row small { display: block; margin-top: .2rem; color: #9ca3af; }
</style>
