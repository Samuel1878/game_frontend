<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import router from '@/router';
import { useAuthStore } from '@/stores/auth'
import { User2Icon, LogOutIcon, HistoryIcon } from 'lucide-vue-next'

const authStore = useAuthStore()
</script>

<template>
  <main class="min-h-screen bg-linear-to-b w-full from-gray-950 to-black px-4 py-10">
    <div class="max-w-md mx-auto space-y-8">

      <!-- Profile Card -->
      <section
        class="relative bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl"
      >

        <!-- Avatar -->
        <div class="flex flex-col items-center space-y-4">

          <div
            class="relative w-28 h-28 rounded-full p-0.5 bg-linear-to-tr from-sky-500 to-emerald-400"
          >
            <div
              class="w-full h-full rounded-full bg-gray-100 flex items-center justify-center"
            >
              <User2Icon class="text-gray-900 w-16 h-16" />
            </div>
          </div>

          <div class="text-center">
            <h2 class="text-2xl font-bold text-white">
              {{ authStore.user?.name }}
            </h2>

            <div class="flex items-center justify-center gap-2 mt-2">
              <span
                class="px-3 py-1 text-xs rounded-full bg-sky-600 text-white font-semibold"
              >
                Level {{ authStore.user?.level }}
              </span>

              <span
                class="px-3 py-1 text-xs rounded-full"
                :class="authStore.user?.status === 'active'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-green-600 text-white'"
              >
                {{ authStore.user?.status || "Active" }}
              </span>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="my-8 border-t border-gray-800"></div>

        <!-- Info List -->
        <div class="space-y-5 text-sm">

          <div class="flex justify-between">
            <span class="text-gray-400">User ID</span>
            <span class="text-white font-semibold">
              {{ authStore.user?.id }}
            </span>
          </div>

          <div class="flex justify-between">
            <span class="text-gray-400">Username</span>
            <span class="text-white font-semibold">
              {{ authStore.user?.name }}
            </span>
          </div>

          <div class="flex justify-between">
            <span class="text-gray-400">Account Level</span>
            <span class="text-white font-semibold">
              {{ authStore.user?.level }}
            </span>
          </div>

          <div class="flex justify-between items-center">
            <span class="text-gray-400">Phone Number</span>
            <span class="text-white font-semibold" v-if="authStore?.user?.phone">
              {{ authStore.user?.phone }}
            </span>
            <Button class="bg-sky-500" v-else>
              Bind
            </Button>
          </div>
          <!-- <div class="flex justify-between">
            <span class="text-gray-400">Email</span>
            <span class="text-white font-semibold">
              {{ authStore.user?.phone }}
            </span>
          </div> -->

        </div>
        <Button class=" bg-gray-800 rounded-xl absolute top-2 right-2 z-40 p-2 flex gap-2" :disabled="!authStore.user" @click="router.push(`/transactions`)">
          
          <HistoryIcon class="w-13 h-12"/>
          <p>Transactions</p>
        </Button>
      </section>

      <!-- Logout Button -->
      <button
        @click="authStore.logout"
        class="w-full h-12 rounded-2xl bg-linear-to-r from-sky-600 to-emerald-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg hover:opacity-90 transition"
      >
        <LogOutIcon class="w-5 h-5" />
        Logout
      </button>

    </div>
  </main>
</template>