<script setup lang="ts">
import { MembershipCenter, UserAction } from "@/consts";
import router from "@/router";
import { useAuthStore } from "@/stores/auth";
import { profile } from "@/utils";
import {
  PhoneIcon,
} from "lucide-vue-next";
import moment from "moment";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const authStore = useAuthStore();
</script>

<template>
  <main class="min-h-screen bg-gray-900 w-full px-4 py-4">
    <div class="max-w-md mx-auto space-y-4">
      <section
        class="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-linear-to-br from-white/10 via-gray-900/40 to-gray-900/40 backdrop-blur-2xl border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.6)]">

        <div
          class="absolute inset-0 opacity-30 bg-linear-to-tr from-sky-500/20 via-purple-500/10 to-yellow-500/30 blur-2xl">
        </div>

        <!-- Header -->
        <div class="relative z-10 flex items-center justify-between">
          <!-- Left: Avatar + Info -->
          <div class="flex items-center gap-4">
            <!-- Avatar -->
            <div class="relative">
              <div class="absolute inset-0 rounded-full bg-linear-to-tr from-sky-400 to-yellow-500 blur-md opacity-60">
              </div>
              <div
                class="relative w-16 h-16 rounded-full p-0.5 bg-linear-to-tr from-sky-400 via-amber-200 to-yellow-500">
                <div class="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                  <img :src="profile" class="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            <!-- User Info -->
            <div>
              <h2 class="text-xl md:text-2xl font-bold text-white tracking-wide">
                {{ authStore.user?.name }}
              </h2>
              <p class="text-gray-400 text-sm flex gap-2 items-center"><span>
                  <PhoneIcon :size="15" />
                </span>
                <span v-if="!authStore.user?.phone">{{ t("not_connected") }}</span>
                <span v-else>{{ authStore.user?.phone }}</span>
              </p>

            </div>
          </div>
          <!-- Status -->
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full animate-pulse" :class="authStore.user?.status === 'Active'
                ? 'bg-green-400'
                : 'bg-red-400'
              " />
            <span class="text-xs text-gray-400">
              {{ authStore.user?.status }}
            </span>
          </div>
        </div>
        <!-- Divider -->
        <div class="my-6 border-t border-white/10"></div>
        <!-- Stats -->
        <div class="relative z-10 grid grid-cols-2 gap-4 text-center">
          <div class="flex flex-col gap-1">
            <p class="text-lg font-bold text-white">
              Lv. {{ authStore.user?.level }}
            </p>
            <p class="text-xs text-gray-400">{{ t('level') }}</p>
          </div>
          <div class="flex flex-col gap-1">
            <p class="text-lg font-bold text-white">
              {{ moment(authStore.user?.created_at).format("MMM YYYY") }}
            </p>
            <p class="text-xs text-gray-400">{{ t("joined") }}</p>
          </div>
        </div>
        <div
          class="absolute bottom-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-sky-400/40 to-transparent">
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
        <div class="grid grid-cols-4 p-2 mt-4 gap-4">

          <div v-for="value in MembershipCenter" class="cursor-pointer my-2 flex flex-col items-center gap-2"
            @click="value.action">
            <div
              class="h-14 w-14 flex flex-col rounded-full justify-center items-center bg-yellow-400/10 bg-linear-to-br from-yellow/5 via-yellow/10 to-yellow/5 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
              <img :src="value.image" class="w-10 h-10" />
            </div>
            <p class="text-gray-300 text-sm text-wrap text-center">{{ t(value.label) }}</p>
          </div>
        </div>

      </section>

    </div>
  </main>
</template>
