<script setup lang="ts">
import router from "@/router";
import { useAuthStore } from "@/stores/auth";
import { profile } from "@/utils";
import {
  LogOutIcon,
  HistoryIcon,
  ChevronRightIcon,
  Phone,
  PiggyBankIcon,
  LockIcon,
  HeadsetIcon,
  MailIcon,
  LetterTextIcon,
  CircleQuestionMark,
  CopyIcon,
  Share2Icon,
} from "lucide-vue-next";
import moment from "moment";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const authStore = useAuthStore();
</script>

<template>
  <main
    class="min-h-screen bg-gray-900 w-full px-4 py-4"
  >
    <div class="max-w-md mx-auto space-y-4">
      <section
        class="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-linear-to-br from-white/10 via-gray-900/40 to-gray-900/40 backdrop-blur-2xl border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.6)]"
      >
        <!-- Glow Background -->
        <div
          class="absolute inset-0 opacity-30 bg-linear-to-tr from-sky-500/20 via-purple-500/10 to-yellow-500/30 blur-2xl"
        ></div>

        <!-- Header -->
        <div class="relative z-10 flex items-center justify-between">
          <!-- Left: Avatar + Info -->
          <div class="flex items-center gap-4">
            <!-- Avatar -->
            <div class="relative">
              <div
                class="absolute inset-0 rounded-full bg-linear-to-tr from-sky-400 to-purple-500 blur-md opacity-60"
              ></div>
              <div
                class="relative w-16 h-16 rounded-full p-0.5 bg-linear-to-tr from-sky-400 via-purple-400 to-yellow-500"
              >
                <div
                  class="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden"
                >
                  <img :src="profile" class="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            <!-- User Info -->
            <div>
              <h2
                class="text-xl md:text-2xl font-bold text-white tracking-wide"
              >
                {{ authStore.user?.name }}
              </h2>
              <p class="text-gray-400 text-sm">ID: {{ authStore.user?.id }}</p>
            </div>
          </div>
          <!-- Status -->
          <div class="flex items-center gap-2">
            <div
              class="w-3 h-3 rounded-full animate-pulse"
              :class="
                authStore.user?.status === 'Active'
                  ? 'bg-green-400'
                  : 'bg-red-400'
              "
            />
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
            <p class="text-xs text-gray-400">Level</p>
          </div>
          <div class="flex flex-col gap-1">
            <p class="text-lg font-bold text-white">
              {{ moment(authStore.user?.created_at).format("MMM YYYY") }}
            </p>
            <p class="text-xs text-gray-400">Joined</p>
          </div>
        </div>
        <div
          class="absolute bottom-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-sky-400/40 to-transparent"
        ></div>
      </section>
      <div
        @click="router.push('/transactions')"
        class="group flex items-center justify-between py-4 px-4 cursor-pointer bg-linear-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_5px_rgba(0,0,0,0.5)] transition rounded-2xl"
      >
        <div class="flex items-center gap-3">
          <HistoryIcon
            class="w-5 h-5 text-gray-400 group-hover:text-white transition"
          />
          <p class="text-gray-300 group-hover:text-white transition">
            {{ t("transactions") }}
          </p>
        </div>

        <ChevronRightIcon
          class="w-5 h-5 text-gray-500 group-hover:translate-x-1 transition"
        />
      </div>
      <div>
        <p></p>
        <div
          class="rounded-2xl pl-4 bg-linear-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_5px_rgba(0,0,0,0.5)]"
        >
          <div
            @click="router.push(`/user/bank-accounts`)"
            class="w-full flex items-center justify-between py-4 pr-4 border-b border-gray-700"
          >
            <div class="flex gap-3 items-center">
              <PiggyBankIcon />
              <p class="text-gray-100">{{ t("bank_accounts") }}</p>
            </div>
            <ChevronRightIcon class="w-5 h-5 text-gray-500" />
          </div>
          <div
            @click="router.push(`/transactions`)"
            class="w-full flex items-center justify-between py-4 pr-4 border-b border-gray-700"
          >
            <div class="flex gap-3 items-center">
              <Phone />
              <p>
                {{
                  authStore.user?.phone
                    ? authStore.user?.phone
                    : t("phone_number")
                }}
              </p>
            </div>
            <div class="flex gap-2 items-center">
              <p class="text-gray-100">
                {{ authStore.user?.phone ? t("change_number") : t("bind") }}
              </p>
              <ChevronRightIcon class="w-5 h-5 text-gray-500" />
            </div>
          </div>
          <div
            @click="router.push(`/transactions`)"
            class="w-full flex items-center justify-between py-4 pr-4 border-b border-gray-700"
          >
            <div class="flex gap-3 items-center">
              <MailIcon />
              <p>
                {{ authStore.user?.email ? authStore.user?.email : t("email") }}
              </p>
            </div>
            <div class="flex gap-2 items-center">
              <p class="text-gray-100">
                {{ authStore.user?.email ? t("change") : t("bind") }}
              </p>
              <ChevronRightIcon class="w-5 h-5 text-gray-500" />
            </div>
          </div>
          <div
            @click="router.push(`/transactions`)"
            class="w-full flex items-center justify-between py-4 pr-4 border-b border-gray-700"
          >
            <div class="flex gap-3 items-center">
              <LockIcon />
              <p>{{ t("password") }}</p>
            </div>
            <div class="flex gap-2 items-center">
              <ChevronRightIcon class="w-5 h-5 text-gray-500" />
            </div>
          </div>
          <div
            @click="router.push(`/transactions`)"
            class="w-full flex items-center justify-between py-4 pr-4"
          >
            <div class="flex gap-3 items-center">
              <LetterTextIcon />
              <p>{{ t("limits_and_regulations") }}</p>
            </div>
            <div class="flex gap-2 items-center">
              <ChevronRightIcon class="w-5 h-5 text-gray-500" />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div
          class="rounded-xl bg-linear-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_5px_rgba(0,0,0,0.5)] transition pl-4 py-2"
        >
          <div
            @click="router.push(`/transactions`)"
            class="w-full flex items-center justify-between py-4 pr-4 border-b border-gray-700"
          >
            <div class="flex gap-3 items-center">
              <Share2Icon />
              <p>{{ t("Referral Code") }}</p>
            </div>
            <div class="flex gap-2 items-center">
              <CopyIcon class="w-5 h-5 text-gray-500" />
            </div>
          </div>

          <div
            @click="router.push(`/transactions`)"
            class="w-full flex items-center justify-between py-4 pr-4 border-b border-gray-700"
          >
            <div class="flex gap-3 items-center">
              <HeadsetIcon />
              <p>{{ t("help_center") }}</p>
            </div>
            <div class="flex gap-2 items-center">
              <ChevronRightIcon class="w-5 h-5 text-gray-500" />
            </div>
          </div>
          <div
            @click="router.push(`/faq`)"
            class="w-full flex items-center justify-between py-4 pr-4"
          >
            <div class="flex gap-3 items-center">
              <CircleQuestionMark />
              <p>{{ t("faq") }}</p>
            </div>
            <div class="flex gap-2 items-center">
              <ChevronRightIcon class="w-5 h-5 text-gray-500" />
            </div>
          </div>
        </div>
      </div>
      <!-- Logout Button -->
      <button
        @click="authStore.logout"
        class="w-full py-3 rounded-xl bg-linear-to-r from-red-400/20 to-red-600/20 border border-red-500/30 text-red-400 font-semibold hover:from-red-500/30 hover:to-red-600/30 active:scale-[0.98] transition flex items-center justify-center gap-2"
      >
        <LogOutIcon class="w-5 h-5" />
        Logout
      </button>
    </div>
  </main>
</template>
