<script setup lang="ts">
import { computed } from "vue";
import { RouterView, useRouter } from "vue-router";
import { ShieldAlert } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const router = useRouter();
const { t } = useI18n();

const isAgent = computed(() => authStore.user?.role?.toUpperCase() === "AGENT");
</script>

<template>
  <div class="min-h-screen w-full bg-[#0b0f19] text-white">
    <main v-if="isAgent" class="pb-28">
      <RouterView />
    </main>

    <main v-else class="flex min-h-screen items-center justify-center p-6 text-center">
      <section class="max-w-sm rounded-3xl border border-amber-400/15 bg-[#111827] p-7 shadow-2xl">
        <ShieldAlert class="mx-auto mb-4 h-10 w-10 text-amber-300" />
        <h1 class="text-xl font-bold">{{ t('agent_access_only') }}</h1>
        <p class="mt-2 text-sm leading-6 text-gray-400">{{ t('agent_access_only_description') }}</p>
        <button
          type="button"
          class="mt-6 rounded-xl bg-amber-400 px-5 py-2.5 font-semibold text-slate-950"
          @click="router.push('/user/profile')"
        >
          {{ t('back_to_profile') }}
        </button>
      </section>
    </main>
  </div>
</template>
