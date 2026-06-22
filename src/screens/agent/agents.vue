<script setup lang="ts">
import { computed, onActivated, onMounted, reactive, ref } from "vue";
import { Headset, Network, Plus, Search } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { createAgentDashboardAgent, getAgentDashboardAgents } from "@/services/agentAPI";
import { getApiErrorMessage } from "@/services/api";
import { useAgentDashboardStore } from "@/stores/agentDashboardStore";
import type {
  AgentDashboardAgentListItem,
  AgentDashboardList,
  AgentDashboardPeriod,
  CreateDownlineAgentPayload,
} from "@/utils/types";
import { openChat } from "@/utils";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import LanguageBtn from "@/components/languageBtn.vue";
import AgentOptions from "@/components/layout/agentOptions.vue";
import AgentMoneyAmounts from "@/components/agent/AgentMoneyAmounts.vue";
import AgentPagination from "@/components/agent/AgentPagination.vue";
import AgentPeriodFilter from "@/components/agent/AgentPeriodFilter.vue";

const { t } = useI18n();
const router = useRouter();
const dashboard = useAgentDashboardStore();
const { period, startDate, endDate } = storeToRefs(dashboard);
const loading = ref(false);
const saving = ref(false);
const error = ref<string | null>(null);
const result = ref<AgentDashboardList<AgentDashboardAgentListItem> | null>(null);
const searchInput = ref("");
const search = ref("");
const page = ref(1);
const limit = 20;
const showCreateForm = ref(false);
const form = reactive<CreateDownlineAgentPayload>({ username: "", phone: "", password: "", name: "", commission_rate: "" });

const items = computed(() => result.value?.items ?? []);
const pagination = computed(() => result.value?.pagination ?? { page: page.value, limit, total: 0, totalPages: 0 });
const formatDate = (value: string) => new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));

const updatePeriod = (value: AgentDashboardPeriod) => {
  period.value = value;
  if (value !== "custom") {
    startDate.value = undefined;
    endDate.value = undefined;
  }
  page.value = 1;
};

const fetchAgents = async () => {
  if (period.value === "custom" && (!startDate.value || !endDate.value)) {
    error.value = t("custom_date_range_required");
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    result.value = await getAgentDashboardAgents(
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
  void fetchAgents();
};

const changePage = (value: number) => {
  page.value = value;
  void fetchAgents();
};

const resetForm = () => {
  form.username = "";
  form.phone = "";
  form.password = "";
  form.name = "";
  form.commission_rate = "";
};

const createAgent = async () => {
  saving.value = true;
  error.value = null;
  try {
    await createAgentDashboardAgent({
      username: form.username,
      phone: form.phone,
      password: form.password,
      ...(form.name?.trim() ? { name: form.name.trim() } : {}),
      ...(String(form.commission_rate ?? "").trim()
        ? { commission_rate: String(form.commission_rate).trim() }
        : {}),
    });
    toast.success(t("agent_created"));
    resetForm();
    showCreateForm.value = false;
    page.value = 1;
    await fetchAgents();
  } catch (err) {
    error.value = getApiErrorMessage(err);
  } finally {
    saving.value = false;
  }
};

onMounted(fetchAgents);
onActivated(fetchAgents);
</script>

<template>
  <CustomNavBar title="agents" backTo="/user/agent-center/overview">
    <template #right>
      <button type="button" @click="openChat"><Headset class="h-6 w-6 text-amber-300" /></button>
      <LanguageBtn />
    </template>
  </CustomNavBar>
  <AgentOptions current-page="agents" />

  <div class="space-y-4 p-4">
    <header class="flex items-center justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold">{{ t('downline_agents') }}</h1>
        <p class="mt-1 text-sm text-gray-400">{{ pagination.total }} {{ t('records') }}</p>
      </div>
      <button type="button" class="create-button" @click="showCreateForm = !showCreateForm">
        <Plus class="h-4 w-4" /> {{ t('create_agent') }}
      </button>
    </header>

    <form v-if="showCreateForm" class="create-form" @submit.prevent="createAgent">
      <h2 class="font-semibold text-amber-100">{{ t('create_downline_agent') }}</h2>
      <input v-model.trim="form.username" required minlength="3" maxlength="50" class="form-input" :placeholder="t('username')" />
      <input v-model.trim="form.phone" required minlength="7" maxlength="30" class="form-input" :placeholder="t('phone_number')" />
      <input v-model="form.password" required type="password" minlength="6" class="form-input" :placeholder="t('password')" />
      <input v-model.trim="form.name" maxlength="120" class="form-input" :placeholder="t('name_optional')" />
      <input v-model="form.commission_rate" inputmode="decimal" class="form-input" :placeholder="t('commission_rate_optional')" />
      <div class="grid grid-cols-2 gap-2">
        <button type="button" class="cancel-button" :disabled="saving" @click="showCreateForm = false">{{ t('cancel') }}</button>
        <button type="submit" class="create-button justify-center" :disabled="saving">{{ saving ? t('loading') : t('create_agent') }}</button>
      </div>
    </form>

    <AgentPeriodFilter
      :period="period"
      :start-date="startDate"
      :end-date="endDate"
      :loading="loading"
      @update:period="updatePeriod"
      @update:start-date="startDate = $event"
      @update:end-date="endDate = $event"
      @apply="fetchAgents"
    />

    <form class="flex gap-2" @submit.prevent="submitSearch">
      <input v-model="searchInput" class="search-input" :placeholder="t('search_agents')" maxlength="100" />
      <button type="submit" class="search-button" :disabled="loading"><Search class="h-5 w-5" /></button>
    </form>

    <p v-if="error" class="rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{{ error }}</p>

    <section class="space-y-3">
      <div v-if="loading" v-for="item in 4" :key="item" class="h-64 animate-pulse rounded-2xl bg-white/5" />
      <div v-else-if="!items.length" class="rounded-2xl border border-white/5 bg-[#0f172a] py-16 text-center text-sm text-gray-500">{{ t('no_record') }}</div>
      <article v-else v-for="agent in items" :key="agent.id" class="agent-card">
        <button type="button" class="flex w-full items-start justify-between gap-3 text-left" @click="router.push({ name: 'agent-dashboard-agent-detail', params: { agentId: agent.id } })">
          <span class="flex min-w-0 items-center gap-3">
            <span class="avatar"><Network class="h-5 w-5" /></span>
            <span class="min-w-0">
              <strong class="block truncate">{{ agent.name || agent.username }}</strong>
              <span class="mt-1 block truncate text-xs text-gray-400">{{ agent.username }} · {{ agent.phone }}</span>
              <span class="mt-1 block text-xs text-gray-500">{{ t('joined') }}: {{ formatDate(agent.createdAt) }} · {{ agent.commissionRate }}%</span>
            </span>
          </span>
          <span class="rounded-full bg-emerald-400/15 px-2 py-1 text-[10px] text-emerald-300">{{ agent.status }}</span>
        </button>

        <div class="mt-4 grid grid-cols-2 gap-2">
          <div class="summary-cell"><span>{{ t('total_players') }}</span><strong>{{ agent.downlineTotals.totalPlayerCount }}</strong></div>
          <div class="summary-cell"><span>{{ t('total_deposit') }}</span><AgentMoneyAmounts compact :amounts="agent.downlineTotals.totalDeposits" /></div>
          <div class="summary-cell"><span>{{ t('total_withdraw') }}</span><AgentMoneyAmounts compact :amounts="agent.downlineTotals.totalWithdrawals" /></div>
          <div class="summary-cell"><span>{{ t('turnover') }}</span><AgentMoneyAmounts compact :amounts="agent.downlineTotals.totalTurnover" /></div>
          <div class="summary-cell col-span-2"><span>{{ t('ggr') }}</span><AgentMoneyAmounts compact :amounts="agent.downlineTotals.totalGGR" /></div>
        </div>

        <details class="mt-3 rounded-xl border border-white/5 bg-black/10 p-3 text-xs">
          <summary class="cursor-pointer text-gray-300">{{ t('direct_and_nested_totals') }}</summary>
          <div class="mt-3 grid grid-cols-2 gap-3">
            <div><p class="mb-1 text-amber-200">{{ t('direct_totals') }} ({{ agent.directTotals.totalPlayerCount }})</p><AgentMoneyAmounts compact :amounts="agent.directTotals.totalGGR" /></div>
            <div><p class="mb-1 text-sky-200">{{ t('nested_totals') }} ({{ agent.nestedTotals.totalPlayerCount }})</p><AgentMoneyAmounts compact :amounts="agent.nestedTotals.totalGGR" /></div>
          </div>
        </details>
      </article>
    </section>

    <AgentPagination :pagination="pagination" :loading="loading" @page="changePage" />
  </div>
</template>

<style scoped>
.create-button { display: inline-flex; align-items: center; gap: .35rem; border-radius: .8rem; background: linear-gradient(135deg,#facc15,#d97706); padding: .65rem .8rem; font-size: .8rem; font-weight: 700; color: #111827; }
.create-button:disabled { opacity: .5; }
.cancel-button { border-radius: .8rem; border: 1px solid rgba(255,255,255,.12); color: #d1d5db; }
.create-form { display: grid; gap: .65rem; border: 1px solid rgba(250,204,21,.2); border-radius: 1rem; background: #111827; padding: 1rem; }
.form-input, .search-input { min-width: 0; border: 1px solid rgba(255,255,255,.08); border-radius: .75rem; background: #0f172a; padding: .7rem .8rem; color: white; outline: none; }
.form-input:focus, .search-input:focus { border-color: rgba(250,204,21,.55); }
.search-input { flex: 1; }
.search-button { display: grid; width: 2.9rem; place-items: center; border-radius: .85rem; background: #facc15; color: #111827; }
.agent-card { border: 1px solid rgba(255,255,255,.06); border-radius: 1rem; background: #0f172a; padding: 1rem; }
.avatar { display: grid; height: 2.5rem; width: 2.5rem; place-items: center; border-radius: .75rem; background: rgba(250,204,21,.13); color: #facc15; }
.summary-cell { display: flex; min-height: 4.7rem; flex-direction: column; justify-content: space-between; gap: .4rem; border-radius: .75rem; background: rgba(255,255,255,.035); padding: .65rem; }
.summary-cell > span { font-size: .68rem; color: #9ca3af; }
.summary-cell > strong { font-size: 1.1rem; color: white; }
</style>
