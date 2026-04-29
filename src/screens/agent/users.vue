<script setup lang="ts">
import { useRouter } from "vue-router";
import { getUserByAgentAPI } from "@/services/agentAPI";
import { useAuthStore } from "@/stores/auth";
import type { userInfo } from "@/utils/types";
import moment from "moment";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import { openChat } from "@/utils";
import { Headset } from "lucide-vue-next";
import LanguageBtn from "@/components/languageBtn.vue";
const loadingUsers = ref(false)
const _currentPage = ref(1)
const _pageSize = ref(10)
const _totalItems = ref(0)
const _totalPages = ref(0) ;
const {t} = useI18n();
const players = ref<userInfo[]>([])
const authStore = useAuthStore();


const router = useRouter();
const fetchPlayers = async (agent: number) => {
    console.log("Fetching Player")
    try {
        loadingUsers.value = true
        const res = await getUserByAgentAPI(agent, _currentPage.value, _pageSize.value);
        console.log(res)
        if (res) {
            players.value = res.data
            _totalItems.value = res.pagination.total
            _totalPages.value = res.pagination.totalPages
        }
    } catch (error) {
        console.error(error)
    } finally {
        loadingUsers.value = false
    }
}
onMounted(() => {
    if (authStore.user?.agent_id) {
        fetchPlayers(authStore.user.agent_id)
    }
})
</script>

<template>
        <CustomNavBar title="my_team" backTo="/user/profile">
    <template #right>

      <button
        v-on:click="openChat">
        <Headset class="w-6 h-6" />
      </button>
      <LanguageBtn/>
    </template>
  </CustomNavBar>
  <div class="space-y-4 p-4">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold tracking-wide">
        {{ t('my_team_members_list') }}
      </h1>

      <div class="text-sm text-gray-400">
      {{ t('total') }} : {{ _totalItems }} 
      </div>
    </div>

    <!-- Container -->
    <div class="bg-[#0f172a] border border-white/5 rounded-2xl overflow-hidden">

      <!-- Table Header -->
      <div class="grid grid-cols-2 px-4 py-3 text-xs text-gray-400 border-b border-white/5">
        <span>{{ t('username') }}</span>
        <span class="text-right">{{ t('status') }}</span>
      </div>

      <!-- List -->
      <div
        v-for="u in players"
        :key="u.id"
        @click="router.push(`/user/agent-center/users/detail/${u.id}?name=${u.name}&status=${u.status}&created_at=${u.created_at}&level=${u.level}`)"
        class="flex justify-between px-4 py-4 active-button items-center border-b border-white/5 last:border-none hover:bg-white/5 transition"
      >
        <!-- User Info -->
        <div class="flex items-center gap-3 flex-1">
          <!-- Avatar -->
          <div class="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-semibold">
            {{ u.name?.charAt(0).toUpperCase() }}
          </div>

          <div class="flex flex-col">
            <span class="text-sm font-medium">{{ u.name }} ({{ u.level }})</span>
            <span class="text-xs text-gray-400">{{ moment(u.created_at).format("DD MMM YYYY") }}</span>
          </div>
        </div>

        <!-- Date -->
        <div class="text-right text-sm rounded-full px-4 py-1 " :class="u.status==='Active'?'bg-green-400 text-black':'bg-red-400 text-white'">
          {{ u.status }}
        </div>
      </div>

    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between text-sm text-gray-400 pt-2">
      <span>
        {{ t('page') }} {{ _currentPage }} / {{ _totalPages }}
      </span>

      <div class="flex gap-2">
        <button
          class="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition"
        >
          {{ t('prev') }}
        </button>
        <button
          class="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition"
        >
          {{ t('next') }}
        </button>
      </div>
    </div>

  </div>
</template>