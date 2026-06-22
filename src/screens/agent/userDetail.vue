<script setup lang="ts">
import { computed, onActivated, onMounted, ref } from "vue";
import { Headset, UserRound } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { getAgentDashboardPlayer } from "@/services/agentAPI";
import { getApiErrorMessage } from "@/services/api";
import { useAgentDashboardStore } from "@/stores/agentDashboardStore";
import type { AgentDashboardPeriod, AgentDashboardPlayerDetail, AgentTotals } from "@/utils/types";
import { openChat } from "@/utils";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import LanguageBtn from "@/components/languageBtn.vue";
import AgentPeriodFilter from "@/components/agent/AgentPeriodFilter.vue";
import AgentTotalsGrid from "@/components/agent/AgentTotalsGrid.vue";

const { t } = useI18n();
const route = useRoute();
const dashboard = useAgentDashboardStore();
const { period, startDate, endDate } = storeToRefs(dashboard);
const loading = ref(false);
const error = ref<string | null>(null);
const detail = ref<AgentDashboardPlayerDetail | null>(null);
const playerId = computed(() => String(route.params.playerId));

const totals = computed<AgentTotals | null>(() =>
  detail.value ? { ...detail.value.totals, totalPlayerCount: 1 } : null,
);
const formatDate = (value: string) => new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));

const updatePeriod = (value: AgentDashboardPeriod) => {
  period.value = value;
  if (value !== "custom") {
    startDate.value = undefined;
    endDate.value = undefined;
  }
};

const fetchDetail = async () => {
  if (period.value === "custom" && (!startDate.value || !endDate.value)) {
    error.value = t("custom_date_range_required");
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    detail.value = await getAgentDashboardPlayer(playerId.value, dashboard.buildQuery());
  } catch (err) {
    error.value = getApiErrorMessage(err);
    detail.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchDetail);
onActivated(fetchDetail);
</script>

<template>
  <CustomNavBar title="player_detail" backTo="/user/agent-center/users">
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
    <div v-if="loading" class="h-48 animate-pulse rounded-3xl bg-white/5" />

    <template v-else-if="detail && totals">
      <section class="rounded-3xl border border-amber-400/15 bg-linear-to-br from-[#161c2c] to-[#0f172a] p-5">
        <div class="flex items-start gap-4">
          <div class="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-amber-400/15 text-amber-300"><UserRound class="h-7 w-7" /></div>
          <div class="min-w-0">
            <h1 class="truncate text-xl font-bold">{{ detail.player.username }}</h1>
            <p class="mt-1 text-sm text-gray-400">{{ detail.player.phone }}</p>
            <div class="mt-3 flex flex-wrap gap-2 text-xs">
              <span class="tag">{{ detail.player.isDirect ? t('direct') : t('nested') }}</span>
              <span class="tag">{{ detail.player.status }}</span>
              <span class="tag">{{ t('joined') }}: {{ formatDate(detail.player.createdAt) }}</span>
            </div>
          </div>
        </div>
      </section>

      <AgentTotalsGrid :title="t('player_totals')" :totals="totals" :show-player-count="false" />
    </template>
  </div>
</template>

<style scoped>
.tag { border: 1px solid rgba(255,255,255,.08); border-radius: .65rem; background: rgba(255,255,255,.04); padding: .3rem .5rem; color: #d1d5db; }
</style>
