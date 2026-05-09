<script setup lang="ts">
import { MembershipCenter, UserAction } from "@/consts";
import router from "@/router";
import { useAuthStore } from "@/stores/auth";
import { useUIStore } from "@/stores/ui";

import {
  ChevronRight,
  PhoneIcon,
} from "lucide-vue-next";
import moment from "moment";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const authStore = useAuthStore();
const uiStore = useUIStore()



</script>

<template>
  <main class="min-h-screen bg-gray-900 w-full px-4 py-4">
    <div class="max-w-md mx-auto space-y-4">
      <section
  class="relative overflow-hidden rounded-2xl p-6 md:p-8 
  bg-linear-to-br from-white/10 via-gray-900/50 to-gray-900/70 
  backdrop-blur-2xl border border-white/10 
  shadow-[0_0_40px_rgba(0,0,0,0.8)] group"
>

  <!-- 🌈 ambient casino glow -->
  <div
    class="absolute inset-0 opacity-40 blur-3xl animate-floatGlow
    bg-linear-to-tr from-sky-500/20 via-purple-500/10 to-yellow-400/20"
  ></div>

  <!-- ✨ moving light sheen -->
  <div
    class="absolute inset-0 opacity-20 animate-shimmer
    bg-linear-to-r from-transparent via-white/10 to-transparent"
  ></div>

  <!-- soft golden edge highlight -->
  <div class="absolute inset-0 rounded-2xl border border-yellow-400/10 pointer-events-none"></div>

  <!-- CONTENT -->
  <div class="relative z-10 flex items-center justify-between">

    <!-- Avatar -->
    <div class="flex items-center gap-4">

      <div class="relative">
        <div class="absolute inset-0 rounded-full bg-linear-to-tr from-sky-400 to-yellow-400 blur-md opacity-70 animate-pulse"></div>

        <div class="relative w-16 h-16 rounded-full p-0.5 bg-linear-to-tr from-sky-400 via-yellow-300 to-yellow-500">
          <div class="w-full h-full rounded-full bg-gray-900 overflow-hidden">
            <img src="/images/profile.png" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <div v-if="authStore.user && authStore.accessToken">
        <h2 class="text-xl md:text-2xl font-bold text-white tracking-wide">
          {{ authStore.user?.name }}
        </h2>

        <p class="text-gray-400 text-sm flex gap-2 items-center">
          <PhoneIcon :size="15" />
          <span v-if="!authStore.user?.phone">***********</span>
          <span v-else> ********{{ authStore.user?.phone.slice(-3) }}</span>
        </p>
      </div>
      <div v-else class="flex gap-3 items-center cursor-pointer" v-on:click="uiStore.openAuthModal()">
        <p >{{ t('login_to_your_account') }}</p>
        <ChevronRight/>
      </div>

    </div>

    <!-- Status -->
    <div class="flex items-center gap-2" v-show="authStore.user">
      <div
        class="w-3 h-3 rounded-full animate-pulse"
        :class="authStore.user?.status === 'Active'
          ? 'bg-green-400 shadow-[0_0_10px_rgba(34,197,94,0.6)]'
          : 'bg-red-400 shadow-[0_0_10px_rgba(239,68,68,0.6)]'"
      />
      <span class="text-xs text-gray-400">
        {{ authStore.user?.status}}
      </span>
    </div>

  </div>

  <div class="my-6 border-t border-white/10"></div>

  <!-- Stats -->
  <div class="relative z-10 grid grid-cols-2 gap-4 text-center">

    <div class="group-hover:scale-105 transition">
      <p class="text-lg font-bold text-white">
        VIP. {{ authStore.user?.level ||0}}
      </p>
      <p class="text-xs text-gray-400">{{ t('level') }}</p>
    </div>

    <div class="group-hover:scale-105 transition">
      <p class="text-lg font-bold text-white">
        {{ moment(authStore.user?.created_at).format("MMM YYYY") }}
      </p>
      <p class="text-xs text-gray-400">{{ t("joined") }}</p>
    </div>

  </div>

  <!-- bottom gold line -->
  <div class="absolute bottom-0 left-0 w-full h-[2px]
    bg-linear-to-r from-transparent via-yellow-400/40 to-transparent">
  </div>

</section>
      <section class="w-full flex justify-between gap-2 items-center">

        <div @click="router.push(value.path)" v-for="value in UserAction"
          class="cursor-pointer h-12 w-full flex justify-center items-center gap-2 rounded-full bg-gray-900 bg-linear-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
          <div class="h-6 w-6 flex justify-center items-center">
            <img :src="value.image" class="w-8 h-8" />
          </div>
          <p class="text-gray-300 text-sm">{{ t(value.label) }}</p>

        </div>

      </section>
      <section class="w-full">
        <div class="flex w-full items-center justify-between gap-2">
          <p class="p-2 rounded-full text-nowrap bg-amber-400/10 text-xs">
            {{ t('membership_center') }}
          </p>
          <div class="h-0.5 w-full bg-amber-500/30" />
        </div>
        <div class="grid grid-cols-4 p-2 my-4 mb-20 gap-4">

          <div v-for="value in MembershipCenter" class="cursor-pointer my-2 flex flex-col items-center gap-2"
            @click=" value.action">
            <div
              class="h-14 w-14 flex flex-col rounded-full justify-center items-center bg-yellow-400/10 bg-linear-to-br from-yellow/5 via-yellow/10 to-yellow/5 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
              <img v-if="value.image" :src="value.image" class="w-10 h-10" />
              <component v-else :is="value?.icon" class="w-8 h-8 text-[#c59c07b4]" />
            </div>
            <p class="text-gray-300 text-xs text-wrap text-center">{{ t(value.label) }}</p>
          </div>
        </div>

      </section>

    </div>
  </main>
</template>
